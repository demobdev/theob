/**
 * Vercel build for apps/web.
 *
 * 1. Build Next.js (requires NEXT_PUBLIC_CONVEX_URL in Vercel env).
 * 2. Best-effort Convex function push when CONVEX_DEPLOY_KEY is set.
 *    Deploy key must be a full Production deploy key from the Convex dashboard
 *    (read-only / scoped keys fail with ViewData on recent CLI versions).
 */
import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function run(command, args, { allowFail = false } = {}) {
  const result = spawnSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32",
    env: process.env,
  });
  const code = result.status ?? 1;
  if (code !== 0 && !allowFail) {
    process.exit(code);
  }
  return code;
}

const convexUrl = process.env.NEXT_PUBLIC_CONVEX_URL?.trim();
const deployKey = process.env.CONVEX_DEPLOY_KEY?.trim();

function urlFromDeployKey(key) {
  const match = key.match(/^(?:dev|prod):([^|]+)/);
  return match ? `https://${match[1]}.convex.cloud` : null;
}

const resolvedConvexUrl = convexUrl ?? (deployKey ? urlFromDeployKey(deployKey) : null);

if (!resolvedConvexUrl) {
  console.error(
    "\n[vercel-build] Missing NEXT_PUBLIC_CONVEX_URL.\n" +
      "In Vercel → Project → Settings → Environment Variables, add:\n" +
      "  NEXT_PUBLIC_CONVEX_URL = https://quiet-mole-11.convex.cloud\n" +
      "(or your production Convex URL)\n" +
      "Apply to Production and Preview.\n",
  );
  process.exit(1);
}

process.env.NEXT_PUBLIC_CONVEX_URL = resolvedConvexUrl;

console.log(`[vercel-build] Building web-app (${resolvedConvexUrl})`);
run("npm", ["run", "build", "--workspace=web-app"]);

if (!deployKey) {
  console.log(
    "[vercel-build] No CONVEX_DEPLOY_KEY — skipping Convex function push.",
  );
  process.exit(0);
}

console.log("[vercel-build] Pushing Convex functions (best-effort)…");
const deployCode = run(
  "npx",
  ["convex", "deploy", "--typecheck", "disable", "--codegen", "disable"],
  { allowFail: true },
);

if (deployCode !== 0) {
  console.warn(
    "\n[vercel-build] Convex deploy failed — web build still succeeded.\n" +
      "Regenerate CONVEX_DEPLOY_KEY in Convex Dashboard:\n" +
      "  Deployment Settings → Generate Production Deploy Key\n" +
      "Use a full deploy key (not read-only). Update Vercel env CONVEX_DEPLOY_KEY.\n" +
      "Until then, run `npx convex deploy` locally after backend changes.\n",
  );
}

process.exit(0);
