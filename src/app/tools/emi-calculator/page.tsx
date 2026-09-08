import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { ToolPage } from "@/components/tools/tool-page";
import { EmiCalculator } from "@/components/tools/emi-calculator";

const name = "EMI Calculator";
const path = "/tools/emi-calculator";
const description = "Free EMI calculator for personal, home, business and car loans. See your monthly instalment, total interest, principal split and a year-wise repayment schedule using the reducing-balance formula lenders use.";

export const metadata: Metadata = pageMetadata({ title: "EMI Calculator: Monthly Instalment, Interest and Amortisation Schedule", description, path, keywords: ["EMI calculator", "loan EMI calculator", "home loan EMI calculator", "personal loan EMI calculator", "car loan EMI calculator", "EMI formula"] });

const faqs = [
  { question: "How is EMI calculated?", answer: "EMI = P × r × (1 + r)^n ÷ ((1 + r)^n − 1), where P is the loan amount, r the monthly interest rate (annual rate ÷ 12 ÷ 100) and n the number of months. This is the reducing-balance method used by all banks and NBFCs." },
  { question: "Why is most of my early EMI interest?", answer: "Interest is charged on the outstanding balance, which is highest at the start. As the balance falls, the interest part of each EMI shrinks and the principal part grows. The schedule shows this year by year." },
  { question: "Does a longer tenure always cost more?", answer: "Yes, in total interest, because you borrow for longer. It lowers the monthly EMI, which is why lenders offer it. Choose the shortest tenure you can comfortably afford and prepay when you can." },
  { question: "Are processing fees included?", answer: "No. The calculator shows interest cost only. Fees are disclosed in the lender's Key Fact Statement and included in its APR figure." },
];

export default function Page() {
  return (
    <ToolPage
      name={name}
      path={path}
      title="EMI calculator"
      lede="Set the amount, rate and tenure. The EMI, total interest and year-wise schedule update instantly."
      description={description}
      calculator={<EmiCalculator />}
      explainer={
        <>
          <h2>How to use the EMI calculator</h2>
          <p>Enter the loan amount you expect, the annual interest rate quoted (or the indicative rate from the product page) and the tenure in months. The result is the fixed monthly instalment on a reducing-balance basis, the same method every bank and NBFC uses.</p>
          <h3>What to compare</h3>
          <ul>
            <li><strong>Total interest</strong> is what the loan actually costs you. Halving the tenure often cuts it by more than half.</li>
            <li><strong>Principal share</strong> shows how much of your total outgo repays the loan versus pays for it.</li>
            <li><strong>The schedule</strong> tells you the outstanding balance at any year, useful for planning a prepayment or a balance transfer.</li>
          </ul>
          <h3>Rates to try</h3>
          <p>Personal loans currently run from about 10.25% to 24% p.a., home loans from 7.35% to 9.5%, business loans from 14% to 24%, loans against property from 8.75% to 12.5% and car loans from 8.5% to 12.5%. Our interest rates page keeps these ranges current.</p>
        </>
      }
      faqs={faqs}
    />
  );
}
