/**
 * Serialisable, prose-free shapes for anything that crosses the server/client
 * boundary. Client components import ONLY from here (types are erased at
 * build time), never from the full data modules, which carry long-form copy
 * that would otherwise be bundled into every page's JavaScript.
 */
export type IconName =
  | "user" | "home" | "briefcase" | "building" | "car" | "car-used"
  | "graduation" | "coins" | "stethoscope" | "refresh" | "cog" | "wallet";

export type ProductLite = {
  slug: string;
  name: string;
  shortName: string;
  icon: IconName;
  category: string;
  rateFrom: number;
  rateTo: number;
  amountMin: number;
  amountMax: number;
  tenureMaxMonths: number;
  popular: boolean;
  payoutFrom: number;
  payoutTo: number;
  ticketSize: string;
};

export type CityLite = { slug: string; name: string; state: string };
export type AudienceLite = { slug: string; name: string; short: string };
export type CategoryLite = { key: string; label: string };

export type NavData = {
  products: ProductLite[];
  categories: CategoryLite[];
  cities: CityLite[];
  audiences: AudienceLite[];
};
