import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card } from "@/components/shared/section";
import { Steps } from "@/components/shared/steps";
import { CheckList } from "@/components/shared/checklist";
import { FaqList } from "@/components/shared/faq";
import { LinkPills } from "@/components/shared/link-pills";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { PartnerForm } from "@/components/forms/partner-form";
import { products, getProduct } from "@/data/products";
import { partnerFaqs, partnerSteps, partnerEligibility } from "@/data/partner";
import { audienceOptions, cityOptions, productOptions } from "@/data/lite";
import { formatINR } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ slug: `${p.slug}-dsa` }));
}

const fromSlug = (slug: string) => (slug.endsWith("-dsa") ? getProduct(slug.slice(0, -4)) : undefined);

export async function generateMetadata({ params }: PageProps<"/partner/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const p = fromSlug(slug);
  if (!p) return {};
  return pageMetadata({
    title: `${p.name} DSA: Payouts and Registration`,
    description: `Become a ${p.name.toLowerCase()} DSA with LoansPartner. Distribute ${p.name.toLowerCase()}s from our lender panel, typical tickets of ${p.dsa.ticketSize}, payouts of ${p.dsa.payoutFrom}% to ${p.dsa.payoutTo}%, processing handled by our credit desk. Free registration.`,
    path: `/partner/${slug}`,
    keywords: [`${p.name.toLowerCase()} DSA`, `${p.name.toLowerCase()} DSA registration`, `${p.name.toLowerCase()} DSA commission`, `${p.name.toLowerCase()} agent`, "loan DSA", "DSA partner program"],
  });
}

export default async function ProductDsaPage({ params }: PageProps<"/partner/[slug]">) {
  const { slug } = await params;
  const p = fromSlug(slug);
  if (!p) notFound();
  const path = `/partner/${slug}`;
  const title = `${p.name} DSA programme`;
  const description = `Distribute ${p.name.toLowerCase()}s from our lender panel and earn ${p.dsa.payoutFrom}% to ${p.dsa.payoutTo}% of every disbursal.`;
  const faqs = [
    { question: `How much does a ${p.name.toLowerCase()} DSA earn per file?`, answer: `Indicatively ${p.dsa.payoutFrom}% to ${p.dsa.payoutTo}% of the disbursed amount. On a typical ticket of ${p.dsa.ticketSize}, that is a meaningful payout per file. Your slab is stated in your agreement and reviewed quarterly.` },
    { question: `Who are the best prospects for ${p.name.toLowerCase()}s?`, answer: p.dsa.sellsTo.join("; ") + "." },
    ...partnerFaqs.slice(1, 5),
  ];
  const others = products.filter((x) => x.slug !== p.slug);

  return (
    <>
      <JsonLd data={[
        webPageSchema({ name: title, description, path, dateModified: p.updatedAt }),
        faqPageSchema(faqs),
      ]} />
      <PageHero
        tone="ink"
        crumbs={[{ name: "Partner programme", path: "/partner" }, { name: `${p.name} DSA`, path }]}
        eyebrow="Product programme"
        title={<>{p.name} DSA</>}
        lede={<><p className="font-display text-2xl italic text-white/90">{p.dsa.pitch}</p><p className="mt-4">{description} We handle lender selection, documentation and follow-up; you bring the relationship.</p></>}
        aside={
          <div className="grid gap-4">
            <Stat label="Indicative payout" value={`${p.dsa.payoutFrom}% to ${p.dsa.payoutTo}%`} />
            <Stat label="Typical ticket" value={p.dsa.ticketSize} />
            <Stat label="Borrower rate range" value={`${p.rate.from.toFixed(2)}% to ${p.rate.to.toFixed(2)}% p.a.`} />
            <Stat label="Loan amounts" value={`₹${formatINR(p.amount.min, { compact: true })} to ₹${formatINR(p.amount.max, { compact: true })}`} />
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="#register" size="lg">Register free <ArrowRight className="size-4" /></ButtonLink>
          <ButtonLink href={`/loans/${p.slug}`} variant="outline-light" size="lg">Product details for borrowers</ButtonLink>
        </div>
      </PageHero>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-2">
          <div>
            <SectionHeader eyebrow="Who to sell to" title={`Where ${p.name.toLowerCase()} demand comes from`} />
            <Card className="mt-6 p-6"><CheckList items={p.dsa.sellsTo} /></Card>
            <SectionHeader eyebrow="What borrowers get" title="Your pitch, in the borrower's terms" className="mt-10" />
            <ul className="mt-6 space-y-3">
              {p.benefits.slice(0, 4).map((b) => (<li key={b.title} className="rounded-xl border border-line bg-white p-4"><p className="text-sm font-bold text-ink-900">{b.title}</p><p className="mt-1 text-sm text-mute">{b.text}</p></li>))}
            </ul>
          </div>
          <div>
            <SectionHeader eyebrow="Eligibility you should pre-check" title="Qualify the lead before you log it" lede="Files that fit policy convert. A minute of pre-qualification saves everyone a week." />
            <dl className="mt-6 space-y-3">
              <Row label="Age" value={p.eligibility.age} />
              <Row label="Income" value={p.eligibility.income} />
              <Row label="Credit score" value={p.eligibility.cibil} />
              <Row label="Employment" value={p.eligibility.employment.join(". ")} />
            </dl>
            <p className="mt-4 text-sm text-mute">Full documentation lists are on the <Link href={`/loans/${p.slug}#documents`} className="font-bold text-verdant-700 underline underline-offset-4">borrower product page</Link>.</p>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader eyebrow="How it works" title="Registration to first payout" />
            <Card className="mt-8 p-6"><p className="eyebrow text-mute">Who can join</p><CheckList items={partnerEligibility} className="mt-4 text-sm" /></Card>
          </div>
          <Steps steps={partnerSteps} />
        </div>
      </Section>

      <Section tone="cream" id="register">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div>
            <SectionHeader eyebrow="Apply" title={`Register as a ${p.name.toLowerCase()} DSA`} lede="Free, with no obligation. Pick the products you want to distribute; you can add more later." />
            <Card className="mt-8 p-6 sm:p-8"><PartnerForm products={productOptions} audiences={audienceOptions} cities={cityOptions} source={`partner:${p.slug}-dsa`} /></Card>
          </div>
          <div className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <div>
              <p className="eyebrow mb-4 text-mute">FAQs</p>
              <FaqList faqs={faqs} />
            </div>
            <LinkPills title="Other product programmes" links={others.map((x) => ({ label: `${x.name} DSA`, href: `/partner/${x.slug}-dsa` }))} />
          </div>
        </div>
      </Section>

      <CtaBand title={`Start distributing ${p.name.toLowerCase()}s.`} lede="Free registration, one code for our whole lender panel, and a credit desk that processes every file." primary={{ label: "Register as a partner", href: "/partner/register" }} secondary={{ label: "Commission slabs", href: "/partner/commission" }} />
    </>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-xs text-white/55">{label}</p>
      <p className="tnum mt-1 font-display text-2xl text-white">{value}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-line bg-white p-4">
      <dt className="text-xs font-bold uppercase tracking-wide text-mute">{label}</dt>
      <dd className="mt-1 text-sm text-ink-800">{value}</dd>
    </div>
  );
}
