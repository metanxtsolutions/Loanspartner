import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Section, Card } from "@/components/shared/section";
import { PartnerForm } from "@/components/forms/partner-form";
import { CheckList } from "@/components/shared/checklist";
import { Steps } from "@/components/shared/steps";
import { partnerDocuments, partnerSteps } from "@/data/partner";
import { siteConfig } from "@/data/site-config";

const title = "Register as a Loan DSA Partner: Free Online Application";
const description = "Apply to become a LoansPartner channel partner in two minutes. Free registration, verification within one working day, training and partner code within a week.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/partner/register", keywords: ["DSA registration online", "loan DSA registration", "register as loan agent", "DSA apply online"] });

export default function PartnerRegisterPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, path: "/partner/register" })} />
      <Section tone="paper" className="!pt-8">
        <Breadcrumbs items={[{ name: "Partner programme", path: "/partner" }, { name: "Register", path: "/partner/register" }]} className="mb-8" />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <p className="eyebrow text-verdant-600">Partner application</p>
            <h1 className="display mt-3 text-4xl text-ink-950 sm:text-5xl">Register as a channel partner</h1>
            <p className="mt-4 text-lg text-mute">Free, with no obligation. A partner manager calls within one working day to walk you through the programme.</p>
            <Card className="mt-8 p-6 sm:p-8"><PartnerForm /></Card>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="eyebrow text-mute">What happens next</p>
              <div className="mt-4"><Steps steps={partnerSteps} /></div>
            </Card>
            <Card className="p-6">
              <p className="eyebrow text-mute">Documents for onboarding</p>
              <CheckList items={partnerDocuments} className="mt-4 text-sm" />
            </Card>
            <Card className="bg-ink-900 p-6 text-white">
              <p className="eyebrow text-verdant-400">Questions first?</p>
              <p className="mt-2 text-sm text-white/75">Email <a href={`mailto:${siteConfig.contact.partnerEmail}`} className="font-bold text-white underline underline-offset-4">{siteConfig.contact.partnerEmail}</a> or call <a href={`tel:${siteConfig.contact.phone}`} className="font-bold text-white underline underline-offset-4">{siteConfig.contact.phoneDisplay}</a>, {siteConfig.contact.hours}.</p>
            </Card>
          </aside>
        </div>
      </Section>
    </>
  );
}
