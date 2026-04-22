import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const SettingToggle = ({ label, value, onToggle }) => (
  <View style={styles.toggleItem}>
    <Text style={styles.toggleLabel}>{label}</Text>
    <Switch
      trackColor={{ false: "#333", true: "#E31837" }}
      thumbColor={value ? "#FFF" : "#AAA"}
      ios_backgroundColor="#1A1A1A"
      onValueChange={onToggle}
      value={value}
    />
  </View>
);

const NotificationSettingsScreen = ({ navigation }) => {
  const [pushOrder, setPushOrder] = useState(true);
  const [pushOffers, setPushOffers] = useState(true);
  const [pushPoints, setPushPoints] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(true);
  const [emailStatements, setEmailStatements] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>PUSH NOTIFICATIONS</Text>
          <SettingToggle 
            label="Order Status Updates" 
            value={pushOrder} 
            onToggle={setPushOrder} 
          />
          <SettingToggle 
            label="Daily Offers & Specials" 
            value={pushOffers} 
            onToggle={setPushOffers} 
          />
          <SettingToggle 
            label="Points Multiplier Alerts" 
            value={pushPoints} 
            onToggle={setPushPoints} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>EMAIL NOTIFICATIONS</Text>
          <SettingToggle 
            label="Marketing & Newsletter" 
            value={emailMarketing} 
            onToggle={setEmailMarketing} 
          />
          <SettingToggle 
            label="Monthly Points Statement" 
            value={emailStatements} 
            onToggle={setEmailStatements} 
          />
        </View>

        <TouchableOpacity 
          style={styles.saveBtn}
          onPress={() => {
            // Future logic to save to Clerk metadata or database
            navigation.goBack();
          }}
        >
          <Text style={styles.saveBtnText}>SAVE PREFERENCES</Text>
        </TouchableOpacity>
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
    paddingHorizontal: 20,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: {
    marginRight: 10,
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
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: RFValue(10),
    fontFamily: "MBold",
    color: "#666",
    marginBottom: 20,
    letterSpacing: 1.5,
  },
  toggleItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  toggleLabel: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#FFF",
  },
  saveBtn: {
    backgroundColor: "#E31837",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: RFValue(13),
    fontFamily: "MBold",
    letterSpacing: 1,
  }
});

export default NotificationSettingsScreen;
