import "server-only";
import { headers } from "next/headers";

/**
 * Abuse controls: a fixed window per IP, a honeypot field and a minimum
 * time-on-form.
 *
 * The window needs a store shared across instances to mean anything on a
 * serverless runtime, where each request may land on a fresh process. When a
 * Redis store is configured we count there over plain HTTP, which needs no
 * client library. Without one we fall back to
 * a per-process map: still useful against a single noisy client hitting one
 * warm instance, but not a real limit. The honeypot and timing checks are
 * unaffected either way and remain the primary bot defence.
 */
const WINDOW_MS = 10 * 60 * 1000;
const MAX_PER_WINDOW = 12;
const MIN_FORM_SECONDS = 3;

const hits = new Map<string, number[]>();

// Vercel's Upstash integration injects KV_REST_API_URL and KV_REST_API_TOKEN
// when a Redis store is connected to the project. Those are read first so the
// limiter works the moment the store is linked, with no secret copied by hand.
// UPSTASH_REDIS_REST_* stays supported for a database provisioned elsewhere.
const redisUrl = process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL;
const redisToken = process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN;

/** True when the shared counter is configured, so the limit applies fleet-wide. */
export const rateLimitIsShared = Boolean(redisUrl && redisToken);

export async function requestMeta() {
  const h = await headers();
  const fwd = h.get("x-forwarded-for") ?? h.get("x-real-ip") ?? "";
  const ip = fwd.split(",")[0]?.trim() || "unknown";
  return { ip, userAgent: h.get("user-agent") ?? "", referer: h.get("referer") ?? "" };
}

export async function rateLimited(ip: string): Promise<boolean> {
  if (redisUrl && redisToken) {
    const shared = await rateLimitedShared(ip, redisUrl, redisToken);
    if (shared !== null) return shared;
  }
  return rateLimitedInMemory(ip);
}

/**
 * INCR the window key and set its expiry on first use. Returns null when the
 * store cannot be reached, so a Redis outage degrades to the local counter
 * rather than locking every visitor out of the forms.
 */
async function rateLimitedShared(ip: string, url: string, token: string): Promise<boolean | null> {
  const bucket = Math.floor(Date.now() / WINDOW_MS);
  const key = `lead-rate:${bucket}:${ip}`;
  try {
    const res = await fetch(`${url}/pipeline`, {
      method: "POST",
      headers: { authorization: `Bearer ${token}`, "content-type": "application/json" },
      body: JSON.stringify([
        ["INCR", key],
        ["EXPIRE", key, String(Math.ceil(WINDOW_MS / 1000))],
      ]),
      signal: AbortSignal.timeout(2000),
      cache: "no-store",
    });
    if (!res.ok) throw new Error(`redis ${res.status}`);
    const body = (await res.json()) as { result?: number }[];
    const count = Number(body?.[0]?.result ?? 0);
    if (!Number.isFinite(count) || count <= 0) return null;
    return count > MAX_PER_WINDOW;
  } catch (err) {
    console.warn("[leads] shared rate limit unavailable", err instanceof Error ? err.message : err);
    return null;
  }
}

function rateLimitedInMemory(ip: string) {
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
