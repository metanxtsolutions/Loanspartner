"use server";

import { redirect } from "next/navigation";
import { partnerRegisterSchema, loginSchema } from "@/lib/dashboard/schemas";
import {
  registerPartner,
  login,
  logout,
  EmailInUseError,
  InvalidCredentialsError,
  AccountSuspendedError,
} from "@/server/dashboard/auth";

export type AuthActionState = { ok: boolean; message?: string; signedIn?: boolean };

const GENERIC_FORM_ERROR = "Please check the form and try again.";

export async function registerPartnerAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = partnerRegisterSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    phone: formData.get("phone"),
    city: formData.get("city"),
    firmName: formData.get("firmName"),
    password: formData.get("password"),
    consent: formData.get("consent"),
  });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? GENERIC_FORM_ERROR };

  try {
    await registerPartner({
      name: parsed.data.name,
      email: parsed.data.email,
      phone: parsed.data.phone,
      city: parsed.data.city,
      firmName: parsed.data.firmName || undefined,
      password: parsed.data.password,
    });
  } catch (error) {
    if (error instanceof EmailInUseError) return { ok: false, message: error.message };
    throw error;
  }

  return { ok: true, signedIn: true };
}

export async function loginPartnerAction(_prev: AuthActionState, formData: FormData): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({ email: formData.get("email"), password: formData.get("password") });
  if (!parsed.success) return { ok: false, message: "Enter a valid email and password." };

  try {
    await login({ email: parsed.data.email, password: parsed.data.password, expectedRole: "PARTNER" });
  } catch (error) {
    if (error instanceof InvalidCredentialsError || error instanceof AccountSuspendedError) {
      return { ok: false, message: error.message };
    }
    throw error;
  }

  return { ok: true, signedIn: true };
}

/**
 * No prevState/return value: this is called directly as a <form action>,
 * the same way src/actions/outreach/auth.ts's signOut() is, so it can
 * redirect() straight away (there's no client-side cookie-timing race here
 * the way there is right after sign-in, since we're destroying the session
 * rather than depending on a fresh one being readable).
 */
export async function logoutPartnerAction() {
  await logout();
  redirect("/partners/login");
}
