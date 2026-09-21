"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerPartnerAction, type AuthActionState } from "@/actions/auth/partner";

const initial: AuthActionState = { ok: true };

export function PartnerRegisterForm() {
  const [state, action, pending] = useActionState(registerPartnerAction, initial);
  const router = useRouter();

  useEffect(() => {
    if (state.signedIn) {
      // Newly-registered partners always start at NOT_SUBMITTED KYC.
      router.push("/partners/onboarding");
      router.refresh();
    }
  }, [state.signedIn, router]);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="label">
          Full name
        </label>
        <input id="name" name="name" type="text" required autoComplete="name" className="field" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="email" className="label">
          Email
        </label>
        <input id="email" name="email" type="email" required autoComplete="email" className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="label">
            Mobile number
          </label>
          <input id="phone" name="phone" type="tel" required autoComplete="tel" className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="label">
            City
          </label>
          <input id="city" name="city" type="text" required autoComplete="address-level2" className="field" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="firmName" className="label">
          Firm / business name (optional)
        </label>
        <input id="firmName" name="firmName" type="text" className="field" />
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="password" className="label">
          Password
        </label>
        <input id="password" name="password" type="password" required minLength={8} autoComplete="new-password" className="field" />
        <p className="hint">At least 8 characters.</p>
      </div>
      <label className="flex items-start gap-2 text-sm">
        <input type="checkbox" name="consent" required className="mt-0.5" />
        <span className="text-mute">
          I agree to the{" "}
          <Link href="/terms" className="text-ink-900 underline underline-offset-2">
            Terms
          </Link>{" "}
          and{" "}
          <Link href="/privacy-policy" className="text-ink-900 underline underline-offset-2">
            Privacy Policy
          </Link>
          .
        </span>
      </label>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-brass-500 text-ink-950 hover:bg-brass-400 mt-1 h-12 px-5 text-sm font-bold transition disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Create partner account"}
      </button>
      <p className="text-mute text-sm">
        Already registered?{" "}
        <Link href="/partners/login" className="text-ink-900 font-semibold underline underline-offset-2">
          Sign in
        </Link>
      </p>
    </form>
  );
}
