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
1. ESPN           → free, `convex/sports/espn/` (API logos + prime-time flags)
2. API-Sports     → free tier (~100 req/day) if API_SPORTS_KEY set
3. TheSportsDB    → always free (public key "123", no env var)
```

Sportradar remains in `sportradar/` for legacy/manual use only; scheduled sync does **not** call it.

**Endpoint reference:** [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) · details: [ESPN_MIGRATION.md](ESPN_MIGRATION.md).

**UFC:** Synced via ESPN MMA scoreboard only (`mma/ufc`). One row per fight night; no API-Sports/TSDB fallback.

**NASCAR / F1:** Synced via ESPN racing scoreboards only:
- NASCAR Cup: `racing/nascar-premier/scoreboard`
- Formula 1: `racing/f1/scoreboard`

One row per race weekend (main **Race** session). Top-two drivers map to `awayTeam`/`homeTeam`; additional names go in `editorialNote`. Practice/qualifying sessions are not separate rows (deferred).

## Env vars (minimal)

| Key | Required? |
|-----|-----------|
| *(none)* | TheSportsDB alone can sync major US leagues |
| `API_SPORTS_KEY` | Optional — improves quality before TSDB fallback |
| `SPORTRADAR_*` | **Not needed** — omit to skip tier 1 immediately |

## Logos & links

Team logos use **ESPN CDN** (`a.espncdn.com`) in normalizers and UI — separate from which API supplies schedule/scores.
