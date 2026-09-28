import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Calculator,
  Landmark,
  LayoutDashboard,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ScanSearch,
  ShieldCheck,
} from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { faqPageSchema, howToSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader, Card } from "@/components/shared/section";
import { ProofStrip } from "@/components/shared/proof-strip";
import { Steps } from "@/components/shared/steps";
import { TrustNotes } from "@/components/shared/trust-notes";
import { FaqList } from "@/components/shared/faq";
import { CtaBand } from "@/components/shared/cta-band";
import { ButtonLink } from "@/components/shared/button";
import { ProductIcon } from "@/components/shared/product-icon";
import { HeroForm } from "@/components/forms/hero-form";
import { borrowerFaqs, borrowerSegments, borrowerSteps, borrowersUpdatedAt } from "@/data/borrowers";
import { getProduct, products } from "@/data/products";
import { cities } from "@/data/cities";
import { formattedAddress, siteConfig, whatsappUrl } from "@/data/site-config";
import { productOptions } from "@/data/lite";

const title = "For Borrowers: How LoansPartner Works";
const description = `How borrowers use LoansPartner: compare ${products.length} loan products from banks and NBFCs, check eligibility with no bureau enquiry, track your application. Zero fee.`;

export const metadata: Metadata = pageMetadata({
  title,
  description,
  path: "/borrowers",
  keywords: [
    "loan advisory for borrowers",
    "how to get a loan through LoansPartner",
    "check loan eligibility free",
    "compare loans India",
    "loan help for salaried professionals",
    "loan help for self-employed",
    "business loan advisory India",
  ],
});

const capabilities = [
  {
    icon: Landmark,
    title: `Compare ${products.length} loan products`,
    text: "Indicative rates, amounts, tenures, fees, eligibility and documents for every product on our panel.",
    href: "/loans",
  },
  {
    icon: ScanSearch,
    title: "Check eligibility without a bureau enquiry",
    text: "A two-minute form, then a call back within one working day with a lender shortlist and indicative rates.",
    href: "/apply",
  },
  {
    icon: Calculator,
    title: "Run the numbers",
    text: "EMI, eligibility and balance transfer calculators using the same reducing-balance arithmetic lenders use.",
    href: "/tools",
  },
  {
    icon: MapPin,
    title: `Get local guidance in ${cities.length} cities`,
    text: "Property rules, employer lists and lender appetite differ by city. Our city desks know what changes locally.",
    href: "/cities",
  },
  {
    icon: BookOpen,
    title: "Read before you sign",
    text: "Plain-language guides and a glossary, reviewed by our credit desk, on eligibility, credit scores, balance transfers and loan fraud.",
    href: "/guides",
  },
  {
    icon: LayoutDashboard,
    title: "Track your application online",
    text: "Create a free account to see each application's status, upload requested documents and get notifications.",
    href: "/register",
  },
];

export default function BorrowersPage() {
  return (
    <>
      <JsonLd
        data={[
          webPageSchema({ name: title, description, path: "/borrowers", dateModified: borrowersUpdatedAt }),
          howToSchema({
            name: "How to get a loan through LoansPartner",
            description:
              "Share your requirement, get pre-screened without a bureau enquiry, submit one complete file to the right lender, and review the Key Fact Statement before disbursal.",
            path: "/borrowers",
            steps: borrowerSteps,
          }),
          faqPageSchema(borrowerFaqs),
        ]}
      />
      <PageHero
        tone="ink"
        crumbs={[{ name: "For borrowers", path: "/borrowers" }]}
        eyebrow="For borrowers"
        title="Borrow once, from the right lender, with a credit desk on your side."
        lede="LoansPartner helps salaried professionals, self-employed individuals and businesses compare loans from banks, housing finance companies and NBFCs, then processes one complete file with the lender most likely to approve on the best terms. You never pay us a fee."
        aside={
          <div className="rounded-panel text-ink-900 shadow-lift bg-white p-6 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="font-display text-2xl">Check your eligibility</p>
              <span className="bg-brass-100 text-brass-600 px-2.5 py-1 text-[11px] font-bold">Free</span>
            </div>
            <p className="text-mute mt-1 text-sm">
              Two minutes. A call back with a lender shortlist within one working day.
            </p>
            <div className="mt-5">
              <HeroForm products={productOptions} source="borrowers" />
            </div>
          </div>
        }
      >
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/apply" variant="light" size="lg">
            Check eligibility <ArrowRight className="size-4" aria-hidden />
          </ButtonLink>
          <ButtonLink href="/loans" variant="outline-light" size="lg">
            Explore loan products
          </ButtonLink>
        </div>
        <p className="mt-5 text-sm text-white/75">
          Already applied?{" "}
          <Link href="/login" className="font-bold text-white underline underline-offset-4">
            Sign in to track your application
          </Link>
          .
        </p>
      </PageHero>

      <Section tone="paper" className="!py-14">
        <ProofStrip />
      </Section>

      <Section tone="cream">
        <SectionHeader
          eyebrow="Who can use LoansPartner"
          title="Salaried, self-employed or running a business: if a regulated lender can fund it, we can arrange it."
          lede="Anyone in India borrowing from a bank, housing finance company or NBFC. Each product page lists the age, income, employment and credit score its lenders look for. If you are not sure where you stand, share your details and the credit desk tells you before any application is made."
        />
        <ul className="mt-10 grid gap-5 lg:grid-cols-3">
          {borrowerSegments.map((seg, i) => (
            <li
              key={seg.slug}
              data-reveal
              data-reveal-delay={(i % 3) * 70}
              className="rounded-card border-line shadow-soft border bg-white p-6"
            >
              <h3 className="font-display text-ink-950 text-xl">{seg.name}</h3>
              <p className="text-mute mt-2 text-sm leading-relaxed">{seg.text}</p>
              <p className="eyebrow text-mute mt-5">Usually starts with</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {seg.products
                  .map(getProduct)
                  .filter((p): p is NonNullable<typeof p> => Boolean(p))
                  .map((p) => (
                    <li key={p.slug}>
                      <Link
                        href={`/loans/${p.slug}`}
                        className="border-line text-ink-800 hover:border-brass-500 hover:text-brass-600 inline-flex items-center gap-1.5 border bg-white px-3 py-1.5 text-[13px] font-semibold"
                      >
                        <ProductIcon icon={p.icon} className="text-brass-600 size-3.5" aria-hidden />
                        {p.name}
                      </Link>
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="paper">
        <SectionHeader
          eyebrow="What you can do here"
          title="Everything a borrower needs before, during and after a loan."
          lede="Compare products and lenders, get pre-screened without touching your credit report, model the EMI, and follow your file through to disbursal. All of it free, none of it obliging you to apply."
        />
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {capabilities.map((c, i) => (
            <li key={c.href} data-reveal data-reveal-delay={(i % 3) * 70}>
              <Link
                href={c.href}
                className="group rounded-card border-line shadow-soft hover:shadow-lift flex h-full flex-col border bg-white p-6 transition-all hover:-translate-y-1"
              >
                <c.icon className="text-brass-600 size-7" aria-hidden />
                <h3 className="font-display text-ink-950 group-hover:text-brass-600 mt-4 text-xl">{c.title}</h3>
                <p className="text-mute mt-2 text-sm leading-relaxed">{c.text}</p>
                <span className="text-brass-600 mt-auto inline-flex items-center gap-1 pt-4 text-sm font-bold">
                  Open <ArrowRight className="size-3.5" aria-hidden />
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </Section>

      <Section tone="cream">
        <div className="grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <SectionHeader
              eyebrow="How it works"
              title="From enquiry to disbursal in four steps, with one person on your side throughout."
              lede="Applying everywhere at once gets you several hard enquiries and the worst rate. Applying once, to the right lender, with a complete file, gets you the best one."
            />
            <ButtonLink href="/apply" className="mt-8">
              Start with a two-minute check <ArrowRight className="size-4" aria-hidden />
            </ButtonLink>
          </div>
          <Steps steps={borrowerSteps} />
        </div>
      </Section>

      <Section tone="paper">
        <SectionHeader
          eyebrow="What it costs you"
          title="Nothing. Lenders pay us after disbursal, and that shapes how we work."
          lede={siteConfig.compliance.feeDisclosure}
        />
        <TrustNotes className="mt-10" />
      </Section>

      <Section tone="cream">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <SectionHeader
              eyebrow="Support"
              title="One credit manager from enquiry to disbursal, and a desk you can reach."
              lede={`You deal with a named credit manager who knows your file. The desk answers by phone, WhatsApp and email, ${siteConfig.contact.hours}, and stays on call after disbursal for EMI, rate reset, top-up and foreclosure questions.`}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <Card className="p-5">
              <p className="text-mute flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <Phone className="text-brass-600 size-4" aria-hidden /> Phone
              </p>
              <a
                href={`tel:${siteConfig.contact.phone}`}
                className="font-display text-ink-950 hover:text-brass-600 mt-2 block text-2xl"
              >
                {siteConfig.contact.phoneDisplay}
              </a>
              <p className="text-mute mt-1 text-xs">{siteConfig.contact.hours}</p>
            </Card>
            <Card className="p-5">
              <p className="text-mute flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <MessageCircle className="text-brass-600 size-4" aria-hidden /> WhatsApp
              </p>
              <a
                href={whatsappUrl("Hi LoansPartner, I would like to check my loan eligibility.")}
                target="_blank"
                rel="noopener noreferrer"
                className="text-ink-900 hover:text-brass-600 mt-2 block font-bold"
              >
                Message the credit desk
              </a>
              <p className="text-mute mt-1 text-xs">Working hours only. We never ask for a fee.</p>
            </Card>
            <Card className="p-5">
              <p className="text-mute flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <Mail className="text-brass-600 size-4" aria-hidden /> Email
              </p>
              <a
                href={`mailto:${siteConfig.contact.email}`}
                className="text-ink-900 hover:text-brass-600 mt-2 block font-bold break-all"
              >
                {siteConfig.contact.email}
              </a>
              <p className="text-mute mt-1 text-xs">{formattedAddress()}</p>
            </Card>
            <Card className="p-5">
              <p className="text-mute flex items-center gap-2 text-xs font-bold tracking-wide uppercase">
                <ShieldCheck className="text-brass-600 size-4" aria-hidden /> Complaints
              </p>
              <Link href="/grievance-redressal" className="text-ink-900 hover:text-brass-600 mt-2 block font-bold">
                Grievance redressal
              </Link>
              <p className="text-mute mt-1 text-xs">Acknowledged within 2 working days, resolved within 15.</p>
            </Card>
            <Card className="bg-ink-900 p-6 text-white sm:col-span-2">
              <p className="eyebrow text-brass-400">Track your application</p>
              <p className="mt-2 text-sm text-white/75">
                A free account shows the status of every application, lets you upload the documents a lender asks for,
                and sends you a notification when your file moves.
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                <ButtonLink href="/register" variant="light" size="sm">
                  Create an account
                </ButtonLink>
                <ButtonLink href="/login" variant="outline-light" size="sm">
                  Sign in
                </ButtonLink>
              </div>
            </Card>
          </div>
        </div>
      </Section>

      <Section tone="paper">
        <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeader
            eyebrow="Questions"
            title="What borrowers ask before they apply."
            lede={
              <>
                More on the{" "}
                <Link href="/faqs" className="text-brass-600 font-bold underline underline-offset-4">
                  FAQ page
                </Link>
                . Looking to distribute loans instead? See the{" "}
                <Link href="/partner" className="text-brass-600 font-bold underline underline-offset-4">
                  partner programme
                </Link>
                .
              </>
            }
          />
          <FaqList faqs={borrowerFaqs} />
        </div>
      </Section>

      <CtaBand
        title="Ready to borrow well?"
        lede="Two minutes to share your requirement. One call from our credit desk with a lender shortlist. No fee, ever."
        primary={{ label: "Check eligibility", href: "/apply" }}
        secondary={{ label: "Browse loan products", href: "/loans" }}
      />
    </>
  );
}
