import { createMiddleware } from "hono/factory";
import { jwt, verify } from "hono/jwt";
import { HTTPException } from "hono/http-exception";

const requireApiKey = createMiddleware(async (c, next) => {
  if (c.req.path === "/") {
    return await next();
  }

  if (c.req.header("PHX-API-Key") !== c.env.API_KEY) {
    throw new HTTPException(401, {
      res: new Response("Unauthorized", {
        status: 401,
        headers: {
          "WWW-Authenticate": 'error="invalid_api_key"',
        },
      }),
    });
  }

  await next();
});

const jwtMiddleware = createMiddleware(async (c, next) => {
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

export { requireApiKey, jwtMiddleware, requireLogin };
