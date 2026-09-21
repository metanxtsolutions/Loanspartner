"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginCustomerAction, type CustomerAuthState } from "@/actions/auth/customer";

const initial: CustomerAuthState = { ok: true };

export function LoginForm() {
  const [state, formAction, pending] = useActionState(loginCustomerAction, initial);
  const router = useRouter();

  // Don't redirect() inside the action itself: the target reads the session
  // cookie server-side, and that render can happen before this action's
  // Set-Cookie response has round-tripped to the browser. Navigating from
  // the client, once the state update lands, avoids that race.
  useEffect(() => {
    if (state.ok && state.signedIn && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-4 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
