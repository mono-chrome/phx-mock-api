const bufferToBase64 = (buffer: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buffer)));

const base64ToBuffer = (base64: string) =>
  Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));

const hashPassword = async (password: string) => {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 10,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return {
    hash: bufferToBase64(derivedKey),
    salt: bufferToBase64(salt),
  };
};

const verifyPassword = async (
  password: string,
  salt: string,
  storedHash: string,
) => {
  const encoder = new TextEncoder();
  const passwordBuffer = encoder.encode(password);
  const saltBuffer = base64ToBuffer(salt);

  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    passwordBuffer,
    { name: "PBKDF2" },
    false,
    ["deriveBits"],
  );

  const derivedKey = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt: saltBuffer,
      iterations: 10,
      hash: "SHA-256",
    },
    keyMaterial,
    256,
  );

  return bufferToBase64(derivedKey) === storedHash;
};

// INFO: This doesn't really sanitize yet, just here to guard against SQLI
function querySanitizer(input: Record<any, any> | any) {
  const DANGEROUS_PATTERNS =
    /['"`]|(--|#|\/\*).*$|;|\b(SELECT|INSERT|UPDATE|DELETE|DROP|UNION)\b/i;

  const sanitize = (input: unknown): boolean => {
    if (input == null) return true;

    const str =
      typeof input === "object" ? JSON.stringify(input) : String(input);

    return !DANGEROUS_PATTERNS.test(str);
  };

  const sanitizeObject = (input: Record<string, unknown>): boolean => {
    return Object.values(input).every((value) =>
      typeof value === "object" && value !== null
        ? sanitizeObject(value as Record<string, unknown>)
        : sanitize(value),
    );
  };

  return { sanitize: sanitize(input), sanitizeObject: sanitizeObject(input) };
}

const generateSessionId = () => {
  const timestamp = Date.now().toString().slice(-10);
  const random = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, "0");
  return `2${timestamp}${random}`;
};

export { verifyPassword, hashPassword, querySanitizer, generateSessionId };
