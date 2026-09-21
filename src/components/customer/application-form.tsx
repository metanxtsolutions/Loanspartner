"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createApplicationAction, type ApplicationFormState } from "@/actions/customer/applications";
import type { CityLite, ProductLite } from "@/data/lite-types";
import { formatINR } from "@/lib/utils";

const initial: ApplicationFormState = { ok: true };

const EMPLOYMENT_TYPES = ["Salaried", "Self-employed (business)", "Self-employed (professional)", "Other"];

export function ApplicationForm({
  products,
  cities,
  defaultProductSlug,
}: {
  products: ProductLite[];
  cities: CityLite[];
  defaultProductSlug?: string;
}) {
  const [state, formAction, pending] = useActionState(createApplicationAction, initial);
  const router = useRouter();

  const initialSlug = defaultProductSlug && products.some((p) => p.slug === defaultProductSlug) ? defaultProductSlug : (products[0]?.slug ?? "");
  const [productSlug, setProductSlug] = useState(initialSlug);
  const product = useMemo(() => products.find((p) => p.slug === productSlug), [products, productSlug]);

  useEffect(() => {
    if (state.ok && state.applicationId) {
      router.push(`/dashboard/applications/${state.applicationId}`);
      router.refresh();
    }
  }, [state, router]);

  return (
    <form action={formAction} className="border-line bg-cream flex max-w-xl flex-col gap-5 border p-6">
      <div>
        <label htmlFor="product" className="label">
          Loan product
        </label>
        <select id="product" name="product" required className="field" value={productSlug} onChange={(e) => setProductSlug(e.target.value)}>
          {products.map((p) => (
            <option key={p.slug} value={p.slug}>
              {p.name}
            </option>
          ))}
        </select>
        {product ? (
          <p className="hint">
            {product.rateFrom}%&ndash;{product.rateTo}% p.a. &middot; {formatINR(product.amountMin, { compact: true })}&ndash;
            {formatINR(product.amountMax, { compact: true })} &middot; up to {Math.round(product.tenureMaxMonths / 12)} years
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="requestedAmount" className="label">
          Amount required (&#8377;)
        </label>
        <input
          id="requestedAmount"
          name="requestedAmount"
          type="number"
          required
          min={10000}
          step={1000}
          defaultValue={product?.amountMin ?? 100000}
          className="field"
        />
        {product ? (
          <p className="hint">
            Typical range for {product.shortName}: {formatINR(product.amountMin, { compact: true })}&ndash;{formatINR(product.amountMax, { compact: true })}
          </p>
        ) : null}
      </div>

      <div>
        <label htmlFor="city" className="label">
          City
        </label>
        <input id="city" name="city" list="dashboard-city-options" required maxLength={60} className="field" placeholder="e.g. Mumbai" autoComplete="address-level2" />
        <datalist id="dashboard-city-options">
          {cities.map((c) => (
            <option key={c.slug} value={c.name} />
          ))}
        </datalist>
      </div>

      <div>
        <label htmlFor="employmentType" className="label">
          Employment type (optional)
        </label>
        <select id="employmentType" name="employmentType" className="field" defaultValue="">
          <option value="">Prefer not to say</option>
          {EMPLOYMENT_TYPES.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>

      {!state.ok && state.message ? <p className="error">{state.message}</p> : null}

      <button type="submit" disabled={pending} className="bg-ink-900 hover:bg-ink-800 h-12 px-5 text-sm font-semibold text-white transition disabled:opacity-60">
        {pending ? "Submitting..." : "Submit enquiry"}
      </button>
    </form>
  );
}
