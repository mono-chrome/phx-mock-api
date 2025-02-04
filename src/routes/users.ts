import { sign } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import { hashPassword, querySanitizer } from "@/utils";
import { validateUserUpdate } from "@/validators";
import { Context } from "hono";

const editUsersHandler = async (c: Context) => {
  const userId = c.req.param("id");
  const token =
    c.get("jwtPayload") || c.req.header("Authorization")?.split(" ")[1];
  const fields = await c.req.json();

  if (!userId) {
    return c.json({ error: "No user id provided" }, 400);
  }

  if (!token.jti) {
    return c.json({ error: "Invalid token" }, 401);
  }

  if (!querySanitizer(token.jti).sanitize) {
    return c.json({ error: "Malicious JWT modification" }, 400);
  }

  if (
    !querySanitizer(fields).sanitizeObject ||
    !querySanitizer(userId).sanitize
  ) {
    return c.json({ error: "Invalid input." }, 400);
  }

  const revoked = await c.env.DB.prepare(
    "SELECT jti FROM revoked_tokens WHERE jti = ?",
  )
    .bind(token.jti)
    .first();

  if (revoked) {
    return c.json({ error: "Token has expired." }, 401);
  }

  const updates: Record<string, any> = {};
  const validationResult = validateUserUpdate(fields);

  if (!validationResult.isValid) {
    return c.json({ error: validationResult.error }, 400);
  }

  if (fields.email) {
    const existingUser = await c.env.DB.prepare(
      "SELECT email FROM users WHERE email = ?",
    )
      .bind(fields.email)
      .first();

    if (existingUser) {
      return c.json({ error: "Email already assigned to another user" }, 409);
    }
    updates.email = fields.email;
  }

  if (fields.password) {
    const { hash, salt } = await hashPassword(fields.password);
    updates.password_hash = hash;
    updates.salt = salt;
  }

  if (fields.first_name) updates.first_name = fields.first_name;
  if (fields.last_name) updates.last_name = fields.last_name;
  if (fields.gender) updates.gender = fields.gender;
  if (fields.segment) updates.segment = fields.segment;
  if (fields.store) updates.store = fields.store;

  const binds: Array<any> = [];
  const sets: Array<any> = [];

  for (const [key, value] of Object.entries(updates)) {
    sets.push(`${key} = ?`);
    binds.push(value);
  }

  binds.push(userId);

  try {
    const { success } = await c.env.DB.prepare(
      `UPDATE users SET ${sets.join(", ")} WHERE id = ?`,
    )
      .bind(...binds)
      .run();

    if (!success) {
      return c.json({ error: "Update failed" }, 400);
    }

    // log out user (token)
    await c.env.DB.prepare(
      "INSERT INTO revoked_tokens (jti, user_id) VALUES (?, ?)",
    )
      .bind(token.jti, token.sub)
      .run();

    // generate new token
    const newPayload = {
      sub: userId,
      exp: Math.floor(Date.now() / 1000) + 60 * 45, // 45 minutes
      iss: "PHX - JF from the ashes",
      segment: updates?.segment || token.segment,
      store: updates?.store || token.store,
      gender: updates?.gender || token.gender,
      jti: uuidv4(),
    };

    const newToken = await sign(newPayload, c.env.JWT_SECRET);
    return c.json({
      message: "User updated successfully",
      access_token: newToken,
    });
  } catch (dbError) {
    return c.json(`Update Error: ${dbError}`);
  }
};

const listUsersHandler = async (c: Context) => {
  const token =
    c.get("jwtPayload") || c.req.header("Authorization")?.split(" ")[1];

  if (!token.jti) {
    return c.json({ error: "Invalid token" }, 401);
  }

  if (!querySanitizer(token.jti).sanitize) {
    return c.json({ error: "Malicious JWT modification" }, 400);
  }

  const revoked = await c.env.DB.prepare(
    "SELECT jti FROM revoked_tokens WHERE jti = ?",
  )
    .bind(token.jti)
    .first();

  if (revoked) {
    return c.json({ error: "Token has expired." }, 401);
  }

  try {
    const { success, results } = await c.env.DB.prepare(
      "SELECT email, first_name, last_name, gender, store, segment FROM users WHERE email NOT LIKE '%loggedout.session'",
    ).run();

    if (success) {
      return c.json(results);
    }
  } catch (dbError) {
    return c.json({
      error: `Unable to run query on DB`,
    });
  }
};

export { editUsersHandler, listUsersHandler };
