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

const TermsScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>TERMS & CONDITIONS</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>1. ACCEPTANCE OF TERMS</Text>
          <Text style={styles.bodyText}>
            By accessing and using THE OWNER'S BOX mobile application, you agree to be bound by these Terms and Conditions. If you do not agree, please do not use the app.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>2. USER ACCOUNTS</Text>
          <Text style={styles.bodyText}>
            You are responsible for maintaining the confidentiality of your account information and for all activities that occur under your account. You agree to provide accurate and complete information when creating an account.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>3. LOYALTY PROGRAM</Text>
          <Text style={styles.bodyText}>
            Points earned through our Box Score loyalty program have no cash value and are non-transferable. We reserve the right to modify or terminate the program at any time.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>4. LIMITATION OF LIABILITY</Text>
          <Text style={styles.bodyText}>
            THE OWNER'S BOX shall not be liable for any indirect, incidental, special, or consequential damages resulting from the use or inability to use the application.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>5. MODIFICATIONS</Text>
          <Text style={styles.bodyText}>
            We reserve the right to change these terms at any time. Your continued use of the app after such changes constitutes acceptance of the new terms.
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

export default TermsScreen;
