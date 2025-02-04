import { Context } from "hono";
import { querySanitizer, verifyPassword } from "@/utils";
import { sign } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import type { JwtVariables } from "hono/jwt";
import type { Bindings } from "..";
import { User } from "..";

const loginHandler = async (
  c: Context<{ Bindings: Bindings; Variables: JwtVariables; test: string }>,
) => {
  const loginData = await c.req.json();
  const sessionToken =
    c.get("jwtPayload") || c.req.header("Authorization")?.split(" ")[1];

  if (!loginData.email || !loginData.password) {
    return c.json({ error: "Email and password required." }, 400);
  }

  if (!querySanitizer(loginData).sanitizeObject) {
    return c.json({ error: "Invalid input." }, 400);
  }

  const user = await c.env.DB.prepare("SELECT * FROM users WHERE email = ?")
    .bind(loginData.email)
    .first<User>();

  if (!user) {
    return c.json({ error: "Email or user not found" }, 401);
  }

  const verifiedPass = await verifyPassword(
    loginData.password,
    user.salt,
    user.password_hash,
  );

  if (!verifiedPass) {
    return c.json({ error: "Password incorrect" }, 401);
  }

  if (sessionToken?.segment === "anonymous") {
    // I'm migrating logged out / anon users and invalidate their prev session
    // 1. Remove revoke token 2. Remove anon user sesssion 3. Revoke old token
    try {
      await c.env.DB.batch([
        c.env.DB.prepare("DELETE FROM revoked_tokens WHERE user_id = ?").bind(
          sessionToken.sub,
        ),

        c.env.DB.prepare(
          "DELETE FROM users WHERE id = ? AND segment = 'anonymous'",
        ).bind(sessionToken.sub),

        c.env.DB.prepare(
          "INSERT INTO revoked_tokens (jti, user_id) VALUES (?, ?)",
        ).bind(sessionToken.jti, user.id),
      ]);
    } catch (error: any) {
      // Errortypes.. Again, typescript. Love it.
      if (
        error?.message.includes("UNIQUE constraint failed: revoked_tokens.jti")
      ) {
        return c.json({
          error: "Tried to reuse an old and expired logged-out session.",
        });
      }
      return c.json({ error: `Failed to migrate logged-out user. ${error}` });
    }
  }

  const payload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 45,
    iss: "PHX - JF from the ashes",
    segment: user.segment,
    store: user.store,
    gender: user.gender,
    jti: uuidv4(),
  };

  const token = await sign(payload, c.env.JWT_SECRET);
  return c.json({ logged_in_access_token: token });
};
export { loginHandler };
