import { sign } from "hono/jwt";
import { generateSessionId } from "@/utils";
import { v4 as uuidv4 } from "uuid";
import { Context } from "hono";

const sessionHandler = async (c: Context) => {
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
};

export { sessionHandler };
