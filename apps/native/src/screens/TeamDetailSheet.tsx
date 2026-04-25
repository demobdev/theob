import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Linking,
  Platform,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

const { width } = Dimensions.get("window");

/**
 * ESPN URL generators for each sport.
 */
const ESPN_TEAM_URLS: Record<string, (slug: string) => string> = {
  NBA:  (slug) => `https://www.espn.com/nba/team/_/name/${slug}`,
  NHL:  (slug) => `https://www.espn.com/nhl/team/_/name/${slug}`,
  MLB:  (slug) => `https://www.espn.com/mlb/team/_/name/${slug}`,
  NFL:  (slug) => `https://www.espn.com/nfl/team/_/name/${slug}`,
  NCAAF:(slug) => `https://www.espn.com/college-football/team/_/id/${slug}`,
};

/**
 * ESPN slug overrides — maps our abbreviation to ESPN's URL slug.
 */
const ESPN_SLUGS: Record<string, Record<string, string>> = {
  NBA: {
    GSW: "gs", LAL: "lal", BOS: "bos", MIA: "mia", PHX: "phx",
    MIL: "mil", PHI: "phi", NYK: "ny", BRK: "bkn", CHI: "chi",
    DEN: "den", DAL: "dal", LAC: "lac", ATL: "atl", CLE: "cle",
    TOR: "tor", MEM: "mem", NOP: "no", UTA: "utah", OKC: "okc",
    SAC: "sac", POR: "por", MIN: "min", ORL: "orl", IND: "ind",
    CHA: "cha", WAS: "wsh", DET: "det", HOU: "hou", SAS: "sa",
  },
  NHL: {
    BOS: "bos", NYR: "nyr", TOR: "tor", MTL: "mtl", CHI: "chi",
    PIT: "pit", PHI: "phi", WSH: "wsh", TBL: "tb", FLA: "fla",
    DET: "det", EDM: "edm", CGY: "cgy", VAN: "van", COL: "col",
    STL: "stl", DAL: "dal", VGK: "vgk", SEA: "sea", ARI: "ari",
    CBJ: "cbj", MIN: "min", BUF: "buf", OTT: "ott", CAR: "car",
    NJD: "nj",  NYI: "nyi", ANA: "ana", SJS: "sj",  LAK: "la",
  },
  MLB: {
    NYY: "nyy", BOS: "bos", LAD: "lad", CHC: "chc", STL: "stl",
    SFG: "sf",  ATL: "atl", NYM: "nym", PHI: "phi", WSN: "wsh",
    HOU: "hou", OAK: "oak", SEA: "sea", TEX: "tex", LAA: "laa",
    TOR: "tor", BAL: "bal", TBR: "tb",  CWS: "chw", MIN: "min",
    KCR: "kc",  DET: "det", CLE: "cle", MIL: "mil", CIN: "cin",
    PIT: "pit",  COL: "col", SDP: "sd",  ARI: "ari", MIA: "mia",
  },
  NFL: {
    NE: "ne",   KC: "kc",   BUF: "buf", MIA: "mia", BAL: "bal",
    CIN: "cin", CLE: "cle", PIT: "pit", HOU: "hou", IND: "ind",
    JAX: "jax", TEN: "ten", DEN: "den", LV: "lv",   LAC: "lac",
    SEA: "sea", DAL: "dal", PHI: "phi", NYG: "nyg", WAS: "wsh",
    CHI: "chi", DET: "det", GB: "gb",   MIN: "min", NO: "no",
    ATL: "atl", CAR: "car", TB: "tb",   LAR: "lar", SF: "sf",
    ARI: "ari",
  },
};

function getESPNUrl(sport: string, abbr: string): string | null {
  const urlFn = ESPN_TEAM_URLS[sport?.toUpperCase()];
  if (!urlFn) return null;

  const slugMap = ESPN_SLUGS[sport?.toUpperCase()] ?? {};
  const slug = slugMap[abbr?.toUpperCase()] ?? abbr?.toLowerCase();

  return urlFn(slug);
}

interface TeamDetailSheetProps {
  team: {
    name: string;
    abbr: string;
    logoUrl?: string | null;
    wins?: number | null;
    losses?: number | null;
    score?: number | null;
  };
  sport: string;
  opponent?: {
    name: string;
    abbr: string;
    logoUrl?: string | null;
    score?: number | null;
  };
  gameStatus?: string;
  startsAt?: string;
  onClose: () => void;
}

/**
 * TeamDetailSheet — Bottom sheet that slides up when a team is tapped.
 * Shows team logo, name, record, and links out to ESPN.
 */
const TeamDetailSheet: React.FC<TeamDetailSheetProps> = ({
  team,
  sport,
  opponent,
  gameStatus,
  startsAt,
  onClose,
}) => {
  const espnUrl = getESPNUrl(sport, team.abbr);
  const isFinal = gameStatus === "closed";
  const isLive  = gameStatus === "inprogress";

  const openESPN = () => {
    if (!espnUrl) return;
    Linking.openURL(espnUrl).catch(() => {
      console.warn("Could not open ESPN URL:", espnUrl);
    });
  };

  const openESPNNews = () => {
    const newsUrl = espnUrl ? `${espnUrl}/news` : `https://www.espn.com`;
    Linking.openURL(newsUrl).catch(() => {});
  };

  const sportColor: Record<string, string> = {
    NBA: "#FF6B00", NHL: "#A2AAAD", MLB: "#E31837",
    NFL: "#013369", NCAAF: "#4E2A84", GOLF: "#2d6a4f",
  };
  const accent = sportColor[sport] ?? "#FFA500";

  return (
    <View style={styles.overlay}>
      {/* Backdrop */}
      <TouchableOpacity style={styles.backdrop} onPress={onClose} activeOpacity={1} />

      {/* Sheet */}
      <View style={styles.sheet}>
        <LinearGradient
          colors={["#1a1a1a", "#111111"]}
          style={styles.sheetGradient}
        >
          {/* Handle */}
          <View style={styles.handle} />

          {/* Close Button */}
          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Ionicons name="close" size={20} color="#888" />
          </TouchableOpacity>

          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Team Logo + Name */}
            <View style={styles.teamHero}>
              <View style={[styles.logoBg, { borderColor: accent }]}>
                {team.logoUrl ? (
                  <Image
                    source={{ uri: team.logoUrl }}
                    style={styles.teamLogo}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={[styles.abbr, { color: accent }]}>{team.abbr}</Text>
                )}
              </View>
              <Text style={styles.teamName}>{team.name?.toUpperCase()}</Text>
              <View style={[styles.sportPill, { backgroundColor: accent }]}>
                <Text style={styles.sportPillText}>{sport}</Text>
              </View>
            </View>

            {/* Record if available */}
            {(team.wins != null || team.losses != null) && (
              <View style={styles.recordRow}>
                <View style={styles.statBlock}>
                  <Text style={styles.statNum}>{team.wins ?? "—"}</Text>
                  <Text style={styles.statLabel}>WINS</Text>
                </View>
                <View style={styles.statDivider} />
                <View style={styles.statBlock}>
                  <Text style={styles.statNum}>{team.losses ?? "—"}</Text>
                  <Text style={styles.statLabel}>LOSSES</Text>
                </View>
              </View>
            )}

            {/* Matchup context */}
            {opponent && (
              <View style={styles.matchupRow}>
                <View style={[styles.statusBadge,
                  isLive ? styles.liveBadge :
                  isFinal ? styles.finalBadge :
                  styles.scheduledBadge
                ]}>
                  <Text style={styles.statusText}>
                    {isLive ? "🔴 LIVE" : isFinal ? "FINAL" : "UPCOMING"}
                  </Text>
                </View>
                <Text style={styles.vsText}>
                  {team.name} {isFinal || isLive
                    ? `${team.score ?? "—"}  vs  ${opponent.score ?? "—"}`
                    : "vs"
                  } {opponent.name}
                </Text>
                {startsAt && !isFinal && (
                  <Text style={styles.gameTime}>
                    {new Date(startsAt).toLocaleString([], {
                      weekday: "short", month: "short", day: "numeric",
                      hour: "numeric", minute: "2-digit",
                    })}
                  </Text>
                )}
              </View>
            )}

            {/* Action Buttons */}
            <View style={styles.actions}>
              <TouchableOpacity
                style={[styles.actionBtn, { backgroundColor: accent }]}
                onPress={openESPN}
                disabled={!espnUrl}
              >
                <Ionicons name="stats-chart" size={16} color="#fff" />
                <Text style={styles.actionBtnText}>TEAM STATS ON ESPN</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnOutline}
                onPress={openESPNNews}
              >
                <Ionicons name="newspaper-outline" size={16} color={accent} />
                <Text style={[styles.actionBtnOutlineText, { color: accent }]}>
                  LATEST NEWS &amp; UPDATES
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionBtnOutline}
                onPress={() => {
                  const scheduleUrl = espnUrl ? `${espnUrl}/schedule` : `https://www.espn.com`;
                  Linking.openURL(scheduleUrl).catch(() => {});
                }}
              >
                <Ionicons name="calendar-outline" size={16} color="#888" />
                <Text style={[styles.actionBtnOutlineText, { color: "#888" }]}>
                  FULL SCHEDULE
                </Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.poweredBy}>Powered by ESPN — opens in browser</Text>
          </ScrollView>
        </LinearGradient>
      </View>
    </View>
  );
};

export default TeamDetailSheet;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 999,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  sheet: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    overflow: "hidden",
    maxHeight: "85%",
  },
  sheetGradient: {
    paddingHorizontal: 20,
    paddingBottom: Platform.OS === "ios" ? 40 : 24,
    paddingTop: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#444",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },
  closeBtn: {
    position: "absolute",
    top: 16,
    right: 20,
    padding: 4,
    zIndex: 10,
  },
  teamHero: {
    alignItems: "center",
    marginTop: 12,
    marginBottom: 20,
  },
  logoBg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    backgroundColor: "#222",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  teamLogo: {
    width: 80,
    height: 80,
  },
  abbr: {
    fontSize: 28,
    fontWeight: "900",
    letterSpacing: 2,
  },
  teamName: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: 1.5,
    textAlign: "center",
    marginBottom: 8,
  },
  sportPill: {
    paddingHorizontal: 12,
    paddingVertical: 3,
    borderRadius: 12,
  },
  sportPillText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  recordRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1f1f1f",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  statBlock: {
    alignItems: "center",
    paddingHorizontal: 32,
  },
  statNum: {
    color: "#fff",
    fontSize: 28,
    fontWeight: "900",
  },
  statLabel: {
    color: "#888",
    fontSize: 10,
    letterSpacing: 1.5,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: "#333",
  },
  matchupRow: {
    backgroundColor: "#1a1a1a",
    borderRadius: 12,
    padding: 14,
    marginBottom: 16,
    alignItems: "center",
    gap: 6,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 8,
    marginBottom: 4,
  },
  liveBadge:       { backgroundColor: "#E31837" },
  finalBadge:      { backgroundColor: "#333" },
  scheduledBadge:  { backgroundColor: "#1a3a1a" },
  statusText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  vsText: {
    color: "#ccc",
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },
  gameTime: {
    color: "#888",
    fontSize: 11,
    marginTop: 2,
  },
  actions: {
    gap: 10,
    marginBottom: 16,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 14,
    borderRadius: 12,
  },
  actionBtnText: {
    color: "#fff",
    fontSize: 13,
    fontWeight: "800",
    letterSpacing: 1,
  },
  actionBtnOutline: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 13,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
  },
  actionBtnOutlineText: {
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  poweredBy: {
    color: "#555",
    fontSize: 10,
    textAlign: "center",
    marginTop: 4,
  },
});
