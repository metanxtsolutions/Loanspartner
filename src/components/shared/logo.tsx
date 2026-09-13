import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * One continuous stroke reading as an L and a P sharing a stem. Geometry and
 * stroke weight are exact production values from the brand identity handoff:
 * never scale down for a favicon, use LogoMark's `favicon` variant instead.
 */
export function LogoMark({ className, tone = "dark" }: { className?: string; tone?: "dark" | "light" }) {
  const stem = tone === "dark" ? "#0B1B33" : "#FBFAF7";
  const bowl = tone === "dark" ? "#A87F3D" : "#C6A15B";
  return (
    <svg viewBox="0 0 100 100" role="img" aria-label="LoansPartner" className={cn("size-9", className)}>
      <path d="M27 14 V86 H70" fill="none" stroke={stem} strokeWidth="13" />
      <path d="M27 14 H51 a19.5 19.5 0 0 1 0 39 H27" fill="none" stroke={bowl} strokeWidth="13" />
    </svg>
  );
}

export function Logo({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  return (
    <Link href="/" aria-label="LoansPartner home" className={cn("inline-flex items-center gap-3", className)}>
      <LogoMark tone={tone} className="size-10 shrink-0" />
      <span
        className={cn(
          "font-sans text-[1.45rem] leading-none tracking-[-0.035em]",
          tone === "dark" ? "text-ink-950" : "text-white",
        )}
      >
        <span className="font-normal">Loans</span>
        <span className="font-semibold">Partner</span>
      </span>
    </Link>
  );
}
