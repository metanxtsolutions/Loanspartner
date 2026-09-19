import "server-only";
import { cookies } from "next/headers";
import type { UserRole } from "@prisma/client";
import { SESSION_COOKIE_NAME, createSessionToken, verifySessionToken, type SessionPayload } from "@/lib/dashboard/session-token";

export type { SessionPayload };

export async function createSession(userId: string, role: UserRole) {
  const { token, expires } = createSessionToken(userId, role);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: new Date(expires),
  });
}

export async function destroySession() {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

/** Reads and verifies the session cookie. Use in Server Components/actions/route handlers. */
export async function getSession(): Promise<SessionPayload | null> {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
