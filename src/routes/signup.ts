import { hashPassword, querySanitizer } from "@/utils";
import { validateUserUpdate } from "@/validators";
import { v4 as uuidv4 } from "uuid";
import { Context } from "hono";

const signupHandler = async (c: Context) => {
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
};
export { signupHandler };
