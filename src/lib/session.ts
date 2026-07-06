import { cookies } from "next/headers";
import crypto from "node:crypto";

/**
 * Minimal, dependency-free session handling for the admin dashboard.
 * The session is a stateless, HMAC-signed cookie: `<payload>.<signature>`.
 * This is intentionally simple — swap for a real auth provider if the
 * dashboard ever holds sensitive data.
 */

export const SESSION_COOKIE = "wp_admin_session";
export const SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours

const SECRET =
  process.env.SESSION_SECRET ?? "dev-only-insecure-secret-change-me";

export type Session = { username: string; exp: number };

function sign(body: string): string {
  return crypto.createHmac("sha256", SECRET).update(body).digest("base64url");
}

export function signToken(username: string): string {
  const payload: Session = {
    username,
    exp: Date.now() + SESSION_MAX_AGE * 1000,
  };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body)}`;
}

export function verifyToken(token?: string | null): Session | null {
  if (!token) return null;
  const [body, signature] = token.split(".");
  if (!body || !signature) return null;

  const expected = sign(body);
  const a = Buffer.from(signature);
  const b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(body, "base64url").toString()
    ) as Session;
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

/** Read and verify the current session (safe to call in Server Components). */
export async function getSession(): Promise<Session | null> {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  return verifyToken(token);
}

/** Issue a session cookie. Only call from a Server Action or Route Handler. */
export async function createSession(username: string): Promise<void> {
  (await cookies()).set(SESSION_COOKIE, signToken(username), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  });
}

/** Clear the session cookie. Only call from a Server Action or Route Handler. */
export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}
