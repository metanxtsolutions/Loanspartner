import { citiesBatch1 } from "@/data/cities-batch-1";
import { citiesBatch2 } from "@/data/cities-batch-2";
import type { City, CoreProductSlug } from "@/data/city-types";

export type { City, CoreProductSlug };

export const cities: City[] = [...citiesBatch1, ...citiesBatch2];
export const cityMap = new Map(cities.map((c) => [c.slug, c]));
export const getCity = (slug: string) => cityMap.get(slug);
export const cityNames = cities.map((c) => c.name);
export const citiesByRegion = (region: City["region"]) => cities.filter((c) => c.region === region);
export const citySourceFile = (slug: string) =>
  citiesBatch1.some((c) => c.slug === slug) ? "src/data/cities-batch-1.ts" : "src/data/cities-batch-2.ts";
