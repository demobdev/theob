# OB sports data — redundant free pipeline

War Room scores use a **waterfall**: try sources in order until one succeeds. You do **not** need Sportradar paid keys for the app to get games.

## How it runs

| Cron / action | Path |
|---------------|------|
| Scheduled | `sports_actions.scheduledSyncWithFallback` |
| Manual (admin) | `sports_actions.manualSync` |

Both call [`fallback_sync.ts`](fallback_sync.ts) → `syncUpcomingWeekWithFallback`.

## Waterfall (today in git)

```
1. Sportradar     → skips if no SPORTRADAR_* key (throws → next)
2. API-Sports     → free tier (~100 req/day) if API_SPORTS_KEY set
3. TheSportsDB    → always free (public key "123", no env var)
```

If step 1 fails and step 2 has no key, **step 3 still fills the War Room** for NBA/NHL/MLB/NFL/NCAAF.

Golf: only Sportradar path today; may be empty without SR key until ESPN migration.

## Planned: ESPN as source 1 (free)

Replace Sportradar with ESPN public scoreboards (`site.api.espn.com`) — no API key.

**Endpoint reference:** [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) (community docs for the same APIs ESPN’s apps use).

Keep API-Sports + TheSportsDB as fallbacks. Implementation plan: [ESPN_MIGRATION.md](ESPN_MIGRATION.md).

## Env vars (minimal)

| Key | Required? |
|-----|-----------|
| *(none)* | TheSportsDB alone can sync major US leagues |
| `API_SPORTS_KEY` | Optional — improves quality before TSDB fallback |
| `SPORTRADAR_*` | **Not needed** — omit to skip tier 1 immediately |

## Logos & links

Team logos use **ESPN CDN** (`a.espncdn.com`) in normalizers and UI — separate from which API supplies schedule/scores.
