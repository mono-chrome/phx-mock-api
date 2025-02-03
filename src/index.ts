import { Hono } from "hono";
import { sign } from "hono/jwt";
import { v4 as uuidv4 } from "uuid";
import {
  generateSessionId,
  hashPassword,
  querySanitizer,
  verifyPassword,
} from "./utils";
import { validateUserUpdate } from "./validators";
import { jwtMiddleware, requireSession } from "./middlewares";
import type { JwtVariables } from "hono/jwt";
import { dummyData } from "./dummyData";

type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

interface User {
  id: string;
  email: string;
  password_hash: string;
  salt: string;
  created_at: string;
  first_name: string;
  last_name: string;
  gender?: "female" | "male";
  store?: number;
  segment?: "anonymous" | "lead" | "vip" | string;
}

const app = new Hono<{ Bindings: Bindings; Variables: JwtVariables }>();

app.get("/session", async (c) => {
  const sessionId = generateSessionId();

  try {
    await c.env.DB.prepare(
      "INSERT INTO users (id, email, password_hash, salt, segment) VALUES (?, ?, ?, ?, ?)",
    )
      .bind(sessionId, `s${sessionId}@loggedout.session`, "", "", "anonymous")
      .run();

    const payload = {
      sub: sessionId,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24,
      iss: "PHX - JF from the ashes",
      user: `s${sessionId}@loggedout.session`,
      segment: "anonymous",
      store: 9,
      gender: "female",
      jti: uuidv4(),
    };

    const token = await sign(payload, c.env.JWT_SECRET);
    return c.json({ access_token: token });
  } catch (error) {
    return c.json({ error: "Failed to create session" }, 500);
  }
});

app.post("/signup", async (c) => {
  const fields = await c.req.json();

  if (!fields.email || !fields.password) {
    return c.json({ error: "Email and password required." }, 400);
  }

  if (!querySanitizer(fields).sanitizeObject) {
    return c.json({ error: "Invalid input." }, 400);
  }

  const validationResult = validateUserUpdate(fields);

  if (!validationResult.isValid) {
    return c.json({ error: validationResult.error }, 400);
  }

  const exists = await c.env.DB.prepare("SELECT id FROM users WHERE email = ?")
    .bind(fields.email)
    .first();

  if (exists) {
    return c.json({ error: "User already exists" }, 409);
  }

  const { hash, salt } = await hashPassword(fields.password);
  const userId = uuidv4();

  await c.env.DB.prepare(
    "INSERT INTO users (id, email, password_hash, salt, first_name, last_name, gender, store, segment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      userId,
      fields.email,
      hash,
      salt,
      fields?.first_name || null,
      fields?.last_name || null,
      fields?.gender || "female",
      fields?.store || 9,
      fields?.segment || "lead",
    )
    .run();

  return c.json({ message: "User created" }, 201);
});

app.post("/login", requireSession, async (c) => {
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
    } catch (error) {
      return c.json({ error: `Failed to migrate logged-out user. ${error}` });
    }
  }

  const payload = {
    sub: user.id,
    exp: Math.floor(Date.now() / 1000) + 60 * 45,
    iss: "PHX - JF from the ashes",
    user: user.email,
    segment: user.segment,
    store: user.store,
    gender: user.gender,
    jti: uuidv4(),
  };

  const token = await sign(payload, c.env.JWT_SECRET);
  return c.json({ access_token: token });
});

app.post("/logout", jwtMiddleware, async (c) => {
  const payload = c.get("jwtPayload");

  if (!querySanitizer(payload).sanitizeObject) {
    return c.json({ error: "Malicious JWT modification" }, 400);
  }

  await c.env.DB.prepare(
    "INSERT INTO revoked_tokens (jti, user_id) VALUES (?, ?)",
  )
    .bind(payload.jti, payload.sub)
    .run();

  return c.json({ message: "Logged out" });
});

app.get("/page", jwtMiddleware, async (c) => {
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

  return c.json({
    userData: {
      issuer: token.iss,
      userId: token.sub,
      email: token.user,
      segment: token.segment,
      storeId: token.store,
      gender: token.gender,
    },
    productData: dummyData,
  });
});

app.get("/users", jwtMiddleware, async (c) => {
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
});

app.patch("/user/:id", jwtMiddleware, async (c) => {
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
      user: updates?.email || token.user,
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
});

app.get("/", async (c) => {
  return c.text(` ____  _   ___  __      _    ____ ___ 
|  _ \\| | | \\ \\/ /     / \\  |  _ \\_ _|
| |_) | |_| |\\  /     / _ \\ | |_) | | 
|  __/|  _  |/  \\    / ___ \\|  __/| | 
|_|   |_| |_/_/\\_\\  /_/   \\_\\_|  |___|  v 0.4

┌───────────┬───────┬───────────┬─────────────────────────────────────────────┐
│ ENDPOINT  │ TYPE  │ PATH      │ REQUIREMENTS                                │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Create    │ GET   │ /session  │ No requirements.                            │
│ Session   │       │           │ Generates new Session.                      │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Signup    │ POST  │ /signup   │ JSON body:                                  │
│ User      │       │           │  email       : string  (required)           │
│           │       │           │  password    : string  (required)           │
│           │       │           │  first_name? : string                       │
│           │       │           │  last_name?  : string                       │
│           │       │           │  gender?     : 'female' | 'male'            │
│           │       │           │  segment?    : 'anonymous' | 'lead' | 'vip' │
│           │       │           │                'funnel_<string(23)>'        │
│           │       │           │  store?      : number (0-99)                │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Login     │ POST  │ /login    │ Header -> Authorization: Bearer <token>     │
│ User      │       │           │                                             │
│           │       │           │ JSON body:                                  │
│           │       │           │  - email     : string  (required)           │
│           │       │           │  - password  : string  (required)           │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Logout    │ POST  │ /logout   │ Header -> Authorization: Bearer <token>     │
│ User      │       │           │                                             │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Edit      │ PATCH │ /user/:id │ Header -> Authorization: Bearer <token>     │
│ User      │       │           │                                             │
│           │       │           │ Param 'id' -> jwt.sub = user-id  (required) │
│           │       │           │                                             │
│           │       │           │ JSON body:                                  │
│           │       │           │  email?      : string                       │
│           │       │           │  password?   : string                       │
│           │       │           │  first_name? : string                       │
│           │       │           │  last_name?  : string                       │
│           │       │           │  gender?     : 'female' | 'male'            │
│           │       │           │  segment?    : 'anonymous' | 'lead' | 'vip' │
│           │       │           │                'funnel_<string(23)>'        │
│           │       │           │  store?      : number (0-99)                │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Protected │ GET   │ /page     │ Header -> Authorization: Bearer <token>     │
│ route ex. │       │           │                                             │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Userlist  │ GET   │ /users    │ Header -> Authorization: Bearer <token>     │
├───────────┴───────┴───────────┴─────────────────────────────────────────────┤
│ Notes:                                                                      │
│ - JWT + all inputs are sanitized and protected against SQLI                 │
│ - Token expires after 45 minutes                                            │
│                                                                             │
│ TODO:                                                                       │
│ - Modify middlewares to allow for specific logged-out/in endpoints. (20min) │
│ - Implement issuing, updating + revoking Cookie header for JWT. (30min)     │
│ - Add PHX-API-KEY header and issue api keys for guarded api access. (35min) │
│                                                                             │
│ - JWT segment data is WIP                                                   │
│   ┌─────────────────────┐                                                   │
│   │ sub: uuid           │                                                   │
│   │ exp: unix_timestamp │                                                   │
│   │ iss: string         │                                                   │
│   │ user: email         │                                                   │
│   │ segment: string     │                                                   │
│   │ store: integer      │                                                   │
│   │ gender: string      │                                                   │
│   │ jti: jwt_uuid       │                                                   │
│   └─────────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
`);
});

export default app;
