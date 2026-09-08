"use client";

import { useActionState, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ArrowRight, Check } from "lucide-react";
import { submitLeadStep1, submitLeadStep2, type ActionState } from "@/actions/leads";
import type { CityLite, ProductLite } from "@/data/lite-types";
import { cibilBands, employmentTypes } from "@/lib/leads/options";
import { Honeypot, Field, FormError, SubmitButton, amountPresets, useGuardedAction } from "@/components/forms/form-bits";
import { cn, formatINR } from "@/lib/utils";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const employmentLabels: Record<(typeof employmentTypes)[number], string> = {
  salaried: "Salaried",
  "self-employed-professional": "Self-employed professional",
  "self-employed-business": "Business owner",
  other: "Other",
};
const cibilLabels: Record<(typeof cibilBands)[number], string> = {
  "750+": "750 and above",
  "700-749": "700 to 749",
  "650-699": "650 to 699",
  "below-650": "Below 650",
  unknown: "I do not know",
};

export function ApplyForm({ products, cities }: { products: ProductLite[]; cities: CityLite[] }) {
  const params = useSearchParams();
  const leadId = params.get("lead");
  const validLead = leadId && UUID.test(leadId) ? leadId : null;
  const wantsStep2 = params.get("step") === "2";
  const step: 1 | 2 = validLead && wantsStep2 ? 2 : 1;
  const staleLink = wantsStep2 && !validLead;

  return (
    <div>
      <Stepper step={step} />
      {staleLink && (
        <p className="mb-5 rounded-xl bg-danger-50 px-4 py-3 text-sm font-semibold text-danger" role="alert">
          That link has expired. Please share your requirement again; it takes under a minute.
        </p>
      )}
      {step === 1 ? (
        <StepOne
          products={products}
          cities={cities}
          defaultProduct={params.get("product") ?? "personal-loan"}
          defaultAmount={Number(params.get("amount") ?? 500_000)}
          defaultCity={params.get("city") ?? ""}
          defaultName={params.get("name") ?? ""}
        />
      ) : (
        <StepTwo
          cities={cities}
          products={products}
          leadId={validLead as string}
          defaultName={params.get("name") ?? ""}
          defaultCity={params.get("city") ?? ""}
          product={params.get("product") ?? ""}
          amount={Number(params.get("amount") ?? 0)}
        />
      )}
    </div>
  );
}

function Stepper({ step }: { step: 1 | 2 }) {
  const items = ["Your requirement", "Your profile", "Lender shortlist"];
  return (
    <ol className="mb-8 flex items-center gap-2 text-xs font-bold">
      {items.map((label, i) => {
        const n = i + 1;
        const done = n < step;
        const active = n === step;
        return (
          <li key={label} className="flex items-center gap-2" aria-current={active ? "step" : undefined}>
            <span className={cn("flex size-6 items-center justify-center rounded-full", done ? "bg-verdant-600 text-white" : active ? "bg-ink-900 text-white" : "bg-sand text-mute")}>
              {done ? <Check className="size-3.5" aria-hidden /> : n}
              <span className="sr-only">Step {n}: </span>
            </span>
            <span className={cn(active ? "text-ink-900" : "text-mute", "hidden sm:inline")}>{label}</span>
            {n < items.length && <span className="mx-1 h-px w-6 bg-line" aria-hidden />}
          </li>
        );
      })}
    </ol>
  );
}

function StepOne({ products, cities, defaultProduct, defaultAmount, defaultCity, defaultName }: { products: ProductLite[]; cities: CityLite[]; defaultProduct: string; defaultAmount: number; defaultCity: string; defaultName: string }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitLeadStep1, { ok: false });
  const onSubmit = useGuardedAction(action);
  const [amount, setAmount] = useState(defaultAmount > 0 ? defaultAmount : 500_000);
  const [product, setProduct] = useState(defaultProduct);
  const p = products.find((x) => x.slug === product);
  return (
    <form onSubmit={onSubmit} method="post" aria-label="Your loan requirement" className="relative space-y-6" noValidate>
      <Honeypot />
      <input type="hidden" name="source" value="apply-step-1" />
      <fieldset>
        <legend className="label">What do you need?</legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {products.map((x) => (
            <label
              key={x.slug}
              className={cn(
                "cursor-pointer rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-2 has-[:focus-visible]:outline-verdant-500",
                product === x.slug ? "border-verdant-500 bg-verdant-50 text-verdant-700" : "border-line bg-white hover:border-ink-300",
              )}
            >
              <input type="radio" name="product" value={x.slug} checked={product === x.slug} onChange={() => setProduct(x.slug)} className="sr-only" />
              {x.name}
            </label>
          ))}
        </div>
        {state.errors?.product && <p className="error" role="alert">{state.errors.product}</p>}
      </fieldset>
      <Field
        label="Loan amount"
        name="amount"
        error={state.errors?.amount}
        hint={p ? `${p.name}s typically range from ₹${formatINR(p.amountMin, { compact: true })} to ₹${formatINR(p.amountMax, { compact: true })}.` : undefined}
      >
        {(a) => (
          <>
            <div className="flex flex-wrap gap-2 pb-2">
              {amountPresets.map((v) => (
                <button type="button" key={v} onClick={() => setAmount(v)} aria-pressed={amount === v} className={cn("rounded-full border px-3 py-1 text-xs font-bold", amount === v ? "border-ink-900 bg-ink-900 text-white" : "border-line bg-white hover:border-ink-300")}>₹{formatINR(v, { compact: true })}</button>
              ))}
            </div>
            <input {...a} name="amount" type="number" inputMode="numeric" min={10000} step={10000} value={amount} onChange={(e) => setAmount(Number(e.target.value))} className="field" />
          </>
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Your name" name="name" error={state.errors?.name}>
          {(a) => (<input {...a} name="name" type="text" autoComplete="name" defaultValue={defaultName} className="field" placeholder="Full name" />)}
        </Field>
        <Field label="Mobile number" name="phone" error={state.errors?.phone}>
          {(a) => (<input {...a} name="phone" type="tel" inputMode="tel" autoComplete="tel" className="field" placeholder="10-digit mobile" required />)}
        </Field>
      </div>
      <Field label="City" name="city" error={state.errors?.city}>
        {(a) => (
          <>
            <input {...a} name="city" type="text" list="apply-city-list" defaultValue={defaultCity} autoComplete="address-level2" className="field" placeholder="Where do you live or run your business?" />
            <datalist id="apply-city-list">{cities.map((c) => (<option key={c.slug} value={c.name} />))}</datalist>
          </>
        )}
      </Field>
      <FormError message={state.message} />
      <SubmitButton pending={pending}>Continue <ArrowRight className="size-4" aria-hidden /></SubmitButton>
      <p className="text-center text-xs text-mute">No fee. No spam. Your credit score is not checked at this stage.</p>
    </form>
  );
}

function StepTwo({ cities, products, leadId, defaultName, defaultCity, product, amount }: { cities: CityLite[]; products: ProductLite[]; leadId: string; defaultName: string; defaultCity: string; product: string; amount: number }) {
  const [state, action, pending] = useActionState<ActionState, FormData>(submitLeadStep2, { ok: false });
  const onSubmit = useGuardedAction(action);
  const p = products.find((x) => x.slug === product);
  return (
    <form onSubmit={onSubmit} method="post" aria-label="Your profile" className="relative space-y-6" noValidate>
      <Honeypot />
      <input type="hidden" name="leadId" value={leadId} />
      {p && (
        <div className="rounded-2xl bg-verdant-50 px-4 py-3 text-sm text-verdant-700">
          <span className="font-bold">Saved:</span> {p.name}{amount ? ` for ₹${formatINR(amount)}` : ""}. A few more details let us shortlist the right lenders.
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Full name" name="name" error={state.errors?.name}>
          {(a) => (<input {...a} name="name" type="text" autoComplete="name" defaultValue={defaultName} className="field" required />)}
        </Field>
        <Field label="City" name="city" error={state.errors?.city}>
          {(a) => (
            <>
              <input {...a} name="city" type="text" list="apply-city-list-2" defaultValue={defaultCity} autoComplete="address-level2" className="field" required />
              <datalist id="apply-city-list-2">{cities.map((c) => (<option key={c.slug} value={c.name} />))}</datalist>
            </>
          )}
        </Field>
      </div>
      <Field label="Employment" name="employment" error={state.errors?.employment}>
        {(a) => (
          <select {...a} name="employment" className="field" defaultValue="salaried">
            {employmentTypes.map((e) => (<option key={e} value={e}>{employmentLabels[e]}</option>))}
          </select>
        )}
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Net monthly income (₹)" name="monthlyIncome" error={state.errors?.monthlyIncome} hint="Take-home salary or average monthly business income.">
          {(a) => (<input {...a} name="monthlyIncome" type="number" inputMode="numeric" min={0} step={1000} className="field" placeholder="e.g. 75000" />)}
        </Field>
        <Field label="Existing EMIs per month (₹)" name="existingEmi" error={state.errors?.existingEmi}>
          {(a) => (<input {...a} name="existingEmi" type="number" inputMode="numeric" min={0} step={500} className="field" placeholder="0 if none" />)}
        </Field>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Credit score band" name="cibil" error={state.errors?.cibil}>
          {(a) => (
            <select {...a} name="cibil" className="field" defaultValue="unknown">
              {cibilBands.map((b) => (<option key={b} value={b}>{cibilLabels[b]}</option>))}
            </select>
          )}
        </Field>
        <Field label="Email (optional)" name="email" error={state.errors?.email}>
          {(a) => (<input {...a} name="email" type="email" autoComplete="email" className="field" placeholder="For your lender comparison" />)}
        </Field>
      </div>
      <label className="flex items-start gap-3 text-xs text-mute">
        <input type="checkbox" name="consent" className="mt-0.5 size-4 accent-verdant-600" required />
        <span>I authorise LoansPartner to contact me by call, WhatsApp and email about my loan requirement, and to share my details with the lender I choose to apply to. I understand LoansPartner charges no fee to borrowers.</span>
      </label>
      {state.errors?.consent && <p className="error" role="alert">{state.errors.consent}</p>}
      <FormError message={state.message} />
      <SubmitButton pending={pending}>Get my lender shortlist <ArrowRight className="size-4" aria-hidden /></SubmitButton>
    </form>
  );
}
