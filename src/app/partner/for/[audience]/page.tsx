import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Calculator } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { CheckList } from "@/components/shared/checklist";
import { Steps } from "@/components/shared/steps";
import { FaqList } from "@/components/shared/faq";
import { LinkPills } from "@/components/shared/link-pills";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { PartnerForm } from "@/components/forms/partner-form";
import { ProductIcon } from "@/components/shared/product-icon";
import { partnerAudiences, getAudience, partnerFaqs, partnerSteps } from "@/data/partner";
import { audienceOptions, cityOptions, productOptions } from "@/data/lite";
import { getProduct } from "@/data/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return partnerAudiences.map((a) => ({ audience: a.slug }));
}

export async function generateMetadata({ params }: PageProps<"/partner/for/[audience]">): Promise<Metadata> {
  const { audience } = await params;
  const a = getAudience(audience);
  if (!a) return {};
  return pageMetadata({
    title: `Loan DSA Partnership for ${a.name}`,
    description: `${a.summary}`,
    path: `/partner/for/${a.slug}`,
    keywords: a.keywords,
  });
}

export default async function AudiencePage({ params }: PageProps<"/partner/for/[audience]">) {
  const { audience } = await params;
  const a = getAudience(audience);
  if (!a) notFound();
  const path = `/partner/for/${a.slug}`;
  const prods = a.products.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  const faqs = [...a.faqs, ...partnerFaqs.slice(0, 4)];
  const others = partnerAudiences.filter((x) => x.slug !== a.slug);

  return (
    <>
      <JsonLd data={[webPageSchema({ name: `Partner programme for ${a.name}`, description: a.summary, path, dateModified: a.updatedAt }), faqPageSchema(faqs)]} />
      <PageHero
        tone="verdant"
        crumbs={[{ name: "Partner programme", path: "/partner" }, { name: a.name, path }]}
        eyebrow={`For ${a.short}`}
        title={a.headline}
        lede={a.summary}
        aside={
          <div className="rounded-panel bg-white p-6 text-ink-900 shadow-lift">
            <p className="eyebrow text-mute">A typical quarter</p>
            <p className="mt-3 text-sm leading-relaxed text-ink-800">{a.example.scenario}</p>
            <p className="mt-3 rounded-xl bg-verdant-50 px-4 py-3 text-sm font-bold text-verdant-700">{a.example.math}</p>
            <p className="mt-2 text-[11px] text-mute">Illustrative, using mid-range indicative payouts. Not a guarantee.</p>
            <ButtonLink href="/tools/dsa-income-calculator" variant="secondary" size="sm" className="mt-4"><Calculator className="size-4" /> Model your own numbers</ButtonLink>
          </div>
        }
      >
        <div className="mt-8"><ButtonLink href="#register" variant="light" size="lg">Register free <ArrowRight className="size-4" /></ButtonLink></div>
      </PageHero>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Why it works" title={`Why ${a.short.toLowerCase()} do well as channel partners`} />
            <Card className="mt-6 p-6"><CheckList items={a.why} /></Card>
          </div>
          <div>
            <SectionHeader eyebrow="Good fit" title="This programme suits" />
            <Card className="mt-6 p-6"><CheckList items={a.fit} /></Card>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeader eyebrow="Products that fit your clients" title="Start with these; add the rest when you are ready." />
        <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {prods.map((p, i) => (
            <li key={p.slug} data-reveal data-reveal-delay={(i % 3) * 70}>
              <Link href={`/partner/${p.slug}-dsa`} className="group flex h-full flex-col rounded-card border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-verdant-400/60 hover:shadow-soft">
                <div className="flex items-center justify-between"><ProductIcon icon={p.icon} className="size-5 text-verdant-600" /><Pill tone="verdant" className="tnum">{p.dsa.payoutFrom}% to {p.dsa.payoutTo}%</Pill></div>
                <p className="mt-4 font-display text-xl text-ink-950 group-hover:text-verdant-700">{p.name}</p>
                <p className="mt-1 text-xs text-mute">Typical ticket {p.dsa.ticketSize}</p>
                <p className="mt-3 text-sm text-mute">{p.dsa.pitch}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start"><SectionHeader eyebrow="How it works" title="Six steps to your first payout." /></div>
          <Steps steps={partnerSteps} />
        </div>
      </Section>

      <Section tone="paper" id="register">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionHeader eyebrow="Apply" title={`Register as a partner`} lede="Free, with no obligation. A partner manager calls within one working day." />
            <Card className="mt-8 p-6 sm:p-8"><PartnerForm products={productOptions} audiences={audienceOptions} cities={cityOptions} defaultProfession={a.name} source={`partner:for:${a.slug}`} /></Card>
          </div>
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div><p className="eyebrow mb-4 text-mute">FAQs</p><FaqList faqs={faqs} /></div>
            <LinkPills title="Other programmes" links={others.map((x) => ({ label: x.name, href: `/partner/for/${x.slug}` }))} />
          </div>
        </div>
      </Section>

      <CtaBand title="Turn the loan questions you already get into income." lede="Free registration, no targets, full processing and compliance support." primary={{ label: "Register as a partner", href: "/partner/register" }} secondary={{ label: "Commission slabs", href: "/partner/commission" }} />
    </>
  );
}
