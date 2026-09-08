import { Breadcrumbs, type Crumb } from "@/components/shared/breadcrumbs";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

export function PageHero({
  eyebrow,
  title,
  lede,
  crumbs,
  aside,
  tone = "paper",
  children,
  className,
}: {
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  crumbs?: Crumb[];
  aside?: ReactNode;
  tone?: "paper" | "ink" | "verdant";
  children?: ReactNode;
  className?: string;
}) {
  const dark = tone !== "paper";
  return (
    <section className={cn("relative overflow-hidden", tone === "ink" && "noise bg-ink-900 text-white", tone === "verdant" && "noise bg-verdant-700 text-white", tone === "paper" && "bg-paper", className)}>
      <div className={cn("absolute inset-0", dark ? "grid-fade-dark" : "grid-fade")} aria-hidden />
      <div className="container-x relative pb-14 pt-10 lg:pb-20 lg:pt-14">
        {crumbs && <Breadcrumbs items={crumbs} tone={dark ? "dark" : "light"} className="mb-8" />}
        <div className={cn("grid gap-10", aside ? "lg:grid-cols-[1.25fr_0.9fr] lg:items-start" : "")}>
          <div className="max-w-3xl" data-reveal>
            {eyebrow && <p className={cn("eyebrow mb-4", dark ? "text-verdant-400" : "text-verdant-600")}>{eyebrow}</p>}
            <h1 className={cn("display text-4xl sm:text-5xl lg:text-[3.5rem]", dark ? "text-white" : "text-ink-950")}>{title}</h1>
            {lede && <div className={cn("mt-5 max-w-2xl text-lg leading-relaxed", dark ? "text-white/75" : "text-mute")}>{lede}</div>}
            {children}
          </div>
          {aside && <div data-reveal data-reveal-delay={120}>{aside}</div>}
        </div>
      </div>
    </section>
  );
}
