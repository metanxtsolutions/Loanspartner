"use client";

import { useActionState } from "react";
import { ArrowRight } from "lucide-react";
import { submitPartner, type ActionState } from "@/actions/leads";
import type { AudienceLite, CityLite, ProductLite } from "@/data/lite-types";
import { Honeypot, Field, FormError, SubmitButton, SuccessNote, useGuardedAction } from "@/components/forms/form-bits";

export function PartnerForm({
  products,
  audiences,
  cities,
  defaultProfession,
  source = "partner-register",
}: {
  products: ProductLite[];
  audiences: AudienceLite[];
  cities: CityLite[];
  defaultProfession?: string;
  source?: string;
}) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitPartner, { ok: false });
  const onSubmit = useGuardedAction(action);
  if (state.ok) {
    return (
      <div className="space-y-4">
        <SuccessNote message={state.message} />
        <ol className="list-decimal space-y-1 pl-5 text-sm text-ink-800">
          <li>A partner manager calls to understand your network.</li>
          <li>You share KYC and sign the digital agreement.</li>
          <li>You get your partner code, training and portal access.</li>
        </ol>
      </div>
    );
  }
  return (
    <form onSubmit={onSubmit} method="post" aria-label="Channel partner application" className="relative space-y-5" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" error={state.errors?.name}>{(a) => (<input {...a} name="name" type="text" autoComplete="name" className="field" required />)}</Field>
        <Field label="Mobile" name="phone" error={state.errors?.phone}>{(a) => (<input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" required />)}</Field>
        <Field label="Email" name="email" error={state.errors?.email}>{(a) => (<input {...a} name="email" type="email" autoComplete="email" className="field" required />)}</Field>
        <Field label="City" name="city" error={state.errors?.city}>
          {(a) => (
            <>
              <input {...a} name="city" type="text" list="partner-city-list" autoComplete="address-level2" className="field" required />
              <datalist id="partner-city-list">{cities.map((c) => (<option key={c.slug} value={c.name} />))}</datalist>
            </>
          )}
        </Field>
        <Field label="Your profession" name="profession" error={state.errors?.profession}>
          {(a) => (
            <select {...a} name="profession" className="field" defaultValue={defaultProfession ?? ""}>
              <option value="" disabled>Select</option>
              {audiences.map((x) => (<option key={x.slug} value={x.name}>{x.name}</option>))}
              <option value="Loan DSA (existing)">Existing loan DSA</option>
              <option value="Other">Other</option>
            </select>
          )}
        </Field>
        <Field label="Registering as" name="entityType" error={state.errors?.entityType}>
          {(a) => (
            <select {...a} name="entityType" className="field" defaultValue="individual">
              <option value="individual">Individual</option>
              <option value="proprietorship">Proprietorship</option>
              <option value="partnership-llp">Partnership or LLP</option>
              <option value="company">Private limited company</option>
            </select>
          )}
        </Field>
        <Field label="Experience with loan distribution" name="experience" error={state.errors?.experience} className="sm:col-span-2">
          {(a) => (
            <select {...a} name="experience" className="field" defaultValue="new">
              <option value="new">New to this</option>
              <option value="1-3">1 to 3 years</option>
              <option value="3-5">3 to 5 years</option>
              <option value="5+">More than 5 years</option>
            </select>
          )}
        </Field>
      </div>
      <fieldset>
        <legend className="label">Products you want to distribute</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((p) => (
            <label key={p.slug} className="flex cursor-pointer items-center gap-2 rounded-xl border border-line bg-white px-3 py-2 text-sm font-semibold has-checked:border-verdant-500 has-checked:bg-verdant-50 has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verdant-500">
              <input type="checkbox" name="products[]" value={p.slug} className="size-4 accent-verdant-600" defaultChecked={p.popular} />
              {p.shortName}
            </label>
          ))}
        </div>
        {state.errors?.products && <p className="error" role="alert">{state.errors.products}</p>}
      </fieldset>
      <Field label="Tell us about your network (optional)" name="network" error={state.errors?.network}>
        {(a) => (<textarea {...a} name="network" rows={3} className="field" placeholder="Who are your clients or contacts, and roughly how many loan needs do you see in a month?" />)}
      </Field>
      <label className="flex items-start gap-3 text-xs text-mute">
        <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-verdant-600" required />
        <span>I confirm the details are accurate and agree to be contacted about the partner programme. I understand partners never collect money from borrowers and must follow the LoansPartner code of conduct.</span>
      </label>
      {state.errors?.consent && <p className="error" role="alert">{state.errors.consent}</p>}
      <FormError message={state.message} />
      <SubmitButton pending={pending}>Submit application <ArrowRight className="size-4" aria-hidden /></SubmitButton>
    </form>
  );
}
