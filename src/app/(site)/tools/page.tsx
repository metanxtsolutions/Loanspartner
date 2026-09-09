import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Calculator, Coins, ScanSearch, Sparkles, BookOpen, Percent } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section } from "@/components/shared/section";
import { CtaBand } from "@/components/shared/cta-band";

const title = "Loan Calculators: EMI and Eligibility";
const description =
  "Free calculators from LoansPartner: EMI with amortisation schedule, loan eligibility on your income, home loan balance transfer savings, and DSA income modelling. Plus current indicative rates and a loan glossary.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/tools",
  keywords: [
    "EMI calculator",
    "loan eligibility calculator",
    "home loan balance transfer calculator",
    "DSA income calculator",
    "loan calculator India",
  ],
});

const tools = [
  {
    icon: Calculator,
    label: "EMI calculator",
    href: "/tools/emi-calculator",
    text: "Monthly instalment, total interest and a year-wise schedule for any amount, rate and tenure.",
  },
  {
    icon: ScanSearch,
    label: "Loan eligibility calculator",
    href: "/tools/eligibility-calculator",
    text: "How much you can borrow on your income and existing EMIs, product by product.",
  },
  {
    icon: Sparkles,
    label: "Balance transfer calculator",
    href: "/tools/balance-transfer-calculator",
    text: "Net savings, break-even and the keep-your-EMI option for switching a home loan.",
  },
  {
    icon: Coins,
    label: "DSA income calculator",
    href: "/tools/dsa-income-calculator",
    text: "Model monthly partner payouts from files, ticket sizes and payout slabs.",
  },
  {
    icon: Percent,
    label: "Interest rates",
    href: "/interest-rates",
    text: "Indicative rate ranges, fees and tenures across all twelve products, updated monthly.",
  },
  {
    icon: BookOpen,
    label: "Loan glossary",
    href: "/glossary",
    text: "CIBIL, FOIR, KFS, LTV, EBLR and 30 more terms, in plain language.",
  },
];

export default function ToolsPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: title, description, path: "/tools", type: "CollectionPage" }),
          itemListSchema({
            name: "Loan tools",
            path: "/tools",
            items: tools.map((t) => ({ name: t.label, path: t.href })),
          }),
        ]}
      />
      <PageHero
        crumbs={[{ name: "Tools", path: "/tools" }]}
        eyebrow="Tools"
        title="Run the numbers before anyone runs them for you."
        lede="Every calculator uses the same reducing-balance arithmetic lenders use. They are free, need no sign-up, and store nothing."
      />
      <Section tone="cream">
        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {tools.map((t, i) => (
            <li key={t.href} data-reveal data-reveal-delay={(i % 3) * 70}>
              <Link
                href={t.href}
                className="group rounded-card border-line shadow-soft hover:shadow-lift flex h-full flex-col border bg-white p-6 transition-all hover:-translate-y-1"
              >
                <div className="flex items-start justify-between">
                  <t.icon className="text-brass-600 size-7" />
                  <ArrowUpRight className="text-mute-2 group-hover:text-brass-600 size-5" />
                </div>
                <p className="font-display text-ink-950 group-hover:text-brass-600 mt-5 text-xl">{t.label}</p>
                <p className="text-mute mt-2 text-sm leading-relaxed">{t.text}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Section>
      <CtaBand />
    </>
  );
}
