import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { webPageSchema } from "@/lib/schema";
import { Section, Card } from "@/components/shared/section";
import { ApplyForm } from "@/components/forms/apply-form";
import { TrustNotes } from "@/components/shared/trust-notes";
import { Steps } from "@/components/shared/steps";
import { siteConfig } from "@/data/site-config";
import { cityOptions, productOptions } from "@/data/lite";

const title = "Check Your Loan Eligibility: Free Pre-screen";
const description =
  "Share your loan requirement in two minutes. LoansPartner pre-screens your profile against lender policies without a bureau enquiry and calls with a shortlist. Zero fee.";

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/apply",
  keywords: ["check loan eligibility", "apply for loan online", "loan pre approval", "loan application India"],
});

const next = [
  { name: "We pre-screen", text: "Your details are checked against current lender policies. No bureau enquiry." },
  {
    name: "We call",
    text: "Within one working day, with a shortlist of lenders, indicative rates and the documents to keep ready.",
  },
  { name: "You choose", text: "One application to the lender you pick. We handle the file through to disbursal." },
];

export default function ApplyPage() {
  return (
    <>
      <JsonLd data={webPageSchema({ name: title, description, path: "/apply" })} />
      <Section tone="paper" className="!pt-10">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
          <div>
            <p className="eyebrow text-brass-600">Free eligibility check</p>
            <h1 className="display text-ink-950 mt-3 text-4xl sm:text-5xl">Tell us what you need.</h1>
            <p className="text-mute mt-4 text-lg">
              Two minutes. No documents yet, no fee, no impact on your credit score.
            </p>
            <Card className="mt-8 p-6 sm:p-8">
              <Suspense fallback={<div className="bg-sand h-96 animate-pulse" />}>
                <ApplyForm products={productOptions} cities={cityOptions} />
              </Suspense>
            </Card>
          </div>
          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <Card className="p-6">
              <p className="eyebrow text-mute">What happens next</p>
              <div className="mt-4">
                <Steps steps={next} />
              </div>
            </Card>
            <Card className="bg-ink-900 p-6 text-white">
              <p className="eyebrow text-brass-400">Prefer to call?</p>
              <p className="mt-2 text-sm text-white/75">
                <a
                  href={`tel:${siteConfig.contact.phone}`}
                  className="font-bold text-white underline underline-offset-4"
                >
                  {siteConfig.contact.phoneDisplay}
                </a>
                , {siteConfig.contact.hours}.
              </p>
              <p className="mt-3 text-xs text-white/55">{siteConfig.compliance.feeDisclosure}</p>
            </Card>
          </aside>
        </div>
        <TrustNotes className="mt-14" />
      </Section>
    </>
  );
}
