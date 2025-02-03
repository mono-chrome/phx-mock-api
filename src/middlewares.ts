import { createMiddleware } from "hono/factory";
import { jwt } from "hono/jwt";

const jwtMiddleware = createMiddleware(async (c, next) => {
  return jwt({
    secret: c.env.JWT_SECRET,
    cookie: "token",
    alg: "HS256",
  })(c, next);
});

const requireSession = createMiddleware(async (c, next) => {
  await jwtMiddleware(c, next);
});

export { jwtMiddleware, requireSession };
