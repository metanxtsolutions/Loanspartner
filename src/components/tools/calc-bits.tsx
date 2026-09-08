"use client";

import { formatINR } from "@/lib/utils";
import { cn } from "@/lib/utils";

export function SliderField({ label, value, onChange, min, max, step, format = (v: number) => String(v), suffix, hint }: { label: string; value: number; onChange: (v: number) => void; min: number; max: number; step: number; format?: (v: number) => string; suffix?: string; hint?: string }) {
  const id = label.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="label !mb-0">{label}</label>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-white px-2 py-1">
          <input id={id} type="number" inputMode="decimal" min={min} max={max} step={step} value={value} onChange={(e) => onChange(clamp(Number(e.target.value), min, max))} className="tnum w-28 bg-transparent text-right text-sm font-bold text-ink-900 outline-none" />
          {suffix && <span className="text-xs font-semibold text-mute">{suffix}</span>}
        </div>
      </div>
      <input type="range" aria-label={`${label} slider`} min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="mt-2 w-full" />
      <div className="mt-1 flex justify-between text-[11px] text-mute"><span>{format(min)}</span>{hint ? <span>{hint}</span> : null}<span>{format(max)}</span></div>
    </div>
  );
}

export function Result({ label, value, big = false, tone = "ink", className }: { label: string; value: string; big?: boolean; tone?: "ink" | "verdant" | "brass" | "mute"; className?: string }) {
  const tones = { ink: "text-ink-950", verdant: "text-verdant-700", brass: "text-brass-600", mute: "text-mute" };
  return (
    <div className={className}>
      <p className="text-xs font-bold uppercase tracking-wide text-mute">{label}</p>
      <p className={cn("tnum mt-1 font-display", big ? "text-4xl sm:text-5xl" : "text-2xl", tones[tone])}>{value}</p>
    </div>
  );
}

export function Panel({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={cn("rounded-panel border border-line bg-white p-6 shadow-soft sm:p-8", className)}>{children}</div>;
}

export const inr = (v: number) => `₹${formatINR(Math.round(v))}`;
export const inrCompact = (v: number) => `₹${formatINR(v, { compact: true })}`;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(v) ? v : a));
