"use client";

import { useActionState, useRef } from "react";
import { changePasswordAction, type ProfileFormState } from "@/actions/customer/profile";

const initial: ProfileFormState = { ok: true };

export function PasswordForm() {
  const [state, formAction, pending] = useActionState(changePasswordAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await formAction(formData);
        formRef.current?.reset();
      }}
      className="border-line bg-cream flex max-w-lg flex-col gap-4 border p-6"
    >
      <div>
        <label htmlFor="currentPassword" className="label">
          Current password
        </label>
        <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="field" />
      </div>
      <div>
        <label htmlFor="newPassword" className="label">
          New password
        </label>
        <input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
        <p className="hint">At least 8 characters.</p>
      </div>
      <div>
        <label htmlFor="confirmPassword" className="label">
          Confirm new password
        </label>
        <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-11 self-start px-5 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Saving..." : "Change password"}
      </button>
    </form>
  );
}
