import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Users } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, howToSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { Steps } from "@/components/shared/steps";
import { CheckList } from "@/components/shared/checklist";
import { FaqList } from "@/components/shared/faq";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { GuideCard } from "@/components/shared/guide-card";
import { ProductIcon } from "@/components/shared/product-icon";
import { partnerAudiences, partnerBenefits, partnerEligibility, partnerFaqs, partnerSteps } from "@/data/partner";
import { products } from "@/data/products";
import { guidesByCategory } from "@/data/guides";
import { siteConfig } from "@/data/site-config";

const title = "Become a Loan DSA Channel Partner: 40+ Lenders, One Code, Zero Investment";
const description = "Join the LoansPartner channel partner programme. Distribute personal, home, business and property loans from 40+ banks and NBFCs, earn on every disbursal, with processing and compliance handled by our credit desk. Free registration.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/partner", keywords: ["loan DSA", "become loan DSA", "DSA partner program", "loan channel partner", "DSA registration", "loan agent", "DSA commission", "loan distribution partner"] });

export default function PartnerPage() {
  const guides = guidesByCategory("Partner programme").slice(0, 3);
  return (
    <>
      <JsonLd data={[
        webPageSchema({ name: title, description, path: "/partner" }),
        howToSchema({ name: "How to become a LoansPartner channel partner", description: "Register free, complete KYC and training, and start earning on loan disbursals.", path: "/partner", steps: partnerSteps }),
        faqPageSchema(partnerFaqs),
      ]} />
      <PageHero
        tone="verdant"
        crumbs={[{ name: "Partner programme", path: "/partner" }]}
        eyebrow="Channel partner programme"
        title={<>Distribute loans from 40+ lenders. We process, you earn.</>}
        lede="A single partner code gives you every product on our panel, a credit desk that runs the file, and payouts that are published in your agreement. No joining fee, no deposit, no targets."
        aside={
          <div className="rounded-panel bg-white p-6 text-ink-900 shadow-lift">
            <p className="font-display text-2xl">Indicative payouts</p>
            <ul className="mt-4 divide-y divide-line">
              {products.filter((p) => p.popular).map((p) => (
                <li key={p.slug} className="flex items-center justify-between py-2.5 text-sm">
                  <span className="flex items-center gap-2 font-semibold"><ProductIcon icon={p.icon} className="size-4 text-verdant-600" /> {p.name}</span>
                  <span className="tnum font-bold">{p.dsa.payoutFrom}% to {p.dsa.payoutTo}%</span>
                </li>
              ))}
            </ul>
            <p className="mt-3 text-xs text-mute">Of disbursed amount. Full table on the commission page.</p>
            <ButtonLink href="/partner/register" className="mt-4 w-full">Register free <ArrowRight className="size-4" /></ButtonLink>
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/partner/register" variant="light" size="lg">Apply in two minutes</ButtonLink>
          <ButtonLink href="/partner/commission" variant="outline-light" size="lg">Commission slabs</ButtonLink>
        </div>
      </PageHero>

      <Section tone="cream">
        <SectionHeader eyebrow="Why partners choose us" title="Built for people who bring relationships, not paperwork." />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {partnerBenefits.map((b, i) => (
            <li key={b.title} data-reveal data-reveal-delay={(i % 3) * 70} className="rounded-card border border-line bg-white p-6 shadow-soft">
              <p className="font-display text-xl text-ink-950">{b.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-mute">{b.text}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader eyebrow="How it works" title="From application to first payout in under two weeks." />
            <Card className="mt-8 p-6">
              <p className="eyebrow text-mute">Who can join</p>
              <CheckList items={partnerEligibility} className="mt-4 text-sm" />
            </Card>
          </div>
          <Steps steps={partnerSteps} />
        </div>
      </Section>

      <Section tone="ink">
        <SectionHeader tone="dark" eyebrow="Who it is for" title="Programmes shaped around your profession." lede="Each page explains which products fit your client base, what a typical quarter looks like, and the compliance points that matter for your practice." />
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {partnerAudiences.map((a, i) => (
            <li key={a.slug} data-reveal data-reveal-delay={(i % 3) * 70}>
              <Link href={`/partner/for/${a.slug}`} className="group flex h-full flex-col rounded-card border border-white/10 bg-white/5 p-6 transition-colors hover:border-verdant-400/60 hover:bg-white/10">
                <Users className="size-6 text-verdant-400" />
                <p className="mt-4 font-display text-xl text-white">{a.name}</p>
                <p className="mt-1 text-sm text-white/60">{a.short}</p>
                <p className="mt-3 line-clamp-3 text-sm text-white/75">{a.headline}</p>
                <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold text-verdant-400">Read more <ArrowRight className="size-3.5" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream">
        <SectionHeader eyebrow="Products you can distribute" title="Every product on our panel, with a page on how to sell it." />
        <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((p) => (
            <li key={p.slug}>
              <Link href={`/partner/${p.slug}-dsa`} className="flex items-center justify-between gap-3 rounded-xl border border-line bg-white px-4 py-3 transition-colors hover:border-verdant-500">
                <span className="flex items-center gap-3 text-sm font-bold text-ink-900"><ProductIcon icon={p.icon} className="size-4 text-verdant-600" /> {p.name} DSA</span>
                <Pill tone="verdant" className="tnum">{p.dsa.payoutFrom}% to {p.dsa.payoutTo}%</Pill>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div>
            <SectionHeader eyebrow="Compliance" title="The rules protect good partners." lede={<>{siteConfig.compliance.feeDisclosure} Our code of conduct follows RBI&rsquo;s directions on outsourcing, digital lending and fair practice. <Link href="/guides/rbi-rules-for-loan-dsas-2026" className="font-bold text-verdant-700 underline underline-offset-4">Read the summary.</Link></>} />
          </div>
          <FaqList faqs={partnerFaqs} />
        </div>
      </Section>

      {guides.length > 0 && (
        <Section tone="cream">
          <SectionHeader eyebrow="Guides for partners" title="What experienced DSAs know." />
          <div className="mt-8 grid gap-5 md:grid-cols-3">{guides.map((g, i) => (<GuideCard key={g.slug} guide={g} delay={i * 70} />))}</div>
        </Section>
      )}

      <CtaBand title="Start earning on every disbursal." lede="Free registration, one-day verification, training included. Apply in two minutes and a partner manager will call you." primary={{ label: "Register as a partner", href: "/partner/register" }} secondary={{ label: "DSA income calculator", href: "/tools/dsa-income-calculator" }} />
    </>
  );
}
