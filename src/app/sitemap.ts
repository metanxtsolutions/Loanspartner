import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { products, coreProducts } from "@/data/products";
import { cities } from "@/data/cities";
import { guides } from "@/data/guides";
import { glossary } from "@/data/glossary";
import { lenders } from "@/data/lenders";
import { partnerAudiences } from "@/data/partner";

type Entry = MetadataRoute.Sitemap[number];
const url = (path: string) => `${siteConfig.url}${path}`;
const d = (s: string) => new Date(s);
const latest = (...dates: string[]) => new Date(Math.max(...dates.map((x) => d(x).getTime())));

/**
 * lastModified comes from each entity's own `updatedAt`, never the build
 * time, so a rebuild does not falsely re-date hundreds of unchanged URLs.
 * Static pages carry an explicit date map; bump it when the page changes.
 */
const staticPages: { path: string; updated: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", updated: "2026-09-01", priority: 1, changeFrequency: "weekly" },
  { path: "/loans", updated: "2026-09-01", priority: 0.9, changeFrequency: "weekly" },
  { path: "/apply", updated: "2026-09-01", priority: 0.9, changeFrequency: "monthly" },
  { path: "/partner", updated: "2026-09-01", priority: 0.9, changeFrequency: "weekly" },
  { path: "/partner/register", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/partner/commission", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cities", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools", updated: "2026-09-01", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/emi-calculator", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/eligibility-calculator", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/balance-transfer-calculator", updated: "2026-09-01", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/dsa-income-calculator", updated: "2026-09-01", priority: 0.7, changeFrequency: "monthly" },
  { path: "/interest-rates", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", updated: "2026-09-01", priority: 0.8, changeFrequency: "weekly" },
  { path: "/glossary", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/lenders", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faqs", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", updated: "2026-09-01", priority: 0.5, changeFrequency: "yearly" },
  { path: "/grievance-redressal", updated: "2026-09-01", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy-policy", updated: "2026-09-01", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", updated: "2026-09-01", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", updated: "2026-09-01", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: Entry[] = staticPages.map((s) => ({ url: url(s.path), lastModified: d(s.updated), changeFrequency: s.changeFrequency, priority: s.priority }));

  const productPages: Entry[] = products.map((p) => ({ url: url(`/loans/${p.slug}`), lastModified: d(p.updatedAt), changeFrequency: "monthly", priority: p.popular ? 0.9 : 0.8 }));

  const productCityPages: Entry[] = coreProducts.flatMap((p) =>
    cities.map((c) => ({ url: url(`/loans/${p.slug}/${c.slug}`), lastModified: latest(p.updatedAt, c.updatedAt), changeFrequency: "monthly" as const, priority: 0.6 })),
  );

  const cityPages: Entry[] = cities.map((c) => ({ url: url(`/cities/${c.slug}`), lastModified: d(c.updatedAt), changeFrequency: "monthly", priority: 0.7 }));

  const partnerProductPages: Entry[] = products.map((p) => ({ url: url(`/partner/${p.slug}-dsa`), lastModified: d(p.updatedAt), changeFrequency: "monthly", priority: 0.7 }));

  const audiencePages: Entry[] = partnerAudiences.map((a) => ({ url: url(`/partner/for/${a.slug}`), lastModified: d(a.updatedAt), changeFrequency: "monthly", priority: 0.7 }));

  const lenderPages: Entry[] = lenders.map((l) => ({ url: url(`/lenders/${l.slug}`), lastModified: d(l.updatedAt), changeFrequency: "monthly", priority: 0.5 }));

  const guidePages: Entry[] = guides.map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: d(g.updatedDate), changeFrequency: "monthly", priority: g.featured ? 0.8 : 0.7 }));

  const glossaryPages: Entry[] = glossary.map((t) => ({ url: url(`/glossary/${t.slug}`), lastModified: d(t.updatedAt), changeFrequency: "yearly", priority: 0.4 }));

  return [...statics, ...productPages, ...cityPages, ...productCityPages, ...partnerProductPages, ...audiencePages, ...guidePages, ...lenderPages, ...glossaryPages];
}
