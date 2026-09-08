"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NumberInput, Panel, Result, inr, inrCompact } from "@/components/tools/calc-bits";
import type { ProductLite } from "@/data/lite-types";
import { formatINR } from "@/lib/utils";

type Row = { files: number; ticket: number; payout: number };

const round2 = (n: number) => Math.round(n * 100) / 100;

/** Mid-point of the published ticket band, used as the starting assumption. */
function typicalTicket(p: ProductLite) {
  const m = p.ticketSize.match(/₹([\d.]+)\s*(lakh|crore)\s*to\s*₹([\d.]+)\s*(lakh|crore)/);
  if (!m) return p.amountMin * 5;
  const toNum = (v: string, u: string) => Number(v) * (u === "crore" ? 1e7 : 1e5);
  return Math.round((toNum(m[1], m[2]) + toNum(m[3], m[4])) / 2);
}

const defaultFiles: Record<string, number> = { "personal-loan": 2, "home-loan": 1, "business-loan": 1 };

export function DsaIncomeCalculator({ products }: { products: ProductLite[] }) {
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(products.map((p) => [p.slug, { files: defaultFiles[p.slug] ?? 0, ticket: typicalTicket(p), payout: round2((p.payoutFrom + p.payoutTo) / 2) }])),
  );
  const update = (slug: string, patch: Partial<Row>) => setRows((r) => ({ ...r, [slug]: { ...r[slug], ...patch } }));

  const totals = useMemo(() => {
    let monthly = 0;
    let files = 0;
    let disbursed = 0;
    for (const p of products) {
      const r = rows[p.slug];
      if (!r) continue;
      monthly += (r.files * r.ticket * r.payout) / 100;
      files += r.files;
      disbursed += r.files * r.ticket;
    }
    return { monthly, annual: monthly * 12, files, disbursed };
  }, [rows, products]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <Panel className="overflow-x-auto !p-0">
        <table className="w-full min-w-[640px] text-sm">
          <caption className="px-4 pt-4 text-left text-xs text-mute">Set the files you expect to close each month, the average ticket and your payout slab.</caption>
          <thead className="bg-cream text-left text-xs uppercase tracking-wide text-mute">
            <tr>
              <th scope="col" className="px-4 py-3 font-bold">Product</th>
              <th scope="col" className="px-4 py-3 font-bold">Files / month</th>
              <th scope="col" className="px-4 py-3 font-bold">Avg ticket (₹)</th>
              <th scope="col" className="px-4 py-3 font-bold">Payout %</th>
              <th scope="col" className="px-4 py-3 text-right font-bold">Monthly</th>
            </tr>
          </thead>
          <tbody className="tnum">
            {products.map((p) => {
              const r = rows[p.slug];
              const m = (r.files * r.ticket * r.payout) / 100;
              return (
                <tr key={p.slug} className="border-t border-line">
                  <th scope="row" className="px-4 py-2 text-left font-bold text-ink-900">
                    {p.shortName}
                    <span className="block text-[11px] font-semibold text-mute">{p.payoutFrom}% to {p.payoutTo}%</span>
                  </th>
                  <td className="px-4 py-2"><NumberInput value={r.files} onChange={(v) => update(p.slug, { files: v })} min={0} max={200} step={1} aria-label={`${p.name} files per month`} className="w-16 rounded-lg border border-line px-2 py-1 text-right" /></td>
                  <td className="px-4 py-2"><NumberInput value={r.ticket} onChange={(v) => update(p.slug, { ticket: v })} min={10_000} max={500_000_000} step={10_000} aria-label={`${p.name} average ticket`} className="w-32 rounded-lg border border-line px-2 py-1 text-right" /></td>
                  <td className="px-4 py-2"><NumberInput value={r.payout} onChange={(v) => update(p.slug, { payout: round2(v) })} min={0} max={5} step={0.05} aria-label={`${p.name} payout percent`} className="w-20 rounded-lg border border-line px-2 py-1 text-right" /></td>
                  <td className="px-4 py-2 text-right font-bold text-ink-900">₹{formatINR(Math.round(m))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
      <Panel className="flex flex-col" live>
        <Result label="Estimated monthly payout" value={inr(totals.monthly)} big tone="verdant" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Result label="Annual" value={inrCompact(totals.annual)} />
          <Result label="Files per month" value={String(totals.files)} tone="mute" />
          <Result label="Monthly disbursal" value={inrCompact(totals.disbursed)} tone="mute" className="col-span-2" />
        </div>
        <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-mute">Gross, before TDS under Section 194H and any clawbacks. Payout slabs are indicative mid-points; your agreement states your slab per product.</p>
        <Link href="/partner/register" className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-800">Register as a partner <ArrowRight className="size-4" aria-hidden /></Link>
      </Panel>
    </div>
  );
}
