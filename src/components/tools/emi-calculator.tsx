"use client";

import { useMemo, useState } from "react";
import { Panel, Result, SliderField, inr, inrCompact } from "@/components/tools/calc-bits";
import { calcEMI, formatINR } from "@/lib/utils";

export function EmiCalculator({ defaultAmount = 1_000_000, defaultRate = 10.5, defaultMonths = 60, maxAmount = 100_000_000, maxMonths = 360 }: { defaultAmount?: number; defaultRate?: number; defaultMonths?: number; maxAmount?: number; maxMonths?: number }) {
  const [amount, setAmount] = useState(defaultAmount);
  const [rate, setRate] = useState(defaultRate);
  const [months, setMonths] = useState(defaultMonths);

  const r = useMemo(() => {
    const emi = calcEMI(amount, rate, months);
    const total = emi * months;
    const interest = total - amount;
    const principalShare = total > 0 ? (amount / total) * 100 : 0;
    const schedule: { year: number; principal: number; interest: number; balance: number }[] = [];
    let bal = amount;
    const mr = rate / 12 / 100;
    for (let m = 1; m <= months; m++) {
      const i = bal * mr;
      const p = emi - i;
      bal = Math.max(0, bal - p);
      const y = Math.ceil(m / 12);
      const row = schedule[y - 1] ?? (schedule[y - 1] = { year: y, principal: 0, interest: 0, balance: 0 });
      row.principal += p;
      row.interest += i;
      row.balance = bal;
    }
    return { emi, total, interest, principalShare, schedule };
  }, [amount, rate, months]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="space-y-7">
        <SliderField label="Loan amount" value={amount} onChange={setAmount} min={50_000} max={maxAmount} step={50_000} format={inrCompact} suffix="₹" />
        <SliderField label="Interest rate" value={rate} onChange={setRate} min={5} max={36} step={0.05} format={(v) => `${v}%`} suffix="% p.a." />
        <SliderField label="Tenure" value={months} onChange={setMonths} min={6} max={maxMonths} step={1} format={(v) => (v >= 12 ? `${Math.round(v / 12)} yr` : `${v} mo`)} suffix="months" hint={`${(months / 12).toFixed(1)} years`} />
      </Panel>
      <Panel className="flex flex-col" live>
        <Result label="Monthly EMI" value={inr(r.emi)} big tone="verdant" />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Result label="Total interest" value={inr(r.interest)} tone="brass" />
          <Result label="Total payment" value={inr(r.total)} />
        </div>
        <div className="mt-6">
          <div className="flex h-3 overflow-hidden rounded-full bg-sand" role="img" aria-label={`Principal ${r.principalShare.toFixed(0)} percent, interest ${(100 - r.principalShare).toFixed(0)} percent`}>
            <div className="bg-verdant-500" style={{ width: `${r.principalShare}%` }} />
            <div className="bg-brass-400" style={{ width: `${100 - r.principalShare}%` }} />
          </div>
          <div className="mt-2 flex justify-between text-xs text-mute"><span><span className="mr-1 inline-block size-2 rounded-full bg-verdant-500" />Principal {r.principalShare.toFixed(0)}%</span><span><span className="mr-1 inline-block size-2 rounded-full bg-brass-400" />Interest {(100 - r.principalShare).toFixed(0)}%</span></div>
        </div>
        <details className="mt-6 border-t border-line pt-4">
          <summary className="cursor-pointer text-sm font-bold text-ink-900">Year-wise repayment schedule</summary>
          <div className="mt-3 max-h-72 overflow-auto rounded-xl border border-line">
            <table className="tnum w-full text-xs">
              <thead className="sticky top-0 bg-cream text-left text-mute"><tr><th scope="col" className="px-3 py-2">Year</th><th scope="col" className="px-3 py-2">Principal</th><th scope="col" className="px-3 py-2">Interest</th><th scope="col" className="px-3 py-2">Balance</th></tr></thead>
              <tbody>{r.schedule.map((s) => (<tr key={s.year} className="border-t border-line"><th scope="row" className="px-3 py-1.5 text-left font-semibold">{s.year}</th><td className="px-3 py-1.5">₹{formatINR(Math.round(s.principal))}</td><td className="px-3 py-1.5">₹{formatINR(Math.round(s.interest))}</td><td className="px-3 py-1.5">₹{formatINR(Math.round(s.balance))}</td></tr>))}</tbody>
            </table>
          </div>
        </details>
      </Panel>
    </div>
  );
}
