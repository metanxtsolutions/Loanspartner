"use client";

import { useActionState, useRef } from "react";
import { changePasswordAction, type ProfileActionState } from "@/actions/partner/profile";

const initial: ProfileActionState = { ok: true };

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
      className="flex flex-col gap-4"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="currentPassword" className="label">
          Current password
        </label>
        <input id="currentPassword" name="currentPassword" type="password" required autoComplete="current-password" className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="newPassword" className="label">
            New password
          </label>
          <input id="newPassword" name="newPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="confirmPassword" className="label">
            Confirm new password
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" required minLength={8} autoComplete="new-password" className="field" />
        </div>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-5 text-sm font-semibold text-white transition disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Updating..." : "Change password"}
      </button>
    </form>
  );
}
