import type { Metadata } from "next";
import Link from "next/link";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card } from "@/components/shared/section";
import { FaqList } from "@/components/shared/faq";
import { CtaBand } from "@/components/shared/cta-band";
import { products } from "@/data/products";
import { siteConfig } from "@/data/site-config";
import { formatINR, readableDate } from "@/lib/utils";

const asOf = "2026-09-01";
const title = "Loan Interest Rates in India, September 2026: Personal, Home, Business, LAP and Car Loans";
const description = "Indicative interest rate ranges, processing fees, amounts and tenures for 12 loan products across banks and NBFCs, updated monthly by the LoansPartner credit desk. Repo rate 5.25%.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/interest-rates", keywords: ["loan interest rates 2026", "personal loan interest rate", "home loan interest rate", "business loan interest rate", "loan against property interest rate", "car loan interest rate", "current loan rates India"] });

const faqs = [
  { question: "Why is there a range rather than one rate?", answer: "Lenders price each borrower on credit score, income type, employer or business category, loan size and, for secured loans, the asset. The low end of each range goes to the strongest profiles at the most competitive lenders; the high end to thinner profiles at NBFCs. We tell you where your profile falls before you apply." },
  { question: "What is the repo rate now and how does it affect my loan?", answer: "The RBI repo rate is 5.25% as of September 2026. Floating-rate home loans and loans against property from banks are linked to it plus a fixed spread, so they move when the RBI moves. Personal, business and car loans are usually fixed-rate and are influenced by the repo rate only at sanction." },
  { question: "Are these the rates I will get?", answer: "No. They are indicative ranges across our panel to help you plan. Your actual rate is stated in the lender's sanction letter and Key Fact Statement, which is the only figure that binds." },
  { question: "How often is this page updated?", answer: "Monthly, and whenever the RBI changes the repo rate or a major lender changes pricing materially." },
];

export default function RatesPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: title, description, path: "/interest-rates", dateModified: asOf }), faqPageSchema(faqs)]} />
      <PageHero crumbs={[{ name: "Interest rates", path: "/interest-rates" }]} eyebrow={`Indicative rates as of ${readableDate(asOf)}`} title="Loan interest rates in India, September 2026" lede="Ranges across public sector banks, private banks, housing finance companies and NBFCs on our panel. Where your rate lands inside a range depends on your profile; we tell you before you apply." />
      <Section tone="cream">
        <div className="overflow-x-auto rounded-card border border-line bg-white shadow-soft" data-reveal>
          <table className="w-full min-w-[860px] text-sm">
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-mute">
              <tr><th className="px-5 py-3 font-bold">Product</th><th className="px-5 py-3 font-bold">Interest rate (p.a.)</th><th className="px-5 py-3 font-bold">Loan amount</th><th className="px-5 py-3 font-bold">Tenure</th><th className="px-5 py-3 font-bold">Processing fee</th></tr>
            </thead>
            <tbody className="tnum">
              {products.map((p) => (
                <tr key={p.slug} className="border-t border-line align-top">
                  <td className="px-5 py-4"><Link href={`/loans/${p.slug}`} className="font-bold text-ink-900 hover:text-verdant-700">{p.name}</Link><span className="mt-1 block max-w-xs text-xs text-mute">{p.rate.note}</span></td>
                  <td className="px-5 py-4 font-bold text-verdant-700">{p.rate.from.toFixed(2)}% to {p.rate.to.toFixed(2)}%</td>
                  <td className="px-5 py-4 text-ink-800">₹{formatINR(p.amount.min, { compact: true })} to ₹{formatINR(p.amount.max, { compact: true })}</td>
                  <td className="px-5 py-4 text-ink-800">{p.tenure.minMonths >= 12 ? `${p.tenure.minMonths / 12} to ${p.tenure.maxMonths / 12} years` : `${p.tenure.minMonths} to ${p.tenure.maxMonths} months`}</td>
                  <td className="px-5 py-4 text-mute">{p.processingFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-mute">{siteConfig.compliance.rateDisclaimer}</p>
        </div>
      </Section>
      <Section tone="paper">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-6"><p className="eyebrow text-verdant-600">Benchmark</p><p className="mt-2 font-display text-3xl">Repo rate 5.25%</p><p className="mt-2 text-sm text-mute">Held by the RBI after the cuts of 2025 and early 2026. Repo-linked home loans price at the repo rate plus a spread of about 2.1% to 2.75%.</p></Card>
          <Card className="p-6"><p className="eyebrow text-verdant-600">Credit score bands</p><ul className="mt-3 space-y-1.5 text-sm text-ink-800"><li><span className="font-bold">750+</span>: lowest rates, pre-approved offers</li><li><span className="font-bold">700 to 749</span>: standard pricing at most lenders</li><li><span className="font-bold">650 to 699</span>: fewer lenders, 2% to 6% higher</li><li><span className="font-bold">Below 650</span>: secured products advised</li></ul></Card>
          <Card className="p-6"><p className="eyebrow text-verdant-600">Compare APR, not rate</p><p className="mt-2 text-sm text-mute">A lower rate with a high processing fee can cost more than a slightly higher rate with none, especially on short tenures. The Key Fact Statement shows the APR for every offer. <Link href="/guides/how-to-read-a-key-fact-statement" className="font-bold text-verdant-700 underline underline-offset-4">How to read it.</Link></p></Card>
        </div>
      </Section>
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQs" title="About these rates" />
          <FaqList faqs={faqs} />
        </div>
      </Section>
      <CtaBand title="Find out where your rate lands." lede="A free pre-screen against actual lender policies tells you your likely rate and lender before any application." />
    </>
  );
}
