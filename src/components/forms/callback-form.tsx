"use client";

import { useActionState } from "react";
import { PhoneCall } from "lucide-react";
import { submitCallback, type ActionState } from "@/actions/leads";
import { Honeypot, Field, FormError, SubmitButton, SuccessNote, useGuardedAction } from "@/components/forms/form-bits";

export function CallbackForm({ product, city, source = "callback", compact = false }: { product?: string; city?: string; source?: string; compact?: boolean }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitCallback, { ok: false });
  const onSubmit = useGuardedAction(action);
  if (state.ok) return <SuccessNote message={state.message} />;
  return (
    <form onSubmit={onSubmit} method="post" aria-label="Request a callback" className="relative space-y-3" noValidate>
      <Honeypot />
      {product && <input type="hidden" name="product" value={product} />}
      {city && <input type="hidden" name="city" value={city} />}
      <input type="hidden" name="source" value={source} />
      <Field label="Name" name="cb-name" error={state.errors?.name}>
        {(a) => (<input {...a} name="name" type="text" autoComplete="name" className="field" placeholder="Your name" required />)}
      </Field>
      <Field label="Mobile" name="cb-phone" error={state.errors?.phone}>
        {(a) => (<input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="10-digit mobile" required />)}
      </Field>
      {!compact && (
        <Field label="Anything we should know? (optional)" name="cb-note" error={state.errors?.note}>
          {(a) => (<textarea {...a} name="note" rows={2} className="field" placeholder="Amount, timeline, property type..." />)}
        </Field>
      )}
      <FormError message={state.message} />
      <SubmitButton pending={pending}><PhoneCall className="size-4" aria-hidden /> Request a callback</SubmitButton>
      <p className="text-center text-[11px] text-mute">We call between 9:30 am and 6 pm, Monday to Saturday.</p>
    </form>
  );
}
