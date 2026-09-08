import { guidesBatch1 } from "@/data/guides-batch-1";
import { guidesBatch2 } from "@/data/guides-batch-2";
import type { Guide, GuideCategory, GuideSection } from "@/data/guide-types";

export type { Guide, GuideCategory, GuideSection };

export const guides: Guide[] = [...guidesBatch1, ...guidesBatch2].sort(
  (a, b) => new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime(),
);
export const guideMap = new Map(guides.map((g) => [g.slug, g]));
export const getGuide = (slug: string) => guideMap.get(slug);
export const featuredGuides = guides.filter((g) => g.featured);
export const guideCategories: GuideCategory[] = ["Borrowing basics", "Home loans", "Business finance", "Credit and scores", "Partner programme", "Safety and compliance"];
export const guidesByCategory = (c: GuideCategory) => guides.filter((g) => g.category === c);
export const guidesForProduct = (slug: string) => guides.filter((g) => g.relatedProducts.includes(slug));
export const guideSourceFile = (slug: string) =>
  guidesBatch1.some((g) => g.slug === slug) ? "src/data/guides-batch-1.ts" : "src/data/guides-batch-2.ts";
