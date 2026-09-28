import type { Faq } from "@/data/products";
import { globalFaqs } from "@/data/faqs";

/**
 * Content for the borrower hub at /borrowers. Every statement here restates
 * something the site already publishes: product eligibility and documents in
 * products.ts, the apply flow, the contact and grievance pages, and what the
 * customer dashboard actually does. Nothing is asserted that the business has
 * not already asserted elsewhere.
 */

export const borrowersUpdatedAt = "2026-09-25";

/**
 * The borrower journey. Rendered on the home page and on /borrowers from this
 * one array so the two descriptions cannot drift apart.
 */
export const borrowerSteps = [
  {
    name: "Tell us what you need",
    text: "Loan type, amount and a little about your income. Two minutes, no documents yet.",
  },
  {
    name: "We pre-screen without a bureau hit",
    text: "Our credit desk checks your profile against current lender policies and calls with a shortlist and indicative rates.",
  },
  {
    name: "One complete file to the right lender",
    text: "We collect documents digitally and submit a file that answers the underwriter's questions before they ask.",
  },
  {
    name: "Sanction, KFS, disbursal",
    text: "You review the Key Fact Statement, sign, and funds land. We stay on call for everything after.",
  },
];

export type BorrowerSegment = {
  slug: string;
  name: string;
  text: string;
  /** Product slugs from products.ts, in the order they usually matter for this borrower. */
  products: string[];
};

/**
 * The three borrower types named in the organisation description. The wording
 * comes from the eligibility and document rules on the product pages.
 */
export const borrowerSegments: BorrowerSegment[] = [
  {
    slug: "salaried",
    name: "Salaried professionals",
    text: "Your employer, salary account and bureau history set your pricing. We match that profile to the lenders whose policy prices it best, so you apply once instead of collecting hard enquiries.",
    products: ["personal-loan", "home-loan", "home-loan-balance-transfer", "car-loan", "education-loan"],
  },
  {
    slug: "self-employed",
    name: "Self-employed and professionals",
    text: "Doctors, chartered accountants, consultants and business owners are assessed on ITRs, bank statements and continuity of practice. We present that income the way underwriters read it.",
    products: ["professional-loan", "business-loan", "loan-against-property", "home-loan", "personal-loan"],
  },
  {
    slug: "businesses",
    name: "Businesses and MSMEs",
    text: "Proprietorships, partnerships, LLPs and companies borrowing for working capital, growth or equipment. Our desk has ex-SME bankers who know what each lender's credit team looks for.",
    products: ["business-loan", "working-capital-loan", "machinery-loan", "loan-against-property"],
  },
];

/** Global FAQs are looked up by their opening words, so a reworded question drops out rather than misfiling. */
const pick = (starts: string[]): Faq[] =>
  starts.map((s) => globalFaqs.find((f) => f.question.startsWith(s))).filter((f): f is Faq => Boolean(f));

export const borrowerFaqs: Faq[] = [
  {
    question: "Who can use LoansPartner?",
    answer:
      "Salaried professionals, self-employed individuals and professionals, and businesses across India who want a loan from a regulated bank, housing finance company or NBFC. Each product page lists the age, income, employment and credit score its lenders look for. If you are unsure where you stand, share your details and our credit desk tells you before any application is made.",
  },
  {
    question: "How do I get started?",
    answer:
      "Fill the two-minute eligibility form with the loan type, amount and your mobile number. No documents are needed at that stage. Our credit desk pre-screens your profile against current lender policies without a bureau enquiry and calls within one working day with a lender shortlist, indicative rates and the documents to keep ready. You can also call or WhatsApp the desk directly during working hours.",
  },
  ...pick(["Do you charge borrowers any fee", "Does a pre-screen affect my credit score", "How fast can I get a loan"]),
  {
    question: "Can I track my loan application online?",
    answer:
      "Yes. Create a free account to see the status of each application, upload the documents a lender asks for and receive notifications as your file moves. Your credit manager stays reachable by phone and WhatsApp during working hours, whether or not you use the account.",
  },
  ...pick(["What if my credit score is low", "How do I know the loan terms are what you promised"]),
  {
    question: "What support do I get after the loan is disbursed?",
    answer:
      "The same desk stays on call. Typical requests after disbursal are EMI and mandate queries, rate resets on floating-rate loans, top-ups and balance transfers, and foreclosure. If something goes wrong, our grievance process acknowledges a complaint within 2 working days and aims to resolve it within 15, with escalation to the lender's grievance officer and the RBI Integrated Ombudsman Scheme after that.",
  },
  ...pick(["How do you protect my data"]),
];
