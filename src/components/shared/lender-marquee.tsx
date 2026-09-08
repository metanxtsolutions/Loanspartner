"use client";

import Link from "next/link";
import { useState } from "react";
import { Pause, Play } from "lucide-react";
import type { LenderLite } from "@/data/lite-types";
import { cn } from "@/lib/utils";

/**
 * Text wordmarks in a CSS marquee; swap for approved logo files once
 * empanelment letters are on record.
 *
 * WCAG 2.2.2 requires a way to stop motion that starts on its own and runs
 * for more than five seconds, so this carries a pause control. Reduced-motion
 * users never see it move at all: globals.css disables the animation, and the
 * control is hidden from them because there is nothing to pause.
 */
export function LenderMarquee({ lenders, tone = "dark", className }: { lenders: LenderLite[]; tone?: "dark" | "light"; className?: string }) {
  const [paused, setPaused] = useState(false);

  // The list is rendered twice so the animation can loop without a visible jump. Only the
  // first copy is real; the duplicate is hidden from assistive technology and
  // kept out of the tab order, since an aria-hidden element must never hold focus.
  const copies = [
    { key: "a", hidden: false },
    { key: "b", hidden: true },
  ];

  return (
    <div className={cn("relative", className)}>
      <div className="relative overflow-hidden" aria-label="Lending partners">
        <div className={cn("pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r", tone === "dark" ? "from-ink-900" : "from-paper")} />
        <div className={cn("pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l", tone === "dark" ? "from-ink-900" : "from-paper")} />
        <div className="flex w-max animate-marquee items-center" style={paused ? { animationPlayState: "paused" } : undefined}>
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
      <button
        type="button"
        onClick={() => setPaused((v) => !v)}
        aria-pressed={paused}
        className={cn(
          "motion-reduce:hidden absolute right-0 top-1/2 z-20 flex size-8 -translate-y-1/2 items-center justify-center rounded-full border transition-colors",
          tone === "dark" ? "border-white/20 bg-ink-900/80 text-white/70 hover:text-white" : "border-line bg-paper/80 text-mute hover:text-ink-900",
        )}
      >
        {paused ? <Play className="size-3.5" aria-hidden /> : <Pause className="size-3.5" aria-hidden />}
        <span className="sr-only">{paused ? "Resume the scrolling list of lending partners" : "Pause the scrolling list of lending partners"}</span>
      </button>
    </div>
  );
}
