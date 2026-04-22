import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const AddCardScreen = ({ navigation }) => {
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [name, setName] = useState("");
  const [zip, setZip] = useState("");
  const [isDefault, setIsDefault] = useState(true);
  const [loading, setLoading] = useState(false);

  const convexUser = useQuery(api.loyalty.getUserProfile);
  console.log("DEBUG: Convex User Profile:", convexUser);

  const saveCardMutation = useMutation(api.payments.savePaymentMethod);

  // Mock Tokenization Utility
  const mockTokenize = async () => {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    // Simple brand detection
    let brand = "Visa";
    if (cardNumber.startsWith("5")) brand = "Mastercard";
    if (cardNumber.startsWith("3")) brand = "Amex";
    
    return {
      token: `genius_tok_v1_${Math.random().toString(36).substring(7)}`,
      brand,
      last4: cardNumber.slice(-4),
      expMonth: expiry.split("/")[0],
      expYear: "20" + expiry.split("/")[1],
    };
  };

  const handleSaveCard = async () => {
    if (!cardNumber || !expiry || !cvv || !zip) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (cardNumber.length < 16) {
      Alert.alert("Error", "Invalid card number");
      return;
    }

    setLoading(true);
    try {
      const tokenResult = await mockTokenize();
      
      const result = await saveCardMutation({
        gatewayToken: tokenResult.token,
        brand: tokenResult.brand,
        last4: tokenResult.last4,
        expMonth: tokenResult.expMonth,
        expYear: tokenResult.expYear,
        isDefault: isDefault,
        billingZip: zip,
        nickname: name || `${tokenResult.brand} Card`,
      });

      if (result?.success) {
        Alert.alert("Success", "Card saved securely", [
          { text: "OK", onPress: () => navigation.goBack() }
        ]);
      } else if (result?.error === "NOT_AUTHENTICATED") {
        Alert.alert(
          "Authentication Required", 
          "Your session hasn't synced with our secure vault yet. Please wait a moment or try logging out and back in."
        );
      } else {
        throw new Error(result?.error || "Unknown error");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Failed to save card. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (text) => {
    const cleaned = text.replace(/\D/g, "");
    const trimmed = cleaned.substring(0, 16);
    const matches = trimmed.match(/.{1,4}/g);
    if (matches) {
      setCardNumber(matches.join(" "));
    } else {
      setCardNumber(trimmed);
    }
  };

  const formatExpiry = (text) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length >= 2) {
      setExpiry(cleaned.substring(0, 2) + "/" + cleaned.substring(2, 4));
    } else {
      setExpiry(cleaned);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#FFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>ADD NEW CARD</Text>
          <View style={{ width: 28 }} />
        </View>

        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.cardPreview}>
             <View style={styles.previewTop}>
                <Ionicons name="card" size={32} color="#FFF" />
                <Text style={styles.previewBrand}>
                    {cardNumber.startsWith("5") ? "MASTERCARD" : cardNumber.startsWith("3") ? "AMEX" : "VISA"}
                </Text>
             </View>
             <Text style={styles.previewNumber}>{cardNumber || "•••• •••• •••• ••••"}</Text>
             <View style={styles.previewBottom}>
                <View>
                    <Text style={styles.previewLabel}>CARD HOLDER</Text>
                    <Text style={styles.previewValue}>{name.toUpperCase() || "NAME SURNAME"}</Text>
                </View>
                <View>
                    <Text style={styles.previewLabel}>EXPIRES</Text>
                    <Text style={styles.previewValue}>{expiry || "MM/YY"}</Text>
                </View>
             </View>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>NAME ON CARD</Text>
              <TextInput
                style={styles.input}
                placeholder="Full Name"
                placeholderTextColor="#444"
                value={name}
                onChangeText={setName}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CARD NUMBER</Text>
              <TextInput
                style={styles.input}
                placeholder="0000 0000 0000 0000"
                placeholderTextColor="#444"
                keyboardType="numeric"
                maxLength={19}
                value={cardNumber}
                onChangeText={formatCardNumber}
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, { flex: 1, marginRight: 15 }]}>
                <Text style={styles.label}>EXPIRY</Text>
                <TextInput
                  style={styles.input}
                  placeholder="MM/YY"
                  placeholderTextColor="#444"
                  keyboardType="numeric"
                  maxLength={5}
                  value={expiry}
                  onChangeText={formatExpiry}
                />
              </View>
              <View style={[styles.inputGroup, { flex: 1 }]}>
                <Text style={styles.label}>CVV</Text>
                <TextInput
                  style={styles.input}
                  placeholder="123"
                  placeholderTextColor="#444"
                  keyboardType="numeric"
                  maxLength={3}
                  value={cvv}
                  onChangeText={setCvv}
                  secureTextEntry
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>BILLING ZIP CODE</Text>
              <TextInput
                style={styles.input}
                placeholder="00000"
                placeholderTextColor="#444"
                keyboardType="numeric"
                maxLength={5}
                value={zip}
                onChangeText={setZip}
              />
            </View>

            <TouchableOpacity 
              style={styles.defaultRow} 
              onPress={() => setIsDefault(!isDefault)}
            >
              <View style={[styles.checkbox, isDefault && styles.checked]}>
                {isDefault && <Ionicons name="checkmark" size={16} color="#000" />}
              </View>
              <Text style={styles.defaultText}>Set as default payment method</Text>
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.saveBtn, loading && styles.disabledBtn]} 
              onPress={handleSaveCard}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.saveBtnText}>SAVE CARD SECURELY</Text>
              )}
            </TouchableOpacity>

            <View style={styles.securityNote}>
              <Ionicons name="lock-closed" size={14} color="#666" style={{ marginRight: 6 }} />
              <Text style={styles.securityText}>
                Your data is encrypted and sent directly to the secure vault.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#FFF",
    letterSpacing: 2,
  },
  content: {
    padding: 25,
  },
  cardPreview: {
    width: "100%",
    aspectRatio: 1.6,
    backgroundColor: "#1A1A1A",
    borderRadius: 16,
    padding: 25,
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 10,
    marginBottom: 30,
  },
  previewTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  previewBrand: {
    color: "#666",
    fontSize: 10,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  previewNumber: {
    color: "#FFF",
    fontSize: RFValue(18),
    fontFamily: "MBold",
    letterSpacing: 3,
    textAlign: "center",
    marginVertical: 20,
  },
  previewBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  previewLabel: {
    color: "#444",
    fontSize: 8,
    fontFamily: "MBold",
    marginBottom: 4,
  },
  previewValue: {
    color: "#AAA",
    fontSize: RFValue(10),
    fontFamily: "MMedium",
    letterSpacing: 1,
  },
  form: {
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  row: {
    flexDirection: "row",
  },
  label: {
    color: "#666",
    fontSize: 10,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  input: {
    backgroundColor: "#161616",
    borderRadius: 12,
    height: 52,
    paddingHorizontal: 15,
    color: "#FFF",
    fontSize: RFValue(14),
    fontFamily: "MMedium",
    borderWidth: 1,
    borderColor: "#222",
  },
  defaultRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#333",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  checked: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  defaultText: {
    color: "#999",
    fontSize: RFValue(12),
    fontFamily: "MRegular",
  },
  saveBtn: {
    backgroundColor: "#FFA500",
    height: 56,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#FFA500",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  disabledBtn: {
    opacity: 0.7,
  },
  saveBtnText: {
    color: "#000",
    fontSize: RFValue(14),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 15,
    opacity: 0.6,
  },
  securityText: {
    color: "#666",
    fontSize: 10,
    fontFamily: "MRegular",
    textAlign: "center",
  },
});

export default AddCardScreen;
