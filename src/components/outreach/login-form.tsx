"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { signIn, type LoginState } from "@/actions/outreach/auth";

const initial: LoginState = { ok: true };

export function LoginForm() {
  const [state, action, pending] = useActionState(signIn, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.signedIn) {
      router.push("/admin/outreach");
      router.refresh();
    }
  }, [state.signedIn, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="text-ink-800 text-sm font-medium">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="username"
          className="border-line-strong/40 bg-cream text-ink-900 focus:border-ink-500 focus:ring-ink-500/20 border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="text-ink-800 text-sm font-medium">
          Password
        </label>
        <input
          id="password"
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="border-line-strong/40 bg-cream text-ink-900 focus:border-ink-500 focus:ring-ink-500/20 border px-3.5 py-2.5 text-sm outline-none focus:ring-2"
        />
      </div>
      {!state.ok && state.message ? <p className="text-danger text-sm">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink-900 hover:bg-ink-800 mt-1 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
