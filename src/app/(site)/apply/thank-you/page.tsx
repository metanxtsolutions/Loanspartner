import type { Metadata } from "next";
import Link from "next/link";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { Section, Card } from "@/components/shared/section";
import { GuideCard } from "@/components/shared/guide-card";
import { featuredGuides } from "@/data/guides";
import { siteConfig, whatsappUrl } from "@/data/site-config";

export const metadata: Metadata = pageMetadata({
  title: "Thank you",
  description: "Your requirement has been received. Our credit desk will call within one working day.",
  path: "/apply/thank-you",
  noindex: true,
});

export default function ThankYouPage() {
  return (
    <Section tone="paper" className="!pt-12">
      <div className="mx-auto max-w-2xl text-center">
        <span className="bg-brass-100 text-brass-600 mx-auto flex size-16 items-center justify-center">
          <CheckCircle2 className="size-8" />
        </span>
        <h1 className="display text-ink-950 mt-6 text-4xl sm:text-5xl">Received. We are on it.</h1>
        <p className="text-mute mt-4 text-lg">
          Our credit desk will pre-screen your profile and call you within one working day with a lender shortlist,
          indicative rates and the documents to keep ready.
        </p>
        <Card className="mt-8 p-6 text-left">
          <p className="text-ink-900 font-bold">In the meantime</p>
          <ul className="text-ink-800 mt-3 space-y-2 text-sm">
            <li>Keep your PAN, Aadhaar, recent bank statements and income proof handy.</li>
            <li>Do not apply elsewhere in parallel; each application adds a hard enquiry to your credit report.</li>
            <li>Remember: we never ask for a fee. Anyone who does is not us.</li>
          </ul>
          <div className="mt-5 flex flex-wrap gap-3">
            <a
              href={whatsappUrl("Hi LoansPartner, I just submitted my loan requirement on your website.")}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-brass-500 hover:bg-brass-400 text-ink-950 inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold"
            >
              Message us on WhatsApp
            </a>
            <a
              href={`tel:${siteConfig.contact.phone}`}
              className="border-line text-ink-900 inline-flex items-center gap-2 border bg-white px-5 py-2.5 text-sm font-bold"
            >
              Call {siteConfig.contact.phoneDisplay}
            </a>
          </div>
        </Card>
      </div>
      <div className="mt-16">
        <p className="eyebrow text-mute mb-6 text-center">While you wait</p>
        <div className="grid gap-5 md:grid-cols-3">
          {featuredGuides.slice(0, 3).map((g, i) => (
            <GuideCard key={g.slug} guide={g} delay={i * 60} />
          ))}
        </div>
        <p className="mt-8 text-center">
          <Link href="/" className="text-brass-600 inline-flex items-center gap-1 text-sm font-bold">
            Back to home <ArrowRight className="size-3.5" />
          </Link>
        </p>
      </div>
    </Section>
  );
}
