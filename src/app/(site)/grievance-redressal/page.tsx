import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, Card } from "@/components/shared/section";
import { Steps } from "@/components/shared/steps";
import { ContactForm } from "@/components/forms/contact-form";
import { siteConfig } from "@/data/site-config";

const title = "Grievance Redressal";
const description =
  "LoansPartner's complaint process: acknowledgement within 2 working days, resolution within 15, escalation to the lender's grievance officer and the RBI Integrated Ombudsman Scheme.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/grievance-redressal",
  keywords: ["grievance redressal loan", "complaint loan agent", "RBI ombudsman complaint", "DSA complaint"],
});

const steps = [
  {
    name: "Level 1: write to the desk",
    text: `Email ${siteConfig.contact.grievanceEmail} or use the form below with your name, mobile number, the loan or partner reference and what went wrong. We acknowledge within 2 working days and resolve within 15.`,
  },
  {
    name: "Level 2: grievance officer",
    text: "If you are not satisfied with the Level 1 response, reply to the acknowledgement asking for escalation. Our grievance officer reviews the case and responds within a further 10 working days.",
  },
  {
    name: "Level 3: the lender",
    text: "Loan terms, disbursal, servicing and recovery are the lender's responsibility. Every lender publishes a grievance officer and a nodal officer on its website, and is accountable under RBI directions for its agents' conduct, including ours. We help you route the complaint.",
  },
  {
    name: "Level 4: RBI Integrated Ombudsman",
    text: "If a complaint against a bank, NBFC or HFC is not resolved within 30 days, you can file with the RBI's Integrated Ombudsman Scheme at cms.rbi.org.in or by calling 14448. The scheme is free.",
  },
];

export default function GrievancePage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, path: "/grievance-redressal" })} />
      <PageHero
        crumbs={[{ name: "Grievance redressal", path: "/grievance-redressal" }]}
        eyebrow="Grievance redressal"
        title="If something went wrong, this is how it gets fixed."
        lede="Complaints about our advice, conduct, data handling or partner behaviour come to us first. Complaints about the loan itself go to the lender, and we help you get there."
      />
      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Steps steps={steps} />
            <Card className="mt-8 p-6">
              <p className="text-ink-900 font-bold">Fraud in our name</p>
              <p className="text-mute mt-2 text-sm">
                If anyone has asked you for money claiming to represent LoansPartner, do not pay. Report it to us at{" "}
                {siteConfig.contact.grievanceEmail} and to the national cybercrime helpline 1930 or cybercrime.gov.in.{" "}
                {siteConfig.compliance.feeDisclosure}
              </p>
            </Card>
          </div>
          <Card className="p-6 sm:p-8 lg:sticky lg:top-28 lg:self-start">
            <p className="font-display text-2xl">Raise a complaint</p>
            <p className="text-mute mt-1 text-sm">Acknowledged within 2 working days.</p>
            <div className="mt-6">
              <ContactForm defaultSubject="grievance" />
            </div>
          </Card>
        </div>
      </Section>
    </>
  );
}
