/**
 * Copies CONVEX_URL from repo root .env.local into app env files.
 * Run after `npx convex dev` links or switches deployments.
 */
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const rootEnvPath = join(root, ".env.local");

function parseEnv(content) {
  const vars = {};
  for (const line of content.split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i === -1) continue;
    vars[t.slice(0, i)] = t.slice(i + 1);
  }
  return vars;
}

function upsertKey(content, key, value) {
  const re = new RegExp(`^${key}=.*$`, "m");
  const line = `${key}=${value}`;
  if (re.test(content)) return content.replace(re, line);
  return `${content.trimEnd()}\n${line}\n`;
}

if (!existsSync(rootEnvPath)) {
  console.error("Missing root .env.local — run: npx convex dev");
  process.exit(1);
}

const convexUrl = parseEnv(readFileSync(rootEnvPath, "utf8")).CONVEX_URL;
if (!convexUrl) {
  console.error("CONVEX_URL not set in root .env.local");
  process.exit(1);
}

const targets = [
  { path: join(root, "apps/native/.env.local"), key: "EXPO_PUBLIC_CONVEX_URL" },
  { path: join(root, "apps/web/.env.local"), key: "NEXT_PUBLIC_CONVEX_URL" },
];

for (const { path, key } of targets) {
  if (!existsSync(path)) {
    console.warn(`Skip (missing): ${path}`);
    continue;
  }
  const next = upsertKey(readFileSync(path, "utf8"), key, convexUrl);
  writeFileSync(path, next);
  console.log(`Updated ${key} in ${path}`);
}

console.log(`Synced Convex URL: ${convexUrl}`);
