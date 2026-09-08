"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { submitLeadStep1, type ActionState } from "@/actions/leads";
import type { ProductLite } from "@/data/lite-types";
import { Honeypot, Field, FormError, SubmitButton, useGuardedAction } from "@/components/forms/form-bits";
import { formatINR } from "@/lib/utils";

export function HeroForm({ products, defaultProduct = "personal-loan", source = "hero" }: { products: ProductLite[]; defaultProduct?: string; source?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitLeadStep1, { ok: false });
  const onSubmit = useGuardedAction(action);
  const [amount, setAmount] = useState(500_000);
  return (
    <form onSubmit={onSubmit} method="post" aria-label="Check your loan eligibility" className="relative space-y-4" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <Field label="Loan type" name="product" error={state.errors?.product}>
        {(a) => (
          <select {...a} name="product" defaultValue={defaultProduct} className="field">
            {products.map((p) => (<option key={p.slug} value={p.slug}>{p.name}</option>))}
          </select>
        )}
      </Field>
      <Field label="Amount needed" name="amount" error={state.errors?.amount} hint={`₹${formatINR(amount)}`}>
        {(a) => (
          <input {...a} name="amount" type="number" inputMode="numeric" min={10000} step={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="field" />
        )}
      </Field>
      <Field label="Mobile number" name="phone" error={state.errors?.phone}>
        {(a) => (<input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" className="field" required />)}
      </Field>
      <FormError message={state.message} />
      <SubmitButton pending={pending}>Check my eligibility <ArrowRight className="size-4" aria-hidden /></SubmitButton>
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-mute"><Lock className="size-3" aria-hidden /> No fee, no spam, no impact on your credit score.</p>
    </form>
  );
}
