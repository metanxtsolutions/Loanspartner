import { ArrowRight, Phone } from "lucide-react";
import { ButtonLink } from "@/components/shared/button";
import { siteConfig } from "@/data/site-config";

export function CtaBand({
  title = "Ready when you are.",
  lede = "Two minutes to share your requirement. One call from our credit desk with a lender shortlist. No fee, ever.",
  primary = { label: "Check eligibility", href: "/apply" },
  secondary,
}: {
  title?: string;
  lede?: string;
  primary?: { label: string; href: string };
  secondary?: { label: string; href: string };
}) {
  return (
    <section className="container-x pb-16 lg:pb-24">
      <div className="noise relative overflow-hidden rounded-panel bg-ink-900 px-6 py-12 text-white sm:px-12 lg:px-16 lg:py-16" data-reveal>
        <div className="grid-fade-dark absolute inset-0" aria-hidden />
        <div className="relative grid items-center gap-8 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <h2 className="display text-3xl sm:text-4xl lg:text-5xl">{title}</h2>
            <p className="mt-4 max-w-xl text-white/70">{lede}</p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
            <ButtonLink href={primary.href} size="lg">{primary.label} <ArrowRight className="size-4" /></ButtonLink>
            {secondary ? (
              <ButtonLink href={secondary.href} variant="outline-light" size="lg">{secondary.label}</ButtonLink>
            ) : (
              <ButtonLink href={`tel:${siteConfig.contact.phone}`} variant="outline-light" size="lg"><Phone className="size-4" /> {siteConfig.contact.phoneDisplay}</ButtonLink>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
