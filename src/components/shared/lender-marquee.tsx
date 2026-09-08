import Link from "next/link";
import { lenders } from "@/data/lenders";
import { cn } from "@/lib/utils";

/** Text wordmarks in a CSS marquee; swap for approved logo files once empanelment letters are on record. */
export function LenderMarquee({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  const list = [...lenders, ...lenders];
  return (
    <div className={cn("relative overflow-hidden", className)} aria-label="Lending partners">
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r", tone === "dark" ? "from-ink-900" : "from-paper")} />
      <div className={cn("pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l", tone === "dark" ? "from-ink-900" : "from-paper")} />
      <ul className="flex w-max animate-marquee items-center gap-10 whitespace-nowrap py-2">
        {list.map((l, i) => (
          <li key={`${l.slug}-${i}`}>
            <Link href={`/lenders/${l.slug}`} className={cn("font-display text-xl tracking-tight transition-opacity hover:opacity-100", tone === "dark" ? "text-white/55" : "text-ink-900/55")} aria-hidden={i >= lenders.length}>
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
