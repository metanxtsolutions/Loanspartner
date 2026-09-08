import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/tool-page";
import { DsaIncomeCalculator } from "@/components/tools/dsa-income-calculator";
import { productOptions } from "@/data/lite";

const name = "DSA Income Calculator";
const path = "/tools/dsa-income-calculator";
const description = "Model your monthly and annual income as a loan DSA channel partner: files per month, average ticket size and payout percentage by product, using indicative 2026 slabs.";

export const metadata: Metadata = pageMetadata({ title: "DSA Income Calculator for Loan Agents", description, path, keywords: ["DSA income calculator", "loan agent income calculator", "DSA commission calculator", "how much do loan DSAs earn", "DSA earnings estimate"] });

const faqs = [
  { question: "Are the payout percentages accurate?", answer: "They are mid-points of indicative 2026 ranges for LoansPartner channel partners. Your agreement states your slab per product, which depends on volume and whether you or our desk processes files. Edit the percentage column to model your own slab." },
  { question: "Is this gross or net income?", answer: "Gross. TDS is deducted under Section 194H, GST applies if you are registered, and clawbacks apply if a loan closes or defaults within the lender's window." },
  { question: "How many files does a typical partner close?", answer: "Part-time referrers close two to four a month; full-time partners with a network close ten or more. Home loans and loans against property take longer per file but pay far more per file." },
  { question: "When would I receive the money?", answer: "Monthly, for loans disbursed in the previous month, after the lender pays us. Expect 30 to 60 days from disbursal to credit." },
];

export default function Page() {
  return (
    <ToolPage
      name={name}
      path={path}
      title="DSA income calculator"
      lede="Enter how many files you expect to close each month, the average ticket and your payout slab for each product. The table totals your estimated gross monthly and annual payout."
      description={description}
      calculator={<DsaIncomeCalculator products={productOptions} />}
      explainer={
        <>
          <h2>How partner payouts work</h2>
          <p>Lenders pay a percentage of every disbursed loan to the empanelled distributor. As a LoansPartner channel partner you receive your slab of that payout for every file you source, with our credit desk handling lender selection, documentation and follow-up.</p>
          <p>Unsecured products such as personal and business loans pay the highest percentages, 1.5% to 3%, on tickets of a few lakh to a few tens of lakh. Home loans and loans against property pay 0.4% to 1.25% on tickets that often run to a crore or more, so one file can equal a month of personal loans.</p>
          <h3>Modelling realistically</h3>
          <ul>
            <li>Start with the products your network actually needs, not every product.</li>
            <li>Use average tickets you have seen, not aspirational ones.</li>
            <li>Remember conversion: not every lead disburses. Model disbursed files, not enquiries.</li>
          </ul>
        </>
      }
      faqs={faqs}
      cta={{ title: "Ready to make these numbers real?", lede: "Register free. A partner manager calls within one working day.", primary: { label: "Register as a partner", href: "/partner/register" } }}
    />
  );
}
