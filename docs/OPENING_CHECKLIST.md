# Opening checklist (new build — menu & POS not live yet)

You are ahead of the app: the **restaurant systems** (Genius menu, items, site ID) can land next week while the app keeps using **seed menu** in Convex until you swap real data.

## What is already in your `.env.local` files

| File | What you have today |
|------|---------------------|
| Root `.env.local` | `CONVEX_URL` → **quiet-mole-11** (dev deployment) |
| `apps/native/.env.local` | `EXPO_PUBLIC_CONVEX_URL` + **Clerk test** publishable key |
| `apps/web/.env.local` | `NEXT_PUBLIC_CONVEX_URL` + Clerk test publishable + secret |

Run `npm run sync:env` after changing root `CONVEX_URL`.

**Genius / Xenial keys are not in `.env.local` on purpose** — they must only live on the **Convex deployment** (server-side). Never put integrator tokens in Expo or Next env files.

## Where to put keys when you get them

### 1. Clerk (sign-in) — already partially done

| Key | Where |
|-----|--------|
| `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` | `apps/native/.env.local` |
| `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` | `apps/web/.env.local` |
| `CLERK_SECRET_KEY` | `apps/web/.env.local` only |
| `CLERK_ISSUER_URL` | **Convex dashboard** (not mobile) |

Before opening: switch Clerk to **production** keys in the same places + update `CLERK_ISSUER_URL` on Convex.

### 2. Genius / Xenial POS — when Hector sends sandbox

Set only on Convex (**quiet-mole-11** or your prod deployment):

```powershell
npx convex env set GENIUS_API_BASE_URL "https://..."
npx convex env set GENIUS_INTEGRATOR_TOKEN "..."
npx convex env set GENIUS_SITE_ID "greenville-site-id-from-xenial"
npx convex env set GENIUS_WEBHOOK_SECRET "..."
```

Until these exist, orders still save in Convex; POS sync stays in **stub** mode (see Convex order `posSyncError`).

### 3. Menu — not an env var

Real menu items will come from:

1. **Genius/Xenial** as source of truth (future sync), or  
2. **Convex** `products` / `categories` (today: `seedMenu:populate` demo data)

For opening without POS menu yet: keep seeding or add items via Convex dashboard / a small admin import.

### 4. Optional (can skip for week one)

| Key | Where | Needed for opening? |
|-----|--------|---------------------|
| `API_SPORTS_KEY` | Convex | No — free fallbacks work |
| `OPENAI_API_KEY` | Convex | No |
| PostHog / Sentry | app `.env.local` | No |

## Sensible order for next week

1. **This week (app):** Clerk prod keys, test full pickup flow on seed menu, EAS build if needed.  
2. **When walls are up:** Genius sandbox + Greenville `GENIUS_SITE_ID`.  
3. **When menu exists in Genius:** map POS product IDs → Convex (or sync job).  
4. **Day before soft open:** real payment tokenization (replaces mock cards).  
5. **Opening day:** webhook “order ready” + push notifications.

## Templates

Committed examples (no secrets): [`.env.example`](../.env.example), [`apps/native/.env.example`](../apps/native/.env.example), [`apps/web/.env.example`](../apps/web/.env.example).

Full key list: [`convex/ENV_KEYS.md`](../convex/ENV_KEYS.md).
