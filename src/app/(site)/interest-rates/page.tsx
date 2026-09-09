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
import { policyRates, repoRateLabel } from "@/data/policy-rates";

const asOf = "2026-09-01";
const title = `Loan Interest Rates in India, ${policyRates.asOfLabel}`;
const description = `Indicative interest rate ranges, processing fees, amounts and tenures for 12 loan products across banks and NBFCs, updated monthly by the LoansPartner credit desk. Repo rate ${repoRateLabel}.`;

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/interest-rates",
  keywords: [
    "loan interest rates 2026",
    "personal loan interest rate",
    "home loan interest rate",
    "business loan interest rate",
    "loan against property interest rate",
    "car loan interest rate",
    "current loan rates India",
  ],
});

const faqs = [
  {
    question: "Why is there a range rather than one rate?",
    answer:
      "Lenders price each borrower on credit score, income type, employer or business category, loan size and, for secured loans, the asset. The low end of each range goes to the strongest profiles at the most competitive lenders; the high end to thinner profiles at NBFCs. We tell you where your profile falls before you apply.",
  },
  {
    question: "What is the repo rate now and how does it affect my loan?",
    answer: `The RBI repo rate is ${repoRateLabel} as of ${policyRates.asOfLabel}. Floating-rate home loans and loans against property from banks are linked to it plus a fixed spread, so they move when the RBI moves. Personal, business and car loans are usually fixed-rate and are influenced by the repo rate only at sanction.`,
  },
  {
    question: "Are these the rates I will get?",
    answer:
      "No. They are indicative ranges across our panel to help you plan. Your actual rate is stated in the lender's sanction letter and Key Fact Statement, which is the only figure that binds.",
  },
  {
    question: "How often is this page updated?",
    answer: "Monthly, and whenever the RBI changes the repo rate or a major lender changes pricing materially.",
  },
];

export default function RatesPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: title, description, path: "/interest-rates", dateModified: asOf }),
          faqPageSchema(faqs),
        ]}
      />
      <PageHero
        crumbs={[{ name: "Interest rates", path: "/interest-rates" }]}
        eyebrow={`Indicative rates as of ${readableDate(asOf)}`}
        title={`Loan interest rates in India, ${policyRates.asOfLabel}`}
        lede="Ranges across public sector banks, private banks, housing finance companies and NBFCs on our panel. Where your rate lands inside a range depends on your profile; we tell you before you apply."
      />
      <Section tone="cream">
        <div className="rounded-card border-line shadow-soft overflow-x-auto border bg-white" data-reveal>
          <table className="w-full min-w-[860px] text-sm">
            <caption className="sr-only">
              Indicative interest rate, amount, tenure and processing fee for each loan product
            </caption>
            <thead className="bg-cream text-mute text-left text-xs tracking-wide uppercase">
              <tr>
                <th scope="col" className="px-5 py-3 font-bold">
                  Product
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Interest rate (p.a.)
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Loan amount
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Tenure
                </th>
                <th scope="col" className="px-5 py-3 font-bold">
                  Processing fee
                </th>
              </tr>
            </thead>
            <tbody className="tnum">
              {products.map((p) => (
                <tr key={p.slug} className="border-line border-t align-top">
                  <th scope="row" className="px-5 py-4 text-left">
                    <Link href={`/loans/${p.slug}`} className="text-ink-900 hover:text-brass-600 font-bold">
                      {p.name}
                    </Link>
                    <span className="text-mute mt-1 block max-w-xs text-xs font-normal">{p.rate.note}</span>
                  </th>
                  <td className="text-brass-600 px-5 py-4 font-bold">
                    {p.rate.from.toFixed(2)}% to {p.rate.to.toFixed(2)}%
                  </td>
                  <td className="text-ink-800 px-5 py-4">
                    ₹{formatINR(p.amount.min, { compact: true })} to ₹{formatINR(p.amount.max, { compact: true })}
                  </td>
                  <td className="text-ink-800 px-5 py-4">
                    {p.tenure.minMonths >= 12
                      ? `${p.tenure.minMonths / 12} to ${p.tenure.maxMonths / 12} years`
                      : `${p.tenure.minMonths} to ${p.tenure.maxMonths} months`}
                  </td>
                  <td className="text-mute px-5 py-4">{p.processingFee}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="text-mute px-5 py-3 text-xs">{siteConfig.compliance.rateDisclaimer}</p>
        </div>
      </Section>
      <Section tone="paper">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-6">
            <p className="eyebrow text-brass-600">Benchmark</p>
            <p className="font-display mt-2 text-3xl">Repo rate {repoRateLabel}</p>
            <p className="text-mute mt-2 text-sm">
              The benchmark for repo-linked floating-rate loans as of {policyRates.asOfLabel}. Such home loans price at
              the repo rate plus a spread of roughly 2.1% to 2.75%, fixed at sanction. Confirm the current rate on the
              RBI website.
            </p>
          </Card>
          <Card className="p-6">
            <p className="eyebrow text-brass-600">Credit score bands</p>
            <ul className="text-ink-800 mt-3 space-y-1.5 text-sm">
              <li>
                <span className="font-bold">750+</span>: lowest rates, pre-approved offers
              </li>
              <li>
                <span className="font-bold">700 to 749</span>: standard pricing at most lenders
              </li>
              <li>
                <span className="font-bold">650 to 699</span>: fewer lenders, 2% to 6% higher
              </li>
              <li>
                <span className="font-bold">Below 650</span>: secured products advised
              </li>
            </ul>
          </Card>
          <Card className="p-6">
            <p className="eyebrow text-brass-600">Compare APR, not rate</p>
            <p className="text-mute mt-2 text-sm">
              A lower rate with a high processing fee can cost more than a slightly higher rate with none, especially on
              short tenures. The Key Fact Statement shows the APR for every offer.{" "}
              <Link
                href="/guides/how-to-read-a-key-fact-statement"
                className="text-brass-600 font-bold underline underline-offset-4"
              >
                How to read it.
              </Link>
            </p>
          </Card>
        </div>
      </Section>
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQs" title="About these rates" />
          <FaqList faqs={faqs} />
        </div>
      </Section>
      <CtaBand
        title="Find out where your rate lands."
        lede="A free pre-screen against actual lender policies tells you your likely rate and lender before any application."
      />
    </>
  );
}
