import Link from "next/link";
import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" className={cn("size-9", className)} aria-hidden fill="none">
      <rect width="48" height="48" rx="13" fill="currentColor" />
      {/* Two arcs meeting: the partner mark */}
      <path d="M13 31c0-8.3 6.7-15 15-15h7" stroke="#F7F5EF" strokeWidth="4" strokeLinecap="round" />
      <path d="M35 17c0 8.3-6.7 15-15 15h-7" stroke="#12996F" strokeWidth="4" strokeLinecap="round" />
      <circle cx="35" cy="17" r="3" fill="#CFAE5E" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" aria-label="LoansPartner home" className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark className={tone === "dark" ? "text-ink-900" : "text-white"} />
      <span className={cn("font-display text-[1.45rem] leading-none tracking-tight", tone === "dark" ? "text-ink-950" : "text-white")}>
        Loans<span className={tone === "dark" ? "text-verdant-600" : "text-verdant-400"}>Partner</span>
      </span>
    </Link>
  );
}
