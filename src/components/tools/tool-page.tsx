import type { ReactNode } from "react";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, softwareToolSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader } from "@/components/shared/section";
import { FaqList } from "@/components/shared/faq";
import { LinkPills } from "@/components/shared/link-pills";
import { CtaBand } from "@/components/shared/cta-band";
import type { Faq } from "@/data/products";

export const toolLinks = [
  { label: "EMI calculator", href: "/tools/emi-calculator" },
  { label: "Eligibility calculator", href: "/tools/eligibility-calculator" },
  { label: "Balance transfer calculator", href: "/tools/balance-transfer-calculator" },
  { label: "DSA income calculator", href: "/tools/dsa-income-calculator" },
  { label: "Interest rates", href: "/interest-rates" },
];

export function ToolPage({ name, path, title, lede, description, calculator, explainer, faqs, cta }: { name: string; path: string; title: ReactNode; lede: string; description: string; calculator: ReactNode; explainer: ReactNode; faqs: Faq[]; cta?: { title: string; lede: string; primary: { label: string; href: string } } }) {
  return (
    <>
      <JsonLd data={[webPageSchema({ name, description, path }), softwareToolSchema({ name, description, path }), faqPageSchema(faqs)]} />
      <PageHero crumbs={[{ name: "Tools", path: "/tools" }, { name, path }]} eyebrow="Free tool" title={title} lede={lede} />
      <Section tone="cream" className="!pt-0">
        <div className="-mt-6 lg:-mt-10">{calculator}</div>
        <LinkPills className="mt-8" title="Other tools" links={toolLinks.filter((l) => l.href !== path)} />
      </Section>
      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div className="prose-lp" data-reveal>{explainer}</div>
          <div>
            <SectionHeader eyebrow="FAQs" title="Questions about this calculator" className="mb-6" />
            <FaqList faqs={faqs} />
          </div>
        </div>
      </Section>
      <CtaBand {...(cta ?? {})} />
    </>
  );
}
