"use client";

import { useActionState, useState } from "react";
import { ArrowRight, Lock } from "lucide-react";
import { submitLeadStep1, type ActionState } from "@/actions/leads";
import { products } from "@/data/products";
import { Honeypot, useGuardedAction, Field, FormError, SubmitButton } from "@/components/forms/form-bits";
import { formatINR } from "@/lib/utils";

export function HeroForm({ defaultProduct = "personal-loan", source = "hero" }: { defaultProduct?: string; source?: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitLeadStep1, { ok: false });
  const onSubmit = useGuardedAction(action);
  const [amount, setAmount] = useState(500_000);
  return (
    <form onSubmit={onSubmit} className="relative space-y-4" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value={source} />
      <Field label="Loan type" name="product" error={state.errors?.product}>
        <select id="product" name="product" defaultValue={defaultProduct} className="field">
          {products.map((p) => (<option key={p.slug} value={p.slug}>{p.name}</option>))}
        </select>
      </Field>
      <Field label="Amount needed" name="amount" error={state.errors?.amount} hint={`₹${formatINR(amount)}`}>
        <input id="amount" name="amount" type="number" inputMode="numeric" min={10000} step={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="field" />
      </Field>
      <Field label="Mobile number" name="phone" error={state.errors?.phone}>
        <input id="phone" name="phone" type="tel" inputMode="tel" autoComplete="tel" placeholder="10-digit mobile" className="field" required />
      </Field>
      <FormError message={state.message} />
      <SubmitButton pending={pending}>Check my eligibility <ArrowRight className="size-4" /></SubmitButton>
      <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-mute"><Lock className="size-3" /> No fee, no spam, no impact on your credit score.</p>
    </form>
  );
}
