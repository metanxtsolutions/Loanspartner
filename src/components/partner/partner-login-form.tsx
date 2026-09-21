"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { loginPartnerAction, type AuthActionState } from "@/actions/auth/partner";

const initial: AuthActionState = { ok: true };

export function PartnerLoginForm() {
  const [state, action, pending] = useActionState(loginPartnerAction, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.signedIn) {
      router.push("/partners");
      router.refresh();
    }
  }, [state.signedIn, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="username" className="field" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required autoComplete="current-password" className="field" />
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-4 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
      <p className="text-mute text-sm">
        <Link href="/forgot-password" className="text-ink-800 underline underline-offset-2">
          Forgot password?
        </Link>
      </p>
    </form>
  );
}
