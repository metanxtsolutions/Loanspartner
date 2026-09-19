"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerCustomerAction, type CustomerAuthState } from "@/actions/auth/customer";

const initial: CustomerAuthState = { ok: true };

export function RegisterForm() {
  const [state, formAction, pending] = useActionState(registerCustomerAction, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.ok && state.signedIn && state.redirectTo) {
      router.push(state.redirectTo);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div>
        <label htmlFor="name" className="label">
          Full name
        </label>
        <input id="name" name="name" required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div>
        <label htmlFor="phone" className="label">
          Mobile number
        </label>
        <input id="phone" name="phone" type="tel" required autoComplete="tel" placeholder="10-digit mobile number" className="field" />
      </div>
      <div>
        <label htmlFor="city" className="label">
          City (optional)
        </label>
        <input id="city" name="city" maxLength={60} autoComplete="address-level2" className="field" />
      </div>
      <div>
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="field" />
        <p className="hint">At least 8 characters.</p>
      </div>
      <label className="text-mute flex items-start gap-2 text-xs">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span>
          I agree to LoansPartner&apos;s{" "}
          <Link href="/terms" className="underline underline-offset-2">
            terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="underline underline-offset-2">
            privacy policy
          </Link>
          .
        </span>
      </label>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-4 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Creating account..." : "Create account"}
      </button>
    </form>
  );
}
