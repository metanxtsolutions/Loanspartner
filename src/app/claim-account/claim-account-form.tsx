"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { claimAccountAction, type TokenActionState } from "@/actions/auth/shared";

const initial: TokenActionState = { ok: true, message: "" };

export function ClaimAccountForm({ token }: { token: string }) {
  const router = useRouter();

  // claimAccountAction takes a plain (token, password) pair rather than
  // (state, formData); this wrapper adapts it to useActionState so the form
  // still gets pending/error state for free, and does the confirm-password
  // check client-side before ever calling the server action.
  const [state, formAction, pending] = useActionState(async (_prev: TokenActionState, formData: FormData): Promise<TokenActionState> => {
    const password = String(formData.get("password") ?? "");
    const confirmPassword = String(formData.get("confirmPassword") ?? "");
    if (password.length < 8) return { ok: false, message: "Use at least 8 characters." };
    if (password !== confirmPassword) return { ok: false, message: "Passwords do not match." };
    return claimAccountAction(token, password);
  }, initial);

  useEffect(() => {
    if (state.ok && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  if (!token) {
    return <p className="error">This link is missing its token. Ask whoever invited you to resend it.</p>;
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
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
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-4 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Setting up..." : "Set password and continue"}
      </button>
    </form>
  );
}
