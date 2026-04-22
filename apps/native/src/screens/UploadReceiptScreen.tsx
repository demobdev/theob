import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StatusBar,
  Image,
  Alert,
  ActivityIndicator
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RFValue } from "react-native-responsive-fontsize";

const UploadReceiptScreen = ({ navigation }) => {
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState(new Date().toLocaleDateString());
  const [isUploading, setIsUploading] = useState(false);
  const submitReceipt = useMutation(api.loyalty.submitReceipt);

  const handleSubmit = async () => {
    if (!amount) {
        Alert.alert("Error", "Please enter the receipt amount.");
        return;
    }

    setIsUploading(true);
    try {
        await submitReceipt({
            imageUrl: "placeholder_image_url", // In real app, this would be from camera
            amount: parseFloat(amount),
            receiptDate: date,
        });
        
        Alert.alert(
            "Submission Successful",
            "Your receipt has been submitted for review. Points will be awarded once verified.",
            [{ text: "OK", onPress: () => navigation.navigate("RewardsScreen") }]
        );
    } catch (error) {
        Alert.alert("Submission Failed", "Something went wrong. Please try again.");
    } finally {
        setIsUploading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="close" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>EARN POINTS</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.iconCircle}>
            <Ionicons name="camera" size={40} color="#FFA500" />
        </View>
        <Text style={styles.mainTitle}>Upload Receipt</Text>
        <Text style={styles.subtitle}>
            Did you eat at THEOB recently? Upload your receipt to collect missed points.
        </Text>

        {/* CAMERA PREVIEW PLACEHOLDER */}
        <TouchableOpacity 
            style={styles.cameraPlaceholder}
            onPress={() => Alert.alert("Photo Attached", "A mock photo has been attached to your receipt.")}
        >
            <Ionicons name="add-circle" size={40} color="#333" />
            <Text style={styles.cameraLabel}>Tap to take a photo</Text>
        </TouchableOpacity>

        <View style={styles.form}>
            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>TOTAL AMOUNT</Text>
                <View style={styles.inputWrapper}>
                    <Text style={styles.currency}>$</Text>
                    <TextInput 
                        style={styles.input}
                        placeholder="0.00"
                        placeholderTextColor="#444"
                        keyboardType="decimal-pad"
                        value={amount}
                        onChangeText={setAmount}
                    />
                </View>
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>VISIT DATE</Text>
                <View style={styles.inputWrapper}>
                    <Ionicons name="calendar-outline" size={18} color="#FFA500" />
                    <TextInput 
                        style={styles.input}
                        value={date}
                        onChangeText={setDate}
                        placeholderTextColor="#444"
                    />
                </View>
            </View>
        </View>

        <TouchableOpacity 
            style={[styles.submitBtn, isUploading && styles.disabledBtn]}
            onPress={handleSubmit}
            disabled={isUploading}
        >
            {isUploading ? (
                <ActivityIndicator color="#000" />
            ) : (
                <>
                    <Text style={styles.submitBtnText}>SUBMIT RECEIPT</Text>
                    <Ionicons name="send" size={18} color="#000" />
                </>
            )}
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
            Submissions are reviewed within 24-48 hours. Please keep your physical receipt until points are awarded.
        </Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  header: {
    backgroundColor: "#111",
    paddingTop: 50,
    paddingBottom: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 40,
    height: 40,
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontSize: 14,
    fontFamily: "MBold",
    letterSpacing: 2,
  },
  content: {
    alignItems: "center",
    padding: 25,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#161616",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#333",
  },
  mainTitle: {
    color: "#fff",
    fontSize: RFValue(24),
    fontFamily: "MBold",
    textAlign: "center",
  },
  subtitle: {
    color: "#888",
    fontSize: 14,
    fontFamily: "MMedium",
    textAlign: "center",
    marginTop: 10,
    lineHeight: 20,
    paddingHorizontal: 20,
  },
  cameraPlaceholder: {
    width: "100%",
    height: 200,
    backgroundColor: "#111",
    borderRadius: 20,
    marginTop: 30,
    borderWidth: 2,
    borderColor: "#222",
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  cameraLabel: {
    color: "#444",
    fontSize: 14,
    fontFamily: "MBold",
  },
  form: {
    width: "100%",
    marginTop: 30,
    gap: 20,
  },
  inputGroup: {
    gap: 8,
  },
  inputLabel: {
    color: "#666",
    fontSize: 10,
    fontFamily: "MBold",
    letterSpacing: 1.5,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#111",
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#222",
    paddingHorizontal: 15,
    height: 55,
    gap: 10,
  },
  currency: {
    color: "#FFA500",
    fontSize: 18,
    fontFamily: "MBold",
  },
  input: {
    flex: 1,
    color: "#fff",
    fontSize: 16,
    fontFamily: "MMedium",
  },
  submitBtn: {
    backgroundColor: "#FFA500",
    width: "100%",
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 40,
    gap: 12,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "MBold",
  },
  disclaimer: {
    color: "#444",
    fontSize: 12,
    fontFamily: "MMedium",
    textAlign: "center",
    marginTop: 20,
    lineHeight: 18,
  },
});

export default UploadReceiptScreen;
