"use server";

import { redirect } from "next/navigation";
import { login, logout, InvalidCredentialsError, AccountSuspendedError } from "@/server/dashboard/auth";
import { loginSchema } from "@/lib/dashboard/schemas";

export type AdminLoginState = { ok: boolean; message?: string; signedIn?: boolean };

/**
 * Does not redirect() here: the redirect target (/console) reads cookies()
 * in its guarded layout, and that render would happen before this action's
 * Set-Cookie header has round-tripped to the browser. Returning `signedIn`
 * and letting the client navigate once the cookie response has actually
 * landed avoids bouncing straight back to /console/login. Mirrors
 * src/actions/outreach/auth.ts.
 */
export async function loginAdminAction(_prev: AdminLoginState, form: FormData): Promise<AdminLoginState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and password." };

  try {
    await login({ email: parsed.data.email, password: parsed.data.password, expectedRole: "ADMIN" });
  } catch (err) {
    if (err instanceof InvalidCredentialsError || err instanceof AccountSuspendedError) {
      return { ok: false, message: err.message };
    }
    throw err;
  }

  return { ok: true, signedIn: true };
}

export async function logoutAdminAction(): Promise<void> {
  await logout();
  redirect("/console/login");
}
