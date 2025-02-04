import { querySanitizer } from "@/utils";
import { Context } from "hono";

const logoutHandler = async (c: Context) => {
  const payload = c.get("jwtPayload");

  if (!querySanitizer(payload).sanitizeObject) {
    return c.json({ error: "Malicious JWT modification" }, 400);
  }

  try {
    await c.env.DB.prepare(
      "INSERT INTO revoked_tokens (jti, user_id) VALUES (?, ?)",
    )
      .bind(payload.jti, payload.sub)
      .run();

    return c.json({ message: "Logged out" });
  } catch (err) {
    return c.json({ message: "User already logged out." });
  }
};

export { logoutHandler };
