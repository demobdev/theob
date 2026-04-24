import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  StatusBar
} from "react-native";
import { Ionicons, FontAwesome5 } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useNavigation } from "@react-navigation/native";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useUser } from "@clerk/clerk-expo";

// THE OB Standard Colors
const DARK = "#111111";
const DARK_CARD = "#1C1C1E";
const RED = "#E31837";
const GOLD = "#FFA500";
const TEXT_MUTED = "#888";

const CollectPointsScreen = () => {
  const navigation = useNavigation<any>();
  const { user } = useUser();
  
  // Real data from Convex
  const profile = useQuery(api.loyalty.getUserProfile);
  const paymentMethods = useQuery(api.payments.getPaymentMethods) || [];
  
  const points = profile?.points || 0;
  const cards = paymentMethods;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.iconBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Collect Points</Text>
        <TouchableOpacity style={styles.iconBtn} onPress={() => navigation.navigate("OrderHistoryScreen")}>
          <Ionicons name="receipt-outline" size={24} color="#FFF" />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        
        {/* Points Display Section */}
        <View style={styles.pointsHero}>
          <View style={styles.foamFingerContainer}>
            <FontAwesome5 name="hand-point-up" size={40} color={RED} />
          </View>
          <Text style={styles.youHaveText}>You've got</Text>
          <Text style={styles.pointsBigText}>{points} Points</Text>

          <TouchableOpacity style={styles.multipliersBtn}>
            <Text style={styles.multipliersBtnText}>
              COLLECT MORE POINTS WITH MULTIPLIERS
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.supportLink}>
            <Ionicons name="help-buoy-outline" size={16} color={TEXT_MUTED} />
            <Text style={styles.supportLinkText}>Contact Support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* Linked Cards Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            You are automatically collecting Points!
          </Text>
          <Text style={styles.sectionSubtitle}>
            When you shop with {cards.length} registered card(s)
          </Text>

          <View style={styles.cardsList}>
            {cards.map((card) => (
              <View key={card._id} style={styles.cardRow}>
                <View style={styles.cardBrandBox}>
                  <FontAwesome5 
                    name={card.brand?.toLowerCase() === "visa" ? "cc-visa" : "credit-card"} 
                    size={20} 
                    color={card.brand?.toLowerCase() === "visa" ? "#00579F" : "#555"} 
                  />
                </View>
                <Text style={styles.cardDigits}>.... .... .... {card.last4}</Text>
              </View>
            ))}
            {cards.length === 0 && (
              <Text style={styles.noCardsText}>No cards registered yet.</Text>
            )}
          </View>

          <TouchableOpacity 
            style={styles.addMoreBtn}
            onPress={() => navigation.navigate("SavedCardsScreen")}
          >
            <Text style={styles.addMoreBtnText}>Add more</Text>
          </TouchableOpacity>
        </View>

        {/* Receipt Upload Section */}
        <View style={styles.sectionCenter}>
          <View style={styles.receiptCircle}>
            <Ionicons name="receipt" size={20} color={TEXT_MUTED} />
          </View>
          <Text style={styles.sectionTitleCenter}>
            Missing points from a previous purchase
          </Text>
          <Text style={styles.sectionSubtitleCenter}>
            <Text style={styles.linkAccent}>Upload receipts</Text> to earn Points for your purchases.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: DARK,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 15,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  headerTitle: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(15),
    letterSpacing: 1,
  },
  iconBtn: {
    padding: 5,
  },
  content: {
    paddingBottom: 40,
  },
  // Hero
  pointsHero: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  foamFingerContainer: {
    marginBottom: 15,
  },
  youHaveText: {
    color: "#CCC",
    fontFamily: "MRegular",
    fontSize: RFValue(14),
    marginBottom: 5,
  },
  pointsBigText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(36),
    marginBottom: 25,
  },
  multipliersBtn: {
    borderWidth: 1,
    borderColor: RED,
    borderRadius: 8,
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginBottom: 20,
    width: "100%",
    alignItems: "center",
  },
  multipliersBtnText: {
    color: RED,
    fontFamily: "MBold",
    fontSize: RFValue(10),
    letterSpacing: 1,
  },
  supportLink: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  supportLinkText: {
    color: TEXT_MUTED,
    fontFamily: "MRegular",
    fontSize: RFValue(12),
  },
  divider: {
    height: 1,
    backgroundColor: "#222",
    width: "100%",
  },
  // Section Auto Collect
  section: {
    padding: 24,
    backgroundColor: "#161618",
    borderBottomWidth: 1,
    borderBottomColor: "#222",
  },
  sectionTitle: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(16),
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitle: {
    color: TEXT_MUTED,
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    textAlign: "center",
    marginBottom: 24,
  },
  cardsList: {
    gap: 12,
    marginBottom: 20,
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: DARK_CARD,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    padding: 16,
    gap: 15,
  },
  cardBrandBox: {
    backgroundColor: "#FFF",
    paddingHorizontal: 4,
    paddingVertical: 2,
    borderRadius: 4,
  },
  cardDigits: {
    color: "#FFF",
    fontFamily: "MRegular",
    fontSize: RFValue(14),
    letterSpacing: 2,
  },
  addMoreBtn: {
    backgroundColor: RED,
    borderRadius: 8,
    paddingVertical: 16,
    alignItems: "center",
  },
  addMoreBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(14),
  },
  // Section Missing Points
  sectionCenter: {
    padding: 30,
    alignItems: "center",
  },
  receiptCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: DARK_CARD,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitleCenter: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    textAlign: "center",
    marginBottom: 8,
  },
  sectionSubtitleCenter: {
    color: TEXT_MUTED,
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    textAlign: "center",
    lineHeight: 20,
  },
  linkAccent: {
    color: RED,
    fontFamily: "MRegular",
  },
  noCardsText: {
    color: TEXT_MUTED,
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    textAlign: "center",
    marginVertical: 10,
  }
});

export default CollectPointsScreen;
