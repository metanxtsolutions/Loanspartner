import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/server/outreach/db";

/**
 * Small internal tool for a handful of LoansPartner staff, so this is a
 * signed session cookie rather than a full auth provider. The cookie payload
 * is the admin's email plus an expiry, HMAC-signed with ADMIN_SESSION_SECRET
 * so it cannot be forged without that secret.
 */
const COOKIE_NAME = "outreach_session";
const SESSION_DAYS = 14;

function secret() {
  const s = process.env.ADMIN_SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("ADMIN_SESSION_SECRET is missing or too short. Set a random 32+ char value in .env.local.");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}

/**
 * The payload is base64url-encoded before joining with the signature so the
 * "." delimiter is unambiguous: splitting a raw `${email}.${expires}`
 * string on "." broke for any email containing a dot, such as
 * "admin@loanspartner.in" itself, since ".in" adds an extra split point.
 */
export async function createSession(email: string) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ email, expires }), "utf8").toString("base64url");
  const token = `${payload}.${sign(payload)}`;
  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires),
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

/** Returns the signed-in admin's email, or null if there is no valid session. */
export async function getSessionEmail(): Promise<string | null> {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return null;
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = sign(payload);
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  try {
    const { email, expires } = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as { email: string; expires: number };
    if (!Number.isFinite(expires) || Date.now() > expires) return null;
    return email;
  } catch {
    return null;
  }
}

export async function requireAdmin() {
  const email = await getSessionEmail();
  if (!email) throw new Error("UNAUTHENTICATED");
  return email;
}

export async function verifyAdminCredentials(email: string, password: string) {
  const user = await prisma.adminUser.findUnique({ where: { email: email.toLowerCase().trim() } });
  if (!user) return null;
  if (!verifyPassword(password, user.passwordHash)) return null;
  return user;
}
