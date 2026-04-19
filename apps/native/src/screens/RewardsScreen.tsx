import React from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import BottomNavBar from "../components/BottomNavBar";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

const RewardsScreen = ({ navigation }) => {
  const { cartCount } = useCart();
  const profile = useQuery(api.loyalty.getUserProfile);
  const rewards = useQuery(api.loyalty.getRewardDefinitions) || [];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* FLOATING HEADER - SYNCED WITH HOME */}
      <View style={styles.floatingHeader}>
        <TouchableOpacity style={styles.logoShortcut} onPress={() => navigation.navigate("LandingScreen")}>
          <Image source={require("../../assets/images/b-logo.png")} style={styles.floatingBLogo} />
        </TouchableOpacity>

        <View style={styles.headerTitles}>
          <Text style={styles.headerTitle}>THE REWARDS BOX</Text>
          <Text style={styles.headerSubtitle}>YOUR BOX SCORE</Text>
        </View>

        <TouchableOpacity 
          style={styles.cartBtn}
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Ionicons name="cart" size={32} color="#FFA500" />
          {cartCount > 0 && (
            <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{cartCount}</Text></View>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: 130, paddingBottom: 100 }}>
        {/* POINTS HEADER SECTION */}
        <View style={styles.pointsHeader}>
          <Text style={styles.pointsLabel}>TOTAL BOX SCORE</Text>
          <View style={styles.pointsRow}>
            <Ionicons name="flash" size={40} color="#FFA500" />
            <Text style={styles.pointsValue}>{profile?.points || 0}</Text>
          </View>
          <View style={styles.spendingInfo}>
            <Text style={styles.spendingText}>${((profile?.points || 0) * 0.1).toFixed(2)} AVAILABLE CREDIT</Text>
          </View>
        </View>

        {/* REWARDS GRID */}
        <View style={styles.rewardsSection}>
          <Text style={styles.sectionTitle}>REDEEMABLE CRAFT SERIES</Text>
          <View style={styles.rewardGrid}>
            {rewards.map((reward) => (
              <TouchableOpacity key={reward._id} style={styles.rewardCard}>
                <View style={styles.rewardIconBg}>
                  <Ionicons 
                    name={reward.rewardType === "free_item" ? "pizza" : "ticket"} 
                    size={30} 
                    color="#FFA500" 
                  />
                </View>
                <Text style={styles.rewardTitle}>{reward.title}</Text>
                <View style={styles.costBadge}>
                  <Text style={styles.costText}>{reward.pointsCost} PTS</Text>
                </View>
                <TouchableOpacity style={styles.redeemBtn}>
                    <Text style={styles.redeemBtnText}>REDEEM</Text>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      <BottomNavBar activeTab="REWARDS" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  floatingHeader: {
    position: "absolute",
    top: 40, // TIGHT TO TOP
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
  },
  logoShortcut: {
    width: 50,
    height: 50,
    justifyContent: "center",
  },
  floatingBLogo: {
    width: 45,
    height: 45,
    resizeMode: "contain",
  },
  headerTitles: {
    alignItems: "center",
    flex: 1,
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(17),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  headerSubtitle: {
    color: "#FFA500",
    fontSize: RFValue(9),
    fontFamily: "MBold",
    letterSpacing: 2,
    marginTop: 2,
  },
  cartBtn: {
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cartBadge: {
    position: "absolute",
    top: 5,
    right: 0,
    backgroundColor: "#E31837",
    width: 17,
    height: 17,
    borderRadius: 8.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#fff",
    fontSize: 9,
    fontFamily: "MBold",
  },
  pointsHeader: {
    alignItems: "center",
    backgroundColor: "#161616",
    marginHorizontal: 20,
    paddingVertical: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  pointsLabel: {
    color: "#666",
    fontSize: 10,
    fontFamily: "MBold",
    letterSpacing: 1.5,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    gap: 10,
  },
  pointsValue: {
    color: "#fff",
    fontSize: RFValue(48),
    fontFamily: "MBold",
  },
  spendingInfo: {
    backgroundColor: "#222",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  spendingText: {
    color: "#FFA500",
    fontSize: 10,
    fontFamily: "MBold",
  },
  rewardsSection: {
    padding: 20,
    marginTop: 20,
  },
  sectionTitle: {
    color: "#666",
    fontSize: 9,
    fontFamily: "MBold",
    letterSpacing: 1.5,
    marginBottom: 20,
  },
  rewardGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 15,
  },
  rewardCard: {
    width: (width - 55) / 2,
    backgroundColor: "#1C1C1E",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  rewardIconBg: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  rewardTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "MBold",
    textAlign: "center",
    height: 40,
  },
  costBadge: {
    marginTop: 10,
    marginBottom: 15,
  },
  costText: {
    color: "#FFA500",
    fontSize: 12,
    fontFamily: "MBold",
  },
  redeemBtn: {
    backgroundColor: "#FFA500", // NOW GOLD
    width: "100%",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  redeemBtnText: {
    color: "#000", // BLACK ON GOLD
    fontSize: 11,
    fontFamily: "MBold",
  },
});

export default RewardsScreen;
