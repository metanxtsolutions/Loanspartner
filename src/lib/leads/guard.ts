import "server-only";
import { headers } from "next/headers";

/**
 * Best-effort abuse controls that need no external service: an in-memory
 * sliding window per IP, a honeypot field and a minimum time-on-form.
 * Swap the window store for Redis when running on more than one instance.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const MIN_FORM_SECONDS = 3;

const hits = new Map<string, number[]>();

export async function requestMeta() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "";
  const ip = fwd.split(",")[0]?.trim() || "unknown";
  return { ip, userAgent: h.get("user-agent") ?? "", referer: h.get("referer") ?? "" };
}

export function rateLimited(ip: string) {
  const now = Date.now();
  const list = (hits.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  if (list.length >= MAX_PER_WINDOW) {
    hits.set(ip, list);
    return true;
  }
  list.push(now);
  hits.set(ip, list);
  if (hits.size > 5000) {
    for (const [k, v] of hits) if (v.every((t) => now - t >= WINDOW_MS)) hits.delete(k);
  }
  return false;
}

/**
 * Returns a reason string when the submission looks automated, else null.
 * `_elapsed` is measured on the client (mount to submit), so no server clock
 * is involved and clock skew cannot reject a real person. A missing value
 * means the form was submitted before hydration; the honeypot still applies.
 */
export function botCheck(form: FormData): string | null {
  const honey = String(form.get("website") ?? "");
  if (honey.trim() !== "") return "honeypot";
  const raw = form.get("_elapsed");
  if (raw === null) return null;
  const elapsed = Number(raw);
  if (Number.isFinite(elapsed) && elapsed > 0 && elapsed < MIN_FORM_SECONDS * 1000) return "too-fast";
  return null;
}
