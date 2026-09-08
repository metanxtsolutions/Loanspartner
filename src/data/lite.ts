/**
 * Server-side only. Derives the small prop payloads that client components
 * need. Importing this from a "use client" module would pull the full data
 * files (and all their prose) into the browser bundle, so don't.
 */
import { products, productCategories } from "@/data/products";
import { cities } from "@/data/cities";
import { partnerAudiences } from "@/data/partner";
import type { AudienceLite, CategoryLite, CityLite, NavData, ProductLite } from "@/data/lite-types";

export const productOptions: ProductLite[] = products.map((p) => ({
  slug: p.slug,
  name: p.name,
  shortName: p.shortName,
  icon: p.icon,
  category: p.category,
  rateFrom: p.rate.from,
  rateTo: p.rate.to,
  amountMin: p.amount.min,
  amountMax: p.amount.max,
  tenureMaxMonths: p.tenure.maxMonths,
  popular: Boolean(p.popular),
  payoutFrom: p.dsa.payoutFrom,
  payoutTo: p.dsa.payoutTo,
  ticketSize: p.dsa.ticketSize,
}));

export const categoryOptions: CategoryLite[] = productCategories.map((c) => ({ key: c.key, label: c.label }));
export const cityOptions: CityLite[] = cities.map((c) => ({ slug: c.slug, name: c.name, state: c.state }));
export const audienceOptions: AudienceLite[] = partnerAudiences.map((a) => ({ slug: a.slug, name: a.name, short: a.short }));

export const navData: NavData = {
  products: productOptions,
  categories: categoryOptions,
  cities: cityOptions,
  audiences: audienceOptions,
};

export const productOption = (slug: string) => productOptions.find((p) => p.slug === slug);
