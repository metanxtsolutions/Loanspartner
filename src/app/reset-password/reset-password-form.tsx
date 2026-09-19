"use client";

import { useActionState } from "react";
import Link from "next/link";
import { resetPasswordAction, type ResetPasswordState } from "@/actions/auth/shared";

const initial: ResetPasswordState = { ok: true };

export function ResetPasswordForm({ token }: { token: string }) {
  const [state, formAction, pending] = useActionState(resetPasswordAction, initial);

  if (!token) {
    return <p className="error">This link is missing its token. Request a new one from the forgot password page.</p>;
  }

  if (state.ok && state.redirectTo) {
    return (
      <div className="flex flex-col gap-4">
        <p className="text-verdant-700 text-sm">{state.message}</p>
        <Link
          href={state.redirectTo}
          className="bg-ink-900 hover:bg-ink-800 inline-flex h-12 items-center justify-center px-4 text-sm font-semibold text-white transition"
        >
          Continue to sign in
        </Link>
      </div>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <input type="hidden" name="token" value={token} />
      <div>
        <label htmlFor="password" className="label">
          New password
        </label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="field" />
        <p className="hint">At least 8 characters.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirm password
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-12 px-4 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Saving..." : "Save new password"}
      </button>
    </form>
  );
}
