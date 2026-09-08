import Link from "next/link";
import { lenders } from "@/data/lenders";
import { cn } from "@/lib/utils";

/** Text wordmarks in a CSS marquee; swap for approved logo files once empanelment letters are on record. */
export function LenderMarquee({ tone = "dark", className }: { tone?: "dark" | "light"; className?: string }) {
  // The list is rendered twice so the animation can loop. Only the first
  // copy is real; the duplicate is hidden from assistive tech and from the
  // tab order, since an aria-hidden element must never hold focus.
  const copies = [
    { key: "a", hidden: false },
    { key: "b", hidden: true },
  ];
  return (
    <div className={cn("relative overflow-hidden", className)} aria-label="Lending partners">
      <div className={cn("pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r", tone === "dark" ? "from-ink-900" : "from-paper")} />
      <div className={cn("pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l", tone === "dark" ? "from-ink-900" : "from-paper")} />
      <div className="flex w-max animate-marquee items-center">
        {copies.map((copy) => (
          <ul key={copy.key} className="flex items-center gap-10 whitespace-nowrap py-2 pr-10" {...(copy.hidden ? { "aria-hidden": true } : {})}>
            {lenders.map((l) =>
              copy.hidden ? (
                <li key={`${copy.key}-${l.slug}`} className={cn("font-display text-xl tracking-tight", tone === "dark" ? "text-white/55" : "text-ink-900/55")}>
                  {l.name}
                </li>
              ) : (
                <li key={`${copy.key}-${l.slug}`}>
                  <Link href={`/lenders/${l.slug}`} className={cn("font-display text-xl tracking-tight transition-opacity hover:opacity-100", tone === "dark" ? "text-white/55" : "text-ink-900/55")}>
                    {l.name}
                  </Link>
                </li>
              ),
            )}
          </ul>
        ))}
      </div>
    </div>
  );
}
