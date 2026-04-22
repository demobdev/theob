import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  Alert,
  Image,
  TextInput,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useUser, useAuth } from "@clerk/clerk-expo";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

// Moving these OUTSIDE the component to prevent re-mounting and losing focus
const InfoField = ({ label, value, onChangeText, showChange = false, editable = true, isEditing = false }) => (
  <View style={styles.infoField}>
    <Text style={styles.fieldLabel}>{label.toUpperCase()}</Text>
    {isEditing && editable ? (
      <TextInput
        style={styles.fieldInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={`Enter ${label}`}
        placeholderTextColor="#444"
      />
    ) : (
      <Text style={styles.fieldValue}>{value || "Not set"}</Text>
    )}
    {!isEditing && showChange && (
      <TouchableOpacity>
        <Text style={styles.changeText}>Change</Text>
      </TouchableOpacity>
    )}
  </View>
);

const ActionButton = ({ title, onPress, isDestructive = false }) => (
  <TouchableOpacity 
      style={[styles.actionBtn, isDestructive && styles.destructiveBtn]} 
      onPress={onPress}
  >
    <Text style={[styles.actionBtnText, isDestructive && styles.destructiveBtnText]}>
      {title}
    </Text>
  </TouchableOpacity>
);

const AccountScreen = ({ navigation }) => {
  const { isLoaded, user, isSignedIn } = useUser();
  const { signOut } = useAuth();
  const syncProfile = useMutation(api.loyalty.syncUserProfile);
  const profile = useQuery(api.loyalty.getUserProfile);

  const [isEditing, setIsEditing] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [birthMonth, setBirthMonth] = useState("February");
  const [birthDay, setBirthDay] = useState("13");
  const [smsConsent, setSmsConsent] = useState(false);
  const [marketingOptIn, setMarketingOptIn] = useState(false);

  // Sync state with user data ONLY when loaded and not editing
  useEffect(() => {
    if (isLoaded && user && !isEditing) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      const metadata = user.unsafeMetadata as any;
      setPhone(metadata?.phone || user.primaryPhoneNumber?.phoneNumber || "");
      setBirthMonth(metadata?.birthMonth || "February");
      setBirthDay(metadata?.birthDay || "13");
    }
  }, [isLoaded, user, isEditing]);

  useEffect(() => {
    if (profile && !isEditing) {
      setSmsConsent(profile.smsConsent || false);
      setMarketingOptIn(profile.marketingOptIn || false);
    }
  }, [profile, isEditing]);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "Are you sure you want to sign out?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Sign Out", 
          style: "destructive",
          onPress: async () => {
            try {
              await signOut();
              // Force navigation back to the Landing screen to prevent being trapped in Account
              navigation.reset({
                index: 0,
                routes: [{ name: "LandingScreen" }],
              });
            } catch (error) {
              console.error("Sign out error:", error);
            }
          } 
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!isLoaded || !user) {
      Alert.alert("Error", "We're still syncing your profile. Please try again in a few seconds.");
      return;
    }

    try {
      const safePhone = phone ? phone.trim() : "";
      
      await user.update({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        unsafeMetadata: {
          ...(user.unsafeMetadata as any),
          birthMonth,
          birthDay,
          phone: safePhone,
        }
      });
      
      // Sync to Convex
      const result = await syncProfile({
        phone: safePhone,
        birthMonth,
        birthDay,
        smsConsent,
        marketingOptIn,
      });
      
      if (result?.error === "NOT_AUTHENTICATED") {
        Alert.alert(
          "Sync Issue", 
          "We couldn't sync your changes to our secure server. Please try logging out and back in."
        );
        return;
      }
      
      setIsEditing(false);
      Alert.alert("Success", "Profile updated successfully!");
    } catch (err) {
      Alert.alert("Error", "Failed to update profile. Please try again.");
      console.error(err);
    }
  };

  const handleAccountRemoval = () => {
    Alert.alert(
      "Request Account Removal",
      "Are you sure you want to request account removal? This action is permanent and cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Confirm", 
          style: "destructive",
          onPress: () => {
            // Logic to send request could go here
            Alert.alert(
              "Request Sent", 
              "Your request has been received. Our team will contact you at your registered email to complete the process."
            );
          } 
        },
      ]
    );
  };

  const handleCancel = () => {
    if (user) {
      setFirstName(user.firstName || "");
      setLastName(user.lastName || "");
      const metadata = user.unsafeMetadata as any;
      setPhone(metadata?.phone || user.primaryPhoneNumber?.phoneNumber || "");
      setBirthMonth(metadata?.birthMonth || "February");
      setBirthDay(metadata?.birthDay || "13");
      setSmsConsent(profile?.smsConsent || false);
      setMarketingOptIn(profile?.marketingOptIn || false);
    }
    setIsEditing(false);
  };

  if (!isLoaded) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#E31837" />
        <Text style={styles.loadingText}>Syncing Profile...</Text>
      </View>
    );
  }

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
        <Text style={styles.headerTitle}>ACCOUNT</Text>
        <TouchableOpacity onPress={isEditing ? handleSave : () => setIsEditing(true)}>
          <Text style={styles.logoText}>{isEditing ? "SAVE" : "EDIT"}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Personal Info Section */}
        <View style={styles.infoSection}>
           <InfoField 
             label="First Name" 
             value={firstName} 
             onChangeText={setFirstName} 
             isEditing={isEditing}
           />
           <InfoField 
             label="Last Name" 
             value={lastName} 
             onChangeText={setLastName} 
             isEditing={isEditing}
           />
           <InfoField 
             label="Email" 
             value={(user as any)?.primaryEmailAddress?.emailAddress || "Not set"} 
             editable={false}
             isEditing={isEditing}
           />
           <InfoField 
             label="Phone" 
             value={phone} 
             onChangeText={setPhone}
             editable={true}
             isEditing={isEditing}
           />
           
           <View style={{ flexDirection: "row", gap: 20 }}>
             <View style={{ flex: 1 }}>
                <InfoField 
                  label="Birthday Month" 
                  value={birthMonth} 
                  onChangeText={setBirthMonth}
                  isEditing={isEditing}
                />
             </View>
             <View style={{ flex: 1 }}>
                <InfoField 
                  label="Birthday Day" 
                  value={birthDay} 
                  onChangeText={setBirthDay}
                  isEditing={isEditing}
                />
             </View>
           </View>

           {isEditing && (
             <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel}>
               <Text style={styles.cancelBtnText}>CANCEL</Text>
             </TouchableOpacity>
           )}
        </View>

         {/* Communication Preferences */}
         <View style={styles.preferencesSection}>
            <Text style={styles.sectionHeader}>COMMUNICATION PREFERENCES</Text>
            
            <TouchableOpacity 
              style={styles.preferenceRow} 
              onPress={async () => {
                const newValue = !smsConsent;
                setSmsConsent(newValue);
                if (user) {
                  await syncProfile({ smsConsent: newValue });
                }
              }}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.preferenceTitle}>Game Day SMS Alerts</Text>
                <Text style={styles.preferenceSubtitle}>Receive texts for scores and specials.</Text>
              </View>
              <Ionicons 
                name={smsConsent ? "checkbox" : "square-outline"} 
                size={24} 
                color={smsConsent ? "#E31837" : "#444"} 
              />
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.preferenceRow} 
              onPress={async () => {
                const newValue = !marketingOptIn;
                setMarketingOptIn(newValue);
                if (user) {
                  await syncProfile({ marketingOptIn: newValue });
                }
              }}
              activeOpacity={0.7}
            >
              <View style={{ flex: 1 }}>
                <Text style={styles.preferenceTitle}>Membership Roster Updates</Text>
                <Text style={styles.preferenceSubtitle}>Stay updated on point deals and events.</Text>
              </View>
              <Ionicons 
                name={marketingOptIn ? "checkbox" : "square-outline"} 
                size={24} 
                color={marketingOptIn ? "#E31837" : "#444"} 
              />
            </TouchableOpacity>
         </View>

        {/* Action Buttons */}
        <View style={styles.actionsSection}>
           <ActionButton title="Registered Credit/Debit Cards" onPress={() => navigation.navigate("SavedCardsScreen")} />
           <ActionButton title="Notification & Email Settings" onPress={() => navigation.navigate("NotificationSettingsScreen")} />
           <ActionButton title="Request Account Removal" onPress={handleAccountRemoval} />
           
           
           {/* Security Note */}
           <View style={styles.securityNote}>
              <Ionicons name="lock-closed" size={16} color="#666" style={{ marginRight: 8 }} />
              <Text style={styles.securityText}>
                Your Box powered by THEOB uses industry-standard encryption to protect the confidentiality of your personal information. Learn more about our:{"\n"}
                <Text style={styles.privacyLink} onPress={() => navigation.navigate("PrivacyPolicyScreen")}>Privacy Policy</Text>
              </Text>
           </View>

           <ActionButton title="Log Out of App" onPress={handleSignOut} isDestructive={true} />
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
  centered: {
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 15,
    color: "#666",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
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
    color: "#E31837",
    fontFamily: "MBold",
    fontSize: RFValue(12),
    letterSpacing: 2,
  },
  content: {
    padding: 25,
  },
  infoSection: {
    marginBottom: 20,
  },
  infoField: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
    paddingBottom: 10,
  },
  fieldLabel: {
    fontSize: RFValue(10),
    fontFamily: "MBold",
    color: "#666",
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  fieldValue: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#FFF",
    marginBottom: 5,
  },
  fieldInput: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#FFA500",
    marginBottom: 5,
    padding: 0,
  },
  changeText: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#E31837",
    marginTop: 2,
  },
  cancelBtn: {
    marginTop: 10,
    alignItems: "center",
  },
  cancelBtnText: {
    fontSize: RFValue(11),
    fontFamily: "MBold",
    color: "#666",
    letterSpacing: 1,
  },
  preferencesSection: {
    marginBottom: 35,
  },
  sectionHeader: {
    fontSize: RFValue(10),
    fontFamily: "MBold",
    color: "#666",
    letterSpacing: 2,
    marginBottom: 20,
  },
  preferenceRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161618",
    padding: 15,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#222",
  },
  preferenceTitle: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#FFF",
  },
  preferenceSubtitle: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#888",
    marginTop: 2,
  },
  actionsSection: {
    marginTop: 0,
    gap: 15,
  },
  actionBtn: {
    width: "100%",
    height: 55,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E31837",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  actionBtnText: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#E31837",
    letterSpacing: 0.5,
  },
  destructiveBtn: {
    marginTop: 20,
    borderColor: "#E31837",
  },
  destructiveBtnText: {
    color: "#E31837",
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "flex-start",
    paddingVertical: 10,
    marginVertical: 10,
  },
  securityText: {
    flex: 1,
    fontSize: RFValue(10),
    color: "#666",
    fontFamily: "MRegular",
    lineHeight: 16,
  },
  privacyLink: {
    color: "#E31837",
    textDecorationLine: "underline",
  }
});

export default AccountScreen;
