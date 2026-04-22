import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Dimensions,
  Modal,
  ActivityIndicator,
  ScrollView,
  Linking,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RFValue } from "react-native-responsive-fontsize";
import { useUser } from "@clerk/clerk-expo";
import QRCode from "react-native-qrcode-svg";

const { width } = Dimensions.get("window");

const RedeemInStoreScreen = ({ route, navigation }) => {
  const { rewardId } = route.params;
  const { user } = useUser();
  const [redeeming, setRedeeming] = useState(false);
  const [success, setSuccess] = useState(false);
  const [redemptionCode, setRedemptionCode] = useState("");
  const [qrModalVisible, setQrModalVisible] = useState(false);

  const profile = useQuery(api.loyalty.getUserProfile);
  const reward = (useQuery(api.loyalty.getRewardDefinitions) as any[])?.find(r => r._id === rewardId);
  const redeem = useMutation(api.loyalty.redeemReward);

  if (!reward) return null;

  // Build secure QR payload: OB-REDEEM|rewardId|userId|timestamp
  const userId = user?.id || "anonymous";
  const timestamp = Math.floor(Date.now() / 1000);
  const qrPayload = `OB-REDEEM|${rewardId}|${userId}|${timestamp}`;
  
  // Short display code from the reward ID
  const displayCode = `${rewardId.substring(rewardId.length - 8).toUpperCase()}`;

  // User contact info for fallback
  const userPhone = (user as any)?.unsafeMetadata?.phone || (user as any)?.primaryPhoneNumber?.phoneNumber || profile?.phone || "Not on file";
  const userEmail = (user as any)?.primaryEmailAddress?.emailAddress || "Not on file";

  const handleRedeem = async () => {
    if (!user) {
        Alert.alert("Sign In Required", "Please sign in to redeem rewards.");
        return;
    }

    setRedeeming(true);
    try {
        const result = await redeem({ rewardId });
        if (result.success) {
            setRedemptionCode(result.newBalance.toString().padStart(6, '0'));
            setSuccess(true);
        }
    } catch (e: any) {
        // Prevent the red screen of death in Expo by catching the error gracefully
        const errorMessage = e?.message || "Something went wrong. Please try again.";
        // Clean up the Convex error prefix if it exists
        const cleanMessage = errorMessage.replace("[CONVEX M(loyalty:redeemReward)] Server Error\nUncaught Error: ", "");
        Alert.alert("Redemption Failed", cleanMessage);
    } finally {
        setRedeeming(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Redeem in-store</Text>
        <TouchableOpacity style={styles.headerRight} onPress={() => navigation.navigate("HelpCenterScreen")}>
            <Ionicons name="settings-outline" size={22} color="#888" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* REWARD TITLE */}
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        
        {/* QR CODE — Tappable for full-screen */}
        <TouchableOpacity style={styles.qrContainer} onPress={() => setQrModalVisible(true)} activeOpacity={0.8}>
            <View style={styles.qrBg}>
                <QRCode
                  value={qrPayload}
                  size={width * 0.55}
                  backgroundColor="#fff"
                  color="#000"
                  ecl="M"
                />
            </View>
        </TouchableOpacity>

        {/* CAN'T SCAN LINK */}
        <TouchableOpacity style={styles.cantScanLink} onPress={() => setQrModalVisible(true)}>
            <Text style={styles.cantScanText}>Can't scan this code?</Text>
        </TouchableOpacity>

        {/* OTHER WAYS TO REDEEM */}
        <View style={styles.fallbackSection}>
            <Text style={styles.fallbackHeading}>Other ways to redeem this reward</Text>
            
            <View style={styles.fallbackCard}>
                <Text style={styles.fallbackLabel}>YOUR PHONE NUMBER</Text>
                <Text style={styles.fallbackValue}>{userPhone}</Text>
            </View>

            <View style={styles.fallbackCard}>
                <Text style={styles.fallbackLabel}>YOUR EMAIL ADDRESS</Text>
                <Text style={styles.fallbackValue}>{userEmail}</Text>
            </View>

            <View style={styles.teamMemberNote}>
                <View style={styles.noteIconCircle}>
                    <Ionicons name="people-outline" size={18} color="#666" />
                </View>
                <Text style={styles.noteText}>
                  Provide your phone number or email to a team member.{"\n"}
                  (If a digital display is available, you may also enter your phone or email there.)
                </Text>
            </View>

            <View style={styles.teamMemberNote}>
                <View style={styles.noteIconCircle}>
                    <Ionicons name="gift-outline" size={18} color="#666" />
                </View>
                <Text style={styles.noteText}>
                  Tell the team member which reward you want to apply to your order.{"\n"}
                  (If a digital display is available, you may also select your reward there.)
                </Text>
            </View>

            {/* CONTACT SUPPORT */}
            <TouchableOpacity 
              style={styles.contactSupport} 
              onPress={() => navigation.navigate("HelpCenterScreen")}
            >
                <Ionicons name="chatbubble-ellipses-outline" size={18} color="#888" />
                <Text style={styles.contactSupportText}>Contact Support</Text>
            </TouchableOpacity>
        </View>

        {/* FINE PRINT */}
        <View style={styles.finePrintSection}>
            <Text style={styles.finePrintTitle}>TERMS & CONDITIONS</Text>
            <Text style={styles.finePrintText}>
              • Rewards are valid for 30 days after activation.{"\n"}
              • Cannot be combined with other offers or promotions.{"\n"}
              • Valid at participating Owner's Box locations only.{"\n"}
              • No cash value. Not transferable.{"\n"}
              • Management reserves the right to modify or cancel rewards.
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("HelpCenterScreen")}>
                <Text style={styles.faqLink}>View FAQ →</Text>
            </TouchableOpacity>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* CONFIRM REDEMPTION BUTTON */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
            style={[styles.redeemActionBtn, (!user || redeeming) && styles.disabledBtn]} 
            onPress={handleRedeem} 
            disabled={!user || redeeming}
        >
            {redeeming ? <ActivityIndicator color="#fff" /> : <Text style={styles.redeemActionText}>{!user ? "SIGN IN REQUIRED" : "CONFIRM REDEMPTION"}</Text>}
        </TouchableOpacity>
      </View>

      {/* FULL-SCREEN QR MODAL */}
      <Modal visible={qrModalVisible} transparent animationType="fade">
        <View style={styles.qrModalOverlay}>
            <View style={styles.qrModalContent}>
                <QRCode
                  value={qrPayload}
                  size={width * 0.65}
                  backgroundColor="#fff"
                  color="#000"
                  ecl="M"
                />
                <Text style={styles.qrModalCode}>{displayCode}</Text>
                <TouchableOpacity style={styles.qrModalClose} onPress={() => setQrModalVisible(false)}>
                    <Text style={styles.qrModalCloseText}>Okay</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* SUCCESS MODAL */}
      <Modal visible={success} transparent animationType="fade">
          <View style={styles.modalOverlay}>
              <View style={styles.modalContent}>
                  <Ionicons name="checkmark-circle" size={64} color="#22c55e" style={{ marginBottom: 15 }} />
                  <Text style={styles.modalTitle}>Redemption Successful!</Text>
                  <View style={styles.modalQrBg}>
                      <QRCode
                        value={`OB-REDEEMED|${rewardId}|${userId}|${Date.now()}`}
                        size={width * 0.4}
                        backgroundColor="#fff"
                        color="#000"
                        ecl="M"
                      />
                  </View>
                  <Text style={styles.modalCodeLabel}>CONFIRMATION CODE:</Text>
                  <Text style={styles.modalCode}>#{displayCode}</Text>
                  
                  <TouchableOpacity 
                    style={styles.doneBtn} 
                    onPress={() => {
                        setSuccess(false);
                        navigation.navigate("RewardsScreen");
                    }}
                  >
                      <Text style={styles.doneBtnText}>Okay</Text>
                  </TouchableOpacity>
              </View>
          </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    backgroundColor: "#fff",
    paddingTop: 55,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#000",
    fontSize: 16,
    fontFamily: "MBold",
  },
  headerRight: {
    width: 40,
    alignItems: "flex-end",
  },
  scrollContent: {
    padding: 25,
    alignItems: "center",
  },
  rewardTitle: {
    color: "#000",
    fontSize: RFValue(18),
    fontFamily: "MBold",
    textAlign: "center",
    marginBottom: 30,
  },
  qrContainer: {
    alignItems: "center",
  },
  qrBg: {
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
    borderWidth: 1,
    borderColor: "#eee",
  },
  cantScanLink: {
    marginTop: 18,
    marginBottom: 30,
  },
  cantScanText: {
    color: "#E31837",
    fontSize: 14,
    fontFamily: "MBold",
  },
  fallbackSection: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 25,
  },
  fallbackHeading: {
    color: "#222",
    fontSize: 16,
    fontFamily: "MBold",
    marginBottom: 18,
  },
  fallbackCard: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#eee",
  },
  fallbackLabel: {
    color: "#999",
    fontSize: 9,
    fontFamily: "MBold",
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  fallbackValue: {
    color: "#000",
    fontSize: 17,
    fontFamily: "MMedium",
  },
  teamMemberNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 14,
    marginTop: 18,
  },
  noteIconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f2f2f2",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 2,
  },
  noteText: {
    flex: 1,
    color: "#666",
    fontSize: 13,
    lineHeight: 19,
    fontFamily: "MRegular",
  },
  contactSupport: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 30,
    paddingVertical: 12,
  },
  contactSupportText: {
    color: "#888",
    fontSize: 14,
    fontFamily: "MMedium",
  },
  finePrintSection: {
    width: "100%",
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  finePrintTitle: {
    color: "#bbb",
    fontSize: 9,
    fontFamily: "MBold",
    letterSpacing: 2,
    marginBottom: 12,
  },
  finePrintText: {
    color: "#999",
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "MRegular",
  },
  faqLink: {
    color: "#E31837",
    fontSize: 13,
    fontFamily: "MBold",
    marginTop: 12,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#fff",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 40,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  redeemActionBtn: {
    backgroundColor: "#E31837",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: "center",
  },
  redeemActionText: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  disabledBtn: {
    backgroundColor: "#666",
    opacity: 0.6,
  },
  // Full-screen QR Modal
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
    fontSize: 22,
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
  // Success Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  modalContent: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: "MBold",
    color: "#000",
    marginBottom: 20,
  },
  modalQrBg: {
    padding: 15,
    backgroundColor: "#fff",
    marginVertical: 15,
  },
  modalCodeLabel: {
    color: "#888",
    fontSize: 11,
    fontFamily: "MBold",
    letterSpacing: 1.5,
    marginTop: 10,
  },
  modalCode: {
    fontSize: 26,
    fontFamily: "MBold",
    color: "#E31837",
    letterSpacing: 2,
    marginVertical: 8,
  },
  doneBtn: {
    backgroundColor: "#E31837",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 25,
    alignItems: "center",
  },
  doneBtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
  },
});

export default RedeemInStoreScreen;
