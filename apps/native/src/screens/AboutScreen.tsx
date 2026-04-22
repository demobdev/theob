import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  SafeAreaView,
  ScrollView,
  StatusBar
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const AboutScreen = ({ navigation }) => {
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
        <Text style={styles.headerTitle}>ABOUT</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Logo Section */}
        <View style={styles.logoContainer}>
          <Image 
            source={require("../../assets/images/theob-letter-tp.png")} 
            style={styles.logo} 
            resizeMode="contain"
          />
          <View style={styles.metaInfo}>
            <Text style={styles.locationText}>Made in beautiful Greenville, SC</Text>
            <Text style={styles.versionText}>Version 1.0.4 • ©2026 THE OWNER'S BOX Inc.</Text>
          </View>
        </View>

        {/* Links Section */}
        <View style={styles.linksContainer}>
          <TouchableOpacity style={styles.linkItem} onPress={() => {}}>
            <Text style={styles.linkText}>Accessibility Statement</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate("PrivacyPolicyScreen")}>
            <Text style={styles.linkText}>Privacy Policy</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => navigation.navigate("TermsScreen")}>
            <Text style={styles.linkText}>Terms & Conditions</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.linkItem} onPress={() => {}}>
            <Text style={styles.linkText}>Online-Tracking Opt Out Guide</Text>
            <Ionicons name="chevron-forward" size={20} color="#CCC" />
          </TouchableOpacity>
        </View>
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
    paddingTop: 40,
    alignItems: "center",
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 40,
  },
  logo: {
    width: 320,
    height: 130,
    marginBottom: 20,
  },
  metaInfo: {
    alignItems: "center",
    marginTop: 20,
  },
  locationText: {
    fontSize: RFValue(11),
    color: "#888",
    fontFamily: "MRegular",
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  versionText: {
    fontSize: RFValue(10),
    color: "#444",
    fontFamily: "MRegular",
    letterSpacing: 0.5,
  },
  linksContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#1A1A1A",
    backgroundColor: "#111",
  },
  linkItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 20,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  linkText: {
    fontSize: RFValue(13),
    color: "#DDD",
    fontFamily: "MBold",
    letterSpacing: 0.5,
  },
});

export default AboutScreen;
