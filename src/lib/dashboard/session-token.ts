import type { UserRole } from "@prisma/client";

/**
 * Sign/verify for the session cookie token using Web Crypto's SubtleCrypto
 * (not node:crypto), so this same code runs unmodified in both the Edge
 * runtime (middleware.ts, which reads cookies off the request directly) and
 * the Node.js runtime (src/server/auth/session.ts, which uses next/headers
 * cookies()) with no runtime pragma needed on either side. `subtle.verify`
 * does the signature comparison itself, in constant time, so there's no
 * manual buffer-equality step to get right.
 */
export const SESSION_COOKIE_NAME = "lp_session";
export const SESSION_DAYS = 30;

export type SessionPayload = { userId: string; role: UserRole; expires: number };

const encoder = new TextEncoder();

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET is missing or too short. Set a random 32+ char value in .env.local.");
  return s;
}

async function hmacKey() {
  return crypto.subtle.importKey("raw", encoder.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function toBase64Url(bytes: ArrayBuffer | Uint8Array) {
  const arr = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let binary = "";
  for (const b of arr) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes;
}

export async function createSessionToken(userId: string, role: UserRole) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = toBase64Url(encoder.encode(JSON.stringify({ userId, role, expires })));
  const signature = await crypto.subtle.sign("HMAC", await hmacKey(), encoder.encode(payload));
  return { token: `${payload}.${toBase64Url(signature)}`, expires };
}

export async function verifySessionToken(token: string): Promise<SessionPayload | null> {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  let signatureBytes: Uint8Array;
  try {
    signatureBytes = fromBase64Url(signature);
  } catch {
    return null;
  }
  const valid = await crypto.subtle.verify("HMAC", await hmacKey(), signatureBytes as BufferSource, encoder.encode(payload));
  if (!valid) return null;
  try {
    const parsed = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as SessionPayload;
    if (!Number.isFinite(parsed.expires) || Date.now() > parsed.expires) return null;
    if (!parsed.userId || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}
