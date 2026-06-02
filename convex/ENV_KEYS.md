# Convex deployment environment variables

Set in the [Convex dashboard](https://dashboard.convex.dev/d/quiet-mole-11/settings/environment-variables) or:

```bash
npx convex env set KEY_NAME "value"
```

## Required

| Key | Notes |
|-----|--------|
| `CLERK_ISSUER_URL` | Clerk JWT issuer for Convex auth |

## Sports — redundant **free** pipeline

OB uses a 3-tier waterfall ([`sports/README.md`](sports/README.md)):

1. **Sportradar** (optional — skip by leaving keys unset)
2. **API-Sports** (optional free tier — `API_SPORTS_KEY`)
3. **TheSportsDB** (always free, no env var)

**You can run War Room with zero sports keys** — sync falls through to TheSportsDB.

**Planned:** ESPN public scoreboards as tier 1 (free, no key). Docs: [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) · OB plan: [`sports/ESPN_MIGRATION.md`](sports/ESPN_MIGRATION.md).

| Key | Needed? |
|-----|---------|
| `SPORTRADAR_*` | **No** — deprecating; omit to use free fallbacks |
| `API_SPORTS_KEY` | Optional (free plan at api-sports.io) |
| `OPENAI_API_KEY` | Optional (AI notes only) |

## Genius / Xenial POS (server-only)

**Do not** put these in `apps/native/.env.local` or `apps/web/.env.local`.

| Key | Notes |
|-----|--------|
| `GENIUS_API_BASE_URL` | Sandbox or prod API host from integrator docs |
| `GENIUS_INTEGRATOR_TOKEN` | From Hector / Heartland-Xenial onboarding |
| `GENIUS_SITE_ID` | Greenville store id inside Xenial |
| `GENIUS_WEBHOOK_SECRET` | When status webhooks are configured |

```bash
npx convex env set GENIUS_API_BASE_URL "https://..."
npx convex env set GENIUS_INTEGRATOR_TOKEN "..."
npx convex env set GENIUS_SITE_ID "..."
```

Until set, `placeOrder` still works; [`integrations/genius/submitOrder.ts`](integrations/genius/submitOrder.ts) records a stub sync. See [`docs/GENIUS_POS_ROADMAP.md`](../docs/GENIUS_POS_ROADMAP.md).

## Client apps

Clerk + Convex URL: `apps/native/.env.local` and `apps/web/.env.local`. Templates: [`.env.example`](../.env.example). Opening timeline: [`docs/OPENING_CHECKLIST.md`](../docs/OPENING_CHECKLIST.md).
