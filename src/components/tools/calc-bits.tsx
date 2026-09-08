"use client";

import { useId, useState } from "react";
import { cn, formatINR } from "@/lib/utils";

export const inr = (v: number) => `₹${formatINR(Math.round(v))}`;
export const inrCompact = (v: number) => `₹${formatINR(v, { compact: true })}`;
export const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, Number.isFinite(v) ? v : a));

/**
 * Number entry that does not fight the person typing. The keystroke is kept
 * as a draft string, so clearing the box or typing a leading digit does not
 * snap the value to the minimum; the value is clamped on blur instead.
 */
export function NumberInput({
  value,
  onChange,
  min,
  max,
  step,
  className,
  id,
  ...rest
}: {
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step?: number;
  className?: string;
  id?: string;
} & Omit<React.ComponentProps<"input">, "value" | "onChange" | "min" | "max" | "step" | "id">) {
  const [draft, setDraft] = useState<string | null>(null);
  return (
    <input
      {...rest}
      id={id}
      type="number"
      inputMode="decimal"
      min={min}
      max={max}
      step={step}
      value={draft ?? String(value)}
      onChange={(e) => {
        const raw = e.target.value;
        setDraft(raw);
        const n = Number(raw);
        if (raw !== "" && Number.isFinite(n) && n >= min && n <= max) onChange(n);
      }}
      onBlur={(e) => {
        const raw = e.target.value;
        const n = Number(raw);
        onChange(clamp(raw === "" || !Number.isFinite(n) ? min : n, min, max));
        setDraft(null);
      }}
      className={className}
    />
  );
}

export function SliderField({
  label,
  value,
  onChange,
  min,
  max,
  step,
  format = (v: number) => String(v),
  suffix,
  hint,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  min: number;
  max: number;
  step: number;
  format?: (v: number) => string;
  suffix?: string;
  hint?: string;
}) {
  const id = useId();
  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <label htmlFor={id} className="label !mb-0">{label}</label>
        <div className="flex items-center gap-1 rounded-lg border border-line bg-white px-2 py-1">
          <NumberInput id={id} value={value} onChange={onChange} min={min} max={max} step={step} className="tnum w-28 bg-transparent text-right text-sm font-bold text-ink-900 outline-none" />
          {suffix && <span className="text-xs font-semibold text-mute">{suffix}</span>}
        </div>
      </div>
      <input
        type="range"
        aria-label={`${label} slider`}
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full"
      />
      <div className="mt-1 flex justify-between text-[11px] text-mute">
        <span>{format(min)}</span>
        {hint ? <span>{hint}</span> : null}
        <span>{format(max)}</span>
      </div>
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

export function Panel({ children, className, live = false }: { children: React.ReactNode; className?: string; live?: boolean }) {
  return (
    <div className={cn("rounded-panel border border-line bg-white p-6 shadow-soft sm:p-8", className)} {...(live ? { "aria-live": "polite" as const } : {})}>
      {children}
    </div>
  );
}
