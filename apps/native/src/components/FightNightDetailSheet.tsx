import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { FightNightGame } from "./FightNightHeroCard";

const { width } = Dimensions.get("window");
const UFC_RED = "#D20A0A";

type Props = {
  event: FightNightGame | null;
  onClose: () => void;
};

export default function FightNightDetailSheet({ event, onClose }: Props) {
  if (!event) return null;

  const headliner = [event.awayTeam?.name, event.homeTeam?.name].filter(Boolean).join(" vs ");

  return (
    <Modal visible transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>UFC</Text>
            </View>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}>
              <Ionicons name="close" size={26} color="#FFA500" />
            </TouchableOpacity>
          </View>

          <Text style={styles.eventName}>{event.tournamentName ?? "UFC Fight Night"}</Text>

          {headliner ? (
            <Text style={styles.headliner}>Main event: {headliner}</Text>
          ) : null}

          <Text style={styles.time}>
            {new Date(event.startsAt).toLocaleString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
              hour: "numeric",
              minute: "2-digit",
            })}
          </Text>

          {event.venue?.name ? (
            <Text style={styles.venue}>
              {event.venue.name}
              {event.venue.city ? ` · ${event.venue.city}` : ""}
            </Text>
          ) : null}

          {event.broadcast ? (
            <Text style={styles.broadcast}>Watch on {event.broadcast}</Text>
          ) : null}

          <View style={styles.comingSoon}>
            <Ionicons name="list" size={16} color="#666" />
            <Text style={styles.comingSoonText}>Full fight card coming soon</Text>
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
            <Text style={styles.closeBtnText}>GOT IT</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.9)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#0F0F0F",
    width,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    paddingTop: 30,
    borderWidth: 1,
    borderColor: "#222",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  badge: {
    backgroundColor: UFC_RED,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 4,
  },
  badgeText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 2,
  },
  eventName: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 18,
    textTransform: "uppercase",
    marginBottom: 12,
  },
  headliner: {
    color: "#FFA500",
    fontFamily: "MSemiBold",
    fontSize: 14,
    marginBottom: 16,
  },
  time: {
    color: "#ccc",
    fontFamily: "MSemiBold",
    fontSize: 13,
    marginBottom: 8,
  },
  venue: {
    color: "#888",
    fontFamily: "MSemiBold",
    fontSize: 12,
    marginBottom: 8,
  },
  broadcast: {
    color: "#888",
    fontFamily: "MSemiBold",
    fontSize: 12,
    marginBottom: 24,
  },
  comingSoon: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#151515",
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  comingSoonText: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 11,
    letterSpacing: 1,
  },
  closeBtn: {
    backgroundColor: "#FFA500",
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
  },
  closeBtnText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 12,
    letterSpacing: 1,
  },
});
