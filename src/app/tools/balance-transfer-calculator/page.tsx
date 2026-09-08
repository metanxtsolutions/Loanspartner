import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/tool-page";
import { BalanceTransferCalculator } from "@/components/tools/balance-transfer-calculator";

const name = "Home Loan Balance Transfer Calculator";
const path = "/tools/balance-transfer-calculator";
const description = "Find out whether transferring your home loan to a lower rate saves money after costs. See the new EMI, monthly saving, interest saved, break-even month and the keep-your-EMI option.";

export const metadata: Metadata = pageMetadata({ title: "Home Loan Balance Transfer Calculator", description, path, keywords: ["home loan balance transfer calculator", "balance transfer savings calculator", "should I transfer my home loan", "home loan refinance calculator", "loan transfer break even"] });

const faqs = [
  { question: "What costs should I include?", answer: "Processing fee (often waived in campaigns), legal and technical charges of ₹5,000 to ₹15,000, and stamp duty on the new mortgage deed in states that levy it. There is no foreclosure charge on floating-rate home loans to individuals." },
  { question: "What is the break-even month?", answer: "The number of months of EMI savings needed to recover the transfer costs. A break-even within a year or two, with many years of tenure left, is a clear win." },
  { question: "Should I keep my EMI the same after transferring?", answer: "If you can afford it, yes. Paying the old EMI at the new rate shortens the tenure and saves far more interest than simply lowering the EMI. The calculator shows both." },
  { question: "Can I just ask my current lender for a lower rate?", answer: "Yes. Banks must allow floating-rate borrowers to switch benchmarks or reset spreads for a conversion fee, usually 0.25% to 0.5% of outstanding. Compare that outcome with the transfer result here." },
];

export default function Page() {
  return (
    <ToolPage
      name={name}
      path={path}
      title="Balance transfer calculator"
      lede="Enter your outstanding balance, remaining tenure, current and new rates, and the transfer costs. See whether switching pays, and by how much."
      description={description}
      calculator={<BalanceTransferCalculator />}
      explainer={
        <>
          <h2>Reading the result</h2>
          <p>The calculator compares the interest you would pay over the remaining tenure at your current rate against the same tenure at the new rate, subtracts the transfer costs, and reports the net saving and the month by which the savings recover the costs.</p>
          <p>It also shows a second strategy: keep paying your current EMI at the new rate. Because more of each instalment goes to principal, the loan closes early and the interest saving is larger. Most borrowers who can afford their current EMI should choose this.</p>
          <h3>A simple rule</h3>
          <ul>
            <li>Rate difference of 0.5% or more.</li>
            <li>At least 8 to 10 years of tenure remaining.</li>
            <li>Outstanding balance of ₹25 lakh or more.</li>
          </ul>
          <p>When all three hold, a transfer almost always pays. When they do not, ask your lender to reprice; it takes one form and a small fee.</p>
        </>
      }
      faqs={faqs}
      cta={{ title: "Get real transfer offers.", lede: "Share your current loan details and we will compare offers across the panel, including a top-up if you need one.", primary: { label: "Check transfer offers", href: "/apply?product=home-loan-balance-transfer" } }}
    />
  );
}
