"use client";

import { useSyncExternalStore } from "react";

const subscribe = () => () => {};

/**
 * The footer is prerendered, so a server-side `new Date()` freezes the year at
 * build time and the copyright line goes stale on 1 January unless someone
 * redeploys. This prints the build year in the HTML and swaps in the visitor's
 * current year after hydration, without a hydration mismatch.
 */
export function CurrentYear({ buildYear }: { buildYear: number }) {
  const year = useSyncExternalStore(
    subscribe,
    () => new Date().getFullYear(),
    () => buildYear,
  );
  return <>{year}</>;
}
