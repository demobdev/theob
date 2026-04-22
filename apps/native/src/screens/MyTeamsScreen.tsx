import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useUser } from "@clerk/clerk-expo";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// ─── Sub-components defined OUTSIDE to prevent re-mount on render ──────────────

const TeamTile = ({
  team,
  isSelected,
  onToggle,
}: {
  team: { name: string; abbr: string; logoUrl: string };
  isSelected: boolean;
  onToggle: () => void;
}) => (
  <TouchableOpacity
    style={[styles.teamTile, isSelected && styles.teamTileSelected]}
    onPress={onToggle}
    activeOpacity={0.7}
  >
    {isSelected && (
      <View style={styles.selectedBadge}>
        <Ionicons name="checkmark" size={10} color="#FFF" />
      </View>
    )}
    <Image
      source={{ uri: team.logoUrl }}
      style={styles.teamLogo}
      resizeMode="contain"
    />
    <Text style={[styles.teamAbbr, isSelected && styles.teamAbbrSelected]}>
      {team.abbr}
    </Text>
  </TouchableOpacity>
);

// ─── Main Screen ───────────────────────────────────────────────────────────────

const MyTeamsScreen = ({ navigation }: any) => {
  const { user, isLoaded } = useUser();
  const sportGroups = useQuery(api.sports_queries.getUniqueTeams) ?? [];

  // favorites shape: { NBA: ["LAL","GSW"], NFL: ["CAR"], ... }
  const [favorites, setFavorites] = useState<Record<string, string[]>>({});
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);

  // Load existing preferences from Clerk metadata
  useEffect(() => {
    if (isLoaded && user) {
      const stored = (user.unsafeMetadata?.favoriteTeams as Record<string, string[]>) ?? {};
      setFavorites(stored);
    }
  }, [isLoaded, user]);

  const toggleTeam = (sport: string, abbr: string) => {
    setFavorites((prev) => {
      const current = prev[sport] ?? [];
      const updated = current.includes(abbr)
        ? current.filter((a) => a !== abbr)
        : [...current, abbr];
      return { ...prev, [sport]: updated };
    });
    setDirty(true);
  };

  const handleSave = async () => {
    if (!isLoaded) return;
    if (!user) {
      Alert.alert(
        "Join the Roster",
        "You need to be logged in to save your favorite teams.",
        [
          { text: "Cancel", style: "cancel" },
          { text: "Sign In", onPress: () => navigation.navigate("LoginScreen") }
        ]
      );
      return;
    }
    setSaving(true);
    try {
      await user.update({
        unsafeMetadata: {
          ...user.unsafeMetadata,
          favoriteTeams: favorites,
        },
      });
      setDirty(false);
      navigation.goBack();
    } catch (err) {
      Alert.alert("Error", "Could not save your team preferences. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!isLoaded) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator color="#FFA500" size="large" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  const totalSelected = Object.values(favorites).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const selectedTeamObjects: any[] = [];
  sportGroups.forEach(group => {
    const favs = favorites[group.sport] || [];
    favs.forEach(favAbbr => {
      const t = group.teams.find(team => team.abbr === favAbbr);
      if (t) selectedTeamObjects.push(t);
    });
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>MY TEAMS</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      {/* Subtitle */}
      <View style={styles.subtitleRow}>
        <Text style={styles.subtitle}>
          Pick your squads — we'll surface their games first.
        </Text>
        {totalSelected > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{totalSelected} selected</Text>
          </View>
        )}
      </View>

      {/* Your Roster Strip */}
      {selectedTeamObjects.length > 0 && (
        <View style={styles.rosterStripContainer}>
          <Text style={styles.rosterStripTitle}>YOUR ROSTER</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.rosterStripScroll}>
            {selectedTeamObjects.map(team => (
              <View key={`selected-${team.abbr}`} style={styles.rosterStripItem}>
                <Image source={{ uri: team.logoUrl }} style={styles.rosterMiniLogo} resizeMode="contain" />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Team Picker */}
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {sportGroups.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="trophy-outline" size={48} color="#333" />
            <Text style={styles.emptyTitle}>No teams yet</Text>
            <Text style={styles.emptySubtitle}>
              Team logos load automatically as games are synced from our live sports feed.
              Check back on game day!
            </Text>
          </View>
        ) : (
          sportGroups.map((group) => (
            <View key={group.sport} style={styles.sportSection}>
              <View style={styles.sportHeaderRow}>
                <View style={styles.sportAccentLine} />
                <Text style={styles.sportName}>{group.sport}</Text>
              </View>
              <View style={styles.tilesGrid}>
                {group.teams.map((team) => (
                  <TeamTile
                    key={`${group.sport}-${team.abbr}`}
                    team={team}
                    isSelected={(favorites[group.sport] ?? []).includes(team.abbr)}
                    onToggle={() => toggleTeam(group.sport, team.abbr)}
                  />
                ))}
              </View>
            </View>
          ))
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Save Button — appears when changes are made */}
      {dirty && (
        <View style={styles.saveBar}>
          <TouchableOpacity
            style={styles.saveBtn}
            onPress={handleSave}
            disabled={saving}
          >
            {saving ? (
              <ActivityIndicator color="#FFF" size="small" />
            ) : (
              <Text style={styles.saveBtnText}>SAVE MY TEAMS</Text>
            )}
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#0F0F11",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  loadingText: {
    color: "#666",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#FFF",
    letterSpacing: 2,
  },
  logoText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(12),
    letterSpacing: 2,
  },
  subtitleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  subtitle: {
    color: "#666",
    fontFamily: "MRegular",
    fontSize: RFValue(11),
    flex: 1,
    marginRight: 10,
  },
  countBadge: {
    backgroundColor: "#E31837",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  countBadgeText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(9),
    letterSpacing: 0.5,
  },
  rosterStripContainer: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    backgroundColor: "#161618",
  },
  rosterStripTitle: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: RFValue(10),
    letterSpacing: 1.5,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  rosterStripScroll: {
    paddingHorizontal: 20,
    gap: 12,
  },
  rosterStripItem: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: "#E31837",
    alignItems: "center",
    justifyContent: "center",
  },
  rosterMiniLogo: {
    width: 28,
    height: 28,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  sportSection: {
    marginBottom: 36,
  },
  sportHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 16,
  },
  sportAccentLine: {
    width: 3,
    height: 16,
    backgroundColor: "#E31837",
    borderRadius: 2,
  },
  sportName: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 2,
  },
  tilesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
  },
  teamTile: {
    width: 72,
    height: 80,
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: "#2A2A2A",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    position: "relative",
  },
  teamTileSelected: {
    borderColor: "#FFA500",
    backgroundColor: "#1C1A12",
  },
  selectedBadge: {
    position: "absolute",
    top: 5,
    right: 5,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: "#E31837",
    alignItems: "center",
    justifyContent: "center",
  },
  teamLogo: {
    width: 40,
    height: 40,
  },
  teamAbbr: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: RFValue(9),
    letterSpacing: 1,
  },
  teamAbbrSelected: {
    color: "#FFA500",
  },
  emptyState: {
    alignItems: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 30,
  },
  emptyTitle: {
    color: "#444",
    fontFamily: "MBold",
    fontSize: RFValue(16),
  },
  emptySubtitle: {
    color: "#333",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    textAlign: "center",
    lineHeight: 20,
  },
  saveBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    backgroundColor: "#0F0F11",
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
  },
  saveBtn: {
    backgroundColor: "#E31837",
    height: 54,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  saveBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 1.5,
  },
});

export default MyTeamsScreen;
