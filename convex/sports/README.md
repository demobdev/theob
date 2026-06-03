# OB sports data — redundant free pipeline

War Room scores use a **waterfall**: try sources in order until one succeeds. You do **not** need Sportradar paid keys for the app to get games.

## How it runs

| Cron / action | Path |
|---------------|------|
| Scheduled | `sports_actions.scheduledSyncWithFallback` |
| Manual (admin) | `sports_actions.manualSync` |

Both call [`fallback_sync.ts`](fallback_sync.ts) → `syncUpcomingWeekWithFallback`.

## Waterfall (production cron)

```
1. ESPN           → free, `convex/sports/espn/` (site.api.espn.com)
2. API-Sports     → free tier (~100 req/day) if API_SPORTS_KEY set
3. TheSportsDB    → always free (public key "123", no env var)
```

Sportradar remains in `sportradar/` for legacy/manual use only; scheduled sync does **not** call it.

**Endpoint reference:** [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) · details: [ESPN_MIGRATION.md](ESPN_MIGRATION.md).

## Env vars (minimal)

| Key | Required? |
|-----|-----------|
| *(none)* | TheSportsDB alone can sync major US leagues |
| `API_SPORTS_KEY` | Optional — improves quality before TSDB fallback |
| `SPORTRADAR_*` | **Not needed** — omit to skip tier 1 immediately |

## Logos & links

Team logos use **ESPN CDN** (`a.espncdn.com`) in normalizers and UI — separate from which API supplies schedule/scores.
