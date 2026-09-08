import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Indian rupee formatting with lakh/crore grouping: 12,50,000 */
export function formatINR(value: number, opts: { decimals?: number; compact?: boolean } = {}) {
  const { decimals = 0, compact = false } = opts;
  if (!Number.isFinite(value)) return "0";
  if (compact) return formatINRCompact(value);
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: decimals,
    minimumFractionDigits: decimals,
  }).format(value);
}

/** 1250000 -> "12.5 L", 25000000 -> "2.5 Cr" */
export function formatINRCompact(value: number) {
  const abs = Math.abs(value);
  if (abs >= 1e7) return `${trim(value / 1e7)} Cr`;
  if (abs >= 1e5) return `${trim(value / 1e5)} L`;
  if (abs >= 1e3) return `${trim(value / 1e3)} K`;
  return `${Math.round(value)}`;
}

function trim(n: number) {
  const r = Math.round(n * 100) / 100;
  return Number.isInteger(r) ? String(r) : String(r).replace(/\.?0+$/, "");
}

/** Standard reducing-balance EMI. rate is annual percent. */
export function calcEMI(principal: number, annualRate: number, months: number) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return principal / months;
  const f = Math.pow(1 + r, months);
  return (principal * r * f) / (f - 1);
}

/** Inverse of calcEMI: the principal a given EMI can service. */
export function principalForEMI(emi: number, annualRate: number, months: number) {
  if (emi <= 0 || months <= 0) return 0;
  const r = annualRate / 12 / 100;
  if (r === 0) return emi * months;
  const f = Math.pow(1 + r, months);
  return (emi * (f - 1)) / (r * f);
}

export function slugify(input: string) {
  return input
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function titleCase(s: string) {
  return s.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function isoDate(d: string | Date) {
  return (typeof d === "string" ? new Date(d) : d).toISOString();
}

export function readableDate(d: string | Date) {
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "long", year: "numeric" }).format(
    typeof d === "string" ? new Date(d) : d,
  );
}

export function pick<T>(arr: readonly T[], n: number, seed = 0): T[] {
  if (arr.length <= n) return [...arr];
  const start = seed % arr.length;
  const out: T[] = [];
  for (let i = 0; i < n; i++) out.push(arr[(start + i) % arr.length]);
  return out;
}
