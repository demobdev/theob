<!-- convex-ai-start -->
This project uses [Convex](https://convex.dev) as its backend.

When working on Convex code, **always read `convex/_generated/ai/guidelines.md` first** for important guidelines on how to correctly use Convex APIs and patterns. The file contains rules that override what you may have learned about Convex from training data.

Convex agent skills for common tasks can be installed by running `npx convex ai-files install`.
<!-- convex-ai-end -->

## Cursor Cloud specific instructions

Monorepo for **The Owner's Box** (npm workspaces + Turborepo). Standard commands live in `COMMANDS.md`; canonical Convex backend is the root `/convex` (not `packages/backend/convex`). The update script already runs `npm install` (Node 20+; `.npmrc` sets `legacy-peer-deps=true`). Below are the non-obvious startup caveats for running services.

### Services
- **Convex backend (required):** from repo root run `CONVEX_AGENT_MODE=anonymous npx convex dev` (anonymous mode = no Convex login). It writes `CONVEX_URL=http://127.0.0.1:3210` to root `.env.local`. Gotcha: functions will **not deploy** until `CLERK_ISSUER_URL` is set on the deployment (it's referenced in `convex/auth.config.js`). Set it with `npx convex env set CLERK_ISSUER_URL <issuer>` where `<issuer>` is the Clerk Frontend API URL — decode it from the publishable key (`pk_test_<base64-domain>` → `https://<domain>`) or copy it from the Clerk dashboard "convex" JWT template.
- **Seed data (once per fresh deployment):** `npm run seed` (= `seedMenu:populate` + `seedRewards:seedRewards`). Verify with `npx convex run products:getAllProducts`.
- **Web app (Next.js, port 3000):** `npm run dev:web`. Needs `apps/web/.env.local` with `NEXT_PUBLIC_CONVEX_URL=http://127.0.0.1:3210`, `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`.
- **Native app (Expo, Metro 8081):** `npm run dev:native`. Needs `apps/native/.env.local` with `EXPO_PUBLIC_CONVEX_URL` + `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`. Requires a device/emulator (Expo Go); not runnable headless in this VM.

### Clerk is mandatory to render any UI
`ClerkProvider` + `clerkMiddleware` wrap the whole app, so a missing/placeholder publishable key makes **every** route (even public pages like `/menu`) redirect to a Clerk "Invalid host" error before React mounts. A real Clerk dev key tied to a live instance is required. Keys are stored as Cursor secrets (`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`, `CLERK_SECRET_KEY`, `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY`); the `.env.local` files are gitignored, so recreate them from those env vars each session. After editing `.env.local`, restart `next dev` — env changes are not hot-reloaded.

### Checks & gotchas
- **Typecheck (use this):** `npm run typecheck` (turbo → `tsc --noEmit` for `web-app` + `@packages/backend`).
- **Lint is broken — don't rely on it:** `next lint` was removed in Next.js 16, and the legacy `apps/web/.eslintrc.json` (`next/core-web-vitals`) is incompatible with ESLint 9. `npm run lint` fails for repo reasons, not your changes.
- **No automated test suite** exists in this repo.
- **Sports data needs no API keys:** the ESPN free fallback works; a 15-min cron syncs games, or run `npx convex run sports_actions:scheduledSyncWithFallback` manually.
- `npm run dev` (root) starts **only** the web app — not Convex or Expo — despite what the README implies.
