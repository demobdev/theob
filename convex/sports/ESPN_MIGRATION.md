# ESPN sports API migration (replaces Sportradar)

**Reference:** [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) — documented public ESPN endpoints (no API key). Use this when implementing `convex/sports/espn/`.

## Current state (in git)

| Layer | What runs today |
|-------|------------------|
| Sync | `sportradar/sync.ts` + `fallback_sync.ts` waterfall (Sportradar → API-Sports → TheSportsDB) |
| Logos / UI | ESPN CDN (`a.espncdn.com`) + ESPN web links in `TeamDetailSheet` |
| Env | `SPORTRADAR_*` optional; `API_SPORTS_KEY` optional; TheSportsDB needs nothing |

**No `convex/sports/espn/` module on `main` yet.**

## Target waterfall (redundant & free)

| Tier | Source | Cost |
|------|--------|------|
| 1 | **ESPN** `site.api.espn.com` | Free, no key |
| 2 | API-Sports | Free tier with `API_SPORTS_KEY` |
| 3 | TheSportsDB | Free (no key) |

Retire Sportradar from the waterfall.

---

## OB league → ESPN paths

Pattern (from Public-ESPN-API):

```
GET https://site.api.espn.com/apis/site/v2/sports/{sport}/{league}/scoreboard
GET .../scoreboard?dates=YYYYMMDD   # historical / specific day
```

| OB `SportKey` | `{sport}` | `{league}` |
|---------------|-----------|------------|
| NFL | `football` | `nfl` |
| NCAAF | `football` | `college-football` |
| NBA | `basketball` | `nba` |
| MLB | `baseball` | `mlb` |
| NHL | `hockey` | `nhl` |
| GOLF | `golf` | `pga` |

**Examples:**

```bash
curl "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=20241215"
curl "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=20241215"
curl "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard"
```

Response shape: `events[]` with `competitions[]`, `competitors[]`, `status`, scores — map into existing `UpcomingGame` in [`types.ts`](types.ts).

**Also useful from the doc:**

- v3 scoreboard: `/apis/site/v3/sports/{sport}/{league}/scoreboard` (richer schema)
- News: `now.core.api.espn.com` (team news in `TeamDetailSheet`)
- Standings: `/apis/v2/sports/.../standings` (not `/apis/site/v2/...` — site path is a stub per doc)

---

## Implementation checklist

1. **Add** `convex/sports/espn/client.ts` — `fetchScoreboard(sportKey, ymd)` using table above + `dates` param.
2. **Add** `convex/sports/espn/normalize.ts` — map ESPN `events` → `UpcomingGame`; reuse `getEspnLogoUrl` from [`sportradar/normalize.ts`](sportradar/normalize.ts) or extract to `espn/logos.ts`.
3. **Update** [`fallback_sync.ts`](fallback_sync.ts) — ESPN first, then API-Sports, then TheSportsDB; delete or gate Sportradar.
4. **Caching** — respect ESPN rate limits (doc recommends cache between cron runs; OB already sleeps between sports).
5. **Update** [`sports_actions.ts`](../sports_actions.ts) — cron stays on `scheduledSyncWithFallback`.
6. **Mirror** `apps/web/src/lib/sports/` if web still imports Sportradar.
7. **Legal** — Public-ESPN-API disclaimer: unofficial API, may change; review before App Store scale.

---

## Env vars after migration

**None** for ESPN. Optional: `API_SPORTS_KEY` for tier 2 only.

---

## Clone the reference repo (optional, local docs only)

```bash
git clone https://github.com/pseudo-r/Public-ESPN-API.git
```

Do not vendor into `theob` unless you want a submodule; link is enough for implementation.
