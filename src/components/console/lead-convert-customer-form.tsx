"use client";

import { useActionState } from "react";
import Link from "next/link";
import type { ProductLite } from "@/data/lite-types";
import { convertLeadToCustomerAction, type ActionResult } from "@/actions/console/leads";

const initial: ActionResult = { ok: true };

export function LeadConvertCustomerForm({
  leadId,
  products,
  defaults,
}: {
  leadId: string;
  products: ProductLite[];
  defaults: { email: string; product: string; amount: number | null; city: string };
}) {
  const [state, action, pending] = useActionState(convertLeadToCustomerAction, initial);

  if (state.ok && state.applicationId) {
    return (
      <div className="border-verdant-100 bg-verdant-50 border p-4">
        <p className="text-verdant-700 text-sm font-semibold">{state.message}</p>
        <Link href={`/console/applications/${state.applicationId}`} className="text-ink-900 mt-2 inline-block text-sm font-semibold underline underline-offset-2">
          Open the application
        </Link>
      </div>
    );
  }

  return (
    <form action={action} className="flex flex-col gap-3">
      <input type="hidden" name="leadId" value={leadId} />
      <p className="text-mute text-sm">
        Creates a customer account (or attaches to an existing one for this email), submits an application, and emails the customer a link to claim their
        account and track it.
      </p>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label htmlFor="convert-email" className="label">
            Customer email
          </label>
          <input id="convert-email" name="email" type="email" required defaultValue={defaults.email} className="field" />
          {!defaults.email ? <p className="hint">The enquiry had no email. Confirm one with the customer first.</p> : null}
        </div>
        <div>
          <label htmlFor="convert-product" className="label">
            Product
          </label>
          <select id="convert-product" name="product" required defaultValue={defaults.product} className="field">
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
        <div>
          <label htmlFor="convert-amount" className="label">
            Requested amount (₹)
          </label>
          <input id="convert-amount" name="requestedAmount" type="number" required min={10000} step={1000} defaultValue={defaults.amount ?? ""} className="field" />
        </div>
        <div>
          <label htmlFor="convert-city" className="label">
            City
          </label>
          <input id="convert-city" name="city" required defaultValue={defaults.city} className="field" />
        </div>
      </div>
      <div className="flex justify-end">
        <button type="submit" disabled={pending} className="bg-brass-500 text-ink-950 hover:bg-brass-400 px-4 py-2 text-sm font-bold transition disabled:opacity-60">
          {pending ? "Converting..." : "Create customer and application"}
        </button>
      </div>
      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}
    </form>
  );
}
