import type { Metadata } from "next";
import { pageMetadata } from "@/lib/seo";
import { JsonLd } from "@/components/shared/json-ld";
import { itemListSchema, webPageSchema } from "@/lib/schema";
import { PageHero } from "@/components/shared/page-hero";
import { Section, SectionHeader } from "@/components/shared/section";
import { LenderCards } from "@/components/shared/lender-cards";
import { CtaBand } from "@/components/shared/cta-band";
import { lenders, lenderTypes } from "@/data/lenders";
import { siteConfig } from "@/data/site-config";

const title = "Lending Partners: Banks, HFCs and NBFCs";
const description = "LoansPartner places loan applications with public sector banks, private banks, housing finance companies, NBFCs and small finance banks across India. See which lenders serve which products.";

export const metadata: Metadata = pageMetadata({ title, description, path: "/lenders", keywords: ["loan lending partners", "banks and NBFCs for loans", "which bank for personal loan", "which bank for home loan", "NBFC loan partners"] });

export default function LendersPage() {
  return (
    <>
      <JsonLd data={[webPageSchema({ name: title, description, path: "/lenders", type: "CollectionPage" }), itemListSchema({ name: "Lending partners", path: "/lenders", items: lenders.map((l) => ({ name: l.name, path: `/lenders/${l.slug}` })) })]} />
      <PageHero crumbs={[{ name: "Lending partners", path: "/lenders" }]} eyebrow="Lending partners" title="The panel behind every shortlist." lede={<>{siteConfig.compliance.dsaDisclosure} Lender profiles below describe each institution's products and typical strengths from public information; they do not state rates, which vary by profile and change frequently.</>} />
      {lenderTypes.map((t, i) => {
        const list = lenders.filter((l) => l.type === t);
        if (!list.length) return null;
        return (
          <Section key={t} tone={i % 2 === 0 ? "cream" : "paper"} className="!py-12 lg:!py-16">
            <SectionHeader eyebrow={t} title={`${list.length} ${t.toLowerCase()}${list.length > 1 ? "s" : ""} on the panel`} />
            <div className="mt-8"><LenderCards lenders={list} /></div>
          </Section>
        );
      })}
      <CtaBand title="Which lender is right for you?" lede="That depends on your profile, city and the asset involved. Share your requirement and we will tell you, before any application." />
    </>
  );
}
