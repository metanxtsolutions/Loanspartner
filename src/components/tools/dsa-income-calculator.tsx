"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel, Result, inr, inrCompact, clamp } from "@/components/tools/calc-bits";
import { products } from "@/data/products";
import { formatINR } from "@/lib/utils";

type Row = { files: number; ticket: number; payout: number };

function typicalTicket(p: (typeof products)[number]) {
  const m = p.dsa.ticketSize.match(/₹([\d.]+)\s*(lakh|crore)\s*to\s*₹([\d.]+)\s*(lakh|crore)/);
  if (!m) return p.amount.min * 5;
  const toNum = (v: string, u: string) => Number(v) * (u === "crore" ? 1e7 : 1e5);
  return Math.round((toNum(m[1], m[2]) + toNum(m[3], m[4])) / 2);
}

const defaults: Record<string, number> = { "personal-loan": 2, "home-loan": 1, "business-loan": 1 };

export function DsaIncomeCalculator() {
  const [rows, setRows] = useState<Record<string, Row>>(() =>
    Object.fromEntries(products.map((p) => [p.slug, { files: defaults[p.slug] ?? 0, ticket: typicalTicket(p), payout: (p.dsa.payoutFrom + p.dsa.payoutTo) / 2 }])),
  );
  const update = (slug: string, patch: Partial<Row>) => setRows((r) => ({ ...r, [slug]: { ...r[slug], ...patch } }));

  const totals = useMemo(() => {
    let monthly = 0;
    let files = 0;
    let disbursed = 0;
    for (const p of products) {
      const r = rows[p.slug];
      monthly += (r.files * r.ticket * r.payout) / 100;
      files += r.files;
      disbursed += r.files * r.ticket;
    }
    return { monthly, annual: monthly * 12, files, disbursed };
  }, [rows]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.25fr_0.75fr]">
      <Panel className="overflow-x-auto !p-0">
        <table className="w-full min-w-[640px] text-sm">
          <thead className="bg-cream text-left text-xs uppercase tracking-wide text-mute">
            <tr><th className="px-4 py-3 font-bold">Product</th><th className="px-4 py-3 font-bold">Files / month</th><th className="px-4 py-3 font-bold">Avg ticket (₹)</th><th className="px-4 py-3 font-bold">Payout %</th><th className="px-4 py-3 text-right font-bold">Monthly</th></tr>
          </thead>
          <tbody className="tnum">
            {products.map((p) => {
              const r = rows[p.slug];
              const m = (r.files * r.ticket * r.payout) / 100;
              return (
                <tr key={p.slug} className="border-t border-line">
                  <td className="px-4 py-2 font-bold text-ink-900">{p.shortName}<span className="block text-[11px] font-semibold text-mute">{p.dsa.payoutFrom}% to {p.dsa.payoutTo}%</span></td>
                  <td className="px-4 py-2"><input type="number" min={0} max={200} value={r.files} onChange={(e) => update(p.slug, { files: clamp(Number(e.target.value), 0, 200) })} aria-label={`${p.name} files per month`} className="w-16 rounded-lg border border-line px-2 py-1 text-right" /></td>
                  <td className="px-4 py-2"><input type="number" min={10000} step={10000} value={r.ticket} onChange={(e) => update(p.slug, { ticket: clamp(Number(e.target.value), 10_000, 500_000_000) })} aria-label={`${p.name} average ticket`} className="w-32 rounded-lg border border-line px-2 py-1 text-right" /></td>
                  <td className="px-4 py-2"><input type="number" min={0} max={5} step={0.05} value={r.payout} onChange={(e) => update(p.slug, { payout: clamp(Number(e.target.value), 0, 5) })} aria-label={`${p.name} payout percent`} className="w-20 rounded-lg border border-line px-2 py-1 text-right" /></td>
                  <td className="px-4 py-2 text-right font-bold text-ink-900">₹{formatINR(Math.round(m))}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </Panel>
      <Panel className="flex flex-col">
        <Result label="Estimated monthly payout" value={inr(totals.monthly)} big tone="verdant" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Result label="Annual" value={inrCompact(totals.annual)} />
          <Result label="Files per month" value={String(totals.files)} tone="mute" />
          <Result label="Monthly disbursal" value={inrCompact(totals.disbursed)} tone="mute" className="col-span-2" />
        </div>
        <p className="mt-5 rounded-xl bg-cream px-4 py-3 text-xs leading-relaxed text-mute">Gross, before TDS under Section 194H and any clawbacks. Payout slabs are indicative mid-points; your agreement states your slab per product.</p>
        <Link href="/partner/register" className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-800">Register as a partner <ArrowRight className="size-4" /></Link>
      </Panel>
    </div>
  );
}
