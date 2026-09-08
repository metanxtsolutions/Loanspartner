import { ArrowRight, Check } from "lucide-react";
import { HeroForm } from "@/components/forms/hero-form";
import { ButtonLink } from "@/components/shared/button";
import { LenderMarquee } from "@/components/shared/lender-marquee";
import { lenderOptions, productOptions } from "@/data/lite";

const bullets = ["Zero fee to borrowers, paid by lenders", "Banks, HFCs and NBFCs on one application", "A named credit manager from enquiry to disbursal"];

export function Hero() {
  return (
    <section className="noise relative overflow-hidden bg-ink-900 text-white">
      <div className="grid-fade-dark absolute inset-0" aria-hidden />
      <div className="pointer-events-none absolute -right-40 -top-40 size-[34rem] rounded-full bg-verdant-500/20 blur-3xl" aria-hidden />
      <div className="pointer-events-none absolute -bottom-48 -left-24 size-[28rem] rounded-full bg-brass-400/10 blur-3xl" aria-hidden />
      <div className="container-x relative grid items-center gap-12 pb-16 pt-14 lg:grid-cols-[1.2fr_0.85fr] lg:pb-24 lg:pt-20">
        <div className="animate-rise">
          <p className="eyebrow text-verdant-400">Loan advisory and distribution partner · India</p>
          <h1 className="display mt-5 text-[2.75rem] leading-[1.02] sm:text-6xl lg:text-[4.25rem]">
            Better loans begin with the <em className="font-normal italic text-brass-300">right partner</em>.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/75">
            We compare personal, home, business and property loans across leading lenders, read your profile the way a credit manager does, and put your file where it will be approved on the best terms. At no cost to you.
          </p>
          <ul className="mt-7 space-y-2.5">
            {bullets.map((b) => (
              <li key={b} className="flex items-center gap-3 text-[15px] text-white/85">
                <span className="flex size-5 items-center justify-center rounded-full bg-verdant-500/25 text-verdant-400"><Check className="size-3" strokeWidth={3} /></span>
                {b}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <ButtonLink href="/loans" variant="outline-light" size="lg">Explore loan products</ButtonLink>
            <ButtonLink href="/partner" variant="ghost" size="lg" className="text-white hover:bg-white/10">Become a partner <ArrowRight className="size-4" /></ButtonLink>
          </div>
        </div>

        <div className="relative animate-rise [animation-delay:120ms]">
          <div className="absolute -inset-1 rounded-panel bg-gradient-to-br from-verdant-400/40 via-transparent to-brass-300/30 blur-xl" aria-hidden />
          <div className="relative rounded-panel border border-white/10 bg-white p-6 text-ink-900 shadow-lift sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl">Check your eligibility</p>
              <span className="rounded-full bg-verdant-100 px-2.5 py-1 text-[11px] font-bold text-verdant-700">Free</span>
            </div>
            <p className="mt-1 text-sm text-mute">Two minutes. A call back with a lender shortlist within one working day.</p>
            <div className="mt-5"><HeroForm products={productOptions} /></div>
          </div>
        </div>
      </div>
      <div className="container-x relative border-t border-white/10 py-6">
        <p className="eyebrow mb-3 text-white/40">Loans arranged from</p>
        <LenderMarquee lenders={lenderOptions} tone="dark" />
      </div>
    </section>
  );
}
