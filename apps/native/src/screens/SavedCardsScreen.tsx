import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  StatusBar,
  ActivityIndicator,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery, useMutation } from "convex/react";
import { useAuth } from "@clerk/clerk-expo";
import { api } from "../../../../convex/_generated/api";
import { ensureAuth } from "../utils/authGuard";

const SavedCardsScreen = ({ navigation }) => {
  const { isSignedIn } = useAuth();
  const savedCards = useQuery(api.payments.getPaymentMethods) as any[];
  const removeMutation = useMutation(api.payments.removePaymentMethod);
  const setDefaultMutation = useMutation(api.payments.setDefaultPaymentMethod);

  const getCardIcon = (brand) => {
    const b = brand?.toLowerCase();
    if (b === "visa") return "card";
    if (b === "mastercard") return "card-outline";
    return "card";
  };

  const handleRemove = (cardId) => {
    Alert.alert(
      "Remove Card",
      "Are you sure you want to remove this payment method?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Remove", 
          style: "destructive",
          onPress: async () => {
            try {
              await removeMutation({ cardId });
            } catch (error) {
              Alert.alert("Error", "Failed to remove card");
            }
          }
        }
      ]
    );
  };

  const handleSetDefault = async (cardId) => {
    try {
      await setDefaultMutation({ cardId });
    } catch (error) {
      Alert.alert("Error", "Failed to update default card");
    }
  };

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
        <Text style={styles.headerTitle}>SAVED CARDS</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionTitle}>YOUR PAYMENT METHODS</Text>
        
        {savedCards === undefined ? (
          <ActivityIndicator color="#FFA500" style={{ marginTop: 50 }} />
        ) : savedCards.length === 0 ? (
          <View style={styles.emptyState}>
             <Ionicons name="card-outline" size={64} color="#333" />
             <Text style={styles.emptyText}>No saved cards yet.</Text>
          </View>
        ) : (
          savedCards.map((card) => (
            <TouchableOpacity 
              key={card._id} 
              style={styles.cardItem}
              onPress={() => handleSetDefault(card._id)}
            >
              <View style={styles.cardIconBox}>
                  <Ionicons name={getCardIcon(card.brand) as any} size={24} color="#FFA500" />
              </View>
              <View style={styles.cardInfo}>
                  <Text style={styles.cardName}>{card.brand} •••• {card.last4}</Text>
                  {card.isDefault && <Text style={styles.defaultLabel}>DEFAULT</Text>}
              </View>
              <TouchableOpacity onPress={() => handleRemove(card._id)}>
                  <Text style={styles.removeText}>Remove</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}

        <TouchableOpacity 
          style={styles.addBtn} 
          onPress={() => ensureAuth(!!isSignedIn, navigation, () => navigation.navigate("AddCardScreen"))}
        >
          <Ionicons name="add-circle-outline" size={24} color="#FFF" style={{ marginRight: 10 }} />
          <Text style={styles.addBtnText}>ADD NEW CARD</Text>
        </TouchableOpacity>

        <View style={styles.securityNote}>
            <Ionicons name="shield-checkmark-outline" size={32} color="#4CAF50" />
            <Text style={styles.securityTitle}>Secure Payments</Text>
            <Text style={styles.securitySub}>
                Your card information is tokenized and stored securely. THE OWNER'S BOX never stores your full card number on our servers.
            </Text>
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
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: RFValue(10),
    fontFamily: "MBold",
    color: "#666",
    paddingHorizontal: 25,
    marginTop: 30,
    marginBottom: 20,
    letterSpacing: 1,
  },
  cardItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 18,
    paddingHorizontal: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  cardIconBox: {
    width: 44,
    height: 32,
    borderRadius: 4,
    backgroundColor: "#161616",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#DDD",
  },
  defaultLabel: {
    fontSize: 9,
    fontFamily: "MBold",
    color: "#4CAF50",
    marginTop: 2,
  },
  removeText: {
    fontSize: RFValue(11),
    fontFamily: "MMedium",
    color: "#E31837",
  },
  addBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    margin: 25,
    height: 56,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#333",
    borderStyle: "dashed",
    backgroundColor: "#161616",
  },
  addBtnText: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#FFF",
  },
  emptyState: {
    alignItems: "center",
    marginTop: 40,
    gap: 15,
  },
  emptyText: {
    color: "#444",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
  },
  securityNote: {
    marginTop: 40,
    paddingHorizontal: 40,
    alignItems: "center",
  },
  securityTitle: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#FFF",
    marginTop: 15,
    marginBottom: 8,
  },
  securitySub: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#666",
    textAlign: "center",
    lineHeight: 18,
  }
});

export default SavedCardsScreen;

