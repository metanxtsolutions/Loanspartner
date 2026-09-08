import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/data/site-config";

const title = "Disclaimer";
const description = "Rates, fees, eligibility and calculator outputs on LoansPartner are indicative. Loans are provided by regulated lenders under their own terms. We are a distribution partner, not a lender.";
export const metadata: Metadata = pageMetadata({ title, description, path: "/disclaimer" });

export default function Page() {
  return (
    <LegalPage title={title} description={description} path="/disclaimer" updated="2026-09-01">
      <h2>Indicative information</h2>
      <p>{siteConfig.compliance.rateDisclaimer} Interest rate ranges, processing fees, loan amounts, tenures and eligibility criteria shown on product, city and rate pages are compiled from lender publications and our desk's experience and are updated periodically. They may lag lender changes.</p>
      <h2>Calculators</h2>
      <p>The EMI, eligibility, balance transfer and DSA income calculators use standard formulas and representative assumptions. Their outputs are estimates for planning, not offers. Actual EMIs, eligibility and payouts are determined by the lender or by your partner agreement.</p>
      <h2>Our role</h2>
      <p>{siteConfig.compliance.dsaDisclosure} {siteConfig.compliance.feeDisclosure}</p>
      <h2>No advice</h2>
      <p>Guides and other content are educational and general. They do not account for your circumstances and are not financial, legal, tax or investment advice. Consult a qualified professional for advice specific to you.</p>
      <h2>Lender and third-party names</h2>
      <p>Lender names and marks are used only to identify institutions whose products we distribute or describe. Inclusion on this website does not imply endorsement by the lender of this website's content. Product availability with any lender may change.</p>
      <h2>Partner earnings</h2>
      <p>Payout ranges and examples on partner pages are indicative and illustrative. They are not a promise of income. Actual payouts depend on your agreement, disbursed volumes, clawbacks and taxes.</p>
      <h2>City information</h2>
      <p>Stamp duty, registration charges and local approval requirements described on city pages are summaries that may change. Verify with the relevant state authority before transacting.</p>
    </LegalPage>
  );
}
