import { createHmac, timingSafeEqual } from "node:crypto";
import type { UserRole } from "@prisma/client";

/**
 * Pure sign/verify for the session cookie token, with no next/headers
 * dependency, so middleware.ts (Edge runtime, reads cookies off the request
 * directly) and src/server/auth/session.ts (Node runtime, uses next/headers
 * cookies()) can both use the exact same verification logic without either
 * pulling in APIs the other can't run.
 */
export const SESSION_COOKIE_NAME = "lp_session";
export const SESSION_DAYS = 30;

export type SessionPayload = { userId: string; role: UserRole; expires: number };

function secret() {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) throw new Error("SESSION_SECRET is missing or too short. Set a random 32+ char value in .env.local.");
  return s;
}

function sign(payload: string) {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function createSessionToken(userId: string, role: UserRole) {
  const expires = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  const payload = Buffer.from(JSON.stringify({ userId, role, expires }), "utf8").toString("base64url");
  return { token: `${payload}.${sign(payload)}`, expires };
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;
  const [payload, signature] = parts;
  const expected = sign(payload);
  if (expected.length !== signature.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) return null;
  try {
    const parsed = JSON.parse(Buffer.from(payload, "base64url").toString("utf8")) as SessionPayload;
    if (!Number.isFinite(parsed.expires) || Date.now() > parsed.expires) return null;
    if (!parsed.userId || !parsed.role) return null;
    return parsed;
  } catch {
    return null;
  }
}
