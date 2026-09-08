/**
 * Copy gate. Typography rules fail the build; phrasing rules warn.
 * Escape hatch: add `copy-check-ignore` on the same line.
 *   pnpm check:copy
 */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const ROOT = path.resolve("src");
const EXT = new Set([".ts", ".tsx", ".md", ".mdx"]);
const DASHES = /[–—]/; // en dash, em dash
const BANNED = ["seamless", "elevate", "leverage", "robust", "empower", "streamline", "delve", "game-changer", "game changer", "cutting-edge", "in today's", "look no further", "unleash", "supercharge", "hassle-free", "world-class"];

function walk(dir: string, out: string[] = []) {
  for (const name of readdirSync(dir)) {
    const p = path.join(dir, name);
    if (statSync(p).isDirectory()) walk(p, out);
    else if (EXT.has(path.extname(p))) out.push(p);
  }
  return out;
}

let failures = 0;
let warnings = 0;
for (const file of walk(ROOT)) {
  const lines = readFileSync(file, "utf8").split("\n");
  lines.forEach((line, i) => {
    if (line.includes("copy-check-ignore")) return;
    const loc = `${path.relative(process.cwd(), file)}:${i + 1}`;
    if (DASHES.test(line)) {
      failures++;
      console.error(`FAIL ${loc}: en/em dash. Use a comma, colon, or "to".`);
    }
    const lower = line.toLowerCase();
    for (const w of BANNED) {
      if (lower.includes(w)) {
        warnings++;
        console.warn(`warn ${loc}: filler word "${w}"`);
      }
    }
  });
}
console.log(`\ncopy check: ${failures} failure(s), ${warnings} warning(s)`);
if (failures > 0) process.exit(1);
