/**
 * The GA4 measurement ID for the loanspartner.in property. It is not a secret:
 * it is visible in the page source of every site that uses it. Kept as a
 * default here rather than an environment variable so it deploys with the
 * code, and read as a literal process.env access so Next can inline an
 * override at build time.
 */
// `||` not `??`: an env var set to an empty string must fall through to the
// default, and setting it empty locally is how you keep dev traffic out of GA.
export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || "G-57GRXV3DFM";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    dataLayer?: unknown[];
  }
}

/** Fire a GA4 event; silently no-ops when analytics is not loaded. */
export function trackEvent(name: string, params: Params = {}) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  window.gtag("event", name, params);
}
