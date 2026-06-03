import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Switch,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const SettingToggle = ({
  label,
  value,
  onToggle,
  disabled = false,
}: {
  label: string;
  value: boolean;
  onToggle: (next: boolean) => void;
  disabled?: boolean;
}) => (
  <View style={styles.toggleItem}>
    <Text style={[styles.toggleLabel, disabled && styles.toggleLabelMuted]}>
      {label}
    </Text>
    <Switch
      trackColor={{ false: "#333", true: "#E31837" }}
      thumbColor={value ? "#FFF" : "#AAA"}
      ios_backgroundColor="#1A1A1A"
      onValueChange={onToggle}
      value={value}
      disabled={disabled}
    />
  </View>
);

const NotificationSettingsScreen = ({ navigation }) => {
  const profile = useQuery(api.loyalty.getUserProfile);
  const syncProfile = useMutation(api.loyalty.syncUserProfile);

  const [pushOffers, setPushOffers] = useState(true);
  const [pushPoints, setPushPoints] = useState(false);
  const [emailMarketing, setEmailMarketing] = useState(true);
  const [emailStatements, setEmailStatements] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile === undefined) return;
    const marketing = profile?.marketingOptIn ?? true;
    setPushOffers(marketing);
    setPushPoints(marketing);
    setEmailMarketing(marketing);
  }, [profile]);

  const handleSave = async () => {
    setSaving(true);
    try {
      await syncProfile({ marketingOptIn: pushOffers || emailMarketing });
      navigation.goBack();
    } finally {
      setSaving(false);
    }
  };

  const loading = profile === undefined;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
        </View>
        <Text style={styles.headerTitle}>NOTIFICATIONS</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {loading ? (
          <ActivityIndicator color="#E31837" style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>PUSH NOTIFICATIONS</Text>
              <SettingToggle
                label="Order Status Updates"
                value={true}
                onToggle={() => undefined}
                disabled
              />
              <Text style={styles.hint}>
                Order-ready alerts are always sent when you have push enabled.
              </Text>
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
              style={[styles.saveBtn, saving && styles.saveBtnDisabled]}
              onPress={handleSave}
              disabled={saving}
            >
              {saving ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>SAVE PREFERENCES</Text>
              )}
            </TouchableOpacity>
          </>
        )}
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
  hint: {
    fontSize: RFValue(10),
    fontFamily: "MRegular",
    color: "#666",
    marginBottom: 12,
    marginTop: -8,
    lineHeight: RFValue(14),
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
    flex: 1,
    paddingRight: 12,
  },
  toggleLabelMuted: {
    color: "#888",
  },
  saveBtn: {
    backgroundColor: "#E31837",
    height: 55,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  saveBtnDisabled: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#FFF",
    fontSize: RFValue(13),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
});

export default NotificationSettingsScreen;
