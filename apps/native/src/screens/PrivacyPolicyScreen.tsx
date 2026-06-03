import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { privacyPolicy } from "@packages/legal";
import LegalDocumentView from "../components/LegalDocumentView";

const PrivacyPolicyScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>PRIVACY POLICY</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <LegalDocumentView document={privacyPolicy} />
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
});

export default PrivacyPolicyScreen;
