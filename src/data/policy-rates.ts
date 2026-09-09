/**
 * Rates set by the regulator rather than by us. Every page that quotes the
 * benchmark reads it from here, so one edit moves the whole site when the RBI
 * changes policy. Never inline the number in prose again: it used to appear as
 * a literal in three files and would have gone stale in all of them silently.
 *
 * `asOf` is the date the credit desk last checked the number against the RBI
 * release, and it is what the site tells readers.
 */
export const policyRates = {
  /** RBI repo rate, per cent per annum. */
  repo: 5.25,
  asOf: "2026-09-08",
  asOfLabel: "September 2026",
  source: "https://www.rbi.org.in/",
} as const;

/** Formatted once so every mention on the site matches. */
export const repoRateLabel = `${policyRates.repo}%`;
