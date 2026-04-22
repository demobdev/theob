import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  ImageBackground,
  Alert,
  Modal
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { LinearGradient } from "expo-linear-gradient";
import BottomNavBar from "../components/BottomNavBar";
import { useCart } from "../context/CartContext";
import QRCode from "react-native-qrcode-svg";
import { ensureAuth } from "../utils/authGuard";

const { width } = Dimensions.get("window");

const getRewardImage = (title = "") => {
    const t = title.toLowerCase();
    if (t.includes("drink") || t.includes("soda")) return require("../../assets/images/menu/cheese_pizza.png"); // placeholder
    if (t.includes("fries") || t.includes("side") || t.includes("dip")) return require("../../assets/images/menu/crab_dip.png");
    if (t.includes("sandwich") || t.includes("philly")) return require("../../assets/images/menu/philly.png");
    if (t.includes("salad")) return require("../../assets/images/menu/chopped_salad.png");
    if (t.includes("pizza")) return require("../../assets/images/menu/meat_lover_pizza.png");
    if (t.includes("wings")) return require("../../assets/images/menu/jumbo_wings.png");
    if (t.includes("yeti") || t.includes("merch")) return require("../../assets/images/placeholder_reward.png");
    return require("../../assets/images/placeholder_reward.png");
};

const RewardsScreen = ({ navigation }) => {
  const { totalItems } = useCart();
  const { user } = useUser();
  const { isSignedIn } = useAuth();
  const profile = useQuery(api.loyalty.getUserProfile) as any;
  const rewards = (useQuery(api.loyalty.getRewardDefinitions) as any[]) || [];
  const points = (profile?.points as number) || 0;
  const claimBirthday = useMutation(api.loyalty.checkBirthdayReward);
  const [memberQrVisible, setMemberQrVisible] = useState(false);

  // Secure member QR payload
  const userId = user?.id || "anonymous";
  const memberQrPayload = `OB-MEMBER|${userId}`;
  const memberDisplayCode = userId.substring(userId.length - 12);

  const today = new Date();
  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const isBirthday = profile?.birthMonth === months[today.getMonth()] && profile?.birthDay === today.getDate().toString();
  const birthdayClaimedThisYear = profile?.lastBirthdayRewardYear === today.getFullYear();

  // Featured promo expiration
  const promoExpiry = new Date("2026-04-26T23:59:59");
  const promoActive = today <= promoExpiry;

  const handleClaimBirthday = async () => {
    if (!isSignedIn) {
      ensureAuth(false, navigation);
      return;
    }
    try {
      const result = await claimBirthday();
      if (result.success) {
        Alert.alert("🎉 HAPPY BIRTHDAY!", `150 PTS have been added to your Roster balance. Enjoy your day!`, [{ text: "AWESOME" }]);
      } else {
        Alert.alert("Hold on", result.reason === "Already granted" ? "You've already claimed your gift for this year!" : "It's not your birthday yet!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
      >
        {/* MEMBERSHIP CARD */}
        <ImageBackground 
            source={require("../../assets/images/leather_black.jpg")} 
            style={styles.membershipCard}
            imageStyle={styles.leatherTexture}
        >
            <View style={styles.membershipHeader}>
                <View>
                    <Text style={styles.memberName}>{user?.firstName?.toUpperCase() || "THE"} {user?.lastName?.toUpperCase() || "ROSTER"}</Text>
                    <Text style={styles.memberStatus}>ACTIVE MEMBER</Text>
                </View>
                <Image source={require("../../assets/images/b-logo.png")} style={styles.membershipLogo} />
            </View>
            
            <View style={styles.pointsRow}>
                <View style={styles.pointsDisplay}>
                    <Text style={styles.pointsMain}>{points.toLocaleString()}</Text>
                    <Text style={styles.pointsSub}>TOTAL POINTS AVAILABLE</Text>
                </View>
                <TouchableOpacity style={styles.scanActionBtn} onPress={() => ensureAuth(!!isSignedIn, navigation, () => setMemberQrVisible(true))}>
                    <Ionicons name="qr-code" size={18} color="#FFF" />
                    <Text style={styles.scanActionBtnText}>SCAN</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.progressSection}>
                <View style={styles.barContainer}>
                    <View style={[styles.barFill, { width: `${Math.min(points / 500, 1) * 100}%` }]} />
                </View>
                <Text style={styles.progressHint}>
                    {points < 500 ? `${500 - points} PTS UNTIL YOUR NEXT FREE PIZZA` : "YOU'VE UNLOCKED A FREE PIZZA!"}
                </Text>
            </View>

            <View style={styles.actionRow}>
                <TouchableOpacity 
                    style={styles.pillBtn}
                    onPress={() => ensureAuth(!!isSignedIn, navigation, () => navigation.navigate("PointsHistoryScreen"))}
                >
                    <Ionicons name="time-outline" size={16} color="#FFA500" />
                    <Text style={styles.pillBtnText}>HISTORY</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={styles.pillBtn}
                    onPress={() => navigation.navigate("HomeScreen")}
                >
                    <Ionicons name="cart-outline" size={16} color="#FFA500" />
                    <Text style={styles.pillBtnText}>ORDER NOW</Text>
                </TouchableOpacity>
            </View>
        </ImageBackground>

        {/* FEATURED PROMO BANNER */}
        {promoActive && (
          <TouchableOpacity 
            style={styles.promoBanner}
            onPress={() => {
              const promoReward = rewards.find(r => r.title === "$5 Off The Owner's Wings");
              if (promoReward) {
                ensureAuth(!!isSignedIn, navigation, () => navigation.navigate("RedeemInStoreScreen", { rewardId: promoReward._id }));
              }
            }}
            activeOpacity={0.9}
          >
            <ImageBackground 
              source={require("../../assets/images/menu/jumbo_wings.png")} 
              style={styles.promoBg}
              imageStyle={styles.promoImage}
            >
              <LinearGradient
                colors={['rgba(0,0,0,0.3)', 'rgba(0,0,0,0.85)']}
                style={styles.promoGradient}
              >
                <View style={styles.promoContent}>
                  <View style={styles.promoTagRow}>
                    <View style={styles.promoTag}>
                      <Text style={styles.promoTagText}>LIMITED TIME</Text>
                    </View>
                    <Text style={styles.promoExpiry}>Thru Sunday 7/26</Text>
                  </View>
                  <Text style={styles.promoTitle}>$5 OFF{"\n"}THE OWNER'S WINGS</Text>
                  <Text style={styles.promoSubtitle}>New item • Add to any order</Text>
                  <View style={styles.promoCtaRow}>
                    <Text style={styles.promoCta}>TAP TO REDEEM</Text>
                    <Ionicons name="chevron-forward" size={16} color="#FFA500" />
                  </View>
                </View>
              </LinearGradient>
            </ImageBackground>
          </TouchableOpacity>
        )}

        <View style={styles.birthdaySection}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>ROSTER BIRTHDAY PERK</Text>
                <Ionicons name="gift" size={12} color="#FFA500" />
            </View>

            <TouchableOpacity 
                style={[
                    styles.birthdayCard, 
                    isBirthday && !birthdayClaimedThisYear ? styles.birthdayCardActive : styles.birthdayCardLocked
                ]}
                disabled={!isBirthday || birthdayClaimedThisYear}
                onPress={handleClaimBirthday}
            >
                <LinearGradient 
                    colors={isBirthday && !birthdayClaimedThisYear ? ["#FFA500", "#FF4500"] : ["#1a1a1a", "#111"]}
                    style={styles.birthdayGradient}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                >
                    <View style={styles.birthdayContent}>
                        <View style={styles.birthdayInfo}>
                            <Text style={[styles.birthdayTitle, isBirthday && !birthdayClaimedThisYear && { color: "#000" }]}>
                                {birthdayClaimedThisYear ? "CLAIMED FOR 2026" : "ANNUAL BIRTHDAY BONUS"}
                            </Text>
                            <Text style={[styles.birthdayPoints, isBirthday && !birthdayClaimedThisYear && { color: "#000" }]}>150 PTS</Text>
                            <Text style={[styles.birthdayStatus, isBirthday && !birthdayClaimedThisYear && { color: "rgba(0,0,0,0.6)" }]}>
                                {isBirthday && !birthdayClaimedThisYear 
                                    ? "HAPPY BIRTHDAY! TAP TO CLAIM GIFT" 
                                    : birthdayClaimedThisYear 
                                        ? "SEE YOU NEXT YEAR!"
                                        : profile?.birthMonth && profile?.birthDay 
                                            ? `UNLOCKS ON ${profile.birthMonth.toUpperCase()} ${profile.birthDay}`
                                            : "COMPLETE PROFILE TO UNLOCK"}
                            </Text>
                        </View>
                        <View style={[styles.birthdayIconBox, isBirthday && !birthdayClaimedThisYear && { backgroundColor: "rgba(0,0,0,0.1)" }]}>
                            <Ionicons 
                                name={birthdayClaimedThisYear ? "checkmark-circle" : "gift"} 
                                size={32} 
                                color={isBirthday && !birthdayClaimedThisYear ? "#000" : "#333"} 
                            />
                        </View>
                    </View>
                </LinearGradient>
            </TouchableOpacity>
        </View>

        <View style={styles.rewardsSection}>
            <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionHeading}>AVAILABLE REDEMPTIONS</Text>
                <View style={styles.goldLine} />
            </View>
            
            {rewards.map((reward) => {
                const isLocked = points < reward.pointsCost;
                return (
                    <TouchableOpacity 
                        key={reward._id} 
                        style={styles.voucherContainer}
                        onPress={() => ensureAuth(!!isSignedIn, navigation, () => navigation.navigate("RewardDetailScreen", { rewardId: reward._id }))}
                    >
                        <ImageBackground 
                            source={require("../../assets/images/leather_black.jpg")} 
                            style={styles.voucherInner}
                            imageStyle={styles.leatherTextureSmall}
                        >
                            <View style={styles.voucherLeft}>
                                <Image 
                                    source={getRewardImage(reward.title)} 
                                    style={[styles.voucherImage, isLocked && { opacity: 0.3 }]} 
                                />
                                {isLocked && (
                                    <View style={styles.voucherLock}>
                                        <Ionicons name="lock-closed" size={24} color="#FFA500" />
                                    </View>
                                )}
                                <View style={styles.costBadge}>
                                    <Text style={styles.costText}>{reward.pointsCost} PTS</Text>
                                </View>
                            </View>
                            
                            <View style={styles.voucherRight}>
                                <View style={styles.voucherContent}>
                                    <Text style={styles.voucherCategory}>{reward.category.toUpperCase()}</Text>
                                    <Text style={styles.voucherTitle}>{reward.title.toUpperCase()}</Text>
                                    <Text style={styles.voucherDesc}>TAP TO REDEEM</Text>
                                </View>
                                <View style={styles.voucherStub}>
                                    <View style={styles.stubHole} />
                                    <Ionicons name="chevron-forward" size={20} color="#FFA500" />
                                    <View style={styles.stubHole} />
                                </View>
                            </View>
                        </ImageBackground>
                    </TouchableOpacity>
                );
            })}
        </View>

        <TouchableOpacity style={styles.helpLink} onPress={() => navigation.navigate("HelpCenterScreen")}>
            <Ionicons name="help-circle-outline" size={20} color="#666" />
            <Text style={styles.helpText}>Need help with rewards?</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* MEMBER QR CODE MODAL */}
      <Modal visible={memberQrVisible} transparent animationType="fade">
        <View style={styles.qrModalOverlay}>
            <View style={styles.qrModalContent}>
                <QRCode
                  value={memberQrPayload}
                  size={width * 0.6}
                  backgroundColor="#fff"
                  color="#000"
                  ecl="M"
                />
                <Text style={styles.qrModalCode}>{memberDisplayCode}</Text>
                <TouchableOpacity style={styles.qrModalClose} onPress={() => setMemberQrVisible(false)}>
                    <Text style={styles.qrModalCloseText}>Okay</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      <BottomNavBar activeTab="REWARDS" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#050505",
  },
  membershipCard: {
    margin: 20,
    marginTop: 60,
    padding: 25,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)", // Inner glow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 20,
    overflow: "hidden",
  },
  leatherTexture: {
    opacity: 0.4,
    resizeMode: "cover",
  },
  leatherTextureSmall: {
    opacity: 0.25,
    resizeMode: "cover",
  },
  membershipHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 25,
  },
  memberName: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    letterSpacing: 1,
  },
  memberStatus: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 9,
    marginTop: 4,
    letterSpacing: 2,
  },
  membershipLogo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
    opacity: 0.8,
  },
  pointsDisplay: {
    marginBottom: 25,
  },
  pointsMain: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(44),
  },
  pointsSub: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 1,
    marginTop: -5,
  },
  progressSection: {
    marginBottom: 25,
  },
  barContainer: {
    height: 8,
    backgroundColor: "#222",
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
  },
  barFill: {
    height: "100%",
    backgroundColor: "#FFA500",
  },
  progressHint: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: 11,
    fontStyle: "italic",
  },
  actionRow: {
    flexDirection: "row",
    gap: 12,
  },
  pillBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,165,0,0.1)",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.2)",
    gap: 8,
    flex: 1,
    justifyContent: "center",
  },
  pillBtnText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 1,
  },
  scrollContent: {
    paddingBottom: 120,
  },
  rewardsSection: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
    marginBottom: 20,
  },
  sectionHeading: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 2,
  },
  goldLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(255,165,0,0.2)",
  },
  voucherContainer: {
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    overflow: "hidden",
    backgroundColor: "#111",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  voucherInner: {
    flexDirection: "row",
    height: 150,
  },
  voucherLeft: {
    width: 150,
    height: 150,
    position: "relative",
  },
  voucherImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  voucherLock: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.6)",
    justifyContent: "center",
    alignItems: "center",
  },
  costBadge: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 4,
    alignItems: "center",
  },
  costText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 10,
  },
  voucherRight: {
    flex: 1,
    flexDirection: "row",
  },
  voucherContent: {
    flex: 1,
    padding: 15,
    justifyContent: "center",
  },
  voucherCategory: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 8,
    letterSpacing: 1,
    marginBottom: 4,
  },
  voucherTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(14),
  },
  voucherDesc: {
    color: "#444",
    fontFamily: "MBold",
    fontSize: 8,
    marginTop: 6,
    letterSpacing: 1,
  },
  voucherStub: {
    width: 35,
    backgroundColor: "#161618",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderLeftWidth: 1,
    borderLeftColor: "#222",
    borderStyle: "dashed",
  },
  stubHole: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#050505",
    marginHorizontal: -6,
  },
  birthdaySection: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 25,
  },
  birthdayCard: {
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  birthdayCardActive: {
    borderColor: "#FFA500",
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  birthdayCardLocked: {
    opacity: 0.8,
  },
  birthdayGradient: {
    padding: 20,
  },
  birthdayContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  birthdayInfo: {
    flex: 1,
  },
  birthdayTitle: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  birthdayPoints: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(24),
    marginVertical: 2,
  },
  birthdayStatus: {
    color: "#444",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  birthdayIconBox: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#1a1a1a",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#222",
  },
  helpLink: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 20,
    gap: 8,
  },
  helpText: {
    color: "#444",
    fontFamily: "MRegular",
    fontSize: 12,
  },
  // FEATURED PROMO BANNER
  promoBanner: {
    marginHorizontal: 20,
    marginTop: 60,
    marginBottom: 10,
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.3)",
  },
  promoBg: {
    width: "100%",
    height: 200,
  },
  promoImage: {
    resizeMode: "cover",
    borderRadius: 18,
  },
  promoGradient: {
    flex: 1,
    justifyContent: "flex-end",
    padding: 20,
    borderRadius: 18,
  },
  promoContent: {},
  promoTagRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  promoTag: {
    backgroundColor: "#E31837",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  promoTagText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 1.5,
  },
  promoExpiry: {
    color: "#999",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 0.5,
  },
  promoTitle: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(20),
    lineHeight: RFValue(24),
    marginBottom: 6,
  },
  promoSubtitle: {
    color: "#999",
    fontFamily: "MRegular",
    fontSize: 12,
    marginBottom: 10,
  },
  promoCtaRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  promoCta: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 12,
    letterSpacing: 1,
  },
  // SCAN ACTION BUTTON on membership card
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  scanActionBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E31837",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    gap: 8,
  },
  scanActionBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: 12,
    letterSpacing: 1,
  },
  // MEMBER QR MODAL
  qrModalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  qrModalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
  },
  qrModalCode: {
    fontSize: 20,
    fontFamily: "MBold",
    color: "#333",
    letterSpacing: 1,
    marginTop: 25,
    marginBottom: 5,
  },
  qrModalClose: {
    backgroundColor: "#E31837",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  qrModalCloseText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
  },
});

export default RewardsScreen;
