import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, ShieldCheck } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { articleSchema, faqPageSchema, webPageSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Section, SectionHeader, Card, Pill } from "@/components/shared/section";
import { FaqList } from "@/components/shared/faq";
import { GuideCard } from "@/components/shared/guide-card";
import { ProductCard } from "@/components/shared/product-card";
import { Toc } from "@/components/shared/toc";
import { CallbackForm } from "@/components/forms/callback-form";
import { CtaBand } from "@/components/shared/cta-band";
import { guides, getGuide } from "@/data/guides";
import { getProduct } from "@/data/products";
import { siteConfig } from "@/data/site-config";
import { readableDate, slugify } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return guides.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: PageProps<"/guides/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) return {};
  return pageMetadata({ title: g.title, description: g.excerpt, path: `/guides/${g.slug}`, keywords: [g.primaryKeyword, ...g.secondaryKeywords], type: "article", publishedTime: g.publishedDate, modifiedTime: g.updatedDate });
}

export default async function GuidePage({ params }: PageProps<"/guides/[slug]">) {
  const { slug } = await params;
  const g = getGuide(slug);
  if (!g) notFound();
  const path = `/guides/${g.slug}`;
  const prods = g.relatedProducts.map(getProduct).filter(Boolean) as NonNullable<ReturnType<typeof getProduct>>[];
  const related = g.relatedGuides.map(getGuide).filter(Boolean) as typeof guides;
  const toc = g.sections.map((s) => ({ id: slugify(s.heading), label: s.heading }));
  const isPartner = g.category === "Partner programme";

  return (
    <>
      <JsonLd data={[
        webPageSchema({ name: g.title, description: g.excerpt, path, dateModified: g.updatedDate }),
        articleSchema({ title: g.title, description: g.excerpt, path, publishedDate: g.publishedDate, updatedDate: g.updatedDate, keywords: [g.primaryKeyword, ...g.secondaryKeywords, ...g.tags], section: g.category }),
        faqPageSchema(g.faqs),
      ]} />
      <article>
        <header className="relative overflow-hidden bg-paper">
          <div className="grid-fade absolute inset-0" aria-hidden />
          <div className="container-x relative pb-12 pt-10 lg:pt-14">
            <Breadcrumbs items={[{ name: "Guides", path: "/guides" }, { name: g.title, path }]} className="mb-8" />
            <div className="max-w-3xl" data-reveal>
              <div className="flex flex-wrap items-center gap-3"><Pill tone="verdant">{g.category}</Pill><span className="flex items-center gap-1 text-xs text-mute"><Clock className="size-3.5" /> {g.readTime}</span></div>
              <h1 className="display mt-5 text-4xl text-ink-950 sm:text-5xl">{g.title}</h1>
              <p className="mt-5 text-lg leading-relaxed text-mute">{g.excerpt}</p>
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-mute">
                <span>Published {readableDate(g.publishedDate)}</span>
                <span>Updated {readableDate(g.updatedDate)}</span>
                <span className="flex items-center gap-1 font-semibold text-ink-800"><ShieldCheck className="size-3.5 text-verdant-600" /> Reviewed by {siteConfig.editorialTeam.reviewer}</span>
              </div>
            </div>
          </div>
        </header>

        <Section tone="cream">
          <div className="grid gap-12 lg:grid-cols-[16rem_minmax(0,1fr)_18rem]">
            <aside className="hidden lg:block lg:sticky lg:top-28 lg:self-start"><Toc items={toc} /></aside>
            <div className="prose-lp min-w-0 max-w-3xl">
              {g.intro.map((p, i) => (<p key={i} className={i === 0 ? "text-[1.15rem] font-medium text-ink-900" : ""}>{p}</p>))}
              {g.sections.map((s) => (
                <section key={s.heading}>
                  <h2 id={slugify(s.heading)}>{s.heading}</h2>
                  {s.body.map((p, i) => (<p key={i}>{p}</p>))}
                  {s.bullets && (<ul>{s.bullets.map((b) => (<li key={b}>{b}</li>))}</ul>)}
                  {s.table && (
                    <div className="overflow-x-auto rounded-xl border border-line bg-white">
                      <table>
                        <thead><tr>{s.table.headers.map((h, i) => (<th key={i}>{h}</th>))}</tr></thead>
                        <tbody>{s.table.rows.map((row, ri) => (<tr key={ri}>{row.map((cell, ci) => (<td key={ci} className={ci === 0 ? "font-semibold text-ink-900" : ""}>{cell}</td>))}</tr>))}</tbody>
                      </table>
                    </div>
                  )}
                </section>
              ))}
              <div className="not-prose mt-12 rounded-panel border border-brass-300/60 bg-brass-50 p-6">
                <p className="eyebrow text-brass-600">Key takeaways</p>
                <ul className="mt-3 space-y-2">{g.keyTakeaways.map((k) => (<li key={k} className="flex gap-3 text-[15px] text-ink-900"><span className="mt-2 size-1.5 shrink-0 rounded-full bg-brass-500" />{k}</li>))}</ul>
              </div>
              <h2 id="faqs">Frequently asked questions</h2>
              <FaqList faqs={g.faqs} />
              <div className="mt-12 flex items-start gap-4 rounded-card border border-line bg-white p-6">
                <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-ink-900 text-white"><ShieldCheck className="size-6" /></span>
                <div>
                  <p className="font-bold text-ink-900">{siteConfig.editorialTeam.name}</p>
                  <p className="mt-1 text-sm text-mute">{siteConfig.editorialTeam.description} Updated whenever lender policy or RBI directions change. <Link href="/about" className="font-bold text-verdant-700 underline underline-offset-4">About us</Link>.</p>
                </div>
              </div>
            </div>
            <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
              <Card className="p-5">
                {isPartner ? (
                  <>
                    <p className="font-display text-xl">Become a partner</p>
                    <p className="mt-1 text-sm text-mute">Free registration, one code for our whole lender panel, processing handled.</p>
                    <Link href="/partner/register" className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-verdant-600 px-5 py-3 text-sm font-bold text-white hover:bg-verdant-700">Register free <ArrowRight className="size-4" /></Link>
                  </>
                ) : (
                  <>
                    <p className="font-display text-xl">Talk to the credit desk</p>
                    <p className="mt-1 text-sm text-mute">Questions about your own situation? We call back within one working day.</p>
                    <div className="mt-4"><CallbackForm source={`guide:${g.slug}`} compact /></div>
                  </>
                )}
              </Card>
              {g.tags.length > 0 && (<div><p className="eyebrow mb-2 text-mute">Topics</p><ul className="flex flex-wrap gap-1.5">{g.tags.map((t) => (<li key={t} className="rounded-full bg-sand px-2.5 py-1 text-[11px] font-bold text-ink-800">{t}</li>))}</ul></div>)}
            </aside>
          </div>
        </Section>

        {(prods.length > 0 || related.length > 0) && (
          <Section tone="paper">
            {prods.length > 0 && (<><SectionHeader eyebrow="Related products" title="Products mentioned in this guide" /><div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{prods.map((p, i) => (<ProductCard key={p.slug} product={p} delay={i * 60} />))}</div></>)}
            {related.length > 0 && (<><SectionHeader eyebrow="Keep reading" title="Related guides" className="mt-16" /><div className="mt-8 grid gap-5 md:grid-cols-3">{related.map((r, i) => (<GuideCard key={r.slug} guide={r} delay={i * 60} />))}</div></>)}
          </Section>
        )}
      </article>
      <CtaBand {...(isPartner ? { title: "Start earning on every disbursal.", lede: "Free registration, one-day verification, training included.", primary: { label: "Register as a partner", href: "/partner/register" }, secondary: { label: "Commission slabs", href: "/partner/commission" } } : {})} />
    </>
  );
}
