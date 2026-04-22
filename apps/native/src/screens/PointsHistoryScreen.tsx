import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "../../../../convex/_generated/api";
import { RFValue } from "react-native-responsive-fontsize";
import { ensureAuth } from "../utils/authGuard";

const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

const { width } = Dimensions.get("window");

const PointsHistoryScreen = ({ navigation }) => {
  const { isSignedIn, isLoaded } = useAuth();
  const [activeTab, setActiveTab] = React.useState("History"); // "History" | "Expiring Points"
  const history = useQuery(api.loyalty.getPointsHistory, { limit: 50 }) || [];

  React.useEffect(() => {
    if (isLoaded && !isSignedIn) {
      ensureAuth(false, navigation);
    }
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Account History</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* TABS */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "History" && styles.activeTab]}
          onPress={() => setActiveTab("History")}
        >
            <Text style={[styles.tabText, activeTab === "History" && styles.activeTabText]}>History</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "Expiring Points" && styles.activeTab]}
          onPress={() => setActiveTab("Expiring Points")}
        >
            <Text style={[styles.tabText, activeTab === "Expiring Points" && styles.activeTabText]}>Expiring Points</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {activeTab === "Expiring Points" ? (
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>You have no points expiring soon.</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>No activity yet. Every order counts!</Text>
          </View>
        ) : (
          history.map((entry, index) => (
            <View key={entry._id} style={[styles.historyItem, index === history.length - 1 && styles.lastItem]}>
              <View style={styles.itemMain}>
                <Text style={styles.itemTitle}>
                    {entry.type === "earned" ? `Earned ${entry.points} points` : entry.reason}
                </Text>
                <Text style={styles.itemDate}>
                    {formatDate(entry.createdAt)}, THEOB Greenville
                </Text>
              </View>
              {entry.type === "redeemed" && (
                <View style={styles.pointsBadgeRedeemed}>
                    <Text style={styles.pointsBadgeText}>{entry.points}</Text>
                </View>
              )}
              {entry.type === "earned" && (
                <View style={styles.pointsBadgeEarned}>
                    <Text style={styles.pointsBadgeText}>+{entry.points}</Text>
                </View>
              )}
            </View>
          ))
        )}

        <TouchableOpacity style={styles.helpBox}>
            <Ionicons name="mail-outline" size={20} color="#E31837" />
            <Text style={styles.helpText}>Need help with anything?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* BOTTOM ACTION */}
      <TouchableOpacity 
        style={styles.doneBtn}
        onPress={() => navigation.navigate("RewardsScreen")}
      >
          <Text style={styles.doneBtnText}>CLOSE</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  header: {
    backgroundColor: "#111",
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#111",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  tab: {
    flex: 1,
    paddingVertical: 15,
    alignItems: "center",
  },
  activeTab: {
    borderBottomWidth: 3,
    borderBottomColor: "#FFA500",
  },
  tabText: {
    fontSize: 13,
    color: "#666",
    fontFamily: "MBold",
    letterSpacing: 0.5,
  },
  activeTabText: {
    color: "#fff",
  },
  scrollContent: {
    paddingBottom: 120,
  },
  historyItem: {
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: "#1a1a1a",
    flexDirection: "row",
    alignItems: "center",
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  itemMain: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    color: "#fff",
    fontFamily: "MMedium",
  },
  itemDate: {
    fontSize: 12,
    color: "#666",
    fontFamily: "MMedium",
    marginTop: 4,
  },
  pointsBadgeEarned: {
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(76, 175, 80, 0.2)",
  },
  pointsBadgeRedeemed: {
    backgroundColor: "rgba(227, 24, 55, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(227, 24, 55, 0.2)",
  },
  pointsBadgeText: {
    fontSize: 13,
    color: "#fff",
    fontFamily: "MBold",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 100,
    gap: 15,
  },
  emptyText: {
    color: "#444",
    fontSize: 16,
    fontFamily: "MMedium",
  },
  helpBox: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 40,
    padding: 18,
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#222",
    backgroundColor: "#111",
    gap: 10,
  },
  helpText: {
    color: "#FFA500",
    fontSize: 14,
    fontFamily: "MBold",
  },
  doneBtn: {
    position: "absolute",
    bottom: 40,
    left: 20,
    right: 20,
    backgroundColor: "#E31837",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#E31837",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 5,
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
});

export default PointsHistoryScreen;
