import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Building2, Landmark, MapPin } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, loanProductSchema, localServiceSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { HeroForm } from "@/components/forms/hero-form";
import { CheckList } from "@/components/shared/checklist";
import { FaqList } from "@/components/shared/faq";
import { EmiTable } from "@/components/shared/emi-table";
import { LenderCards } from "@/components/shared/lender-cards";
import { LinkPills } from "@/components/shared/link-pills";
import { Steps } from "@/components/shared/steps";
import { TrustNotes } from "@/components/shared/trust-notes";
import { CtaBand } from "@/components/shared/cta-band";
import { coreProducts, getProduct } from "@/data/products";
import { productOptions } from "@/data/lite";
import { cities, getCity, type CoreProductSlug } from "@/data/cities";
import { lendersForProduct } from "@/data/lenders";
import { siteConfig } from "@/data/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return coreProducts.flatMap((p) => cities.map((c) => ({ product: p.slug, city: c.slug })));
}

function load(productSlug: string, citySlug: string) {
  const p = getProduct(productSlug);
  const c = getCity(citySlug);
  if (!p || !c || !p.core) return null;
  return { p, c, note: c.productNotes[p.slug as CoreProductSlug] };
}

export async function generateMetadata({ params }: PageProps<"/loans/[product]/[city]">): Promise<Metadata> {
  const { product, city } = await params;
  const data = load(product, city);
  if (!data) return {};
  const { p, c } = data;
  return pageMetadata({
    title: `${p.seoName ?? p.name} in ${c.name}: Rates`,
    description: `Get a ${p.name.toLowerCase()} in ${c.name} from banks and NBFCs on our panel. ${c.tagline} Zero fee, local documentation support, lender shortlist within one working day.`,
    path: `/loans/${p.slug}/${c.slug}`,
    keywords: [
      `${p.name.toLowerCase()} in ${c.name}`,
      `${p.name.toLowerCase()} ${c.name}`,
      `best ${p.name.toLowerCase()} ${c.name}`,
      `${p.name.toLowerCase()} agent ${c.name}`,
      ...p.keywords.slice(0, 3),
      ...c.keywords.slice(0, 2),
    ],
  });
}

export default async function ProductCityPage({ params }: PageProps<"/loans/[product]/[city]">) {
  const { product, city } = await params;
  const data = load(product, city);
  if (!data) notFound();
  const { p, c, note } = data;
  const path = `/loans/${p.slug}/${c.slug}`;
  const title = `${p.name} in ${c.name}`;
  const description = `${p.summary} ${c.tagline}`;
  const faqs = [...c.faqs.slice(0, 2), ...p.faqs.slice(0, 4)];
  const lenders = lendersForProduct(p.slug);
  const otherCities = cities.filter((x) => x.slug !== c.slug);
  const otherProducts = coreProducts.filter((x) => x.slug !== p.slug);
  const nearby = c.nearbySlugs.map(getCity).filter(Boolean) as typeof cities;

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({
            name: `${title} | ${siteConfig.name}`,
            description,
            path,
            dateModified: c.updatedAt > p.updatedAt ? c.updatedAt : p.updatedAt,
          }),
          loanProductSchema({
            name: title,
            description,
            path,
            rateFrom: p.rate.from,
            rateTo: p.rate.to,
            amountMin: p.amount.min,
            amountMax: p.amount.max,
            tenureMaxMonths: p.tenure.maxMonths,
            areaServedName: c.name,
          }),
          localServiceSchema({
            name: `${siteConfig.name} ${c.name}`,
            description: `${p.name} advisory and distribution in ${c.name}, ${c.state}.`,
            path,
            areaServedName: c.name,
          }),
          faqPageSchema(c.faqs),
        ]}
      />
      <PageHero
        crumbs={[
          { name: "Loans", path: "/loans" },
          { name: p.name, path: `/loans/${p.slug}` },
          { name: c.name, path },
        ]}
        eyebrow={`${c.name}, ${c.state}`}
        title={title}
        lede={
          <>
            <p>{note}</p>
          </>
        }
        aside={
          <div className="rounded-panel border-line shadow-lift border bg-white p-6">
            <p className="font-display text-2xl">Check eligibility in {c.name}</p>
            <p className="text-mute mt-1 text-sm">
              Our {c.name} desk pre-screens your profile across the lender panel. No fee, no bureau enquiry.
            </p>
            <div className="mt-5">
              <HeroForm products={productOptions} defaultProduct={p.slug} source={`city:${c.slug}:${p.slug}`} />
            </div>
          </div>
        }
      >
        <div className="mt-6 flex flex-wrap gap-2">
          <Pill tone="brass">Rates from {p.rate.from.toFixed(2)}% p.a.</Pill>
          <Pill tone="sand">Tenure up to {Math.round(p.tenure.maxMonths / 12)} years</Pill>
          {p.ltv && <Pill tone="brass">{p.ltv.split(/[;.,]/)[0]}</Pill>}
        </div>
      </PageHero>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-16">
            <div className="prose-lp max-w-3xl" data-reveal>
              <h2>
                The {c.name} market for {p.name.toLowerCase()}s
              </h2>
              {c.overview.map((para, i) => (
                <p key={i}>{para}</p>
              ))}
              {(p.slug === "home-loan" || p.slug === "loan-against-property") && (
                <>
                  <h3>Property in {c.name}</h3>
                  <p>{c.propertyMarket}</p>
                </>
              )}
              {(p.slug === "business-loan" || p.slug === "personal-loan") && (
                <>
                  <h3>Who borrows in {c.name}</h3>
                  <p>{c.economy}</p>
                </>
              )}
              <h3>Lenders in {c.name}</h3>
              <p>{c.lenderPresence}</p>
            </div>

            <div>
              <SectionHeader eyebrow="Local notes" title={`What changes in ${c.name}`} />
              <Card className="mt-6 p-6">
                <CheckList items={c.localNotes} />
              </Card>
            </div>

            <div>
              <SectionHeader eyebrow="How it works" title={`Getting a ${p.name.toLowerCase()} in ${c.name}`} />
              <div className="mt-8">
                <Steps steps={p.howItWorks} />
              </div>
            </div>

            <div>
              <SectionHeader
                eyebrow="Indicative EMIs"
                title="Instalments at a glance"
                lede={
                  <>
                    At the lowest rate in the range. Run your own numbers in the{" "}
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

            <div>
              <SectionHeader eyebrow="Documents" title="What to keep ready" />
              <div className={`mt-8 grid gap-6 ${p.documents.salaried.length ? "md:grid-cols-2" : ""}`}>
                {p.documents.salaried.length > 0 && (
                  <Card className="p-6">
                    <Pill tone="brass">Salaried</Pill>
                    <CheckList items={p.documents.salaried} className="mt-4" />
                  </Card>
                )}
                <Card className="p-6">
                  <Pill tone="brass">{p.documents.salaried.length ? "Self-employed" : "Business"}</Pill>
                  <CheckList items={p.documents.selfEmployed} className="mt-4" />
                </Card>
              </div>
            </div>

            {lenders.length > 0 && (
              <div>
                <SectionHeader
                  eyebrow="Lenders"
                  title={`${p.name} lenders active in ${c.name}`}
                  lede="A selection from our panel. Lender choice depends on your profile and, for property loans, the specific property."
                />
                <div className="mt-8">
                  <LenderCards lenders={lenders} limit={6} />
                </div>
              </div>
            )}

            <div>
              <SectionHeader eyebrow="FAQs" title={`${p.name} in ${c.name}: common questions`} />
              <FaqList faqs={faqs} className="mt-6" />
            </div>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="eyebrow text-mute">{c.name} desk</p>
              <ul className="text-ink-800 mt-3 space-y-2 text-sm">
                <li className="flex gap-2">
                  <MapPin className="text-brass-600 mt-0.5 size-4 shrink-0" /> Serving {c.name} and the wider {c.state}{" "}
                  region
                </li>
                <li className="flex gap-2">
                  <Landmark className="text-brass-600 mt-0.5 size-4 shrink-0" /> {lenders.length} panel lenders for this
                  product
                </li>
                <li className="flex gap-2">
                  <Building2 className="text-brass-600 mt-0.5 size-4 shrink-0" /> Local documentation and verification
                  support
                </li>
              </ul>
              <Link
                href={`/cities/${c.slug}`}
                className="text-brass-600 mt-4 inline-flex items-center gap-1 text-sm font-bold"
              >
                All loans in {c.name} <ArrowRight className="size-3.5" />
              </Link>
            </Card>
            <Card className="p-5">
              <p className="eyebrow text-mute">Other loans in {c.name}</p>
              <ul className="mt-3 space-y-2 text-sm">
                {otherProducts.map((x) => (
                  <li key={x.slug}>
                    <Link
                      href={`/loans/${x.slug}/${c.slug}`}
                      className="text-ink-800 hover:text-brass-600 font-semibold"
                    >
                      {x.name} in {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </Card>
            {nearby.length > 0 && (
              <Card className="p-5">
                <p className="eyebrow text-mute">Nearby cities</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {nearby.map((x) => (
                    <li key={x.slug}>
                      <Link
                        href={`/loans/${p.slug}/${x.slug}`}
                        className="text-ink-800 hover:text-brass-600 font-semibold"
                      >
                        {p.name} in {x.name}
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>
        </div>
      </Section>

      <Section tone="paper">
        <TrustNotes />
        <LinkPills
          className="mt-12"
          title={`${p.name}s in other cities`}
          links={otherCities.map((x) => ({ label: x.name, href: `/loans/${p.slug}/${x.slug}` }))}
        />
      </Section>

      <CtaBand
        title={`Your ${p.name.toLowerCase()} in ${c.name}, handled.`}
        lede={`Share your requirement and our ${c.name} desk will call with a lender shortlist and the documents to keep ready. No fee, no bureau enquiry.`}
        primary={{ label: "Check eligibility", href: `/apply?product=${p.slug}&city=${encodeURIComponent(c.name)}` }}
      />
    </>
  );
}
