import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

/**
 * Same scrypt salt:hash approach as src/server/outreach/auth.ts, duplicated
 * rather than imported from there: the outreach module is a separate,
 * actively-developed system and this keeps the two auth stacks from sharing
 * a file that both would need to touch.
 */
export function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

export function verifyPassword(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const candidate = scryptSync(password, salt, 64);
  const expected = Buffer.from(hash, "hex");
  if (candidate.length !== expected.length) return false;
  return timingSafeEqual(candidate, expected);
}
