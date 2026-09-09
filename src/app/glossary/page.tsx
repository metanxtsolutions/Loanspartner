import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { CtaBand } from "@/components/shared/cta-band";
import { glossary } from "@/data/glossary";

const title = "Loan and Credit Glossary";
const description = "Plain-language definitions of the terms you meet on a loan application in India: credit score, FOIR, APR, Key Fact Statement, loan-to-value, repo-linked rates, balance transfer, DSA and more.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/glossary", keywords: ["loan glossary", "loan terms explained", "what is FOIR", "what is KFS", "what is LTV", "loan terminology India"] });

export default function GlossaryPage() {
  const sorted = [...glossary].sort((a, b) => a.term.localeCompare(b.term));
  const groups = new Map<string, typeof glossary>();
  for (const t of sorted) {
    const k = t.term[0].toUpperCase();
    groups.set(k, [...(groups.get(k) ?? []), t]);
  }
  const letters = [...groups.keys()];
  return (
    <>
      <JsonLd data={[webPageSchema({ name: title, description, path: "/glossary", type: "CollectionPage" }), itemListSchema({ name: "Loan glossary", path: "/glossary", items: sorted.map((t) => ({ name: t.term, path: `/glossary/${t.slug}` })) })]} />
      <PageHero crumbs={[{ name: "Glossary", path: "/glossary" }]} eyebrow="Glossary" title="The vocabulary of Indian lending, without the jargon." lede={`${glossary.length} terms, each with a plain definition, what it means for your application and where it applies.`} />
      <Section tone="cream">
        <nav aria-label="Jump to letter" className="flex flex-wrap gap-1.5">{letters.map((l) => (<a key={l} href={`#letter-${l}`} className="flex size-9 items-center justify-center rounded-full border border-line bg-white text-sm font-bold text-ink-800 hover:border-verdant-500 hover:text-verdant-700">{l}</a>))}</nav>
        {letters.map((l) => (
          <div key={l} id={`letter-${l}`} className="mt-12 scroll-mt-28">
            <h2 className="display text-3xl text-brass-500">{l}</h2>
            <ul className="mt-4 grid gap-4 md:grid-cols-2">
              {groups.get(l)!.map((t) => (
                <li key={t.slug}>
                  <Link href={`/glossary/${t.slug}`} className="group block h-full rounded-card border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-verdant-400/60 hover:shadow-soft">
                    <p className="font-display text-xl text-ink-950 group-hover:text-verdant-700">{t.term}</p>
                    <p className="mt-2 text-sm leading-relaxed text-mute">{t.short}</p>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </Section>
      <CtaBand />
    </>
  );
}
