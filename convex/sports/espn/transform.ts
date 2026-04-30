/**
 * ESPN Data Transformer
 */
import { SportKey } from "../types";

function getStatus(status: any) {
  if (status.type.completed) return "closed";
  if (status.type.state === "in") return "inprogress";
  return "scheduled";
}

export function transformEspnGame(event: any, sportKey: SportKey, league: string) {
  const comp = event.competitions?.[0];
  if (!comp) throw new Error("No competition data");

  let home = comp.competitors?.find((t: any) => t.homeAway === "home");
  let away = comp.competitors?.find((t: any) => t.homeAway === "away");

  // Fallback for individual sports (Golf, Tennis, F1) which don't have home/away
  if (!home && !away && comp.competitors?.length >= 2) {
    home = comp.competitors[0];
    away = comp.competitors[1];
  }

  if (!home || !away) {
    throw new Error(`Could not determine two competitors (home/away) for event`);
  }

  const leagueMap: Record<string, string> = {
    "usa.1": "MLS",
    "eng.1": "Premier League",
    "college-football": "NCAAF",
    "pga": "PGA Tour",
    "atp": "ATP",
    "wta": "WTA",
    "f1": "Formula 1",
  };

  const leagueLabel = leagueMap[league] || league.toUpperCase();

  const getEntity = (c: any) => {
    const entity = c?.team || c?.athlete || {};
    // Generate headshot URL for individual sports if athlete is present
    if (c?.athlete && c?.id) {
      const sportPath = sportKey === "GOLF" ? "golf" : sportKey === "TENNIS" ? "tennis" : "racing";
      entity.logo = `https://a.espncdn.com/i/headshots/${sportPath}/players/full/${c.id}.png`;
      // Use flag as fallback if we want, but logo URL is primary
    }
    return entity;
  };

  const homeEntity = getEntity(home);
  const awayEntity = getEntity(away);

  return {
    externalId: event.id,
    sport: sportKey,
    league: leagueLabel,
    status: getStatus(event.status),
    startsAt: event.date,
    
    homeTeam: {
      id: homeEntity.id || home.id,
      name: homeEntity.displayName || homeEntity.fullName || "TBD",
      abbr: homeEntity.abbreviation || homeEntity.shortName || "TBD",
      logoUrl: homeEntity.logo || homeEntity.flag?.href || undefined,
      logoUrlSmall: homeEntity.logo?.replace("/500/", "/100/") || homeEntity.flag?.href || undefined,
      score: Number(home.score || 0),
      wins: home.records?.[0]?.summary?.split("-")[0] ? Number(home.records[0].summary.split("-")[0]) : undefined,
      losses: home.records?.[0]?.summary?.split("-")[1] ? Number(home.records[0].summary.split("-")[1]) : undefined,
      draws: home.records?.[0]?.summary?.split("-")[2] ? Number(home.records[0].summary.split("-")[2]) : undefined,
    },
    
    awayTeam: {
      id: awayEntity.id || away.id,
      name: awayEntity.displayName || awayEntity.fullName || "TBD",
      abbr: awayEntity.abbreviation || awayEntity.shortName || "TBD",
      logoUrl: awayEntity.logo || awayEntity.flag?.href || undefined,
      logoUrlSmall: awayEntity.logo?.replace("/500/", "/100/") || awayEntity.flag?.href || undefined,
      score: Number(away.score || 0),
      wins: away.records?.[0]?.summary?.split("-")[0] ? Number(away.records[0].summary.split("-")[0]) : undefined,
      losses: away.records?.[0]?.summary?.split("-")[1] ? Number(away.records[0].summary.split("-")[1]) : undefined,
      draws: away.records?.[0]?.summary?.split("-")[2] ? Number(away.records[0].summary.split("-")[2]) : undefined,
    },
    
    venue: {
      name: comp.venue?.fullName || "TBD",
      city: comp.venue?.address?.city,
      state: comp.venue?.address?.state,
    },
    
    broadcast: comp.broadcasts?.[0]?.names?.[0] || null,
    lastSyncedAt: new Date().toISOString(),
  };
}
