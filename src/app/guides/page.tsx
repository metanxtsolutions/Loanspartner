import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader } from "@/components/shared/section";
import { GuideCard } from "@/components/shared/guide-card";
import { CtaBand } from "@/components/shared/cta-band";
import { guides, guideCategories, guidesByCategory, featuredGuides } from "@/data/guides";
import { siteConfig } from "@/data/site-config";

const title = "Loan Guides: Eligibility, Credit Scores, Balance Transfers, DSA and Staying Safe";
const description = "Plain-language guides on how loans are approved, improving your credit score, when a balance transfer pays, business loan documents, the DSA business and avoiding loan fraud. Reviewed by the LoansPartner credit desk.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/guides", keywords: ["loan guides India", "personal loan guide", "home loan guide", "DSA guide", "CIBIL score guide", "loan fraud"] });

export default function GuidesPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: title, description, path: "/guides", type: "CollectionPage" }), itemListSchema({ name: "Guides", path: "/guides", items: guides.map((g) => ({ name: g.title, path: `/guides/${g.slug}` })) })]} />
      <PageHero crumbs={[{ name: "Guides", path: "/guides" }]} eyebrow="Guides" title="How lending actually works, written by people who did the underwriting." lede={siteConfig.editorialTeam.description} />
      <Section tone="cream">
        <SectionHeader eyebrow="Start here" title="Most read" />
        <div className="mt-8 grid gap-5 md:grid-cols-3">{featuredGuides.map((g, i) => (<GuideCard key={g.slug} guide={g} delay={i * 70} />))}</div>
      </Section>
      {guideCategories.map((cat, ci) => {
        const list = guidesByCategory(cat);
        if (!list.length) return null;
        return (
          <Section key={cat} tone={ci % 2 === 0 ? "paper" : "cream"} className="!py-12 lg:!py-16" id={cat.toLowerCase().replace(/\s+/g, "-")}>
            <SectionHeader eyebrow={cat} title={`${list.length} guide${list.length > 1 ? "s" : ""}`} />
            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">{list.map((g, i) => (<GuideCard key={g.slug} guide={g} delay={(i % 3) * 70} />))}</div>
          </Section>
        );
      })}
      <CtaBand />
    </>
  );
}
