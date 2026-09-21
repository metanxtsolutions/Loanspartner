"use client";

import { useActionState } from "react";
import { requestPasswordResetAction, type RequestResetState } from "@/actions/auth/shared";

const initial: RequestResetState = { ok: true };

export function ForgotPasswordForm() {
  const [state, formAction, pending] = useActionState(requestPasswordResetAction, initial);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-12 px-4 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Sending..." : "Send reset link"}
      </button>
    </form>
  );
}
