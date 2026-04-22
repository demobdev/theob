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
import { useOrder } from "../context/OrderContext";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const { height } = Dimensions.get("window");

const PreferencesModal = ({ visible, onClose }) => {
  const { 
    fulfillmentMethod, setFulfillmentMethod,
    phoneNumber, setPhone,
    scheduledTime, setScheduledTime,
    vehicleInfo, setVehicle,
    deliveryAddress, setDeliveryAddress
  } = useOrder();
  
  const userProfile = useQuery(api.loyalty.getUserProfile);
  const updateVehicle = useMutation(api.loyalty.updateUserVehicle);
  
  const [showSubModal, setShowSubModal] = useState(""); // "" | "curbside" | "delivery" | "schedule"
  const [scheduleDay, setScheduleDay] = useState("Today"); // Today, Tomorrow
  const [timeMode, setTimeMode] = useState("TODAY"); // TODAY, SCHEDULE

  // Local Temp State for Curbside
  const [carMake, setCarMake] = useState(vehicleInfo?.make || "");
  const [carModel, setCarModel] = useState(vehicleInfo?.model || "");
  const [carColor, setCarColor] = useState(vehicleInfo?.color || "");

  // Sync with profile on load
  React.useEffect(() => {
    if (userProfile?.vehicle && !carMake && !carModel && !carColor) {
      setCarMake(userProfile.vehicle.make);
      setCarModel(userProfile.vehicle.model);
      setCarColor(userProfile.vehicle.color);
      setVehicle(userProfile.vehicle);
    }
  }, [userProfile]);

  // Local Temp State for Delivery
  const [delFirstName, setDelFirstName] = useState(deliveryAddress?.firstName || "");
  const [delLastName, setDelLastName] = useState(deliveryAddress?.lastName || "");
  const [delAddress, setDelAddress] = useState(deliveryAddress?.address || "");
  const [delApt, setDelApt] = useState(deliveryAddress?.apt || "");
  const [delCity, setDelCity] = useState(deliveryAddress?.city || "");
  const [delState, setDelState] = useState(deliveryAddress?.state || "");
  const [delZip, setDelZip] = useState(deliveryAddress?.zip || "");
  const [delInstructions, setDelInstructions] = useState(deliveryAddress?.instructions || "");

  // Compute dynamic pickup/delivery time based on current time
  const getDynamicTimeStr = () => {
    if (timeMode === "SCHEDULE") return "Tap to schedule a future date...";
    
    // Assume 15-30 minute prep/delivery window from NOW
    const now = new Date();
    const start = new Date(now.getTime() + 15 * 60000);
    const end = new Date(now.getTime() + 30 * 60000);
    
    const formatTime = (d: Date) => 
      d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
      
    // e.g. "Today, 10:30 AM - 10:45 AM"
    return `Today, ${formatTime(start)} - ${formatTime(end)}`;
  };

  const generateTimeSlots = (day: string) => {
    const slots = [];
    const now = new Date();
    const isToday = day === "Today";
    
    // Standard hours: 11 AM to 10 PM
    let startHour = 11;
    let startMin = 0;
    
    if (isToday) {
      const currentHour = now.getHours();
      const currentMin = now.getMinutes();
      
      // If past 10 PM today, no slots available
      if (currentHour >= 22) return [];
      
      // otherwise, start from next 30-min block
      if (currentHour >= 11) {
        startHour = currentHour;
        startMin = currentMin < 30 ? 30 : 0;
        if (startMin === 0) startHour += 1;
      }
    }
    
    for (let h = startHour; h < 22; h++) {
      for (let m of [0, 30]) {
        if (isToday && h === startHour && m < startMin) continue;
        
        const period = h < 12 ? "AM" : "PM";
        const hour12 = h % 12 || 12;
        const timeStr = `${hour12}:${m === 0 ? "00" : "30"} ${period}`;
        slots.push(timeStr);
      }
    }
    
    return slots;
  };

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
                        <Text style={styles.locationAddress}>1757 Woodruff Rd. STE A{"\n"}Greenville, SC 29607</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={20} color="#FFA500" />
                </TouchableOpacity>
            </View>

            {/* SERVICE TYPE TABS */}
            <View style={styles.tabRow}>
                {serviceTypes.map((type) => {
                    // Match visual label string back to the state enum
                    let mappedEnum = "pickup_instore";
                    if (type.id === "Curbside Pickup") mappedEnum = "pickup_curbside";
                    if (type.id === "Delivery") mappedEnum = "delivery_partner";

                    return (
                        <TouchableOpacity 
                            key={type.id}
                            style={[
                                styles.serviceTab, 
                                fulfillmentMethod === mappedEnum && styles.activeServiceTab
                            ]}
                            onPress={() => {
                              setFulfillmentMethod(mappedEnum as any);
                              if (mappedEnum === "pickup_curbside") setShowSubModal("curbside");
                              if (mappedEnum === "delivery_partner") setShowSubModal("delivery");
                            }}
                        >
                            <Text style={[
                                styles.serviceTabText, 
                                fulfillmentMethod === mappedEnum && styles.activeServiceTabText
                            ]}>
                                {type.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
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
                <Text style={styles.label}>YOUR TIME</Text>
                {timeMode === "TODAY" ? (
                  <View style={styles.inputContainer}>
                      <TextInput 
                          style={styles.input} 
                          value={getDynamicTimeStr()} 
                          editable={false}
                          placeholderTextColor="#666"
                      />
                      <Ionicons name="time-outline" size={20} color="#888" />
                  </View>
                ) : (
                  <TouchableOpacity style={styles.inputContainer} onPress={() => setShowSubModal("schedule")}>
                      <Text style={[styles.input, { color: "#888" }]} pointerEvents="none">
                          Tap to schedule a future date...
                      </Text>
                      <Ionicons name="time-outline" size={20} color="#888" style={{ position: "absolute", right: 15, top: 15 }} />
                  </TouchableOpacity>
                )}
            </View>

            {/* PHONE INPUT */}
            <View style={styles.section}>
                <Text style={styles.label}>PHONE (In case we need to contact you)</Text>
                <View style={styles.inputContainer}>
                    <TextInput 
                        style={styles.input} 
                        value={phoneNumber}
                        onChangeText={setPhone}
                        keyboardType="phone-pad"
                        placeholderTextColor="#666"
                    />
                </View>
            </View>

            {/* UPDATE BUTTON - RED AS REQUESTED FOR ACTION */}
            <TouchableOpacity style={styles.updateBtn} onPress={() => onClose()}>
                <Text style={styles.updateBtnText}>Update order</Text>
            </TouchableOpacity>
          </ScrollView>
        </TouchableOpacity>
      </TouchableOpacity>

      {/* CURBSIDE SUB-MODAL */}
      <Modal 
        visible={showSubModal === "curbside"} 
        transparent={true} 
        animationType="slide"
        onRequestClose={() => setShowSubModal("")}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.subModalContent}>
                <View style={styles.subModalHeader}>
                    <TouchableOpacity onPress={() => setShowSubModal("")} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#FFA500" />
                    </TouchableOpacity>
                    <Text style={styles.subModalTitle}>Details</Text>
                    <TouchableOpacity onPress={async () => {
                      setVehicle({ make: carMake, model: carModel, color: carColor });
                      try {
                        await updateVehicle({ make: carMake, model: carModel, color: carColor });
                      } catch (e) {
                        console.error("Failed to save vehicle", e);
                      }
                      setShowSubModal("");
                    }}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>Help us get your food to you quickly by adding the details below</Text>
                
                <Text style={styles.inputLabel}>MAKE</Text>
                <TextInput style={styles.subInput} value={carMake} onChangeText={setCarMake} keyboardAppearance="dark" />
                
                <Text style={styles.inputLabel}>MODEL</Text>
                <TextInput style={styles.subInput} value={carModel} onChangeText={setCarModel} keyboardAppearance="dark" />
                
                <Text style={styles.inputLabel}>COLOR</Text>
                <TextInput style={styles.subInput} value={carColor} onChangeText={setCarColor} keyboardAppearance="dark" />
                <TouchableOpacity 
                    style={[styles.updateBtn, { marginTop: 30 }]} 
                    onPress={async () => {
                      setVehicle({ make: carMake, model: carModel, color: carColor });
                      try {
                        await updateVehicle({ make: carMake, model: carModel, color: carColor });
                      } catch (e) {
                        console.error("Failed to save vehicle", e);
                      }
                      setShowSubModal("");
                    }}
                >
                    <Text style={[styles.updateBtnText, { color: "#000" }]}>Save vehicle details</Text>
                </TouchableOpacity>
            </View>
        </View>
      </Modal>

      {/* SCHEDULE SUB-MODAL */}
      <Modal 
        visible={showSubModal === "schedule"} 
        transparent={true} 
        animationType="slide"
        onRequestClose={() => setShowSubModal("")}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.subModalContent}>
                <View style={styles.subModalHeader}>
                    <TouchableOpacity onPress={() => setShowSubModal("")} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#FFA500" />
                    </TouchableOpacity>
                    <Text style={styles.subModalTitle}>Schedule Order</Text>
                    <TouchableOpacity onPress={() => setShowSubModal("")}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>
                <Text style={styles.helperText}>Select a time for your order.</Text>
                
                {/* Tabs */}
                <View style={styles.tabRow}>
                  {["Today", "Tomorrow"].map((day) => (
                    <TouchableOpacity 
                      key={day}
                      style={[styles.toggleBtn, scheduleDay === day && styles.activeToggle]}
                      onPress={() => setScheduleDay(day)}
                    >
                      <Text style={[styles.toggleText, scheduleDay === day && styles.activeToggleText]}>{day.toUpperCase()}</Text>
                    </TouchableOpacity>
                  ))}
                </View>

                <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                  <View style={styles.timeGrid}>
                    {generateTimeSlots(scheduleDay).map((time) => (
                      <TouchableOpacity 
                        key={time} 
                        style={[
                          styles.timeSlot,
                          scheduledTime === `${scheduleDay}, ${time}` && styles.activeTimeSlot
                        ]} 
                        onPress={() => {
                          setScheduledTime(`${scheduleDay}, ${time}`);
                          // Also update main context mode
                          setShowSubModal("");
                        }}
                      >
                        <Text style={[
                          styles.timeSlotText,
                          scheduledTime === `${scheduleDay}, ${time}` && styles.activeTimeSlotText
                        ]}>{time}</Text>
                      </TouchableOpacity>
                    ))}
                    {generateTimeSlots(scheduleDay).length === 0 && (
                      <Text style={styles.noSlotsText}>No slots available for the rest of today.</Text>
                    )}
                  </View>
                </ScrollView>
            </View>
        </View>
      </Modal>

      {/* DELIVERY SUB-MODAL */}
      <Modal 
        visible={showSubModal === "delivery"} 
        transparent={true} 
        animationType="slide"
        onRequestClose={() => setShowSubModal("")}
      >
        <View style={styles.modalOverlay}>
            <View style={styles.subModalContent}>
                <View style={styles.subModalHeader}>
                    <TouchableOpacity onPress={() => setShowSubModal("")} style={styles.backBtn}>
                        <Ionicons name="chevron-back" size={24} color="#FFA500" />
                    </TouchableOpacity>
                    <Text style={styles.subModalTitle}>Add New Address</Text>
                    <TouchableOpacity onPress={() => {
                      setDeliveryAddress({
                        firstName: delFirstName,
                        lastName: delLastName,
                        address: delAddress,
                        apt: delApt,
                        city: delCity,
                        state: delState,
                        zip: delZip,
                        instructions: delInstructions
                      });
                      setShowSubModal("");
                    }}>
                        <Text style={styles.doneText}>Done</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView showsVerticalScrollIndicator={false}>
                    <View style={{flexDirection: "row", gap: 10}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>FIRST NAME</Text>
                        <TextInput style={styles.subInput} value={delFirstName} onChangeText={setDelFirstName} keyboardAppearance="dark" />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>LAST NAME</Text>
                        <TextInput style={styles.subInput} value={delLastName} onChangeText={setDelLastName} keyboardAppearance="dark" />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>DELIVER TO</Text>
                    <TextInput style={styles.subInput} placeholder="Please type your address" value={delAddress} onChangeText={setDelAddress} keyboardAppearance="dark" />

                    <Text style={styles.inputLabel}>APARTMENT, UNIT, SUITE, OR FLOOR (OPTIONAL)</Text>
                    <TextInput style={styles.subInput} placeholder="Apt, Suite, etc." value={delApt} onChangeText={setDelApt} keyboardAppearance="dark" />

                    <View style={{flexDirection: "row", gap: 10}}>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>CITY</Text>
                        <TextInput style={styles.subInput} value={delCity} onChangeText={setDelCity} keyboardAppearance="dark" />
                      </View>
                      <View style={{flex: 1}}>
                        <Text style={styles.inputLabel}>STATE</Text>
                        <TextInput style={styles.subInput} value={delState} onChangeText={setDelState} keyboardAppearance="dark" />
                      </View>
                    </View>

                    <Text style={styles.inputLabel}>ZIP CODE</Text>
                    <TextInput style={styles.subInput} placeholder="12345 or A1B2C3" value={delZip} onChangeText={setDelZip} keyboardAppearance="dark" />

                    <Text style={styles.inputLabel}>DELIVERY INSTRUCTIONS</Text>
                    <TextInput style={[styles.subInput, { height: 80 }]} multiline value={delInstructions} onChangeText={setDelInstructions} keyboardAppearance="dark" />
                </ScrollView>
            </View>
        </View>
      </Modal>

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
  
  /* SUB-MODAL FOR CURBSIDE & DELIVERY */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  subModalContent: {
    backgroundColor: "#1A1A1A",
    flex: 1,
    marginTop: 50,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  subModalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 20,
  },
  subModalTitle: {
    fontSize: 16,
    fontFamily: "MRegular",
    color: "#fff",
  },
  backBtn: {
    paddingRight: 10,
  },
  doneText: {
    fontSize: 16,
    fontFamily: "MRegular",
    color: "#FFA500",
  },
  helperText: {
    fontSize: 16,
    color: "#fff",
    textAlign: "center",
    marginBottom: 30,
    paddingHorizontal: 20,
    fontFamily: "MRegular"
  },
  inputLabel: {
    fontSize: 10,
    fontFamily: "MBold",
    color: "#888",
    letterSpacing: 1.5,
    marginBottom: 5,
    marginTop: 10,
  },
  subInput: {
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 6,
    padding: 12,
    fontSize: 16,
    color: "#fff",
    fontFamily: "MRegular",
    marginBottom: 10,
    backgroundColor: "#222"
  },
  timeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    paddingBottom: 40,
  },
  timeSlot: {
    width: "31%",
    height: 45,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#222",
  },
  activeTimeSlot: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  timeSlotText: {
    color: "#fff",
    fontSize: RFValue(11),
    fontFamily: "MBold",
  },
  activeTimeSlotText: {
    color: "#000",
  },
  noSlotsText: {
    color: "#666",
    fontFamily: "MRegular",
    textAlign: "center",
    width: "100%",
    marginTop: 30,
  }
});

export default PreferencesModal;
