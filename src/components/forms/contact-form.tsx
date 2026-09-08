"use client";

import { useActionState } from "react";
import { Send } from "lucide-react";
import { submitContact, type ActionState } from "@/actions/leads";
import { Honeypot, useGuardedAction, Field, FormError, SubmitButton, SuccessNote } from "@/components/forms/form-bits";

export function ContactForm({ defaultSubject = "loan" }: { defaultSubject?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitContact, { ok: false });
  const onSubmit = useGuardedAction(action);
  if (state.ok) return <SuccessNote message={state.message} />;
  return (
    <form onSubmit={onSubmit} className="relative space-y-4" noValidate>
      <Honeypot />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" error={state.errors?.name}><input id="name" name="name" type="text" autoComplete="name" className="field" required /></Field>
        <Field label="Email" name="email" error={state.errors?.email}><input id="email" name="email" type="email" autoComplete="email" className="field" required /></Field>
        <Field label="Mobile (optional)" name="phone" error={state.errors?.phone}><input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" /></Field>
        <Field label="Subject" name="subject" error={state.errors?.subject}>
          <select id="subject" name="subject" className="field" defaultValue={defaultSubject}>
            <option value="loan">A loan requirement</option>
            <option value="partner">Partner programme</option>
            <option value="grievance">Complaint or grievance</option>
            <option value="media">Media or partnership</option>
            <option value="other">Something else</option>
          </select>
        </Field>
      </div>
      <Field label="Message" name="message" error={state.errors?.message}><textarea id="message" name="message" rows={5} className="field" required /></Field>
      <FormError message={state.message} />
      <SubmitButton pending={pending}><Send className="size-4" /> Send message</SubmitButton>
    </form>
  );
}
