import Link from "next/link";
import { ArrowRight, Calculator, Landmark, MapPin, ScanSearch, Sparkles, Users } from "lucide-react";
import { Hero } from "@/components/home/hero";
import { CompareTable } from "@/components/home/compare";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { ProductCard } from "@/components/shared/product-card";
import { ProofStrip } from "@/components/shared/proof-strip";
import { Steps } from "@/components/shared/steps";
import { TrustNotes } from "@/components/shared/trust-notes";
import { FaqList } from "@/components/shared/faq";
import { GuideCard } from "@/components/shared/guide-card";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, webPageSchema, itemListSchema } from "@/lib/schema";
import { products, popularProducts } from "@/data/products";
import { cities } from "@/data/cities";
import { partnerAudiences } from "@/data/partner";
import { featuredGuides } from "@/data/guides";
import { globalFaqs } from "@/data/faqs";
import { siteConfig } from "@/data/site-config";

const homeSteps = [
  { name: "Tell us what you need", text: "Loan type, amount and a little about your income. Two minutes, no documents yet." },
  { name: "We pre-screen without a bureau hit", text: "Our credit desk checks your profile against current lender policies and calls with a shortlist and indicative rates." },
  { name: "One complete file to the right lender", text: "We collect documents digitally and submit a file that answers the underwriter's questions before they ask." },
  { name: "Sanction, KFS, disbursal", text: "You review the Key Fact Statement, sign, and funds land. We stay on call for everything after." },
];

const tools = [
  { icon: Calculator, label: "EMI calculator", href: "/tools/emi-calculator", text: "Instalment, total interest and amortisation for any loan." },
  { icon: ScanSearch, label: "Eligibility calculator", href: "/tools/eligibility-calculator", text: "How much you can borrow on your income and existing EMIs." },
  { icon: Sparkles, label: "Balance transfer calculator", href: "/tools/balance-transfer-calculator", text: "Whether switching your home loan actually saves money." },
];

const homeFaqs = globalFaqs.slice(0, 6);

export default function HomePage() {
  return (
    <>
      <JsonLd data={[
        webPageSchema({ name: `${siteConfig.name}: ${siteConfig.tagline}`, description: siteConfig.metaDescription, path: "/" }),
        faqPageSchema(homeFaqs),
        itemListSchema({ name: "Loan products", path: "/loans", items: products.map((p) => ({ name: p.name, path: `/loans/${p.slug}` })) }),
      ]} />
      <Hero />

      <Section tone="paper" className="!py-14">
        <ProofStrip />
      </Section>

      <Section tone="cream" id="loans">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow="Loan products" title={<>Twelve products. One desk that knows which lender wants your file.</>} lede="From a ₹50,000 personal loan to a ₹15 crore loan against property, we arrange retail and business credit across banks, housing finance companies and NBFCs." />
          <ButtonLink href="/loans" variant="secondary" className="shrink-0">All loan products <ArrowRight className="size-4" /></ButtonLink>
        </div>
        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {popularProducts.map((p, i) => (<ProductCard key={p.slug} product={p} delay={i * 70} />))}
        </div>
        <ul className="mt-6 flex flex-wrap gap-2">
          {products.filter((p) => !p.popular).map((p) => (
            <li key={p.slug}><Link href={`/loans/${p.slug}`} className="inline-block rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-800 hover:border-verdant-500 hover:text-verdant-700">{p.name}</Link></li>
          ))}
        </ul>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeader eyebrow="How it works" title="From enquiry to disbursal, with a person on your side at every step." lede="Applying everywhere at once gets you five hard enquiries and the worst rate. Applying once, to the right lender, with a complete file, gets you the best one." />
            <ButtonLink href="/apply" className="mt-8">Start with a two-minute check <ArrowRight className="size-4" /></ButtonLink>
          </div>
          <Steps steps={homeSteps} />
        </div>
      </Section>

      <Section tone="cream">
        <SectionHeader align="center" eyebrow="Why a partner, not a portal" title="Portals list rates. Branches sell one product. We do the work in between." lede="Rate comparison is the easy part. Getting a specific profile approved by a specific lender on the best terms is a craft, and it is what our credit desk does every day." />
        <div className="mt-10"><CompareTable /></div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-6 lg:grid-cols-3">
          {tools.map((t, i) => (
            <Link key={t.href} href={t.href} data-reveal data-reveal-delay={i * 70} className="group rounded-card border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
              <t.icon className="size-7 text-verdant-600" />
              <p className="mt-4 font-display text-xl text-ink-950 group-hover:text-verdant-700">{t.label}</p>
              <p className="mt-2 text-sm text-mute">{t.text}</p>
            </Link>
          ))}
        </div>
      </Section>

      <Section tone="ink">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-center">
          <div>
            <SectionHeader tone="dark" eyebrow="Local desks, national panel" title="Every city has its own property rules, employer lists and lender appetites. We know them." lede="From society NOCs in Mumbai to khata checks in Bengaluru and patta in Chennai, our city desks prepare files for the lender that funds that property, that profile, in that market." />
            <ButtonLink href="/cities" variant="light" className="mt-8"><MapPin className="size-4" /> Cities we serve</ButtonLink>
          </div>
          <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {cities.map((c, i) => (
              <li key={c.slug} data-reveal data-reveal-delay={(i % 4) * 50}>
                <Link href={`/cities/${c.slug}`} className="block rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-bold text-white/85 transition-colors hover:border-verdant-400/60 hover:bg-white/10 hover:text-white">
                  {c.name}
                  <span className="mt-0.5 block text-[11px] font-semibold text-white/45">{c.state}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <SectionHeader eyebrow="Partner programme" title="Distribute loans from 40+ lenders under one code. We process, you earn." lede="Chartered accountants, insurance advisors, property consultants, former bankers and working professionals earn on every disbursal they refer. Free to join, no targets, full compliance cover." />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/partner/register">Register free <ArrowRight className="size-4" /></ButtonLink>
              <ButtonLink href="/partner/commission" variant="ghost">See commission slabs</ButtonLink>
            </div>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {partnerAudiences.map((a, i) => (
              <li key={a.slug} data-reveal data-reveal-delay={(i % 2) * 70}>
                <Link href={`/partner/for/${a.slug}`} className="group flex h-full items-start gap-3 rounded-card border border-line bg-white p-4 transition-all hover:border-verdant-400/60 hover:shadow-soft">
                  <Users className="mt-0.5 size-5 shrink-0 text-verdant-600" />
                  <span>
                    <span className="block text-sm font-bold text-ink-900 group-hover:text-verdant-700">{a.name}</span>
                    <span className="block text-xs text-mute">{a.short}</span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeader eyebrow="How we keep you safe" title="Regulated lenders, written terms, and a desk that never asks you for money." />
        <TrustNotes className="mt-10" />
        <Card className="mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Landmark className="mt-0.5 size-5 shrink-0 text-brass-500" />
            <p className="text-sm text-ink-800"><span className="font-bold">A note on fraud.</span> Fake agents sometimes use lender and distributor names to demand upfront fees. We never do. If anyone asks you to pay for approval in our name, <Link href="/guides/how-to-spot-loan-fraud" className="font-bold text-verdant-700 underline underline-offset-4">read this</Link> and call 1930.</p>
          </div>
          <Pill tone="brass" className="shrink-0">Never pay a fee</Pill>
        </Card>
      </Section>

      <Section tone="cream">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeader eyebrow="Guides" title="Plain-language answers, reviewed by our credit desk." />
          <ButtonLink href="/guides" variant="ghost" className="shrink-0">All guides <ArrowRight className="size-4" /></ButtonLink>
        </div>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {featuredGuides.slice(0, 3).map((g, i) => (<GuideCard key={g.slug} guide={g} delay={i * 70} />))}
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Questions" title="Straight answers before you apply." lede={<>More on the <Link href="/faqs" className="font-bold text-verdant-700 underline underline-offset-4">FAQ page</Link>.</>} />
          <FaqList faqs={homeFaqs} />
        </div>
      </Section>

      <CtaBand />
    </>
  );
}
