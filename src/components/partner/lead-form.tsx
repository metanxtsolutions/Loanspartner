"use client";

import { useActionState, useEffect, useRef } from "react";
import Link from "next/link";
import type { ProductLite, CityLite } from "@/data/lite-types";
import { submitLeadAction, type LeadActionState } from "@/actions/partner/leads";

const initial: LeadActionState = { ok: true };

export function LeadForm({ products, cities }: { products: ProductLite[]; cities: CityLite[] }) {
  const [state, action, pending] = useActionState(submitLeadAction, initial);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (state.ok && state.applicationId) formRef.current?.reset();
  }, [state.ok, state.applicationId]);

  return (
    <form ref={formRef} action={action} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="customerName" className="label">
            Customer name
          </label>
          <input id="customerName" name="customerName" type="text" required className="field" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="customerPhone" className="label">
            Customer mobile
          </label>
          <input id="customerPhone" name="customerPhone" type="tel" required className="field" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="customerEmail" className="label">
          Customer email
        </label>
        <input id="customerEmail" name="customerEmail" type="email" required className="field" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="product" className="label">
            Product
          </label>
          <select id="product" name="product" required className="field" defaultValue="">
            <option value="" disabled>
              Select a product
            </option>
            {products.map((p) => (
              <option key={p.slug} value={p.slug}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="requestedAmount" className="label">
            Requested amount (₹)
          </label>
          <input id="requestedAmount" name="requestedAmount" type="number" min={10000} step={1000} required className="field" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="city" className="label">
          City
        </label>
        <input id="city" name="city" type="text" list="lead-cities" required className="field" />
        <datalist id="lead-cities">
          {cities.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="label">
          Note (optional)
        </label>
        <textarea id="note" name="note" rows={3} maxLength={500} className="field" placeholder="Anything the credit desk should know" />
        <p className="hint">Internal only, never shown to the customer.</p>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
      {state.ok && state.message && state.applicationId ? (
        <div className="border-verdant-100 bg-verdant-50 text-ink-900 border px-4 py-3 text-sm">
          <p>{state.message}</p>
          <Link href={`/partners/leads/${state.applicationId}`} className="mt-1 inline-block font-semibold underline underline-offset-2">
            View lead →
          </Link>
        </div>
      ) : null}
      <button
        type="submit"
        disabled={pending}
        className="bg-brass-500 text-ink-950 hover:bg-brass-400 mt-1 h-12 px-5 text-sm font-bold transition disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Submitting..." : "Submit lead"}
      </button>
    </form>
  );
}
