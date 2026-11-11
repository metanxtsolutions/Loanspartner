/**
 * Names as they read mid-sentence. A bare `${name.toLowerCase()}s` produced
 * "loan against propertys", "working capital - od / ccs" and "nbfcs", so
 * every lower-cased name in running copy goes through these instead.
 */

/** "Personal Loan" becomes "personal loan"; acronyms such as OD, CC and NBFC keep their capitals. */
export function midSentence(name: string): string {
  return name
    .split(" ")
    .map((word) => (word.length > 1 && word === word.toUpperCase() ? word : word.toLowerCase()))
    .join(" ");
}

/**
 * A loan product mid-sentence. The plural adds an "s" only where the name
 * ends in a countable noun, and pluralises the head noun of "Loan Against
 * Property"; "Working Capital - OD / CC" reads the same either way.
 */
export function productNoun(name: string, form: "singular" | "plural" = "singular"): string {
  const lower = midSentence(name);
  if (form === "singular") return lower;
  if (/^loan against /.test(lower)) return lower.replace(/^loan /, "loans ");
  if (/(loan|transfer)$/.test(lower)) return `${lower}s`;
  return lower;
}

/** A lender type mid-sentence: "NBFC" becomes "NBFCs", "Housing finance company" becomes "housing finance companies". */
export function lenderTypeNoun(type: string, count = 2): string {
  const lower = midSentence(type);
  if (count === 1) return lower;
  return lower.endsWith("y") ? `${lower.slice(0, -1)}ies` : `${lower}s`;
}
