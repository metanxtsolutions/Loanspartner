"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Panel, Result, SliderField, inr, inrCompact } from "@/components/tools/calc-bits";
import { calcEMI } from "@/lib/utils";

export function BalanceTransferCalculator() {
  const [outstanding, setOutstanding] = useState(6_000_000);
  const [months, setMonths] = useState(180);
  const [currentRate, setCurrentRate] = useState(9.25);
  const [newRate, setNewRate] = useState(7.75);
  const [costs, setCosts] = useState(15_000);

  const r = useMemo(() => {
    const oldEmi = calcEMI(outstanding, currentRate, months);
    const newEmi = calcEMI(outstanding, newRate, months);
    const oldInterest = oldEmi * months - outstanding;
    const newInterest = newEmi * months - outstanding;
    const grossSaving = oldInterest - newInterest;
    const netSaving = grossSaving - costs;
    const monthlySaving = oldEmi - newEmi;
    const breakEven = monthlySaving > 0 ? Math.ceil(costs / monthlySaving) : Infinity;
    // Keep the same EMI at the new rate: how many months, and interest saved?
    let sameEmiMonths = 0;
    let bal = outstanding;
    const mr = newRate / 12 / 100;
    if (oldEmi > bal * mr) {
      while (bal > 0 && sameEmiMonths < 600) {
        bal = bal + bal * mr - oldEmi;
        sameEmiMonths++;
      }
    }
    const sameEmiInterest = oldEmi * sameEmiMonths - outstanding;
    const sameEmiSaving = oldInterest - sameEmiInterest - costs;
    const worth = netSaving > 0 && breakEven <= months;
    return { oldEmi, newEmi, oldInterest, newInterest, grossSaving, netSaving, monthlySaving, breakEven, sameEmiMonths, sameEmiSaving, worth };
  }, [outstanding, months, currentRate, newRate, costs]);

  return (
    <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
      <Panel className="space-y-7">
        <SliderField label="Outstanding balance" value={outstanding} onChange={setOutstanding} min={500_000} max={100_000_000} step={100_000} format={inrCompact} suffix="₹" />
        <SliderField label="Remaining tenure" value={months} onChange={setMonths} min={12} max={360} step={1} format={(v) => `${Math.round(v / 12)} yr`} suffix="months" hint={`${(months / 12).toFixed(1)} years`} />
        <SliderField label="Current interest rate" value={currentRate} onChange={setCurrentRate} min={6} max={16} step={0.05} format={(v) => `${v}%`} suffix="% p.a." />
        <SliderField label="New interest rate" value={newRate} onChange={setNewRate} min={6} max={16} step={0.05} format={(v) => `${v}%`} suffix="% p.a." />
        <SliderField label="Transfer costs" value={costs} onChange={setCosts} min={0} max={500_000} step={1_000} format={inrCompact} suffix="₹" hint="Processing, legal, technical, stamp" />
      </Panel>
      <Panel className="flex flex-col">
        <Result label={r.worth ? "Net saving over remaining tenure" : "Net result over remaining tenure"} value={inr(r.netSaving)} big tone={r.worth ? "verdant" : "brass"} />
        <p className="mt-2 text-sm font-semibold text-ink-800">{r.worth ? `Worth doing. You recover the costs in ${r.breakEven} months.` : r.netSaving <= 0 ? "Not worth it at these numbers. Ask your lender to reprice instead." : "Marginal. Check the repricing option with your current lender first."}</p>
        <div className="mt-6 grid grid-cols-2 gap-4">
          <Result label="Current EMI" value={inr(r.oldEmi)} tone="mute" />
          <Result label="New EMI" value={inr(r.newEmi)} />
          <Result label="Monthly saving" value={inr(r.monthlySaving)} tone="verdant" />
          <Result label="Interest saved (gross)" value={inr(r.grossSaving)} />
        </div>
        {r.sameEmiMonths > 0 && r.sameEmiMonths < months && (
          <p className="mt-5 rounded-xl bg-verdant-50 px-4 py-3 text-sm text-verdant-700"><span className="font-bold">Keep your current EMI instead:</span> the loan closes in {r.sameEmiMonths} months rather than {months}, saving about {inr(r.sameEmiSaving)} after costs.</p>
        )}
        <Link href="/apply?product=home-loan-balance-transfer" className="mt-auto inline-flex items-center justify-center gap-2 rounded-full bg-ink-900 px-6 py-3 text-sm font-bold text-white hover:bg-ink-800">Get transfer offers <ArrowRight className="size-4" /></Link>
      </Panel>
    </div>
  );
}
