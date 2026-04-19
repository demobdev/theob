import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const { height } = Dimensions.get("window");

const PreferencesModal = ({ visible, onClose }) => {
  const [serviceType, setServiceType] = useState("In-Store Pickup"); // In-Store, Curbside, Delivery
  const [timeMode, setTimeMode] = useState("TODAY"); // TODAY, SCHEDULE
  const [phone, setPhone] = useState("864-202-2889");

  const serviceTypes = [
    { id: "In-Store Pickup", label: "In-Store\nPickup" },
    { id: "Curbside Pickup", label: "Curbside\nPickup" },
    { id: "Delivery", label: "Delivery (via\nDelivery\nService)" },
  ];

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <TouchableOpacity 
        style={styles.overlay} 
        activeOpacity={1} 
        onPress={onClose}
      >
        <TouchableOpacity 
            style={styles.drawer} 
            activeOpacity={1}
        >
          {/* HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={28} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Preferences</Text>
            <View style={{ width: 40 }} />
          </View>

          <ScrollView contentContainerStyle={styles.content}>
            {/* LOCATION SECTION */}
            <View style={styles.section}>
                <Text style={styles.label}>RESTAURANT LOCATION</Text>
                <TouchableOpacity style={styles.locationLink}>
                    <View>
                        <Text style={styles.locationName}>Greenville</Text>
                        <Text style={styles.locationAddress}>1461 Woodruff Rd Suite E{"\n"}Greenville</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#FFA500" />
                </TouchableOpacity>
            </View>

            {/* SERVICE TYPE TABS */}
            <View style={styles.tabRow}>
                {serviceTypes.map((type) => (
                    <TouchableOpacity 
                        key={type.id}
                        style={[
                            styles.serviceTab, 
                            serviceType === type.id && styles.activeServiceTab
                        ]}
                        onPress={() => setServiceType(type.id)}
                    >
                        <Text style={[
                            styles.serviceTabText, 
                            serviceType === type.id && styles.activeServiceTabText
                        ]}>
                            {type.label}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View>

            {/* TIME TOGGLE */}
            <View style={styles.toggleRow}>
                <TouchableOpacity 
                    style={[styles.toggleBtn, timeMode === "TODAY" && styles.activeToggle]}
                    onPress={() => setTimeMode("TODAY")}
                >
                    <Text style={[styles.toggleText, timeMode === "TODAY" && styles.activeToggleText]}>TODAY</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[styles.toggleBtn, timeMode === "SCHEDULE" && styles.activeToggle]}
                    onPress={() => setTimeMode("SCHEDULE")}
                >
                    <Text style={[styles.toggleText, timeMode === "SCHEDULE" && styles.activeToggleText]}>SCHEDULE</Text>
                </TouchableOpacity>
            </View>

            {/* TIME INPUT */}
            <View style={styles.section}>
                <Text style={styles.label}>YOUR {serviceType.toUpperCase()} TIME</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        value="10:30 am - 10:45 am" 
                        editable={false}
                        placeholderTextColor="#666"
                    />
                    <Ionicons name="time-outline" size={20} color="#888" />
                </View>
            </View>

            {/* PHONE INPUT */}
            <View style={styles.section}>
                <Text style={styles.label}>PHONE (In case we need to contact you)</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        value={phone}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* UPDATE BUTTON - RED AS REQUESTED FOR ACTION */}
            <TouchableOpacity style={styles.updateBtn} onPress={onClose}>
                <Text style={styles.updateBtnText}>Update order</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  drawer: {
    backgroundColor: "#161616", // THEOB Dark Mode
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    maxHeight: height * 0.85,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeBtn: {
    width: 40,
    alignItems: "flex-start",
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "MBold",
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  section: {
    marginBottom: 25,
  },
  label: {
    color: "#666",
    fontSize: 10,
    fontFamily: "MBold",
    letterSpacing: 1,
    marginBottom: 12,
  },
  locationLink: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  locationName: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "MBold",
  },
  locationAddress: {
    color: "#888",
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    marginTop: 4,
  },
  tabRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  serviceTab: {
    flex: 1,
    height: 70,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
  },
  activeServiceTab: {
    backgroundColor: "#FFA500", // BOX GOLD
    borderColor: "#FFA500",
  },
  serviceTabText: {
    color: "#888",
    fontSize: 10,
    textAlign: "center",
    fontFamily: "MBold",
  },
  activeServiceTabText: {
    color: "#000", // BLACK ON GOLD
  },
  toggleRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 25,
  },
  toggleBtn: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  activeToggle: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  toggleText: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: 12,
  },
  activeToggleText: {
    color: "#000",
  },
  inputContainer: {
    backgroundColor: "#222",
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    height: 52,
    borderWidth: 1,
    borderColor: "#333",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontFamily: "MRegular",
    fontSize: 14,
  },
  updateBtn: {
    backgroundColor: "#FFA500",
    height: 56,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  updateBtnText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 16,
  },
});

export default PreferencesModal;
