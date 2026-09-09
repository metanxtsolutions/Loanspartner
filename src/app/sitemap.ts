import { execSync } from "node:child_process";
import type { MetadataRoute } from "next";
import { siteConfig } from "@/data/site-config";
import { products, coreProducts } from "@/data/products";
import { cities, citySourceFile } from "@/data/cities";
import { guides, guideSourceFile } from "@/data/guides";
import { glossary } from "@/data/glossary";
import { lenders } from "@/data/lenders";
import { partnerAudiences } from "@/data/partner";

type Entry = MetadataRoute.Sitemap[number];
const url = (path: string) => (path === "/" ? siteConfig.url : `${siteConfig.url}${path}`);

/**
 * lastModified is the last commit date of the file a URL's content actually
 * comes from, so a rebuild never re-dates hundreds of unchanged pages and
 * editing one city file moves only that city's URLs. Falls back to the
 * entity's declared `updatedAt` when git history is unavailable, as in a
 * shallow CI clone.
 */
const gitDateCache = new Map<string, Date>();

function lastModified(file: string, fallback: string): Date {
  const cached = gitDateCache.get(file);
  if (cached) return cached;
  let result = new Date(fallback);
  try {
    const out = execSync(`git log -1 --format=%aI -- "${file}"`, {
      cwd: process.cwd(),
      encoding: "utf-8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
    if (out) result = new Date(out);
  } catch {
    // No git, or a shallow clone: the declared date stands.
  }
  gitDateCache.set(file, result);
  return result;
}

const PRODUCT_FILE = "src/data/products.ts";
const GLOSSARY_FILE = "src/data/glossary.ts";
const LENDER_FILE = "src/data/lenders.ts";
const PARTNER_FILE = "src/data/partner.ts";
const staticPages: { path: string; file: string; updated: string; priority: number; changeFrequency: Entry["changeFrequency"] }[] = [
  { path: "/", file: "src/app/(site)/page.tsx", updated: "2026-09-01", priority: 1, changeFrequency: "weekly" },
  { path: "/loans", file: "src/app/(site)/loans/page.tsx", updated: "2026-09-01", priority: 0.9, changeFrequency: "weekly" },
  { path: "/apply", file: "src/app/(site)/apply/page.tsx", updated: "2026-09-01", priority: 0.9, changeFrequency: "monthly" },
  { path: "/partner", file: "src/app/(site)/partner/page.tsx", updated: "2026-09-01", priority: 0.9, changeFrequency: "weekly" },
  { path: "/partner/register", file: "src/app/(site)/partner/register/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/partner/commission", file: "src/app/(site)/partner/commission/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/cities", file: "src/app/(site)/cities/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools", file: "src/app/(site)/tools/page.tsx", updated: "2026-09-01", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/emi-calculator", file: "src/app/(site)/tools/emi-calculator/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/eligibility-calculator", file: "src/app/(site)/tools/eligibility-calculator/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/tools/balance-transfer-calculator", file: "src/app/(site)/tools/balance-transfer-calculator/page.tsx", updated: "2026-09-01", priority: 0.7, changeFrequency: "monthly" },
  { path: "/tools/dsa-income-calculator", file: "src/app/(site)/tools/dsa-income-calculator/page.tsx", updated: "2026-09-01", priority: 0.7, changeFrequency: "monthly" },
  { path: "/interest-rates", file: "src/app/(site)/interest-rates/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "monthly" },
  { path: "/guides", file: "src/app/(site)/guides/page.tsx", updated: "2026-09-01", priority: 0.8, changeFrequency: "weekly" },
  { path: "/glossary", file: "src/app/(site)/glossary/page.tsx", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/lenders", file: "src/app/(site)/lenders/page.tsx", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/faqs", file: "src/app/(site)/faqs/page.tsx", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/about", file: "src/app/(site)/about/page.tsx", updated: "2026-09-01", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", file: "src/app/(site)/contact/page.tsx", updated: "2026-09-01", priority: 0.5, changeFrequency: "yearly" },
  { path: "/grievance-redressal", file: "src/app/(site)/grievance-redressal/page.tsx", updated: "2026-09-01", priority: 0.4, changeFrequency: "yearly" },
  { path: "/privacy-policy", file: "src/app/(site)/privacy-policy/page.tsx", updated: "2026-09-01", priority: 0.3, changeFrequency: "yearly" },
  { path: "/terms", file: "src/app/(site)/terms/page.tsx", updated: "2026-09-01", priority: 0.3, changeFrequency: "yearly" },
  { path: "/disclaimer", file: "src/app/(site)/disclaimer/page.tsx", updated: "2026-09-01", priority: 0.3, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const statics: Entry[] = staticPages.map((s) => ({ url: url(s.path), lastModified: lastModified(s.file, s.updated), changeFrequency: s.changeFrequency, priority: s.priority }));

  const productPages: Entry[] = products.map((p) => ({ url: url(`/loans/${p.slug}`), lastModified: lastModified(PRODUCT_FILE, p.updatedAt), changeFrequency: "monthly", priority: p.popular ? 0.9 : 0.8 }));

  const productCityPages: Entry[] = coreProducts.flatMap((p) =>
    cities.map((c) => {
      const product = lastModified(PRODUCT_FILE, p.updatedAt);
      const city = lastModified(citySourceFile(c.slug), c.updatedAt);
      return {
        url: url(`/loans/${p.slug}/${c.slug}`),
        lastModified: product > city ? product : city,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      };
    }),
  );

  const cityPages: Entry[] = cities.map((c) => ({ url: url(`/cities/${c.slug}`), lastModified: lastModified(citySourceFile(c.slug), c.updatedAt), changeFrequency: "monthly", priority: 0.7 }));

  const partnerProductPages: Entry[] = products.map((p) => ({ url: url(`/partner/${p.slug}-dsa`), lastModified: lastModified(PRODUCT_FILE, p.updatedAt), changeFrequency: "monthly", priority: 0.7 }));

  const audiencePages: Entry[] = partnerAudiences.map((a) => ({ url: url(`/partner/for/${a.slug}`), lastModified: lastModified(PARTNER_FILE, a.updatedAt), changeFrequency: "monthly", priority: 0.7 }));

  const lenderPages: Entry[] = lenders.map((l) => ({ url: url(`/lenders/${l.slug}`), lastModified: lastModified(LENDER_FILE, l.updatedAt), changeFrequency: "monthly", priority: 0.5 }));

  const guidePages: Entry[] = guides.map((g) => ({ url: url(`/guides/${g.slug}`), lastModified: lastModified(guideSourceFile(g.slug), g.updatedDate), changeFrequency: "monthly", priority: g.featured ? 0.8 : 0.7 }));

  const glossaryPages: Entry[] = glossary.map((t) => ({ url: url(`/glossary/${t.slug}`), lastModified: lastModified(GLOSSARY_FILE, t.updatedAt), changeFrequency: "yearly", priority: 0.4 }));

  return [...statics, ...productPages, ...cityPages, ...productCityPages, ...partnerProductPages, ...audiencePages, ...guidePages, ...lenderPages, ...glossaryPages];
}
