import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader } from "@/components/shared/section";
import { FaqList } from "@/components/shared/faq";
import { CtaBand } from "@/components/shared/cta-band";
import { globalFaqs } from "@/data/faqs";
import { partnerFaqs } from "@/data/partner";
import { products } from "@/data/products";

const title = "Frequently Asked Questions";
const description = "Answers on how LoansPartner works, fees, credit score impact, timelines, data protection, each loan product and the channel partner programme.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/faqs", keywords: ["loan FAQs", "loan DSA FAQ", "how does a loan DSA work", "loan advisory questions"] });

export default function FaqsPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: title, description, path: "/faqs", type: "FAQPage" }), faqPageSchema([...globalFaqs, ...partnerFaqs])]} />
      <PageHero crumbs={[{ name: "FAQs", path: "/faqs" }]} eyebrow="FAQs" title="Straight answers." lede="If your question is not here, call us or send a message. We reply within one working day." />
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><SectionHeader eyebrow="Working with us" title="How LoansPartner works" /><FaqList faqs={globalFaqs} /></div>
      </Section>
      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]"><SectionHeader eyebrow="Partner programme" title="For channel partners" /><FaqList faqs={partnerFaqs} /></div>
      </Section>
      <Section tone="cream">
        <SectionHeader eyebrow="By product" title="Product questions" />
        <div className="mt-8 grid gap-8 lg:grid-cols-2">
          {products.map((p) => (
            <details key={p.slug} className="group rounded-card border border-line bg-white p-5">
              <summary className="cursor-pointer list-none font-display text-xl text-ink-950">{p.name}</summary>
              <FaqList faqs={p.faqs} className="mt-3" />
            </details>
          ))}
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
