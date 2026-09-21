"use server";

import { z } from "zod";
import { dashboardPathFor, loginPathFor } from "@/server/dashboard/access";
import {
  verifyEmailToken,
  claimAccount,
  requestPasswordReset,
  resetPassword,
} from "@/server/dashboard/auth";

/**
 * Shared across all three role trees by design: a verification/reset/claim
 * token alone determines the account, so these live at the top level
 * (/verify-email, /claim-account, /forgot-password, /reset-password) rather
 * than under /dashboard, /partners or /console. Owned here because the
 * customer track owns those shared top-level pages.
 */

const passwordSchema = z.string().min(8, "Use at least 8 characters").max(100);

export type TokenActionState = { ok: boolean; message: string; redirectTo?: string };

/** Called directly from the /verify-email Server Component with the ?token= value, not a <form> action. */
export async function verifyEmailAction(token: string): Promise<TokenActionState> {
  if (!token) return { ok: false, message: "This verification link is missing its token." };
  const user = await verifyEmailToken(token);
  if (!user) {
    return { ok: false, message: "This verification link is invalid or has expired. Sign in and ask us to resend it." };
  }
  return { ok: true, message: "Your email is verified. You can sign in now.", redirectTo: loginPathFor(user.role) };
}

/**
 * Called with a plain (token, password) pair by the claim-account client
 * form, which does its own confirm-password check before invoking this.
 */
export async function claimAccountAction(token: string, password: string): Promise<TokenActionState> {
  if (!token) return { ok: false, message: "This invitation link is missing its token." };
  const parsed = passwordSchema.safeParse(password);
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Enter a valid password." };

  const user = await claimAccount(token, parsed.data);
  if (!user) {
    return { ok: false, message: "This invitation link is invalid or has expired. Ask whoever invited you to resend it." };
  }
  return { ok: true, message: "Account set up. Taking you to your dashboard...", redirectTo: dashboardPathFor(user.role) };
}

export type RequestResetState = { ok: boolean; message?: string };

export async function requestPasswordResetAction(_prev: RequestResetState, formData: FormData): Promise<RequestResetState> {
  const parsed = z.string().trim().toLowerCase().email().safeParse(formData.get("email"));
  if (!parsed.success) return { ok: false, message: "Enter a valid email address." };
  await requestPasswordReset(parsed.data);
  // Deliberately the same message whether or not the account exists (see requestPasswordReset).
  return { ok: true, message: "If that email is registered with us, we've sent a link to reset the password." };
}

export type ResetPasswordState = { ok: boolean; message?: string; redirectTo?: string };

const resetSchema = z
  .object({ password: passwordSchema, confirmPassword: z.string() })
  .refine((v) => v.password === v.confirmPassword, { message: "Passwords do not match", path: ["confirmPassword"] });

export async function resetPasswordAction(_prev: ResetPasswordState, formData: FormData): Promise<ResetPasswordState> {
  const token = String(formData.get("token") ?? "");
  if (!token) return { ok: false, message: "This reset link is missing its token." };

  const parsed = resetSchema.safeParse({ password: formData.get("password"), confirmPassword: formData.get("confirmPassword") });
  if (!parsed.success) return { ok: false, message: parsed.error.issues[0]?.message ?? "Check the form for errors." };

  const user = await resetPassword(token, parsed.data.password);
  if (!user) return { ok: false, message: "This reset link is invalid or has expired." };
  return { ok: true, message: "Your password has been reset. You can sign in now.", redirectTo: loginPathFor(user.role) };
}
