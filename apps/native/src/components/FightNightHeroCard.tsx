import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");
const UFC_RED = "#D20A0A";

export type FightNightGame = {
  _id?: string;
  id?: string;
  status?: string;
  startsAt: string;
  tournamentName?: string | null;
  broadcast?: string | null;
  venue?: { name?: string | null; city?: string | null; state?: string | null };
  awayTeam?: { name?: string; logoUrl?: string | null; abbr?: string | null };
  homeTeam?: { name?: string; logoUrl?: string | null; abbr?: string | null };
};

type Props = {
  event: FightNightGame;
  onPress: () => void;
};

const FighterCol = ({
  fighter,
}: {
  fighter?: { name?: string; logoUrl?: string | null; abbr?: string | null };
}) => (
  <View style={styles.fighterCol}>
    <View style={styles.fighterAvatar}>
      {fighter?.logoUrl ? (
        <Image source={{ uri: fighter.logoUrl }} style={styles.fighterFlag} resizeMode="cover" />
      ) : (
        <Ionicons name="person" size={28} color="#888" />
      )}
    </View>
    <Text style={styles.fighterName} numberOfLines={2}>
      {(fighter?.name ?? "TBD").toUpperCase()}
    </Text>
  </View>
);

export default function FightNightHeroCard({ event, onPress }: Props) {
  const isLive = event.status === "inprogress";
  const startDate = new Date(event.startsAt);

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.9}>
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.sportBadge}>
            <Ionicons name="fitness" size={12} color="#fff" />
            <Text style={styles.sportBadgeText}>UFC</Text>
          </View>
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerLabel}>
          {isLive ? "FIGHT NIGHT LIVE" : "NEXT FIGHT NIGHT"}
        </Text>
      </View>

      <Text style={styles.eventTitle} numberOfLines={2}>
        {event.tournamentName ?? "UFC Fight Night"}
      </Text>

      <View style={styles.matchupRow}>
        <FighterCol fighter={event.awayTeam} />
        <View style={styles.vsCol}>
          <Text style={styles.vsText}>VS</Text>
          {!isLive && (
            <>
              <Text style={styles.fightTime}>
                {startDate.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
              </Text>
              <Text style={styles.fightDate}>
                {startDate
                  .toLocaleDateString([], { weekday: "short", month: "short", day: "numeric" })
                  .toUpperCase()}
              </Text>
            </>
          )}
        </View>
        <FighterCol fighter={event.homeTeam} />
      </View>

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {event.venue?.name ? (
            <>
              <Ionicons name="location" size={11} color={UFC_RED} />
              <Text style={styles.footerText} numberOfLines={1}>
                {[event.venue.name, event.venue.city].filter(Boolean).join(", ")}
              </Text>
            </>
          ) : event.broadcast ? (
            <>
              <Ionicons name="tv-outline" size={11} color="#FFA500" />
              <Text style={styles.footerText}>{event.broadcast}</Text>
            </>
          ) : null}
        </View>
        <Text style={styles.footerTap}>TAP FOR DETAILS →</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#111",
    width: width - 32,
    marginHorizontal: 16,
    marginBottom: 24,
    borderWidth: 3,
    borderColor: UFC_RED,
    borderRadius: 4,
    overflow: "hidden",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  sportBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: UFC_RED,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  sportBadgeText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 2,
  },
  liveBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#22c55e",
  },
  liveBadgeText: {
    color: "#22c55e",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 2,
  },
  headerLabel: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 2,
  },
  eventTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    textAlign: "center",
    paddingHorizontal: 20,
    marginBottom: 16,
    textTransform: "uppercase",
  },
  matchupRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    paddingBottom: 20,
  },
  fighterCol: {
    alignItems: "center",
    flex: 1,
  },
  fighterAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#222",
    borderWidth: 2,
    borderColor: UFC_RED,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  fighterFlag: {
    width: 64,
    height: 64,
  },
  fighterName: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(8),
    textAlign: "center",
    letterSpacing: 0.5,
  },
  vsCol: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 4,
  },
  vsText: {
    color: UFC_RED,
    fontFamily: "MBold",
    fontSize: RFValue(18),
    fontStyle: "italic",
  },
  fightTime: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(16),
    marginTop: 6,
  },
  fightDate: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: 8,
    letterSpacing: 1,
    marginTop: 4,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "#222",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  footerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    flex: 1,
  },
  footerText: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 1,
    flex: 1,
  },
  footerTap: {
    color: "#444",
    fontFamily: "MBold",
    fontSize: 8,
    letterSpacing: 2,
  },
});
