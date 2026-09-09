import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { LegalPage } from "@/components/shared/legal-page";
import { siteConfig } from "@/data/site-config";

const title = "Privacy Policy";
const description =
  "How LoansPartner collects, uses, shares and protects personal data under the Digital Personal Data Protection Act, 2023, including sharing with lenders you choose to apply to.";
export const metadata: Metadata = pageMetadata({ title, description, path: "/privacy-policy" });

export default function Page() {
  const c = siteConfig.contact;
  return (
    <LegalPage title={title} description={description} path="/privacy-policy" updated="2026-09-01">
      <p>
        {siteConfig.legalName} (&ldquo;LoansPartner&rdquo;, &ldquo;we&rdquo;) is a loan advisory and distribution
        partner. This policy explains what personal data we collect, why, who we share it with and the rights you have
        under the Digital Personal Data Protection Act, 2023 and its rules as they come into force.
      </p>
      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Enquiry data:</strong> name, mobile number, email, city, loan product and amount, employment type,
          income and existing obligations, credit score band as stated by you.
        </li>
        <li>
          <strong>Application data:</strong> when you choose to apply to a lender through us, identity and address
          documents, income and banking documents, and property or asset documents required by that lender.
        </li>
        <li>
          <strong>Partner data:</strong> for channel partner applicants, identity, contact, professional and bank
          details.
        </li>
        <li>
          <strong>Technical data:</strong> IP address, device and browser information, and pages visited, collected
          through standard server logs and, where enabled, Google Analytics with IP anonymisation.
        </li>
      </ul>
      <h2>Why we use it</h2>
      <ul>
        <li>To pre-screen your requirement against lender policies and contact you about it.</li>
        <li>To prepare and submit your application to the lender you select, and to follow it through to disbursal.</li>
        <li>To onboard, train and pay channel partners.</li>
        <li>To respond to complaints, meet legal obligations and prevent fraud.</li>
        <li>To improve the website. Analytics data is aggregated and not used to identify you.</li>
      </ul>
      <h2>Who we share it with</h2>
      <p>
        We share application data only with the bank, housing finance company or NBFC you choose to apply to, and only
        the documents that lender requires. We do not sell personal data, and we do not share it with other lenders,
        marketers or data brokers. Service providers that host our systems or deliver notifications process data on our
        instructions under contract.
      </p>
      <h2>Consent and withdrawal</h2>
      <p>
        We rely on your consent, given when you submit a form, to contact you and to process your enquiry. You can
        withdraw consent at any time by writing to {c.email}; we will stop processing except where a lender application
        is already in progress or the law requires retention.
      </p>
      <h2>Retention</h2>
      <p>
        Enquiry data is kept for 12 months from your last interaction. Application data is kept for the period required
        by the lender and applicable law, typically up to 8 years for disbursed loans, and deleted or anonymised
        thereafter. You may request earlier deletion once your application is closed.
      </p>
      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or erasure of your personal data, nominate a person to exercise your
        rights, and raise a grievance. Write to {c.grievanceEmail}. We respond within 15 working days. If unresolved,
        you may approach the Data Protection Board of India.
      </p>
      <h2>Security</h2>
      <p>
        Data is transmitted over encrypted connections and stored in access-controlled systems. Partners upload
        documents through the partner portal, not messaging apps. We train staff and partners on data handling and
        investigate any suspected breach; where required, we notify you and the Data Protection Board.
      </p>
      <h2>Cookies and analytics</h2>
      <p>
        The website uses only functional cookies needed for forms and, where enabled, Google Analytics for aggregated
        usage statistics. We do not use advertising cookies. You can block cookies in your browser without affecting the
        forms.
      </p>
      <h2>Children</h2>
      <p>
        Our services are for adults. We do not knowingly collect data from anyone under 18, except as a student
        applicant on an education loan with a parent or guardian as co-applicant.
      </p>
      <h2>Changes and contact</h2>
      <p>
        We update this policy when our practices or the law change and show the date above. Questions: {c.email}.
        Grievances: {c.grievanceEmail}.
      </p>
    </LegalPage>
  );
}
