import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, BadgePercent, CalendarClock, Coins, ReceiptText } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, loanProductSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { HeroForm } from "@/components/forms/hero-form";
import { CallbackForm } from "@/components/forms/callback-form";
import { Steps } from "@/components/shared/steps";
import { CheckList } from "@/components/shared/checklist";
import { FaqList } from "@/components/shared/faq";
import { EmiTable } from "@/components/shared/emi-table";
import { LenderCards } from "@/components/shared/lender-cards";
import { LinkPills } from "@/components/shared/link-pills";
import { GuideCard } from "@/components/shared/guide-card";
import { ProductCard } from "@/components/shared/product-card";
import { Toc } from "@/components/shared/toc";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { products, getProduct, productCategories } from "@/data/products";
import { productOptions } from "@/data/lite";
import { cities } from "@/data/cities";
import { lendersForProduct } from "@/data/lenders";
import { guidesForProduct } from "@/data/guides";
import { siteConfig } from "@/data/site-config";
import { formatINR } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return products.map((p) => ({ product: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/loans/[product]">): Promise<Metadata> {
  const { product } = await params;
  const p = getProduct(product);
  if (!p) return {};
  return pageMetadata({
    title: `${p.seoName ?? p.name} Rates from ${p.rate.from.toFixed(2)}%`,
    description: `${p.summary} Compare ${p.name.toLowerCase()} offers from our lender panel with LoansPartner. Zero fee to borrowers.`,
    path: `/loans/${p.slug}`,
    keywords: p.keywords,
  });
}

export default async function ProductPage({ params }: PageProps<"/loans/[product]">) {
  const { product } = await params;
  const p = getProduct(product);
  if (!p) notFound();
  const category = productCategories.find((c) => c.key === p.category)!;
  const lenders = lendersForProduct(p.slug);
  const guides = guidesForProduct(p.slug).slice(0, 3);
  const related = p.related.map(getProduct).filter(Boolean) as typeof products;
  const path = `/loans/${p.slug}`;
  const description = p.summary;
  const hasSalaried = p.documents.salaried.length > 0;

  const toc = [
    { id: "overview", label: "Overview" },
    { id: "benefits", label: "Why borrowers choose it" },
    { id: "eligibility", label: "Eligibility" },
    { id: "documents", label: "Documents" },
    { id: "process", label: "How it works" },
    { id: "emi", label: "Indicative EMIs" },
    { id: "lenders", label: "Lenders" },
    { id: "faqs", label: "FAQs" },
  ];

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `${p.name} | ${siteConfig.name}`, description, path, dateModified: p.updatedAt }),
          loanProductSchema({
            name: p.name,
            description,
            path,
            rateFrom: p.rate.from,
            rateTo: p.rate.to,
            amountMin: p.amount.min,
            amountMax: p.amount.max,
            tenureMaxMonths: p.tenure.maxMonths,
          }),
          faqPageSchema(p.faqs),
        ]}
      />
      <PageHero
        crumbs={[
          { name: "Loans", path: "/loans" },
          { name: p.name, path },
        ]}
        eyebrow={category.label}
        title={p.name}
        lede={
          <>
            <p className="font-display text-ink-800 text-2xl italic">{p.tagline}</p>
            <p className="mt-4">{p.summary}</p>
          </>
        }
        aside={
          <div className="rounded-panel border-line shadow-lift border bg-white p-6">
            <p className="font-display text-2xl">Check {p.shortName.toLowerCase()} loan eligibility</p>
            <p className="text-mute mt-1 text-sm">Free pre-screen across our lender panel. No bureau enquiry.</p>
            <div className="mt-5">
              <HeroForm products={productOptions} defaultProduct={p.slug} source={`product:${p.slug}`} />
            </div>
          </div>
        }
      >
        <dl className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Fact icon={BadgePercent} label="Rate from" value={`${p.rate.from.toFixed(2)}% p.a.`} />
          <Fact
            icon={Coins}
            label="Amount"
            value={`₹${formatINR(p.amount.min, { compact: true })} to ₹${formatINR(p.amount.max, { compact: true })}`}
          />
          <Fact
            icon={CalendarClock}
            label="Tenure"
            value={`${p.tenure.minMonths >= 12 ? `${p.tenure.minMonths / 12} to ${p.tenure.maxMonths / 12} years` : `${p.tenure.minMonths} to ${p.tenure.maxMonths} months`}`}
          />
          <Fact icon={ReceiptText} label="Processing fee" value={p.processingFee.split(/[;,]/)[0]} />
        </dl>
      </PageHero>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-16">
            <div id="overview" className="prose-lp max-w-3xl" data-reveal>
              <h2>About {p.name.toLowerCase()}s</h2>
              {p.intro.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              <p className="border-brass-300/60 bg-brass-50 text-ink-800 border px-5 py-4 text-[15px]">
                <strong>Rate note:</strong> {p.rate.note} {p.ltv ? ` Funding: ${p.ltv}` : ""}
              </p>
            </div>

            <div id="benefits">
              <SectionHeader
                eyebrow="Why borrowers choose it"
                title={`What a ${p.name.toLowerCase()} through LoansPartner gets you`}
              />
              <ul className="mt-8 grid gap-4 sm:grid-cols-2">
                {p.benefits.map((b, i) => (
                  <li
                    key={b.title}
                    data-reveal
                    data-reveal-delay={(i % 2) * 70}
                    className="rounded-card border-line border bg-white p-5"
                  >
                    <p className="text-ink-900 font-bold">{b.title}</p>
                    <p className="text-mute mt-1.5 text-sm leading-relaxed">{b.text}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-8">
                <p className="eyebrow text-mute mb-3">Common uses</p>
                <ul className="flex flex-wrap gap-2">
                  {p.useCases.map((u) => (
                    <li key={u}>
                      <Pill tone="sand">{u}</Pill>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div id="eligibility">
              <SectionHeader
                eyebrow="Eligibility"
                title="Who qualifies"
                lede="Norms vary by lender. These are the ranges across our panel; we tell you precisely where your profile fits before you apply."
              />
              <dl className="mt-8 grid gap-4 sm:grid-cols-2">
                <Term label="Age" value={p.eligibility.age} />
                <Term label="Income" value={p.eligibility.income} />
                <Term label="Credit score" value={p.eligibility.cibil} />
                <Term label="Employment" value={p.eligibility.employment.join(". ")} />
                {p.eligibility.other?.map((o) => (
                  <Term key={o} label="Also" value={o} />
                ))}
              </dl>
              <ButtonLink href="/tools/eligibility-calculator" variant="ghost" className="mt-6 -ml-4">
                Estimate your eligibility <ArrowRight className="size-4" />
              </ButtonLink>
            </div>

            <div id="documents">
              <SectionHeader
                eyebrow="Documents"
                title="What to keep ready"
                lede="A complete file is the single biggest driver of a fast sanction. We collect everything digitally in one go."
              />
              <div className={`mt-8 grid gap-6 ${hasSalaried ? "md:grid-cols-2" : ""}`}>
                {hasSalaried && (
                  <Card className="p-6">
                    <Pill tone="brass">Salaried</Pill>
                    <CheckList items={p.documents.salaried} className="mt-4" />
                  </Card>
                )}
                <Card className="p-6">
                  <Pill tone="brass">{hasSalaried ? "Self-employed and business" : "Business and promoters"}</Pill>
                  <CheckList items={p.documents.selfEmployed} className="mt-4" />
                </Card>
              </div>
            </div>

            <div id="process">
              <SectionHeader eyebrow="How it works" title="Five steps, one point of contact" />
              <div className="mt-8">
                <Steps steps={p.howItWorks} />
              </div>
            </div>

            <div id="emi">
              <SectionHeader
                eyebrow="Indicative EMIs"
                title="What the instalment looks like"
                lede={
                  <>
                    Computed at the lowest rate in this product's range. Run your own numbers in the{" "}
                    <Link
                      href="/tools/emi-calculator"
                      className="text-brass-600 font-bold underline underline-offset-4"
                    >
                      EMI calculator
                    </Link>
                    .
                  </>
                }
              />
              <div className="mt-8">
                <EmiTable product={p} />
              </div>
            </div>

            {lenders.length > 0 && (
              <div id="lenders">
                <SectionHeader
                  eyebrow="Lenders"
                  title={`Where we place ${p.name.toLowerCase()} files`}
                  lede="A selection from our panel. The best lender for you depends on your profile, city and the property or asset involved."
                />
                <div className="mt-8">
                  <LenderCards lenders={lenders} limit={6} />
                </div>
                {lenders.length > 6 && (
                  <Link
                    href="/lenders"
                    className="text-brass-600 mt-4 inline-flex items-center gap-1 text-sm font-bold"
                  >
                    All lending partners <ArrowRight className="size-3.5" />
                  </Link>
                )}
              </div>
            )}

            {p.core && (
              <div>
                <SectionHeader
                  eyebrow="By city"
                  title={`${p.name}s in your city`}
                  lede="Local property rules, employer categories and lender appetite change what gets approved. Read the city-specific notes."
                />
                <LinkPills
                  className="mt-6"
                  links={cities.map((c) => ({ label: `${p.name} in ${c.name}`, href: `/loans/${p.slug}/${c.slug}` }))}
                />
              </div>
            )}

            <div id="faqs">
              <SectionHeader eyebrow="FAQs" title={`${p.name} questions, answered`} />
              <FaqList faqs={p.faqs} className="mt-6" />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Toc items={toc} />
            <Card className="p-5">
              <p className="font-display text-xl">Prefer to talk first?</p>
              <p className="text-mute mt-1 text-sm">Our credit desk will call you back.</p>
              <div className="mt-4">
                <CallbackForm product={p.slug} source={`product-callback:${p.slug}`} compact />
              </div>
            </Card>
            <Card className="p-5">
              <p className="eyebrow text-mute">For partners</p>
              <p className="text-ink-800 mt-2 text-sm">
                Distribute {p.name.toLowerCase()}s and earn {p.dsa.payoutFrom}% to {p.dsa.payoutTo}% of every disbursal.
              </p>
              <Link
                href={`/partner/${p.slug}-dsa`}
                className="text-brass-600 mt-3 inline-flex items-center gap-1 text-sm font-bold"
              >
                {p.name} DSA programme <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          </aside>
        </div>
      </Section>

      {(related.length > 0 || guides.length > 0) && (
        <Section tone="paper">
          {related.length > 0 && (
            <>
              <SectionHeader
                eyebrow="Related products"
                title="Sometimes a different product is cheaper. We will say so."
              />
              <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {related.map((r, i) => (
                  <ProductCard key={r.slug} product={r} delay={i * 70} />
                ))}
              </div>
            </>
          )}
          {guides.length > 0 && (
            <>
              <SectionHeader eyebrow="Guides" title="Read before you apply" className="mt-16" />
              <div className="mt-8 grid gap-5 md:grid-cols-3">
                {guides.map((g, i) => (
                  <GuideCard key={g.slug} guide={g} delay={i * 70} />
                ))}
              </div>
            </>
          )}
        </Section>
      )}

      <CtaBand
        title={`Get your ${p.name.toLowerCase()} shortlist.`}
        lede="Share your requirement in two minutes. Our credit desk pre-screens your profile and calls with lenders, rates and next steps. No fee, no bureau enquiry."
        primary={{ label: "Check eligibility", href: `/apply?product=${p.slug}` }}
      />
    </>
  );
}

function Fact({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
}) {
  return (
    <div className="border-line border bg-white/80 p-4">
      <dt className="text-mute flex items-center gap-1.5 text-xs">
        <Icon className="text-brass-600 size-3.5" /> {label}
      </dt>
      <dd className="tnum text-ink-900 mt-1.5 text-[15px] leading-snug font-bold">{value}</dd>
    </div>
  );
}

function Term({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-card border-line border bg-white p-5">
      <dt className="eyebrow text-mute">{label}</dt>
      <dd className="text-ink-800 mt-2 text-[15px] leading-relaxed">{value}</dd>
    </div>
  );
}
