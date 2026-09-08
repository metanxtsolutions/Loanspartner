import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader } from "@/components/shared/section";
import { TrustNotes } from "@/components/shared/trust-notes";
import { CtaBand } from "@/components/shared/cta-band";
import { cities } from "@/data/cities";
import { coreProducts } from "@/data/products";

const title = "Cities We Serve Across India";
const description = "LoansPartner arranges personal, home, business and property loans in Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata, Pune, Ahmedabad and more, with city desks that know local property rules and lender appetite.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/cities", keywords: ["loan in Mumbai", "loan in Delhi", "loan in Bangalore", "loan agent near me", "loan DSA city", "loans by city India"] });

const regions: { key: (typeof cities)[number]["region"]; label: string }[] = [
  { key: "West", label: "West" },
  { key: "North", label: "North" },
  { key: "South", label: "South" },
  { key: "East", label: "East" },
  { key: "Central", label: "Central" },
];

export default function CitiesPage() {
  return (
    <>
      <JsonLd data={[
        webPageSchema({ name: title, description, path: "/cities", type: "CollectionPage" }),
        itemListSchema({ name: "Cities served", path: "/cities", items: cities.map((c) => ({ name: c.name, path: `/cities/${c.slug}` })) }),
      ]} />
      <PageHero crumbs={[{ name: "Cities", path: "/cities" }]} eyebrow="Cities we serve" title="One lender panel. City desks that know what changes locally." lede="Stamp duty, property approvals, employer categories and lender programmes differ from city to city. Each city page explains what that means for your loan, product by product. Borrowers elsewhere in India are served through the same panel." />
      {regions.map((r, ri) => {
        const list = cities.filter((c) => c.region === r.key);
        if (!list.length) return null;
        return (
          <Section key={r.key} tone={ri % 2 === 0 ? "cream" : "paper"} className="!py-12 lg:!py-16">
            <SectionHeader eyebrow={`${r.label} India`} title={list.map((c) => c.name).join(", ")} className="max-w-3xl" />
            <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {list.map((c, i) => (
                <li key={c.slug} data-reveal data-reveal-delay={(i % 3) * 70}>
                  <Link href={`/cities/${c.slug}`} className="group flex h-full flex-col rounded-card border border-line bg-white p-6 shadow-soft transition-all hover:-translate-y-1 hover:shadow-lift">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="font-display text-2xl text-ink-950 group-hover:text-verdant-700">{c.name}</p>
                        <p className="text-xs font-semibold text-mute">{c.state}</p>
                      </div>
                      <ArrowUpRight className="size-5 text-mute-2 group-hover:text-verdant-600" />
                    </div>
                    <p className="mt-3 text-sm leading-relaxed text-mute">{c.tagline}</p>
                    <ul className="mt-4 flex flex-wrap gap-1.5">
                      {coreProducts.map((p) => (<li key={p.slug} className="rounded-full bg-sand px-2.5 py-0.5 text-[11px] font-bold text-ink-800">{p.shortName}</li>))}
                    </ul>
                  </Link>
                </li>
              ))}
            </ul>
          </Section>
        );
      })}
      <Section tone="paper"><TrustNotes /></Section>
      <CtaBand title="Not in one of these cities?" lede="Our lender panel covers urban India. Share your requirement and we will tell you which lenders serve your location and property." />
    </>
  );
}
