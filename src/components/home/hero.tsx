import { ArrowRight, Check } from "lucide-react";
import { HeroForm } from "@/components/forms/hero-form";
import { ButtonLink } from "@/components/shared/button";
import { LenderMarquee } from "@/components/shared/lender-marquee";
import { lenderOptions, productOptions } from "@/data/lite";

const bullets = [
  "Zero fee to borrowers, paid by lenders",
  "Banks, HFCs and NBFCs on one application",
  "A named credit manager from enquiry to disbursal",
];

export function Hero() {
  return (
    <section className="noise bg-paper relative overflow-hidden">
      <div className="grid-fade absolute inset-0" aria-hidden />
      <div className="container-x relative grid items-center gap-12 pt-14 pb-16 lg:grid-cols-[1.2fr_0.85fr] lg:pt-20 lg:pb-24">
        <div className="animate-rise">
          <p className="eyebrow text-brass-600">Loan advisory and distribution partner · India</p>
          <h1 className="display text-ink-950 mt-5 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
            Better loans begin with the <em className="text-brass-600 font-normal italic">right partner</em>.
          </h1>
          <p className="text-mute mt-6 max-w-xl text-lg leading-relaxed">
            We compare personal, home, business and property loans across leading lenders, read your profile the way a
            credit manager does, and put your file where it will be approved on the best terms. At no cost to you.
          </p>
          <ul className="mt-7 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="text-ink-800 flex items-center gap-3 text-[15px]">
                <span className="bg-ink-50 text-ink-700 flex size-5 items-center justify-center">
                  <Check className="size-3" strokeWidth={3} />
                </span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/loans" variant="secondary" size="lg">
              Explore loan products
            </ButtonLink>
            <ButtonLink href="/partner" variant="ghost" size="lg">
              Become a partner <ArrowRight className="size-4" />
            </ButtonLink>
          </div>
        </div>

        <div className="animate-rise relative [animation-delay:120ms]">
          <div className="rounded-panel text-ink-900 shadow-lift border-line relative border bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl">Check your eligibility</p>
              <span className="bg-brass-100 text-brass-600 px-2.5 py-1 text-[11px] font-bold">Free</span>
            </div>
            <p className="text-mute mt-1 text-sm">
              Two minutes. A call back with a lender shortlist within one working day.
            </p>
            <div className="mt-5">
              <HeroForm products={productOptions} />
            </div>
          </div>
        </div>
      </div>
      <div className="container-x border-line relative border-t py-6">
        <p className="eyebrow text-mute mb-3">Loans arranged from</p>
        <LenderMarquee lenders={lenderOptions} tone="light" />
      </div>
    </section>
  );
}
