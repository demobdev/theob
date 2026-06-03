import React, { useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { formatVenueTime } from "../lib/venueTimezone";

type TeamSide = {
  name?: string;
  abbr?: string;
  logoUrl?: string | null;
};

export type TonightGame = {
  _id?: string;
  sport?: string;
  status?: string;
  startsAt?: string;
  isPrimeTime?: boolean;
  tournamentName?: string | null;
  awayTeam?: TeamSide;
  homeTeam?: TeamSide;
};

type Props = {
  games: TonightGame[];
  onViewSchedule: () => void;
};

function sortByStart(a: TonightGame, b: TonightGame) {
  return new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime();
}

function sortByStartDesc(a: TonightGame, b: TonightGame) {
  return sortByStart(b, a);
}

/** Matches Convex GameStatus "closed" plus legacy/raw aliases from feeds. */
export function isTerminalGameStatus(status?: string): boolean {
  const s = (status ?? "").toLowerCase();
  return (
    s === "closed" ||
    s === "final" ||
    s === "completed" ||
    s === "complete"
  );
}

function isActiveTonightGame(game: TonightGame): boolean {
  const s = (game.status ?? "").toLowerCase();
  if (isTerminalGameStatus(s)) return false;
  if (s === "cancelled" || s === "postponed") return false;
  return true;
}

export function pickTonightHighlight(games: TonightGame[]): TonightGame | null {
  if (!games.length) return null;

  const active = games.filter(isActiveTonightGame);

  const live = active.filter((g) => g.status === "inprogress");
  const liveUfc = live.filter((g) => g.sport === "UFC").sort(sortByStart)[0];
  if (liveUfc) return liveUfc;
  if (live.length) return [...live].sort(sortByStart)[0];

  const scheduled = active.filter((g) => g.status !== "inprogress");
  const ufc = scheduled.filter((g) => g.sport === "UFC").sort(sortByStart)[0];
  if (ufc) return ufc;

  const prime = scheduled.filter((g) => g.isPrimeTime).sort(sortByStart)[0];
  if (prime) return prime;

  const next = scheduled.sort(sortByStart)[0];
  if (next) return next;

  const finals = games.filter((g) => isTerminalGameStatus(g.status));
  if (!finals.length) return null;

  const primeFinal = finals.filter((g) => g.isPrimeTime).sort(sortByStartDesc)[0];
  return primeFinal ?? finals.sort(sortByStartDesc)[0];
}

function matchupLabel(game: TonightGame): string {
  if (game.sport === "UFC") {
    const a = game.awayTeam?.name ?? "TBD";
    const b = game.homeTeam?.name ?? "TBD";
    return `${a} vs ${b}`;
  }
  const away = game.awayTeam?.abbr ?? game.awayTeam?.name ?? "AWAY";
  const home = game.homeTeam?.abbr ?? game.homeTeam?.name ?? "HOME";
  return `${away} @ ${home}`;
}

function headlineFor(game: TonightGame): string {
  if (game.sport === "UFC") {
    return game.tournamentName ?? "UFC Fight Night";
  }
  return `${game.sport ?? "GAME"}${game.isPrimeTime ? " · PRIME TIME" : ""}`;
}

export default function TonightAtTheOB({ games, onViewSchedule }: Props) {
  const highlight = useMemo(() => pickTonightHighlight(games), [games]);

  if (!highlight) return null;

  const isLive = highlight.status === "inprogress";
  const isFinal = isTerminalGameStatus(highlight.status);
  const isUfc = highlight.sport === "UFC";
  const timeLabel = isLive
    ? "LIVE NOW"
    : isFinal
      ? "FINAL"
      : highlight.startsAt
        ? formatVenueTime(highlight.startsAt)
        : "TONIGHT";

  return (
    <View style={styles.wrap}>
      <View style={styles.headerRow}>
        <Text style={styles.sectionLabel}>TONIGHT AT THE OB</Text>
        <TouchableOpacity style={styles.scheduleLink} onPress={onViewSchedule}>
          <Text style={styles.scheduleLinkText}>VIEW SCHEDULE</Text>
          <Ionicons name="chevron-forward" size={14} color="#FFA500" />
        </TouchableOpacity>
      </View>

      <TouchableOpacity
        style={styles.card}
        onPress={onViewSchedule}
        activeOpacity={0.85}
      >
        <View style={styles.cardTop}>
          <View style={styles.badgeRow}>
            {isLive && (
              <View style={styles.liveBadge}>
                <View style={styles.liveDot} />
                <Text style={styles.liveBadgeText}>LIVE</Text>
              </View>
            )}
            {isFinal && !isLive && (
              <View style={styles.finalBadge}>
                <Text style={styles.finalBadgeText}>FINAL</Text>
              </View>
            )}
            <Text style={styles.sportPill}>{highlight.sport ?? "GAME"}</Text>
          </View>
          <Text style={styles.timeText}>{timeLabel}</Text>
        </View>

        <Text style={styles.headline} numberOfLines={1}>
          {headlineFor(highlight)}
        </Text>

        <View style={styles.matchupRow}>
          {!isUfc && highlight.awayTeam?.logoUrl ? (
            <Image
              source={{ uri: highlight.awayTeam.logoUrl }}
              style={styles.teamLogo}
            />
          ) : null}
          <Text style={styles.matchupText} numberOfLines={2}>
            {matchupLabel(highlight)}
          </Text>
          {!isUfc && highlight.homeTeam?.logoUrl ? (
            <Image
              source={{ uri: highlight.homeTeam.logoUrl }}
              style={styles.teamLogo}
            />
          ) : null}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    paddingHorizontal: 20,
    marginTop: 28,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionLabel: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 2,
  },
  scheduleLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  scheduleLinkText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 1,
  },
  card: {
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 165, 0, 0.35)",
    padding: 16,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(74, 222, 128, 0.15)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    gap: 5,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4ade80",
  },
  liveBadgeText: {
    color: "#4ade80",
    fontFamily: "MBold",
    fontSize: 8,
    letterSpacing: 1,
  },
  finalBadge: {
    backgroundColor: "rgba(136, 136, 136, 0.2)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  finalBadgeText: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: 8,
    letterSpacing: 1,
  },
  sportPill: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 1,
  },
  timeText: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  headline: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    marginBottom: 10,
  },
  matchupRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  teamLogo: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  matchupText: {
    flex: 1,
    color: "#CCC",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    lineHeight: 18,
  },
});
