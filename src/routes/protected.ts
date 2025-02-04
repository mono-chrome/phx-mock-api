import { querySanitizer } from "@/utils";
import { Context } from "hono";
import type { JwtVariables } from "hono/jwt";
import type { Bindings } from "..";
import { User } from "..";
import { dummyData } from "@/dummyData";

const pageHandler = async (
  c: Context<{ Bindings: Bindings; Variables: JwtVariables }>,
) => {
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

  const userResults = await c.env.DB.prepare(
    "SELECT email, first_name, last_name FROM users WHERE id = ?",
  )
    .bind(token.sub)
    .first<User>();

  return c.json({
    userData: {
      userId: token.sub,
      email: userResults?.email,
      firstName: userResults?.first_name,
      lastName: userResults?.last_name,
      segment: token.segment,
      storeId: token.store,
      gender: token.gender,
    },
    productData: dummyData,
  });
};

export { pageHandler };
