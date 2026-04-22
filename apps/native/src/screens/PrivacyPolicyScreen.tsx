import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. INFORMATION WE COLLECT</Text>
          <Text style={styles.bodyText}>
            We collect information you provide directly to us, such as when you create an account, place an order, or contact us for support. This may include your name, email address, phone number, and payment information.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. HOW WE USE YOUR INFORMATION</Text>
          <Text style={styles.bodyText}>
            We use the information we collect to provide, maintain, and improve our services, process your transactions, and send you technical notices, updates, and support messages.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. SHARING OF INFORMATION</Text>
          <Text style={styles.bodyText}>
            We do not share your personal information with third parties except as described in this policy, such as with vendors who perform services on our behalf (e.g., payment processing).
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. DATA SECURITY</Text>
          <Text style={styles.bodyText}>
            We take reasonable measures to help protect information about you from loss, theft, misuse, and unauthorized access.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. YOUR CHOICES</Text>
          <Text style={styles.bodyText}>
            You may update or correct your account information at any time by logging into your account or contacting us. You can also opt-out of receiving promotional communications from us.
          </Text>
        </View>

        <Text style={styles.footerText}>Last Updated: April 20, 2026</Text>
        <View style={{ height: 40 }} />
      </ScrollView>
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
    paddingHorizontal: 15,
    height: 56,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 8,
  },
  headerIcon: {
    width: 22,
    height: 22,
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
  content: {
    padding: 25,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#DDD",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  bodyText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
    lineHeight: 20,
  },
  footerText: {
    fontSize: RFValue(10),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
    marginTop: 20,
  }
});

export default PrivacyPolicyScreen;
