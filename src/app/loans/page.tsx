import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { itemListSchema, webPageSchema, faqPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader } from "@/components/shared/section";
import { ProductCard } from "@/components/shared/product-card";
import { TrustNotes } from "@/components/shared/trust-notes";
import { FaqList } from "@/components/shared/faq";
import { CtaBand } from "@/components/shared/cta-band";
import { products, productCategories } from "@/data/products";
import { cities } from "@/data/cities";
import { globalFaqs } from "@/data/faqs";
import { formatINR } from "@/lib/utils";

const title = "Loan Products in India";
const description = "Compare 12 loan products from banks and NBFCs on our panel with LoansPartner: personal loans from 10.25%, home loans from 7.35%, business loans, loan against property, car and education loans. Zero fee to borrowers.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/loans", keywords: ["loan products India", "types of loans", "compare loans", "personal loan", "home loan", "business loan", "loan against property"] });

const faqs = [globalFaqs[2], globalFaqs[3], globalFaqs[4], globalFaqs[6]];

export default function LoansHubPage() {
  return (
    <>
      <JsonLd data={[
        webPageSchema({ name: title, description, path: "/loans", type: "CollectionPage" }),
        itemListSchema({ name: "Loan products", path: "/loans", items: products.map((p) => ({ name: p.name, path: `/loans/${p.slug}` })) }),
        faqPageSchema(faqs),
      ]} />
      <PageHero
        crumbs={[{ name: "Loans", path: "/loans" }]}
        eyebrow="Loan products"
        title={<>Every major loan product, arranged by people who know which lender wants your file.</>}
        lede="Indicative rates below are the lowest in each product's range across our panel. Your rate depends on the lender and your profile; we tell you where you stand before any application."
      />
      {productCategories.map((cat, ci) => {
        const list = products.filter((p) => p.category === cat.key);
        return (
          <Section key={cat.key} tone={ci % 2 === 0 ? "cream" : "paper"} className="!py-12 lg:!py-16">
            <SectionHeader eyebrow={cat.label} title={cat.blurb} className="max-w-xl" />
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((p, i) => (<ProductCard key={p.slug} product={p} delay={i * 70} />))}
            </div>
          </Section>
        );
      })}
      <Section tone="ink" className="!py-14">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <caption className="pb-4 text-left font-display text-2xl text-white">At a glance</caption>
            <thead className="text-left text-xs uppercase tracking-wide text-white/50">
              <tr><th scope="col" className="py-2 pr-4 font-bold">Product</th><th scope="col" className="py-2 pr-4 font-bold">Indicative rate</th><th scope="col" className="py-2 pr-4 font-bold">Amount</th><th scope="col" className="py-2 pr-4 font-bold">Max tenure</th><th scope="col" className="py-2 font-bold">Processing fee</th></tr>
            </thead>
            <tbody className="tnum">
              {products.map((p) => (
                <tr key={p.slug} className="border-t border-white/10">
                  <th scope="row" className="py-3 pr-4 text-left font-bold text-white"><Link href={`/loans/${p.slug}`} className="hover:text-verdant-400">{p.name}</Link></th>
                  <td className="py-3 pr-4 text-white/80">{p.rate.from.toFixed(2)}% to {p.rate.to.toFixed(2)}%</td>
                  <td className="py-3 pr-4 text-white/80">₹{formatINR(p.amount.min, { compact: true })} to ₹{formatINR(p.amount.max, { compact: true })}</td>
                  <td className="py-3 pr-4 text-white/80">{Math.round(p.tenure.maxMonths / 12)} years</td>
                  <td className="py-3 text-white/60">{p.processingFee.split(";")[0].split(",")[0]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>
      <Section tone="paper">
        <SectionHeader eyebrow="Loans by city" title="City desks for the markets we know best." lede="Property rules, employer categories and lender appetite differ by city. Each city page explains what changes locally." />
        <ul className="mt-8 flex flex-wrap gap-2">
          {cities.map((c) => (<li key={c.slug}><Link href={`/cities/${c.slug}`} className="inline-flex items-center gap-1 rounded-full border border-line bg-white px-3.5 py-1.5 text-[13px] font-semibold text-ink-800 hover:border-verdant-500 hover:text-verdant-700">Loans in {c.name}</Link></li>))}
          <li><Link href="/cities" className="inline-flex items-center gap-1 rounded-full bg-ink-900 px-3.5 py-1.5 text-[13px] font-semibold text-white">All cities <ArrowRight className="size-3.5" /></Link></li>
        </ul>
        <TrustNotes className="mt-12" />
      </Section>
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="Questions" title="Before you choose a product." />
          <FaqList faqs={faqs} />
        </div>
      </Section>
      <CtaBand />
    </>
  );
}
