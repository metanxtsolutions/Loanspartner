import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, itemListSchema, localServiceSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card } from "@/components/shared/section";
import { CallbackForm } from "@/components/forms/callback-form";
import { ProductCard } from "@/components/shared/product-card";
import { CheckList } from "@/components/shared/checklist";
import { FaqList } from "@/components/shared/faq";
import { LinkPills } from "@/components/shared/link-pills";
import { TrustNotes } from "@/components/shared/trust-notes";
import { CtaBand } from "@/components/shared/cta-band";
import { cities, getCity } from "@/data/cities";
import { coreProducts, products } from "@/data/products";
import { siteConfig } from "@/data/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return cities.map((c) => ({ city: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/cities/[city]">): Promise<Metadata> {
  const { city } = await params;
  const c = getCity(city);
  if (!c) return {};
  return pageMetadata({
    title: `Loans in ${c.name}: Compare Rates`,
    description: `LoansPartner's ${c.name} desk arranges personal, home, business and property loans from our lender panel. ${c.tagline} Zero fee to borrowers.`,
    path: `/cities/${c.slug}`,
    keywords: c.keywords,
  });
}

export default async function CityPage({ params }: PageProps<"/cities/[city]">) {
  const { city } = await params;
  const c = getCity(city);
  if (!c) notFound();
  const path = `/cities/${c.slug}`;
  const title = `Loans in ${c.name}`;
  const description = `Loan advisory and distribution in ${c.name}, ${c.state}: ${c.tagline}`;
  const nearby = c.nearbySlugs.map(getCity).filter(Boolean) as typeof cities;
  const otherProducts = products.filter((p) => !p.core);

  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: `${title} | ${siteConfig.name}`, description, path, dateModified: c.updatedAt }),
          localServiceSchema({ name: `${siteConfig.name} ${c.name}`, description, path, areaServedName: c.name }),
          itemListSchema({
            name: `Loans in ${c.name}`,
            path,
            items: coreProducts.map((p) => ({ name: `${p.name} in ${c.name}`, path: `/loans/${p.slug}/${c.slug}` })),
          }),
          faqPageSchema(c.faqs),
        ]}
      />
      <PageHero
        tone="ink"
        crumbs={[
          { name: "Cities", path: "/cities" },
          { name: c.name, path },
        ]}
        eyebrow={`${c.state} · ${c.region} India`}
        title={title}
        lede={c.tagline}
        aside={
          <div className="rounded-panel text-ink-900 shadow-lift bg-white p-6">
            <p className="font-display text-2xl">Talk to the {c.name} desk</p>
            <p className="text-mute mt-1 text-sm">
              Tell us the need; we call back with lenders and documents to keep ready.
            </p>
            <div className="mt-4">
              <CallbackForm city={c.name} source={`city-callback:${c.slug}`} />
            </div>
          </div>
        }
      />

      <Section tone="cream">
        <SectionHeader
          eyebrow="Products"
          title={`What we arrange in ${c.name}`}
          lede="Each product page explains what changes locally: documentation, lender appetite and typical ticket sizes."
        />
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {coreProducts.map((p, i) => (
            <ProductCard
              key={p.slug}
              product={p}
              href={`/loans/${p.slug}/${c.slug}`}
              cityName={c.name}
              delay={i * 60}
            />
          ))}
        </div>
        <LinkPills
          className="mt-8"
          title={`Also available in ${c.name}`}
          links={otherProducts.map((p) => ({ label: p.name, href: `/loans/${p.slug}` }))}
        />
      </Section>

      <Section tone="paper">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="prose-lp max-w-3xl" data-reveal>
            <h2>The {c.name} credit market</h2>
            {c.overview.map((para, i) => (
              <p key={i}>{para}</p>
            ))}
            <h3>Economy and borrowers</h3>
            <p>{c.economy}</p>
            <h3>Property and home loans</h3>
            <p>{c.propertyMarket}</p>
            <h3>Lender presence</h3>
            <p>{c.lenderPresence}</p>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-5">
              <p className="eyebrow text-mute">Local notes</p>
              <CheckList items={c.localNotes} className="mt-3 text-sm" />
            </Card>
            {nearby.length > 0 && (
              <Card className="p-5">
                <p className="eyebrow text-mute">Nearby desks</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {nearby.map((n) => (
                    <li key={n.slug}>
                      <Link
                        href={`/cities/${n.slug}`}
                        className="text-ink-800 hover:text-brass-600 inline-flex items-center gap-1 font-semibold"
                      >
                        Loans in {n.name} <ArrowRight className="size-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </aside>
        </div>
      </Section>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQs" title={`Borrowing in ${c.name}`} />
          <FaqList faqs={c.faqs} />
        </div>
      </Section>

      <Section tone="paper">
        <TrustNotes />
        <LinkPills
          className="mt-12"
          title="Other cities"
          links={cities.filter((x) => x.slug !== c.slug).map((x) => ({ label: x.name, href: `/cities/${x.slug}` }))}
        />
      </Section>

      <CtaBand
        title={`Borrowing in ${c.name}? Start with a two-minute check.`}
        lede={`Our ${c.name} desk pre-screens your profile across the panel and calls with a shortlist. No fee, no bureau enquiry.`}
        primary={{ label: "Check eligibility", href: `/apply?city=${encodeURIComponent(c.name)}` }}
      />
    </>
  );
}
