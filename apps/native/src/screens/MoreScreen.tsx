import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import BottomNavBar from "../components/BottomNavBar";

const MoreScreen = ({ navigation }) => {
  const profile = useQuery(api.loyalty.getUserProfile);
  const points = profile?.points ?? 0;

  const UtilityItem = ({ icon, title, subtitle, onPress, showArrow = true, color = "#fff" }) => (
    <TouchableOpacity style={styles.utilityItem} onPress={onPress}>
      <View style={styles.utilityIconContainer}>
         <Ionicons name={icon as any} size={22} color="#F5A623" />
      </View>
      <View style={styles.utilityTextContainer}>
        <Text style={[styles.utilityTitle, { color }]}>{title}</Text>
        {subtitle && <Text style={styles.utilitySubtitle}>{subtitle}</Text>}
      </View>
      {showArrow && <Ionicons name="chevron-forward" size={20} color="#333" />}
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>UTILITIES</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Profile Summary */}
        <View style={styles.profileSection}>
            <View style={styles.avatarPlaceholder}>
                <Ionicons name="person" size={40} color="#333" />
            </View>
            <View style={styles.profileInfo}>
                <Text style={styles.profileName}>BOX SCORE MEMBER</Text>
                <View style={styles.pointsBadge}>
                    <Ionicons name="flame" size={14} color="#000" />
                    <Text style={styles.pointsText}>{points} BOX SCORE POINTS</Text>
                </View>
            </View>
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionLabel}>MY ACCOUNT</Text>
            <UtilityItem 
                icon="person-outline" 
                title="Profile Settings" 
                subtitle="Manage your personal info and security"
                onPress={() => {}} 
            />
            <UtilityItem 
                icon="receipt-outline" 
                title="Order History" 
                subtitle="View your past orders and receipts"
                onPress={() => {}} 
            />
            <UtilityItem 
                icon="card-outline" 
                title="Payment Methods" 
                subtitle="Manage your saved cards and loyalty link"
                onPress={() => {}} 
            />
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionLabel}>PREFERENCES</Text>
            <UtilityItem 
                icon="notifications-outline" 
                title="Notifications" 
                subtitle="Game alerts, order updates, and promos"
                onPress={() => {}} 
            />
            <UtilityItem 
                icon="location-outline" 
                title="Preferred Location" 
                subtitle="Greenville #THEOB"
                onPress={() => {}} 
            />
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionLabel}>SUPPORT</Text>
            <UtilityItem 
                icon="help-circle-outline" 
                title="Help Center" 
                subtitle="FAQ and application guides"
                onPress={() => {}} 
            />
            <UtilityItem 
                icon="mail-outline" 
                title="Contact #THEOB" 
                subtitle="Reach out to our hospitality team"
                onPress={() => {}} 
            />
        </View>

        <View style={[styles.section, { borderBottomWidth: 0 }]}>
            <Text style={styles.sectionLabel}>ABOUT</Text>
            <UtilityItem 
                icon="information-circle-outline" 
                title="Terms of Service" 
                onPress={() => {}} 
            />
            <UtilityItem 
                icon="shield-checkmark-outline" 
                title="Privacy Policy" 
                onPress={() => {}} 
            />
            
            <TouchableOpacity style={styles.logoutBtn}>
                <Text style={styles.logoutText}>SIGN OUT</Text>
            </TouchableOpacity>
            
            <Text style={styles.versionText}>#THEOB APP v1.0.4 (MVP)</Text>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

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
    paddingHorizontal: 25,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    letterSpacing: 2,
  },
  scrollContent: {
    paddingTop: 20,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingVertical: 25,
    backgroundColor: "#161616",
    marginBottom: 20,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(12),
    letterSpacing: 1,
    marginBottom: 6,
  },
  pointsBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5A623",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  pointsText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 9,
    marginLeft: 6,
  },
  section: {
    paddingHorizontal: 25,
    marginBottom: 30,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 20,
  },
  sectionLabel: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 1.5,
    marginBottom: 15,
  },
  utilityItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
  },
  utilityIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  utilityTextContainer: {
    flex: 1,
  },
  utilityTitle: {
    color: "#fff",
    fontFamily: "MSemiBold",
    fontSize: RFValue(12),
    marginBottom: 2,
  },
  utilitySubtitle: {
    color: "#666",
    fontFamily: "MRegular",
    fontSize: RFValue(9),
  },
  logoutBtn: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: "#E31837",
    height: 50,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  logoutText: {
    color: "#E31837",
    fontFamily: "MBold",
    fontSize: 12,
    letterSpacing: 2,
  },
  versionText: {
    color: "#333",
    fontFamily: "MRegular",
    fontSize: 9,
    textAlign: "center",
    marginTop: 25,
    letterSpacing: 1,
  }
});

export default MoreScreen;
