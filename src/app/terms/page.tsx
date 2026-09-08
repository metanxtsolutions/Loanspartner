import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/data/site-config";

const title = "Terms of Use";
const description = "Terms governing use of the LoansPartner website and services: our role as a loan distribution partner, no guarantee of approval, borrower obligations, intellectual property and liability.";
export const metadata: Metadata = pageMetadata({ title, description, path: "/terms" });

export default function Page() {
  return (
    <LegalPage title={title} description={description} path="/terms" updated="2026-09-01">
      <p>By using this website or our services you agree to these terms. If you do not agree, please do not use them.</p>
      <h2>Who we are</h2>
      <p>{siteConfig.compliance.dsaDisclosure}</p>
      <h2>What we do and do not do</h2>
      <ul>
        <li>We provide information about loan products, pre-screen your requirement against lender policies, and assist you in applying to a lender you choose.</li>
        <li>We do not lend, approve loans, hold or route loan funds, or guarantee approval, rate, amount or timeline. All decisions rest with the lender.</li>
        <li>Content on this website, including rates, fees, eligibility, calculators and guides, is indicative and educational. It is not financial, legal or tax advice. Read the lender&rsquo;s Key Fact Statement before signing anything.</li>
      </ul>
      <h2>Fees</h2>
      <p>{siteConfig.compliance.feeDisclosure}</p>
      <h2>Your obligations</h2>
      <ul>
        <li>Provide accurate, complete information and genuine documents. Misrepresentation is an offence and will end our engagement.</li>
        <li>Use the website lawfully and do not attempt to disrupt, scrape or reverse-engineer it.</li>
        <li>Keep your own records of what you submit and what the lender issues.</li>
      </ul>
      <h2>Channel partners</h2>
      <p>Partner registration is subject to verification and a separate partner agreement and code of conduct, which prevail over these terms for partner matters.</p>
      <h2>Intellectual property</h2>
      <p>The LoansPartner name, mark, website design, text, calculators and guides are our property or used under licence. You may share links and short quotations with attribution. Lender names and marks belong to their owners and are used to identify their products.</p>
      <h2>Third-party links</h2>
      <p>Links to lender and government websites are provided for convenience. We do not control their content or practices.</p>
      <h2>Liability</h2>
      <p>To the extent permitted by law, we are not liable for any loss arising from reliance on website content, lender decisions, delays, or events outside our control. Nothing in these terms limits liability that cannot be limited by law.</p>
      <h2>Privacy</h2>
      <p>Our handling of personal data is described in the Privacy Policy, which forms part of these terms.</p>
      <h2>Governing law</h2>
      <p>These terms are governed by the laws of India. Courts at {siteConfig.contact.address.locality}, {siteConfig.contact.address.region} have exclusive jurisdiction, without prejudice to your rights under consumer protection law and the RBI&rsquo;s grievance mechanisms.</p>
      <h2>Changes</h2>
      <p>We may update these terms; the date above shows the current version. Continued use after an update means acceptance.</p>
    </LegalPage>
  );
}
