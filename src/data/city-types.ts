import type { Faq } from "@/data/products";

export type CoreProductSlug = "personal-loan" | "home-loan" | "business-loan" | "loan-against-property" | "car-loan";

export type City = {
  slug: string;
  name: string;
  state: string;
  region: "North" | "South" | "East" | "West" | "Central";
  tier: 1 | 2;
  /** Short line used on cards and in titles. */
  tagline: string;
  overview: string[];
  economy: string;
  propertyMarket: string;
  lenderPresence: string;
  localNotes: string[];
  /** Unique, product-specific paragraph per core product. */
  productNotes: Record<CoreProductSlug, string>;
  nearbySlugs: string[];
  keywords: string[];
  faqs: Faq[];
  updatedAt: string;
};
