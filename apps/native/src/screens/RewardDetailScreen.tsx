import React from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar,
  Dimensions
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { LinearGradient } from "expo-linear-gradient";
import { useUser } from "@clerk/clerk-expo";
import { api } from "../../../../convex/_generated/api";
import { RFValue } from "react-native-responsive-fontsize";

const { width } = Dimensions.get("window");

const getRewardImageLarge = (key?: any) => {
    return require("../../assets/images/placeholder_reward_large.png");
};

const RewardDetailScreen = ({ route, navigation }) => {
  const { rewardId } = route.params;
  const profile = useQuery(api.loyalty.getUserProfile);
  const reward = (useQuery(api.loyalty.getRewardDefinitions) as any[])?.find(r => r._id === rewardId);

  if (!reward) return null;

  const currentPoints = profile?.points || 0;
  const isLocked = currentPoints < reward.pointsCost;
  const pointsNeeded = reward.pointsCost - currentPoints;
  const progress = Math.min(currentPoints / reward.pointsCost, 1);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HERO IMAGE SECTION */}
      <View style={styles.heroContainer}>
        <Image 
            source={getRewardImageLarge()} 
            style={styles.heroImage} 
        />
        <LinearGradient 
            colors={['rgba(0,0,0,0.6)', 'transparent', 'rgba(5,5,5,1)']} 
            style={StyleSheet.absoluteFill}
        />
        <TouchableOpacity 
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
        >
            <Ionicons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <View style={styles.heroOverlayContent}>
            <View style={styles.goldTab}>
                <Text style={styles.goldTabText}>{reward.category.toUpperCase()}</Text>
            </View>
            <Text style={styles.heroTitle}>{reward.title.toUpperCase()}</Text>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.detailsBody}>
            <View style={styles.infoRow}>
                <View style={[styles.infoIconBox, { backgroundColor: 'rgba(255,165,0,0.1)' }]}>
                    <Ionicons name="gift-outline" size={22} color="#FFA500" />
                </View>
                <View style={styles.infoTextGroup}>
                    <Text style={styles.infoLabel}>REWARD TYPE</Text>
                    <Text style={styles.infoValue}>ROSTER EXCLUSIVE</Text>
                </View>
            </View>

            <Text style={styles.description}>
                Enjoy a {reward.title.toLowerCase()} on the house! This craft series reward is available exclusively for Roster members. Ready for redemption at the bar or for mobile pickup.
            </Text>

            <View style={styles.rulesBox}>
                <Text style={styles.rulesTitle}>HOW IT WORKS</Text>
                <View style={styles.ruleItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#444" />
                    <Text style={styles.ruleText}>Redeemable at any Owner's Box location</Text>
                </View>
                <View style={styles.ruleItem}>
                    <Ionicons name="checkmark-circle" size={16} color="#444" />
                    <Text style={styles.ruleText}>Valid for up to 30 days after activation</Text>
                </View>
            </View>
        </View>
      </ScrollView>

      {/* ACTION BAR */}
      <View style={styles.actionBar}>
        {isLocked ? (
          <View style={styles.lockedState}>
            <View style={styles.progressContainer}>
                <View style={[styles.progressBar, { width: `${progress * 100}%` }]} />
            </View>
            <View style={styles.lockedRow}>
                <View style={styles.lockedLabel}>
                    <Ionicons name="lock-closed" size={18} color="#666" />
                    <Text style={styles.lockedText}>Locked</Text>
                </View>
                <View style={styles.pointsNeeded}>
                    <Ionicons name="flash" size={16} color="#FFA500" />
                    <Text style={styles.pointsText}>{reward.pointsCost}</Text>
                </View>
            </View>
            <Text style={styles.neededSubtitle}>
                You need <Text style={{ color: "#FFA500" }}>{pointsNeeded} more points</Text> to unlock this reward
            </Text>
          </View>
        ) : (
          <View style={styles.unlockedState}>
            <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => navigation.navigate("RedeemInStoreScreen", { rewardId })}
            >
                <Text style={styles.primaryBtnText}>Redeem in store</Text>
                <Ionicons name="chevron-forward" size={18} color="#000" />
            </TouchableOpacity>

            <TouchableOpacity 
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("RedeemOnlineScreen", { rewardId })}
            >
                <Text style={styles.secondaryBtnText}>Redeem online</Text>
                <Ionicons name="chevron-forward" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  heroContainer: {
    width: "100%",
    height: 480,
    position: 'relative',
    backgroundColor: '#111',
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  backBtn: {
    position: "absolute",
    top: 60,
    right: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  heroOverlayContent: {
    position: 'absolute',
    bottom: 30,
    left: 25,
    right: 25,
  },
  goldTab: {
    backgroundColor: '#FFA500',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  goldTabText: {
    color: '#000',
    fontFamily: 'MBold',
    fontSize: 10,
    letterSpacing: 1,
  },
  heroTitle: {
    color: "#fff",
    fontSize: RFValue(32),
    fontFamily: "MBold",
    lineHeight: RFValue(36),
  },
  scrollContent: {
    paddingBottom: 220,
  },
  detailsBody: {
    padding: 25,
    marginTop: -10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 15,
    marginBottom: 30,
  },
  infoIconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,165,0,0.2)',
  },
  infoTextGroup: {
    flex: 1,
  },
  infoLabel: {
    color: '#444',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 2,
  },
  infoValue: {
    color: '#fff',
    fontFamily: 'MBold',
    fontSize: 14,
    marginTop: 2,
  },
  description: {
    color: "#888",
    fontSize: 16,
    lineHeight: 26,
    fontFamily: "MRegular",
    marginBottom: 40,
  },
  rulesBox: {
    backgroundColor: '#111',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#222',
  },
  rulesTitle: {
    color: '#666',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 2,
    marginBottom: 15,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  ruleText: {
    color: '#888',
    fontFamily: 'MRegular',
    fontSize: 12,
  },
  actionBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#111",
    paddingTop: 25,
    paddingBottom: 45,
    paddingHorizontal: 25,
    borderTopWidth: 1,
    borderTopColor: "#222",
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
  },
  lockedState: {
    alignItems: "center",
  },
  progressContainer: {
    width: "100%",
    height: 4,
    backgroundColor: "#222",
    borderRadius: 2,
    overflow: "hidden",
    marginBottom: 18,
  },
  progressBar: {
    height: "100%",
    backgroundColor: "#FFA500",
  },
  lockedRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },
  lockedLabel: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  lockedText: {
    color: "#666",
    fontSize: RFValue(14),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  pointsNeeded: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: 'rgba(255,165,0,0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 6,
  },
  pointsText: {
    color: "#FFA500",
    fontSize: 16,
    fontFamily: "MBold",
  },
  neededSubtitle: {
    color: "#444",
    fontSize: 12,
    marginTop: 15,
    fontFamily: "MRegular",
    fontStyle: 'italic',
  },
  unlockedState: {
    gap: 15,
  },
  primaryBtn: {
    backgroundColor: "#FFA500",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: "#000",
    fontSize: 14,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  secondaryBtn: {
    backgroundColor: "transparent",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 24,
    paddingVertical: 18,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#333",
  },
  secondaryBtnText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
});

export default RewardDetailScreen;
