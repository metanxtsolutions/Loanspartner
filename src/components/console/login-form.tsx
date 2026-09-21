"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { loginAdminAction, type AdminLoginState } from "@/actions/auth/admin";

const initial: AdminLoginState = { ok: true };

export function AdminLoginForm() {
  const [state, action, pending] = useActionState(loginAdminAction, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.signedIn) {
      router.push("/console");
      router.refresh();
    }
  }, [state.signedIn, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
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
      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 mt-1 px-4 py-2.5 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  );
}
