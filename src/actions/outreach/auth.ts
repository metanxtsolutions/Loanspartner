"use server";

import { redirect } from "next/navigation";
import { z } from "zod";
import { createSession, destroySession, verifyAdminCredentials } from "@/server/outreach/auth";
import { logActivity } from "@/server/outreach/activity";

export type LoginState = { ok: boolean; message?: string; signedIn?: boolean };

const loginSchema = z.object({
  email: z.string().trim().email(),
  password: z.string().min(1),
});

/**
 * Does not redirect() here. The redirect target (/admin/outreach) reads
 * cookies() in its layout, and that render happens as part of producing
 * this same action's response, before the Set-Cookie header this function
 * writes has round-tripped to the browser. So the layout would see no
 * session yet and bounce straight back to /admin/login. Returning a
 * "signedIn" flag and letting the client navigate afterward, once the
 * cookie response has actually landed, avoids that.
 */
export async function signIn(_prev: LoginState, form: FormData): Promise<LoginState> {
  const parsed = loginSchema.safeParse({ email: form.get("email"), password: form.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and password." };
  const user = await verifyAdminCredentials(parsed.data.email, parsed.data.password);
  if (!user) return { ok: false, message: "Incorrect email or password." };
  await createSession(user.email);
  await logActivity({ actor: user.email, action: "admin.signed_in" });
  return { ok: true, signedIn: true };
}

export async function signOut() {
  await destroySession();
  redirect("/admin/login");
}
