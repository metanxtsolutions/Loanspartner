import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card } from "@/components/shared/section";
import { ProofStrip } from "@/components/shared/proof-strip";
import { TrustNotes } from "@/components/shared/trust-notes";
import { LenderMarquee } from "@/components/shared/lender-marquee";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { siteConfig } from "@/data/site-config";

const title = "About LoansPartner: An Independent Loan Advisory and Distribution Partner";
const description = "LoansPartner is a loan advisory and distribution partner working with 40+ banks, HFCs and NBFCs across India. Former credit professionals, zero fee to borrowers, RBI-aligned conduct, and a channel partner programme.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/about", keywords: ["about LoansPartner", "loan advisory company India", "loan distribution company", "loan DSA company"] });

const principles = [
  { title: "We are paid by lenders, never by you", text: "Our remuneration is a share of the lender's distribution payout after disbursal. That is the whole business model, and it is why we can say no to a loan that is wrong for you." },
  { title: "One application, not five", text: "A pre-screen against lender policies costs you nothing and protects your credit report. We submit one complete file to the lender most likely to approve on the best terms." },
  { title: "The cheaper product wins", text: "If a loan against property, a top-up or a professional loan would cost you less than what you asked for, we say so, even when it pays us less." },
  { title: "The KFS is the contract", text: "We walk every borrower through the lender's Key Fact Statement. If it is not in the KFS, it does not exist." },
  { title: "Conduct you can check", text: "Working-hours contact, named staff, no cash, no pressure, data shared only with the lender you choose. Written into our partner code and our grievance process." },
  { title: "Local knowledge, national panel", text: "Property rules and lender appetite differ by city. Our city desks prepare files for the lender that funds that property, that profile, in that market." },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, path: "/about", type: "AboutPage" })} />
      <PageHero tone="ink" crumbs={[{ name: "About", path: "/about" }]} eyebrow={`Since ${siteConfig.foundedYear}`} title="A credit desk that works for the borrower, paid by the lender." lede={siteConfig.description} />
      <Section tone="paper" className="!py-14"><ProofStrip /></Section>
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader eyebrow="Why we exist" title="Indian borrowers are over-served with rate tables and under-served with judgement." lede="Anyone can list rates. Very few people will tell you which lender's credit policy your profile actually fits, how to present a self-employed income, or when a cheaper product exists. That judgement used to live inside bank branches. We put it on the borrower's side of the table." />
          </div>
          <div className="prose-lp">
            <p>LoansPartner started as a small team of former bank and NBFC credit professionals who had spent years watching good applicants get declined for fixable reasons and weak applicants get expensive loans they did not need. The distribution business, as it existed, rewarded volume and speed. We wanted to build one that rewarded getting it right.</p>
            <p>Today we arrange twelve loan products across a panel of public sector banks, private banks, housing finance companies and NBFCs, for salaried professionals, self-employed individuals and businesses across India, with dedicated desks in the cities we know best. Every file is read by someone who has sat on the other side of the credit decision.</p>
            <p>We also run a channel partner programme for professionals who want to distribute loans the same way: chartered accountants, insurance advisors, property consultants, former bankers and working professionals who bring relationships and let our desk do the processing, inside the rules.</p>
          </div>
        </div>
      </Section>
      <Section tone="paper">
        <SectionHeader eyebrow="How we work" title="Six principles, applied to every file." />
        <ul className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (<li key={p.title} data-reveal data-reveal-delay={(i % 3) * 70} className="rounded-card border border-line bg-white p-6 shadow-soft"><p className="font-display text-xl text-ink-950">{p.title}</p><p className="mt-2 text-sm leading-relaxed text-mute">{p.text}</p></li>))}
        </ul>
      </Section>
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <Card className="p-8">
            <p className="eyebrow text-verdant-600">{siteConfig.editorialTeam.name}</p>
            <p className="mt-3 font-display text-2xl text-ink-950">Who writes and reviews our guides</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{siteConfig.editorialTeam.description} Guides carry a published and updated date and are revised whenever lender policy or RBI directions change. They are educational; your lender's Key Fact Statement governs your loan.</p>
            <ButtonLink href="/guides" variant="ghost" className="mt-5 -ml-4">Read the guides <ArrowRight className="size-4" /></ButtonLink>
          </Card>
          <Card className="p-8">
            <p className="eyebrow text-verdant-600">Regulatory position</p>
            <p className="mt-3 font-display text-2xl text-ink-950">What we are, and are not</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{siteConfig.compliance.dsaDisclosure}</p>
            <p className="mt-3 text-[15px] leading-relaxed text-mute">{siteConfig.compliance.feeDisclosure}</p>
            <Link href="/grievance-redressal" className="mt-5 inline-flex items-center gap-1 text-sm font-bold text-verdant-700">Grievance redressal <ArrowRight className="size-3.5" /></Link>
          </Card>
        </div>
      </Section>
      <Section tone="paper" className="!py-12">
        <p className="eyebrow mb-4 text-mute">Lending partners</p>
        <LenderMarquee tone="light" />
        <Link href="/lenders" className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-verdant-700">All lending partners <ArrowRight className="size-3.5" /></Link>
      </Section>
      <Section tone="cream"><TrustNotes /></Section>
      <CtaBand title="Work with a desk that reads your file." secondary={{ label: "Become a partner", href: "/partner" }} />
    </>
  );
}
