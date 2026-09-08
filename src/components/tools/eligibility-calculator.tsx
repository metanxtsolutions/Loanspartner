"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel, Result, SliderField, inr, inrCompact } from "@/components/tools/calc-bits";
import type { ProductLite } from "@/data/lite-types";
import { calcEMI, principalForEMI } from "@/lib/utils";

/** Representative FOIR caps: lenders allow a larger share of income as income rises. */
function foirCap(income: number, product: string) {
  let cap = income < 50_000 ? 50 : income < 100_000 ? 55 : income < 200_000 ? 60 : 65;
  if (product === "home-loan" || product === "loan-against-property") cap += 5;
  return Math.min(cap, 70);
}

export function EligibilityCalculator({ products, defaultProduct = "personal-loan" }: { products: ProductLite[]; defaultProduct?: string }) {
  const [product, setProduct] = useState(defaultProduct);
  const p = products.find((x) => x.slug === product) ?? products[0];
  const [income, setIncome] = useState(75_000);
  const [existing, setExisting] = useState(0);
  const [rate, setRate] = useState(p.rateFrom);
  const [years, setYears] = useState(Math.min(5, Math.floor(p.tenureMaxMonths / 12)));

  const r = useMemo(() => {
    const cap = foirCap(income, p.slug);
    const maxEmi = Math.max(0, (income * cap) / 100 - existing);
    const months = years * 12;
    const rawLoan = principalForEMI(maxEmi, rate, months);
    const loan = Math.min(rawLoan, p.amountMax);
    const emi = calcEMI(loan, rate, months);
    return { cap, maxEmi, loan, emi, months, capped: rawLoan > p.amountMax, belowMin: loan > 0 && loan < p.amountMin };
  }, [income, existing, rate, years, p]);

  const onProduct = (slug: string) => {
    const np = products.find((x) => x.slug === slug);
    if (!np) return;
    setProduct(slug);
    setRate(np.rateFrom);
    setYears((y) => Math.min(y, Math.floor(np.tenureMaxMonths / 12)));
  };

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="space-y-7">
        <div>
          <label htmlFor="elig-product" className="label">Loan product</label>
          <select id="elig-product" value={product} onChange={(e) => onProduct(e.target.value)} className="field">
            {products.map((x) => (<option key={x.slug} value={x.slug}>{x.name}</option>))}
          </select>
        </div>
        <SliderField label="Net monthly income" value={income} onChange={setIncome} min={15_000} max={2_000_000} step={5_000} format={inrCompact} suffix="₹" />
        <SliderField label="Existing EMIs per month" value={existing} onChange={setExisting} min={0} max={1_000_000} step={1_000} format={inrCompact} suffix="₹" />
        <SliderField label="Interest rate" value={rate} onChange={setRate} min={p.rateFrom} max={p.rateTo} step={0.05} format={(v) => `${v}%`} suffix="% p.a." />
        <SliderField label="Tenure" value={years} onChange={setYears} min={1} max={Math.floor(p.tenureMaxMonths / 12)} step={1} format={(v) => `${v} yr`} suffix="years" />
      </Panel>
      <Panel className="flex flex-col" live>
        <Result label="Indicative eligible amount" value={inr(r.loan)} big tone="verdant" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Result label="Affordable EMI" value={inr(r.maxEmi)} />
          <Result label="EMI at eligible amount" value={inr(r.emi)} tone="mute" />
        </div>
        <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-sm text-ink-800">
          Assumes lenders cap total EMIs at <span className="tnum font-bold">{r.cap}%</span> of net income for this income band and product{r.capped ? `, and the product's maximum of ${inrCompact(p.amountMax)}` : ""}. Actual eligibility also depends on credit score, employer category and, for secured loans, the asset value.
        </p>
        {r.belowMin && (
          <p className="mt-3 rounded-xl bg-brass-50 px-4 py-3 text-sm text-brass-600">
            This is below the usual minimum of {inrCompact(p.amountMin)} for a {p.name.toLowerCase()}. A longer tenure, a co-applicant or a different product would suit better; our desk can advise.
          </p>
        )}
        <Link href={`/apply?product=${p.slug}&amount=${Math.round(r.loan / 10_000) * 10_000}`} className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-800">
          Check with real lenders <ArrowRight className="size-4" aria-hidden />
        </Link>
      </Panel>
    </div>
  );
}
