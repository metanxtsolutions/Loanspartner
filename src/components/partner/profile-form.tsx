"use client";

import { useActionState } from "react";
import { updateProfileAction, type ProfileActionState } from "@/actions/partner/profile";

const initial: ProfileActionState = { ok: true };

export function ProfileForm({ defaultValues }: { defaultValues: { name: string; phone: string; city: string } }) {
  const [state, action, pending] = useActionState(updateProfileAction, initial);

  return (
    <form action={action} className="flex flex-col gap-4">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="name" className="label">
          Full name
        </label>
        <input id="name" name="name" type="text" required defaultValue={defaultValues.name} className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="phone" className="label">
            Mobile number
          </label>
          <input id="phone" name="phone" type="tel" required defaultValue={defaultValues.phone} className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="city" className="label">
            City
          </label>
          <input id="city" name="city" type="text" defaultValue={defaultValues.city} className="field" />
        </div>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message ? <p className="text-verdant-700 text-sm">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-ink-900 hover:bg-ink-800 mt-1 h-12 px-5 text-sm font-semibold text-white transition disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Saving..." : "Save changes"}
      </button>
    </form>
  );
}
