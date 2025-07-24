import { Hono } from "hono";
import { jwtMiddleware, requireApiKey, requireLogin } from "./middlewares";
import { sessionHandler } from "./routes/session";
import { signupHandler } from "./routes/signup";
import { loginHandler } from "./routes/login";
import { logoutHandler } from "./routes/logout";
import { pageHandler } from "./routes/protected";
import { editUsersHandler, listUsersHandler } from "./routes/users";
import type { JwtVariables } from "hono/jwt";
import { cors } from "hono/cors";

export type Bindings = {
  DB: D1Database;
  JWT_SECRET: string;
  API_KEY: string;
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

app.use(cors(), requireApiKey);

app.get("/session", sessionHandler);

app.post("/signup", jwtMiddleware, signupHandler);

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
|_|   |_| |_/_/\\_\\  /_/   \\_\\_|  |___|  v 0.8 (Feb 5, 08:40PM)

╭───────────┬───────┬───────────┬─────────────────────────────────────────────╮
│ ENDPOINT  │ TYPE  │ PATH      │ REQUIREMENTS                                │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Create    │ GET   │ /session  │                                             │
│ Session   │       │           │                                             │
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
│ Login     │ POST  │ /login    │ JSON body:                                  │
│ User      │       │           │  email     : string  (required)             │
│           │       │           │  password  : string  (required)             │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Logout    │ POST  │ /logout   │                                             │
│ User      │       │           │                                             │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Edit      │ PATCH │ /user/:id │ Param 'id' -> jwt.sub = user-id  (required) │
│ User      │       │           │                                             │
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
│ Protected │ GET   │ /page     │                                             │
│ route ex. │       │           │                                             │
├───────────┼───────┼───────────┼─────────────────────────────────────────────┤
│ Userlist  │ GET   │ /users    │                                             │
├───────────┴───────┴───────────┴─────────────────────────────────────────────┤
│ Notes:                                                                      │
│ - Calling /session will start you off with a cookie                         │
│   You can alternatively provide an Authorization: "Bearer <token>" header   │
│ - All routes other than this one require an API key (just ask)              │
│ - JWT + all inputs are sanitized and protected against SQLI                 │
│ - Token expires after 45 minutes                                            │
│ - JWT segment data is WIP                                                   │
│   ╭─────────────────────╮                                                   │
│   │ sub: uuid           │                                                   │
│   │ exp: unix_timestamp │                                                   │
│   │ iss: string         │                                                   │
│   │ segment: string     │                                                   │
│   │ store: integer      │                                                   │
│   │ gender: string      │                                                   │
│   │ jti: jwt_uuid       │                                                   │
│   ╰─────────────────────╯                                                   │
╰─────────────────────────────────────────────────────────────────────────────╯
`);
});

export default app;
