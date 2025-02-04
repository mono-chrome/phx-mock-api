import { createMiddleware } from "hono/factory";
import { jwt, verify } from "hono/jwt";

const jwtMiddleware = createMiddleware(async (c, next) => {
  console.log("jwtcall");
  return jwt({
    secret: c.env.JWT_SECRET,
    cookie: "token",
    alg: "HS256",
  })(c, next);
});

const requireLogin = createMiddleware(async (c, next) => {
  const token = c.req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return c.json({ error: "Invalid token" }, 401);
  }

  const parsedToken = await verify(token, c.env.JWT_SECRET, "HS256");

  if (parsedToken.segment === "anonymous") {
    return c.json({ error: "Logged-in session required." });
  }

  c.set("jwtPayload", parsedToken);

  await next();
});

export { jwtMiddleware, requireLogin };
