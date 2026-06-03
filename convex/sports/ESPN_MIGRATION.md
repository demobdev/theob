# ESPN sports API migration (replaces Sportradar)

**Reference:** [pseudo-r/Public-ESPN-API](https://github.com/pseudo-r/Public-ESPN-API) — documented public ESPN endpoints (no API key). Use this when implementing `convex/sports/espn/`.

## Current state (in git)

| Layer | What runs today |
|-------|------------------|
| Cron | `scheduledSyncWithFallback` every 30 min |
| Sync | ESPN (prime-time flags + API logos) → API-Sports → TheSportsDB via [`fallback_sync.ts`](fallback_sync.ts) |
| Logos / UI | ESPN CDN + `TeamDetailSheet` links |
| Env | No ESPN keys; optional `API_SPORTS_KEY` for tier 2 |

Sportradar code is legacy; not used by the scheduled cron.

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
| UFC | `mma` | `ufc` |

**Examples:**

```bash
curl "https://site.api.espn.com/apis/site/v2/sports/football/nfl/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/football/college-football/scoreboard?dates=20241215"
curl "https://site.api.espn.com/apis/site/v2/sports/basketball/nba/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/baseball/mlb/scoreboard?dates=20241215"
curl "https://site.api.espn.com/apis/site/v2/sports/hockey/nhl/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/golf/pga/scoreboard"
curl "https://site.api.espn.com/apis/site/v2/sports/mma/ufc/scoreboard"
```

**UFC notes:** Each ESPN `event` is a fight night (card). Map one `UpcomingGame` per event — headliner from the **last** `competition` (main event). Fighters use `competitors[].athlete`, not team objects. API-Sports and TheSportsDB fallbacks are skipped for UFC.

Response shape: `events[]` with `competitions[]`, `competitors[]`, `status`, scores — map into existing `UpcomingGame` in [`types.ts`](types.ts).

**Also useful from the doc:**

- v3 scoreboard: `/apis/site/v3/sports/{sport}/{league}/scoreboard` (richer schema)
- News: `now.core.api.espn.com` (team news in `TeamDetailSheet`)
- Standings: `/apis/v2/sports/.../standings` (not `/apis/site/v2/...` — site path is a stub per doc)

---

## Implementation checklist

- [x] `convex/sports/espn/sync.ts` — prime-time carousel flags (first 2 live/upcoming per batch)
- [x] `convex/sports/espn/client.ts` — `fetchEspnScoreboard(sportKey, ymd)`
- [x] `convex/sports/espn/normalize.ts` — ESPN `events` → `UpcomingGame` (API logos, `logoUrlSmall`, record draws)
- [x] `convex/sports/espn/logos.ts` — ESPN CDN logo URLs
- [x] [`fallback_sync.ts`](fallback_sync.ts) — ESPN-first waterfall
- [x] [`crons.ts`](../crons.ts) — `scheduledSyncWithFallback`
- [ ] **Mirror** `apps/web/src/lib/sports/` if web admin sync should match (optional)
- [ ] **Legal** — unofficial API; review before App Store scale

---

## Env vars after migration

**None** for ESPN. Optional: `API_SPORTS_KEY` for tier 2 only.

---

## Clone the reference repo (optional, local docs only)

```bash
git clone https://github.com/pseudo-r/Public-ESPN-API.git
```

Do not vendor into `theob` unless you want a submodule; link is enough for implementation.
