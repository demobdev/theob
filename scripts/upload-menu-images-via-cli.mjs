/**
 * Upload local menu PNGs into Convex file storage using internal Convex CLI mutations.
 *
 * Usage (repo root, dev server NOT required):
 *   node scripts/upload-menu-images-via-cli.mjs
 */

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { ConvexHttpClient } from "convex/browser";
import { api } from "../convex/_generated/api.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const FOOD_DIR = path.join(ROOT, "apps/web/public/images/food");

const SLUG_ALIASES = {
  crab_cake: "crabcake_sandwich",
  "bud-light": "bud_light",
};

const CONVEX_ENV = {
  ...process.env,
  CONVEX_DEPLOY_KEY: "",
  CONVEX_DEPLOYMENT: process.env.CONVEX_DEPLOYMENT?.trim() || "dev:quiet-mole-11",
};

function loadEnvFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  for (const line of fs.readFileSync(filePath, "utf8").split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eq = trimmed.indexOf("=");
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    const hash = value.indexOf(" #");
    if (hash !== -1) value = value.slice(0, hash).trim();
    value = value.replace(/^["']|["']$/g, "");
    if (!process.env[key]) process.env[key] = value;
  }
}

loadEnvFile(path.join(ROOT, "apps/web/.env.local"));
loadEnvFile(path.join(ROOT, ".env.local"));
CONVEX_ENV.CONVEX_DEPLOYMENT =
  process.env.CONVEX_DEPLOYMENT?.trim() || "dev:quiet-mole-11";

function convexRun(functionName, args = {}) {
  const convexBin = path.join(ROOT, "node_modules", "convex", "bin", "main.js");
  const result = spawnSync(
    process.execPath,
    [convexBin, "run", functionName, JSON.stringify(args)],
    {
      cwd: ROOT,
      encoding: "utf8",
      env: CONVEX_ENV,
      shell: false,
    },
  );

  if (result.status !== 0) {
    throw new Error(result.stderr || result.stdout || `${functionName} failed`);
  }

  const lines = result.stdout.trim().split(/\r?\n/).filter(Boolean);
  const last = lines[lines.length - 1] ?? "";
  return last.replace(/^"|"$/g, "");
}

function normalizeSlug(image) {
  if (!image) return null;
  if (image.startsWith("http://") || image.startsWith("https://")) return null;
  if (image.startsWith("/")) {
    const match = image.match(/\/images\/food\/([^/]+)\.(png|jpe?g|webp)$/i);
    if (match) return match[1];
  }
  return image.replace(/\.(png|jpe?g|webp)$/i, "");
}

function resolveFileSlug(slug) {
  return SLUG_ALIASES[slug] ?? slug;
}

function findImageFile(slug) {
  const resolved = resolveFileSlug(slug);
  for (const ext of [".png", ".jpg", ".jpeg", ".webp"]) {
    const candidate = path.join(FOOD_DIR, `${resolved}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

async function uploadFile(uploadUrl, filePath) {
  const contentType =
    {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
    }[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

  const body = fs.readFileSync(filePath);
  const response = await fetch(uploadUrl, {
    method: "POST",
    headers: { "Content-Type": contentType },
    body,
  });

  if (!response.ok) {
    throw new Error(`Upload failed (${response.status}): ${await response.text()}`);
  }

  const { storageId } = await response.json();
  return storageId;
}

async function main() {
  const convexUrl =
    process.env.NEXT_PUBLIC_CONVEX_URL ??
    process.env.CONVEX_URL ??
    "https://quiet-mole-11.convex.cloud";

  const client = new ConvexHttpClient(convexUrl);
  const products = await client.query(api.products.getAllProducts);

  let uploaded = 0;
  let skipped = 0;
  const failed = [];

  for (const product of products) {
    const slug = normalizeSlug(product.image);
    if (!slug) {
      skipped++;
      continue;
    }

    const filePath = findImageFile(slug);
    if (!filePath) {
      failed.push(`${product.name}: no file for slug "${slug}"`);
      continue;
    }

    try {
      const uploadUrl = convexRun("menuImages:generateUploadUrlInternal");
      const storageId = await uploadFile(uploadUrl, filePath);
      const imageUrl = convexRun("menuImages:setProductImageFromStorage", {
        productId: product._id,
        storageId,
      });
      uploaded++;
      console.log(`✓ ${product.name} → ${imageUrl.slice(0, 72)}…`);
    } catch (error) {
      failed.push(
        `${product.name}: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  }

  console.log(
    `\nDone. uploaded=${uploaded} skipped=${skipped} failed=${failed.length}`,
  );
  if (failed.length) {
    for (const line of failed) console.log(`  - ${line}`);
    process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
