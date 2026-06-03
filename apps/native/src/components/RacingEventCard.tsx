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
import { formatVenueDateShort, formatVenueTime } from "../lib/venueTimezone";

const { width } = Dimensions.get("window");

const SERIES_STYLE = {
  NASCAR: { color: "#FFD700", icon: "car-sport" as const, label: "NASCAR" },
  F1: { color: "#E10600", icon: "speedometer" as const, label: "F1" },
} as const;

export type RacingEventGame = {
  _id?: string;
  id?: string;
  sport: "NASCAR" | "F1";
  status?: string;
  startsAt: string;
  tournamentName?: string | null;
  editorialNote?: string | null;
  broadcast?: string | null;
  venue?: { name?: string | null; city?: string | null; state?: string | null };
  awayTeam?: { name?: string; logoUrl?: string | null; abbr?: string | null };
  homeTeam?: { name?: string; logoUrl?: string | null; abbr?: string | null };
};

type Props = {
  event: RacingEventGame;
  onPress: () => void;
  layout?: "stacked" | "carousel";
};

const DriverCol = ({
  driver,
  accent,
}: {
  driver?: { name?: string; logoUrl?: string | null };
  accent: string;
}) => (
  <View style={styles.driverCol}>
    <View style={[styles.driverAvatar, { borderColor: accent }]}>
      {driver?.logoUrl ? (
        <Image source={{ uri: driver.logoUrl }} style={styles.driverFlag} resizeMode="cover" />
      ) : (
        <Ionicons name="person" size={28} color="#888" />
      )}
    </View>
    <Text style={styles.driverName} numberOfLines={2}>
      {(driver?.name ?? "TBD").toUpperCase()}
    </Text>
  </View>
);

export default function RacingEventCard({
  event,
  onPress,
  layout = "stacked",
}: Props) {
  const series = SERIES_STYLE[event.sport] ?? SERIES_STYLE.NASCAR;
  const isLive = event.status === "inprogress";
  const hasDrivers = event.awayTeam?.name || event.homeTeam?.name;

  return (
    <TouchableOpacity
      style={[
        styles.card,
        { borderColor: series.color },
        layout === "carousel" && styles.cardCarousel,
      ]}
      onPress={onPress}
      activeOpacity={0.9}
    >
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.sportBadge, { backgroundColor: series.color }]}>
            <Ionicons name={series.icon} size={12} color="#000" />
            <Text style={styles.sportBadgeText}>{series.label}</Text>
          </View>
          {isLive && (
            <View style={styles.liveBadge}>
              <View style={styles.liveDot} />
              <Text style={styles.liveBadgeText}>LIVE</Text>
            </View>
          )}
        </View>
        <Text style={styles.headerLabel}>
          {isLive ? "RACE LIVE" : "NEXT RACE"}
        </Text>
      </View>

      <Text style={styles.eventTitle} numberOfLines={2}>
        {event.tournamentName ?? `${series.label} Race`}
      </Text>

      {hasDrivers ? (
        <View style={styles.matchupRow}>
          <DriverCol driver={event.awayTeam} accent={series.color} />
          <View style={styles.vsCol}>
            <Text style={[styles.vsText, { color: series.color }]}>VS</Text>
            {!isLive && (
              <>
                <Text style={styles.raceTime}>{formatVenueTime(event.startsAt)}</Text>
                <Text style={styles.raceDate}>{formatVenueDateShort(event.startsAt)}</Text>
              </>
            )}
          </View>
          <DriverCol driver={event.homeTeam} accent={series.color} />
        </View>
      ) : (
        <View style={styles.scheduleOnly}>
          <Text style={styles.raceTime}>{formatVenueTime(event.startsAt)}</Text>
          <Text style={styles.raceDate}>{formatVenueDateShort(event.startsAt)}</Text>
        </View>
      )}

      <View style={styles.footer}>
        <View style={styles.footerLeft}>
          {event.venue?.name ? (
            <>
              <Ionicons name="location" size={11} color={series.color} />
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
    borderRadius: 4,
    overflow: "hidden",
  },
  cardCarousel: {
    width: "100%",
    marginHorizontal: 0,
    marginBottom: 0,
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
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 3,
  },
  sportBadgeText: {
    color: "#000",
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
  scheduleOnly: {
    alignItems: "center",
    paddingBottom: 20,
  },
  driverCol: {
    alignItems: "center",
    flex: 1,
  },
  driverAvatar: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#222",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
    overflow: "hidden",
  },
  driverFlag: {
    width: 64,
    height: 64,
  },
  driverName: {
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
    fontFamily: "MBold",
    fontSize: RFValue(18),
    fontStyle: "italic",
  },
  raceTime: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(16),
    marginTop: 6,
  },
  raceDate: {
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
