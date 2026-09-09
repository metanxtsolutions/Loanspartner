import type { Faq } from "@/data/products";

export type GuideCategory = "Borrowing basics" | "Home loans" | "Business finance" | "Partner programme" | "Credit and scores" | "Safety and compliance";

export type GuideSection = {
  heading: string;
  body: string[];
  bullets?: string[];
  table?: { headers: string[]; rows: string[][] };
};

export type Guide = {
  slug: string;
  title: string;
  /**
   * Shown in <title> when the editorial headline would be truncated in search
   * results. The headline stays on the page as the H1; this is only the SERP
   * label. Falls back to `title`.
   */
  seoTitle?: string;
  category: GuideCategory;
  excerpt: string;
  readTime: string;
  publishedDate: string;
  updatedDate: string;
  primaryKeyword: string;
  secondaryKeywords: string[];
  tags: string[];
  intro: string[];
  sections: GuideSection[];
  keyTakeaways: string[];
  faqs: Faq[];
  relatedProducts: string[];
  relatedGuides: string[];
  featured?: boolean;
};
