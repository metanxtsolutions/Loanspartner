"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileFormState } from "@/actions/customer/profile";

const initial: ProfileFormState = { ok: true };

export function ProfileForm({ name, phone, city }: { name: string; phone: string; city: string }) {
  const [state, formAction, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={formAction} className="border-line bg-cream flex max-w-lg flex-col gap-4 border p-6">
      <div>
        <label htmlFor="name" className="label">
          Full name
        </label>
        <input id="name" name="name" defaultValue={name} required maxLength={80} autoComplete="name" className="field" />
      </div>
      <div>
        <label htmlFor="phone" className="label">
          Mobile number
        </label>
        <input id="phone" name="phone" defaultValue={phone} required autoComplete="tel" className="field" />
      </div>
      <div>
        <label htmlFor="city" className="label">
          City
        </label>
        <input id="city" name="city" defaultValue={city} maxLength={60} autoComplete="address-level2" className="field" />
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-xs">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-11 self-start px-5 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
