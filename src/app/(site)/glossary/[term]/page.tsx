import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { definedTermSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, Card } from "@/components/shared/section";
import { LinkPills } from "@/components/shared/link-pills";
import { ProductCard } from "@/components/shared/product-card";
import { CtaBand } from "@/components/shared/cta-band";
import { glossary, getTerm } from "@/data/glossary";
import { getProduct } from "@/data/products";

export const dynamicParams = false;

export function generateStaticParams() {
  return glossary.map((t) => ({ term: t.slug }));
}

/**
 * Glossary entries spell the acronym out in full, which reads well as an H1 but
 * overflows the <title> once the brand suffix is appended. The expansion is
 * already in the first line of the definition, so dropping it from the title
 * costs nothing and keeps the acronym people actually search for.
 */
function seoTerm(term: string) {
  const head = term.replace(/\s*\(.*\)\s*$/, "").trim();
  return term.length > 30 && head.length > 0 ? head : term;
}

export async function generateMetadata({ params }: PageProps<"/glossary/[term]">): Promise<Metadata> {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) return {};
  return pageMetadata({
    title: `${seoTerm(t.term)} Explained`,
    description: `${t.short} ${t.definition[0]}`,
    path: `/glossary/${t.slug}`,
    keywords: [
      `what is ${t.term.toLowerCase()}`,
      `${t.term.toLowerCase()} meaning`,
      `${t.term.toLowerCase()} loan`,
      "loan glossary",
    ],
  });
}

export default async function TermPage({ params }: PageProps<"/glossary/[term]">) {
  const { term } = await params;
  const t = getTerm(term);
  if (!t) notFound();
  const path = `/glossary/${t.slug}`;
  const related = t.related.map(getTerm).filter(Boolean) as typeof glossary;
  const prods = t.products.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: t.term, description: t.short, path, dateModified: t.updatedAt }),
          definedTermSchema({ term: t.term, definition: t.short, path }),
        ]}
      />
      <PageHero
        crumbs={[
          { name: "Glossary", path: "/glossary" },
          { name: t.term, path },
        ]}
        eyebrow="Glossary"
        title={t.term}
        lede={t.short}
      />
      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="prose-lp max-w-3xl" data-reveal>
            <h2>What it means</h2>
            {t.definition.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {related.length > 0 && (
              <Card className="p-5">
                <p className="eyebrow text-mute">Related terms</p>
                <ul className="mt-3 space-y-2 text-sm">
                  {related.map((r) => (
                    <li key={r.slug}>
                      <Link
                        href={`/glossary/${r.slug}`}
                        className="text-ink-800 hover:text-brass-600 inline-flex items-center gap-1 font-semibold"
                      >
                        {r.term} <ArrowRight className="size-3.5" />
                      </Link>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
            <Card className="p-5">
              <p className="eyebrow text-mute">All terms</p>
              <Link href="/glossary" className="text-brass-600 mt-2 inline-flex items-center gap-1 text-sm font-bold">
                Browse the glossary <ArrowRight className="size-3.5" />
              </Link>
            </Card>
          </aside>
        </div>
        {prods.length > 0 && (
          <div className="mt-16">
            <p className="eyebrow text-mute mb-6">Where it applies</p>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {prods.map((p, i) => (
                <ProductCard key={p.slug} product={p} delay={i * 60} />
              ))}
            </div>
          </div>
        )}
        <LinkPills
          className="mt-12"
          title="More terms"
          links={glossary
            .filter((x) => x.slug !== t.slug)
            .slice(0, 14)
            .map((x) => ({ label: x.term, href: `/glossary/${x.slug}` }))}
        />
      </Section>
      <CtaBand />
    </>
  );
}
