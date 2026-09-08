import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/tool-page";
import { EligibilityCalculator } from "@/components/tools/eligibility-calculator";

const name = "Loan Eligibility Calculator";
const path = "/tools/eligibility-calculator";
const description = "Estimate how much personal, home, business or car loan you can get on your income and existing EMIs. Uses the FOIR method lenders apply, with product-specific rates and tenures.";

export const metadata: Metadata = pageMetadata({ title: "Loan Eligibility Calculator: How Much Can You Borrow on Your Income?", description, path, keywords: ["loan eligibility calculator", "personal loan eligibility calculator", "home loan eligibility calculator", "how much loan can I get", "FOIR calculator"] });

const faqs = [
  { question: "How do lenders calculate loan eligibility?", answer: "They cap your total monthly EMIs, including the new loan, at a share of net income (the FOIR), typically 50% to 65% depending on income level and product. The affordable EMI is converted into a loan amount at the offered rate and tenure. For secured loans, the asset's value caps the amount too." },
  { question: "Why does my bank offer less than this calculator?", answer: "Banks apply their own FOIR caps, may not count part of your income (variable pay, rent), and adjust for credit score and employer category. Some cap the loan at a multiple of monthly income. The calculator shows a representative figure; a pre-screen against actual lender policies gives the precise number." },
  { question: "How can I increase my eligibility?", answer: "Close small loans to reduce existing EMIs, choose a longer tenure, add a co-applicant's income, or improve your credit score so a lender offers a lower rate. Each of these raises the affordable loan amount." },
  { question: "Does this check my credit score?", answer: "No. It uses only the numbers you enter and stores nothing." },
];

export default function Page() {
  return (
    <ToolPage
      name={name}
      path={path}
      title="Loan eligibility calculator"
      lede="Pick a product, enter your income and existing EMIs, and see an indicative eligible amount using the FOIR method lenders use."
      description={description}
      calculator={<EligibilityCalculator />}
      explainer={
        <>
          <h2>How eligibility is estimated</h2>
          <p>Lenders decide the EMI you can afford before they decide the loan amount. The Fixed Obligations to Income Ratio (FOIR) caps your total monthly obligations, existing EMIs plus the new one, at a share of net income. The calculator uses 50% for incomes below ₹50,000, rising to 65% above ₹2 lakh, with a small uplift for home loans and loans against property, which is representative of bank policy in 2026.</p>
          <p>The affordable EMI is then converted into a loan amount at the interest rate and tenure you set, and capped at the product&rsquo;s maximum.</p>
          <h3>What the calculator cannot see</h3>
          <ul>
            <li>Your credit score and report, which decide whether a lender says yes and at what rate.</li>
            <li>Your employer or business category, which moves rates by 1% to 2%.</li>
            <li>For secured loans, the value of the property, vehicle or gold, which sets a separate ceiling.</li>
          </ul>
          <p>A free pre-screen with our credit desk applies actual lender policies to your profile without a bureau enquiry.</p>
        </>
      }
      faqs={faqs}
    />
  );
}
