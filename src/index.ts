import { Hono } from "hono";
import { jwtMiddleware, requireLogin } from "./middlewares";
import { sessionHandler } from "./routes/session";
import { signupHandler } from "./routes/signup";
import { loginHandler } from "./routes/login";
import { logoutHandler } from "./routes/logout";
import { pageHandler } from "./routes/protected";
import { editUsersHandler, listUsersHandler } from "./routes/users";
import type { JwtVariables } from "hono/jwt";

export type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
};

export interface User {
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

app.get("/session", sessionHandler);

app.post("/signup", signupHandler);

app.post("/login", jwtMiddleware, loginHandler);

app.post("/logout", requireLogin, logoutHandler);

app.get("/page", requireLogin, pageHandler);

app.get("/users", jwtMiddleware, listUsersHandler);

app.patch("/user/:id", requireLogin, editUsersHandler);

app.get("/", async (c) => {
  return c.text(` ____  _   ___  __      _    ____ ___ 
|  _ \\| | | \\ \\/ /     / \\  |  _ \\_ _|
| |_) | |_| |\\  /     / _ \\ | |_) | | 
|  __/|  _  |/  \\    / ___ \\|  __/| | 
|_|   |_| |_/_/\\_\\  /_/   \\_\\_|  |___|  v 0.6

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
│ Logout    │ POST  │ /logout   │ Requires Logged-in token                    │
│ User      │       │           │ Header -> Authorization: Bearer <token>     │
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
│ Protected │ GET   │ /page     │ Requires Logged-in token                    │
│ route ex. │       │           │ Header -> Authorization: Bearer <token>     │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Userlist  │ GET   │ /users    │ Requires Logged-in token                    │
│           │       │           │ Header -> Authorization: Bearer <token>     │
├───────────┴───────┴───────────┴─────────────────────────────────────────────┤
│ Notes:                                                                      │
│ - JWT + all inputs are sanitized and protected against SQLI                 │
│ - Token expires after 45 minutes                                            │
│                                                                             │
│ TODO:                                                                       │
│ - Implement issuing, updating + revoking Cookie header for JWT. (30min)     │
│ - Add PHX-API-KEY header and issue api keys for guarded api access. (35min) │
│                                                                             │
│ - JWT segment data is WIP                                                   │
│   ┌─────────────────────┐                                                   │
│   │ sub: uuid           │                                                   │
│   │ exp: unix_timestamp │                                                   │
│   │ iss: string         │                                                   │
│   │ segment: string     │                                                   │
│   │ store: integer      │                                                   │
│   │ gender: string      │                                                   │
│   │ jti: jwt_uuid       │                                                   │
│   └─────────────────────┘                                                   │
└─────────────────────────────────────────────────────────────────────────────┘
`);
});

export default app;
