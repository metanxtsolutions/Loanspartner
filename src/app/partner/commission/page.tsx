import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card } from "@/components/shared/section";
import { FaqList } from "@/components/shared/faq";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { products } from "@/data/products";
import { formatINR } from "@/lib/utils";

const title = "Loan DSA Commission Structure 2026";
const description = "Indicative DSA commission slabs for personal loans, home loans, business loans, loan against property, car loans and more. How payouts are calculated, when they are paid, and what affects them.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/partner/commission", keywords: ["DSA commission", "loan DSA commission structure", "DSA payout", "personal loan DSA commission", "home loan DSA commission", "business loan DSA payout"] });

const faqs = [
  { question: "Are these payouts guaranteed?", answer: "They are indicative ranges. Your agreement states your slab per product, which depends on volume, whether you or our desk processes the file, and lender campaigns. Slabs are reviewed quarterly." },
  { question: "When are payouts released?", answer: "Monthly, for all loans disbursed in the previous month, after the lender's payout to us. Expect 30 to 60 days from disbursal to credit, with a statement listing each file." },
  { question: "What is a clawback?", answer: "If a loan is foreclosed or defaults within the lender's clawback window, typically 3 to 6 months, the lender recovers the payout and we recover it from the partner. Referring genuine, well-qualified borrowers avoids this." },
  { question: "Is TDS deducted?", answer: "Yes, under Section 194H. GST applies if you are registered. Statements show gross payout, TDS and net." },
];

function typicalTicket(p: (typeof products)[number]) {
  const m = p.dsa.ticketSize.match(/₹([\d.]+)\s*(lakh|crore)\s*to\s*₹([\d.]+)\s*(lakh|crore)/);
  if (!m) return p.amount.min * 5;
  const toNum = (v: string, u: string) => Number(v) * (u === "crore" ? 1e7 : 1e5);
  return Math.round((toNum(m[1], m[2]) + toNum(m[3], m[4])) / 2);
}

export default function CommissionPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: title, description, path: "/partner/commission" }), faqPageSchema(faqs)]} />
      <PageHero crumbs={[{ name: "Partner programme", path: "/partner" }, { name: "Commission", path: "/partner/commission" }]} eyebrow="Commission structure" title="What you earn, product by product." lede="Payouts are a percentage of the disbursed amount. Unsecured products pay the highest percentage; secured products pay less on much larger amounts. The table shows indicative ranges and what a typical file pays at the mid-point." />
      <Section tone="cream">
        <div className="overflow-x-auto rounded-card border border-line bg-white shadow-soft" data-reveal>
          <table className="w-full min-w-[760px] text-sm">
            <caption className="sr-only">Indicative partner payout, typical ticket size and audience for each loan product</caption>
            <thead className="bg-cream text-left text-xs uppercase tracking-wide text-mute">
              <tr><th scope="col" className="px-5 py-3 font-bold">Product</th><th scope="col" className="px-5 py-3 font-bold">Indicative payout</th><th scope="col" className="px-5 py-3 font-bold">Typical ticket</th><th scope="col" className="px-5 py-3 font-bold">Payout on a typical file</th><th scope="col" className="px-5 py-3 font-bold">Sells to</th></tr>
            </thead>
            <tbody className="tnum">
              {products.map((p) => {
                const ticket = typicalTicket(p);
                const mid = (p.dsa.payoutFrom + p.dsa.payoutTo) / 2;
                return (
                  <tr key={p.slug} className="border-t border-line align-top">
                    <th scope="row" className="px-5 py-4 text-left font-bold text-ink-900"><Link href={`/partner/${p.slug}-dsa`} className="hover:text-verdant-700">{p.name}</Link></th>
                    <td className="px-5 py-4 text-ink-800">{p.dsa.payoutFrom}% to {p.dsa.payoutTo}%</td>
                    <td className="px-5 py-4 text-ink-800">{p.dsa.ticketSize}</td>
                    <td className="px-5 py-4 font-bold text-verdant-700">about ₹{formatINR(Math.round((ticket * mid) / 100 / 500) * 500)}</td>
                    <td className="px-5 py-4 text-mute">{p.dsa.sellsTo[0]}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <p className="px-5 py-3 text-xs text-mute">Indicative, on disbursed amount, before TDS. Payout on a typical file uses the mid-point of the range and the mid-point of the typical ticket.</p>
        </div>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/tools/dsa-income-calculator">Model your income <ArrowRight className="size-4" /></ButtonLink>
          <ButtonLink href="/partner/register" variant="secondary">Register free</ButtonLink>
        </div>
      </Section>
      <Section tone="paper">
        <div className="grid gap-8 lg:grid-cols-3">
          <Card className="p-6"><p className="font-display text-xl">How it is calculated</p><p className="mt-2 text-sm leading-relaxed text-mute">Disbursed amount multiplied by your slab for that product. Staged disbursals pay per tranche. Sanctioned-but-undisbursed amounts do not pay.</p></Card>
          <Card className="p-6"><p className="font-display text-xl">What raises your slab</p><p className="mt-2 text-sm leading-relaxed text-mute">Consistent monthly volume, bringing processing capability, and specialising in a product. Slabs are reviewed every quarter.</p></Card>
          <Card className="p-6"><p className="font-display text-xl">What lowers it</p><p className="mt-2 text-sm leading-relaxed text-mute">Clawbacks on early foreclosure or default, and files with poor documentation that our desk must rebuild. Quality beats quantity.</p></Card>
        </div>
      </Section>
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader eyebrow="FAQs" title="Payout questions" lede={<>More detail in our guide on <Link href="/guides/loan-dsa-commission-structure-explained" className="font-bold text-verdant-700 underline underline-offset-4">how DSA commission works</Link>.</>} />
          <FaqList faqs={faqs} />
        </div>
      </Section>
      <CtaBand title="Ready to earn on every disbursal?" lede="Register free. A partner manager calls within one working day." primary={{ label: "Register as a partner", href: "/partner/register" }} secondary={{ label: "Partner programme", href: "/partner" }} />
    </>
  );
}
