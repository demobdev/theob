import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useUser, useAuth } from "@clerk/clerk-expo";
import BottomNavBar from "../components/BottomNavBar";
import { ensureAuth } from "../utils/authGuard";

const MoreScreen = ({ navigation }) => {
  const { user } = useUser();
  const { isSignedIn } = useAuth();

  const MenuItem = ({ title, onPress, showArrow = false }) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuItemText}>{title.toUpperCase()}</Text>
      {showArrow && <Ionicons name="chevron-forward" size={18} color="#CCC" />}
    </TouchableOpacity>
  );

  const handleNav = (screen: string) => {
    ensureAuth(!!isSignedIn, navigation, () => navigation.navigate(screen));
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header with Close & Title */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>MORE</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* IDENTITY SECTION */}
        <View style={styles.identitySection}>
          {user ? (
            <TouchableOpacity style={styles.profileBlock} onPress={() => handleNav("AccountScreen")}>
              <Image source={{ uri: user.imageUrl }} style={styles.avatar} />
              <View>
                <Text style={styles.greetingText}>Welcome back,</Text>
                <Text style={styles.userNameText}>{user.firstName || "Superfan"}</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#666" style={{ marginLeft: "auto" }} />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.authCTA} onPress={() => navigation.navigate("LoginScreen")}>
              <View style={styles.authTextCol}>
                <Text style={styles.authCTATitle}>Join the Roster</Text>
                <Text style={styles.authCTASub}>Sign in to earn points and set your favorite teams.</Text>
              </View>
              <View style={styles.authBtn}>
                <Text style={styles.authBtnText}>Sign In</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* REWARDS SECTION */}
        <View style={styles.section}>
          <MenuItem title="Rewards" onPress={() => navigation.navigate("RewardsScreen")} />
          <MenuItem title="Collect Points" onPress={() => handleNav("CollectPointsScreen")} />
          <MenuItem title="Multipliers" onPress={() => {}} />
          <MenuItem title="Upload Receipts" onPress={() => handleNav("UploadReceiptScreen")} />
          <MenuItem title="Saved Cards" onPress={() => handleNav("SavedCardsScreen")} />
        </View>

        {/* ORDER & NOTIFS SECTION */}
        <View style={styles.section}>
          <MenuItem title="Order History" onPress={() => handleNav("OrderHistoryScreen")} />
          <MenuItem title="My Teams" onPress={() => handleNav("MyTeamsScreen")} />
          <MenuItem title="Notifications" onPress={() => navigation.navigate("NotificationSettingsScreen")} />
        </View>

        {/* SUPPORT & ABOUT SECTION */}
        <View style={styles.section}>
          <MenuItem title="Support" onPress={() => navigation.navigate("HelpCenterScreen")} />
          <MenuItem title="Account" onPress={() => handleNav("AccountScreen")} />
          <MenuItem title="About" onPress={() => navigation.navigate("AboutScreen")} />
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER ACTION */}
      <View style={styles.footer}>
        <TouchableOpacity 
          style={styles.startOrderBtn}
          onPress={() => navigation.navigate("HomeScreen")}
        >
          <Text style={styles.startOrderBtnText}>START ORDER</Text>
        </TouchableOpacity>
      </View>

      <BottomNavBar activeTab="MORE" navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  closeBtn: {
    marginRight: 10,
  },
  headerIcon: {
    width: 36,
    height: 36,
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
  scrollContent: {
    paddingVertical: 10,
    paddingTop: 15,
  },
  section: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
  },
  menuItemText: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#FFF",
    letterSpacing: 1.5,
  },
  footer: {
    paddingHorizontal: 20,
    paddingBottom: 90, // Above nav bar
    paddingTop: 10,
    backgroundColor: "#0F0F11",
  },
  startOrderBtn: {
    backgroundColor: "#E31837", // Keep red for the primary action
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  startOrderBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 2,
  },

  identitySection: {
    paddingHorizontal: 20,
    marginBottom: 25,
  },
  profileBlock: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#2A2A2A",
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 15,
    backgroundColor: "#333",
  },
  greetingText: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: RFValue(11),
  },
  userNameText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(16),
  },
  authCTA: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1A1A1A",
    padding: 20,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#E31837",
    borderLeftWidth: 4,
  },
  authTextCol: {
    flex: 1,
    paddingRight: 15,
  },
  authCTATitle: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    marginBottom: 4,
  },
  authCTASub: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: RFValue(10),
    lineHeight: 14,
  },
  authBtn: {
    backgroundColor: "#E31837",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
  },
  authBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(10),
  },
});

export default MoreScreen;
