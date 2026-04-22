import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Image,
  Dimensions,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { RFValue } from "react-native-responsive-fontsize";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

const getRewardImageLarge = (key) => {
    return require("../../assets/images/placeholder_reward_large.png");
};

const RedeemOnlineScreen = ({ route, navigation }) => {
  const { rewardId } = route.params;
  const { applyReward } = useCart();

  const reward = (useQuery(api.loyalty.getRewardDefinitions) as any[])?.find(r => r._id === rewardId);

  if (!reward) return null;

  const handleApply = () => {
    // In a real app, logic would verify eligibility here
    applyReward(reward);
    Alert.alert(
        "Successfully Applied!",
        `${reward.title} has been added to your current order. You'll see the discount at checkout.`,
        [{ text: "Go to Menu", onPress: () => navigation.navigate("HomeScreen") }]
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* HERO SECTION */}
      <View style={styles.hero}>
        <Image 
            source={getRewardImageLarge()} 
            style={styles.heroImage} 
        />
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Ionicons name="chevron-back" size={28} color="#fff" />
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <Text style={styles.headerTitle}>How to redeem online</Text>
        <Text style={styles.rewardTitle}>{reward.title}</Text>
        
        <View style={styles.instructions}>
            <View style={styles.step}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>1</Text></View>
                <Text style={styles.stepText}>Click the "Apply to Order" button below.</Text>
            </View>
            <View style={styles.step}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>2</Text></View>
                <Text style={styles.stepText}>Add eligible items to your cart from the menu.</Text>
            </View>
            <View style={styles.step}>
                <View style={styles.stepNumber}><Text style={styles.stepNumberText}>3</Text></View>
                <Text style={styles.stepText}>Your discount will be automatically applied at checkout.</Text>
            </View>
        </View>

        <TouchableOpacity 
            style={styles.applyBtn}
            onPress={handleApply}
        >
            <Text style={styles.applyBtnText}>APPLY TO ORDER</Text>
            <Ionicons name="cart-outline" size={20} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity 
            style={styles.termsLink}
            onPress={() => {}}
        >
            <Text style={styles.termsText}>View terms and conditions</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  hero: {
    height: 250,
    backgroundColor: "#111",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    opacity: 0.6,
  },
  backBtn: {
    position: "absolute",
    top: 50,
    left: 20,
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 1,
    backgroundColor: "#000",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 30,
  },
  headerTitle: {
    color: "#888",
    fontSize: 14,
    fontFamily: "MBold",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  rewardTitle: {
    color: "#fff",
    fontSize: RFValue(24),
    fontFamily: "MBold",
    marginTop: 10,
    marginBottom: 30,
  },
  instructions: {
    gap: 25,
    marginBottom: 40,
  },
  step: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  stepNumber: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#222",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#444",
  },
  stepNumberText: {
    color: "#FFA500",
    fontSize: 14,
    fontFamily: "MBold",
  },
  stepText: {
    flex: 1,
    color: "#ccc",
    fontSize: 16,
    fontFamily: "MMedium",
    lineHeight: 22,
  },
  applyBtn: {
    backgroundColor: "#FFA500",
    paddingVertical: 18,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  applyBtnText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "MBold",
  },
  termsLink: {
    marginTop: 30,
    alignItems: "center",
  },
  termsText: {
    color: "#666",
    fontSize: 14,
    fontFamily: "MMedium",
    textDecorationLine: "underline",
  },
});

export default RedeemOnlineScreen;
