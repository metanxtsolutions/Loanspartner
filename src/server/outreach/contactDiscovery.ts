import * as cheerio from "cheerio";

/**
 * Finds a real, published contact email on a lender's own website. This
 * never invents an address: every candidate it returns was read off a live
 * page, with the source URL kept so a human can verify it before sending
 * anything. Sites that block simple fetches, or that only expose a contact
 * form with no visible email, come back with no candidates, which is the
 * correct result, not an error.
 */

const EMAIL_RE = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
const GENERIC_LOCAL_PARTS = new Set(["info", "support", "care", "contact", "help", "customercare", "customerservice", "webmaster", "no-reply", "noreply", "privacy", "compliance", "grievance", "legal"]);
const HIGH_VALUE_LOCAL_PARTS = ["partnership", "partnerships", "dsa", "channelpartner", "channel", "alliance", "alliances", "businessdevelopment", "bizdev", "bd", "tieup", "tie-up", "agent", "agents"];
const MEDIUM_VALUE_LOCAL_PARTS = ["business", "sales", "corporate", "b2b", "growth"];
const CANDIDATE_PATH_KEYWORDS = ["partner", "dsa", "channel", "alliance", "become-a", "tie-up", "tieup", "agent", "business-development", "corporate", "contact", "connect-with-us", "reach-us"];

const PAGE_TIMEOUT_MS = 8000;
const MAX_PAGES = 6;
const USER_AGENT = "LoansPartnerOutreachBot/1.0 (+https://loanspartner.in; partnership research, contact: partnerships@loanspartner.in)";

export type DiscoveredContact = {
  email: string;
  confidence: "HIGH" | "MEDIUM" | "LOW";
  sourceUrl: string;
  sourceNote: string;
};

async function fetchPage(url: string): Promise<{ html: string; finalUrl: string } | null> {
  try {
    const res = await fetch(url, {
      headers: { "user-agent": USER_AGENT, accept: "text/html" },
      redirect: "follow",
      signal: AbortSignal.timeout(PAGE_TIMEOUT_MS),
    });
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html")) return null;
    return { html: await res.text(), finalUrl: res.url };
  } catch {
    return null;
  }
}

function scoreEmail(email: string, pageUrl: string): "HIGH" | "MEDIUM" | "LOW" {
  const local = email.split("@")[0]?.toLowerCase() ?? "";
  if (HIGH_VALUE_LOCAL_PARTS.some((p) => local.includes(p))) return "HIGH";
  if (MEDIUM_VALUE_LOCAL_PARTS.some((p) => local.includes(p))) return "MEDIUM";
  if (/partner|dsa|channel|alliance/i.test(pageUrl) && !GENERIC_LOCAL_PARTS.has(local)) return "MEDIUM";
  return "LOW";
}

function extractEmails($: cheerio.CheerioAPI, pageUrl: string, domain: string): Map<string, "HIGH" | "MEDIUM" | "LOW"> {
  const found = new Map<string, "HIGH" | "MEDIUM" | "LOW">();
  $('a[href^="mailto:"]').each((_, el) => {
    const href = $(el).attr("href") ?? "";
    const email = href.replace(/^mailto:/i, "").split("?")[0].trim().toLowerCase();
    if (email.includes("@")) {
      const score = scoreEmail(email, pageUrl);
      const existing = found.get(email);
      if (!existing || rank(score) > rank(existing)) found.set(email, score);
    }
  });
  const bodyText = $("body").text();
  const matches = bodyText.match(EMAIL_RE) ?? [];
  for (const raw of matches) {
    const email = raw.toLowerCase();
    if (!email.endsWith(`@${domain}`) && !isPlausibleCorporateDomain(email, domain)) continue;
    const score = scoreEmail(email, pageUrl);
    const existing = found.get(email);
    if (!existing || rank(score) > rank(existing)) found.set(email, score);
  }
  return found;
}

function rank(c: "HIGH" | "MEDIUM" | "LOW") {
  return c === "HIGH" ? 3 : c === "MEDIUM" ? 2 : 1;
}

/** Some groups route partner mail through a sibling domain (e.g. groupname.com vs bank.com). Accept only the registrable domain matching. */
function isPlausibleCorporateDomain(email: string, domain: string) {
  const root = domain.split(".").slice(-2).join(".");
  return email.endsWith(`@${root}`) || email.split("@")[1]?.endsWith(`.${root}`);
}

function findCandidateLinks($: cheerio.CheerioAPI, baseUrl: string): string[] {
  const base = new URL(baseUrl);
  const links = new Set<string>();
  $("a[href]").each((_, el) => {
    const href = $(el).attr("href");
    if (!href) return;
    let abs: URL;
    try {
      abs = new URL(href, base);
    } catch {
      return;
    }
    if (abs.hostname !== base.hostname) return;
    const path = abs.pathname.toLowerCase();
    if (CANDIDATE_PATH_KEYWORDS.some((k) => path.includes(k))) {
      abs.hash = "";
      links.add(abs.toString());
    }
  });
  return Array.from(links).slice(0, MAX_PAGES - 1);
}

export async function discoverLenderContacts(websiteUrl: string): Promise<DiscoveredContact[]> {
  const home = await fetchPage(websiteUrl);
  if (!home) return [];
  const domain = new URL(home.finalUrl).hostname.replace(/^www\./, "");
  const pagesToTry = [home.finalUrl, ...findCandidateLinks(cheerio.load(home.html), home.finalUrl)];

  const results = new Map<string, DiscoveredContact>();
  for (const url of pagesToTry) {
    const page = url === home.finalUrl ? home : await fetchPage(url);
    if (!page) continue;
    const $ = cheerio.load(page.html);
    const emails = extractEmails($, url, domain);
    for (const [email, confidence] of emails) {
      const existing = results.get(email);
      if (!existing || rank(confidence) > rank(existing.confidence)) {
        results.set(email, { email, confidence, sourceUrl: url, sourceNote: `Found on ${new URL(url).pathname || "/"}` });
      }
    }
  }

  return Array.from(results.values()).sort((a, b) => rank(b.confidence) - rank(a.confidence));
}
