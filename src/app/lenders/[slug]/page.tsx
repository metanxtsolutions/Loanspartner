import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ExternalLink } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { CheckList } from "@/components/shared/checklist";
import { ProductCard } from "@/components/shared/product-card";
import { LenderCards } from "@/components/shared/lender-cards";
import { CtaBand } from "@/components/shared/cta-band";
import { HeroForm } from "@/components/forms/hero-form";
import { lenders, getLender } from "@/data/lenders";
import { getProduct } from "@/data/products";
import { productOptions } from "@/data/lite";
import { siteConfig } from "@/data/site-config";

export const dynamicParams = false;

export function generateStaticParams() {
  return lenders.map((l) => ({ slug: l.slug }));
}

export async function generateMetadata({ params }: PageProps<"/lenders/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const l = getLender(slug);
  if (!l) return {};
  return pageMetadata({
    title: `${l.name} Loans: Products and How to Apply`,
    description: `${l.summary} Apply for ${l.name} loans through LoansPartner with pre-screening across the panel and zero fee to borrowers.`,
    path: `/lenders/${l.slug}`,
    keywords: [`${l.name} loan`, `${l.name} personal loan`, `${l.name} home loan`, `${l.name} DSA`, `${l.name} loan apply`],
  });
}

export default async function LenderPage({ params }: PageProps<"/lenders/[slug]">) {
  const { slug } = await params;
  const l = getLender(slug);
  if (!l) notFound();
  const path = `/lenders/${l.slug}`;
  const prods = l.products.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  const similar = lenders.filter((x) => x.type === l.type && x.slug !== l.slug).slice(0, 3);
  return (
    <>
      <JsonLd data={webPageSchema({ name: `${l.name} | Lending partner`, description: l.summary, path, dateModified: l.updatedAt })} />
      <PageHero
        crumbs={[{ name: "Lending partners", path: "/lenders" }, { name: l.name, path }]}
        eyebrow={l.type}
        title={l.name}
        lede={<><p>{l.summary}</p><p className="mt-3"><span className="font-bold text-ink-900">Best for:</span> {l.bestFor}</p></>}
        aside={
          <div className="rounded-panel border border-line bg-white p-6 shadow-lift">
            <p className="font-display text-2xl">Apply with pre-screening</p>
            <p className="mt-1 text-sm text-mute">We check your profile against {l.shortName}'s policy and others on the panel before any application.</p>
            <div className="mt-5"><HeroForm products={productOptions} defaultProduct={l.products[0]} source={`lender:${l.slug}`} /></div>
          </div>
        }
      >
        <a href={l.website} target="_blank" rel="noopener noreferrer nofollow" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-verdant-700 hover:text-verdant-600">Official website <ExternalLink className="size-3.5" /></a>
      </PageHero>
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <Card className="p-6">
            <p className="eyebrow text-mute">Typical strengths</p>
            <CheckList items={l.strengths} className="mt-4" />
            <p className="mt-6 text-xs leading-relaxed text-mute">{siteConfig.compliance.rateDisclaimer} Loan approval and terms are decided solely by {l.name} under its credit policy.</p>
          </Card>
          <div>
            <SectionHeader eyebrow="Products" title={`What we arrange with ${l.shortName}`} />
            <ul className="mt-6 flex flex-wrap gap-2">{prods.map((p) => (<li key={p.slug}><Pill tone="sand">{p.name}</Pill></li>))}</ul>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">{prods.slice(0, 4).map((p, i) => (<ProductCard key={p.slug} product={p} delay={i * 60} />))}</div>
          </div>
        </div>
      </Section>
      {similar.length > 0 && (
        <Section tone="paper">
          <SectionHeader eyebrow="Compare" title={`Other ${l.type.toLowerCase()}s on the panel`} lede="The best lender for you depends on your profile. We compare before you apply." />
          <div className="mt-8"><LenderCards lenders={similar} /></div>
          <Link href="/lenders" className="mt-6 inline-flex items-center gap-1 text-sm font-bold text-verdant-700">All lending partners <ArrowRight className="size-3.5" /></Link>
        </Section>
      )}
      <CtaBand title={`Is ${l.shortName} the right lender for you?`} lede="Share your requirement and we will compare it against the whole panel, at no cost and with no bureau enquiry." />
    </>
  );
}
