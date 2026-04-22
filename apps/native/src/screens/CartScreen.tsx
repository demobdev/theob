import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView,
  Modal,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useCart, getUniqueKey } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import { useState } from "react";
import { useAuth } from "@clerk/clerk-expo";
import PreferencesModal from "../components/PreferencesModal";
import { ensureAuth } from "../utils/authGuard";

const getImageSource = (imgStr) => {
  switch (imgStr) {
    case "boneless_wings": return require("../../assets/images/menu/boneless_wings.png");
    case "cheese_pizza": return require("../../assets/images/menu/cheese_pizza.png");
    case "queso_chorizo": return require("../../assets/images/menu/queso_chorizo.png");
    case "spicy_bang_bang": return require("../../assets/images/menu/spicy_bang_bang.png");
    case "crispy_calamari": return require("../../assets/images/menu/crispy_calamari.png");
    case "chopped_salad": return require("../../assets/images/menu/chopped_salad.png");
    case "goat_cheese_salad": return require("../../assets/images/menu/goat_cheese_salad.png");
    case "chicago_dog": return require("../../assets/images/menu/chicago_dog.png");
    case "crabcake_sandwich": return require("../../assets/images/menu/crabcake_sandwich.png");
    case "cauliflower_wings": return require("../../assets/images/menu/cauliflower_wings.png");
    case "crab_dip": return require("../../assets/images/menu/crab_dip.png");
    case "fried_shrimp": return require("../../assets/images/menu/fried_shrimp.png");
    case "bar_chicken": return require("../../assets/images/menu/bar_chicken.png");
    case "philly": return require("../../assets/images/menu/philly.png");
    case "rib_eye": return require("../../assets/images/menu/rib_eye.png");
    case "coho_salmon": return require("../../assets/images/menu/coho_salmon.png");
    case "picanha_steak": return require("../../assets/images/menu/picanha_steak.png");
    case "ny_strip": return require("../../assets/images/menu/ny_strip.png");
    case "short_rib_hash": return require("../../assets/images/menu/short_rib_hash.png");
    case "neapolitan_pizza": return require("../../assets/images/menu/neapolitan_pizza.png");
    case "caesar_salad": return require("../../assets/images/menu/caesar_salad.png");
    case "jumbo_wings": return require("../../assets/images/menu/jumbo_wings.png");
    case "meat_lover_pizza": return require("../../assets/images/menu/meat_lover_pizza.png");
    case "short_rib_nachos": return require("../../assets/images/menu/short_rib_nachos.png");
    case "steak_and_eggs": return require("../../assets/images/menu/steak_and_eggs.png");
    case "chicken_waffles": return require("../../assets/images/menu/chicken_waffles.png");

    // DRINKS
    case "beer": return require("../../assets/images/menu/cheese_pizza.png"); // Placeholder
    case "soda": return require("../../assets/images/menu/crab_dip.png"); // Placeholder
    case "cocktail": return require("../../assets/images/menu/philly.png"); // Placeholder
    
    case "supreme_pizza": return require("../../assets/images/menu/supreme_pizza.png");
    case "ham_pineapple": return require("../../assets/images/menu/ham_pineapple.png");
    case "chicken_alfredo_pizza": return require("../../assets/images/menu/chicken_alfredo_pizza.png");
    case "egg_breakfast": return require("../../assets/images/menu/egg_breakfast.png");
    case "pancakes": return require("../../assets/images/menu/pancakes.png");
    case "breakfast_skillet": return require("../../assets/images/menu/breakfast_skillet.png");
    
    default: return null;
  }
};

const CartScreen = ({ navigation }) => {
  const { isSignedIn } = useAuth();
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();
  const { 
    fulfillmentMethod, 
    phoneNumber, 
    scheduledTime, 
    vehicleInfo, 
    deliveryAddress 
  } = useOrder();
  
  const [showPreferences, setShowPreferences] = useState(false);

  const renderItem = ({ item }: { item: any }) => {
    const itemUniqueId = getUniqueKey(item);

    return (
      <View style={styles.cartItem}>
        <View style={styles.imagePlaceholder}>
          {item.image && getImageSource(item.image) ? (
              <Image source={getImageSource(item.image)} style={styles.itemImage} resizeMode="contain" />
          ) : (
              <Ionicons name="fast-food-outline" size={30} color="#555" />
          )}
        </View>
        <View style={styles.itemInfo}>
          <Text style={styles.itemName}>{item.name}</Text>
          <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>
          {item.instructions ? (
            <Text style={styles.itemInstructions} numberOfLines={2}>
              "{item.instructions}"
            </Text>
          ) : null}
        </View>
        <View style={styles.quantityControls}>
          <TouchableOpacity 
              onPress={() => updateQuantity(itemUniqueId, -1)}
              style={styles.qtyBtn}
          >
            <Ionicons name="remove" size={16} color="#000" />
          </TouchableOpacity>
          <Text style={styles.qtyText}>{item.quantity}</Text>
          <TouchableOpacity 
              onPress={() => updateQuantity(itemUniqueId, 1)}
              style={styles.qtyBtn}
          >
            <Ionicons name="add" size={16} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity 
           onPress={() => removeFromCart(itemUniqueId)}
           style={styles.removeBtn}
        >
          <Ionicons name="trash-outline" size={20} color="#E31837" />
        </TouchableOpacity>
      </View>
    );
  };

  const placeOrder = useMutation(api.orders.placeOrder);

  const handleCheckout = async () => {
    // Hide preferences modal when proceeding
    setShowPreferences(false);

    try {
      const subtotal = totalPrice;
      const tax = subtotal * 0.0825; // Example tax
      const total = subtotal + tax;

      await placeOrder({
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
        destination: fulfillmentMethod === "pickup_instore" ? "In-Store Pickup" : 
                     fulfillmentMethod === "pickup_curbside" ? "Curbside Pickup" : "Delivery",
        location: "1757 Woodruff Rd. STE A, Greenville, SC 29607",
        customerPhone: phoneNumber,
        pickupTime: scheduledTime || "ASAP",
        ...(fulfillmentMethod === "pickup_curbside" && {
          carDetails: vehicleInfo
        }),
        ...(fulfillmentMethod === "delivery_partner" && {
          deliveryAddress: deliveryAddress
        })
      });

      alert(`Order Placed Successfully!`);
      clearCart();
      navigation.navigate("HomeScreen");
    } catch (err) {
      alert("Error placing order: " + err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#d4af37" />
        </TouchableOpacity>
        <TouchableOpacity 
            style={styles.logoContainer}
            onPress={() => navigation.navigate("LandingScreen")}
        >
            <Image source={require("../../assets/images/loading-icon.png")} style={styles.brandIcon} resizeMode="contain" />
            <Text style={styles.headerTitle}>#THEOB</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearCart}>
          <Text style={styles.clearText}>Clear Cart</Text>
        </TouchableOpacity>
      </View>

      {items.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#333" />
          <Text style={styles.emptyTitle}>YOUR TICKET IS EMPTY</Text>
          <Text style={styles.emptySubtitle}>Start building your game-day order!</Text>
          <TouchableOpacity 
            style={styles.browseBtn}
            onPress={() => navigation.navigate("HomeScreen")}
          >
            <Text style={styles.browseBtnText}>BROWSE MENU</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <>
          <FlatList
            data={items}
            renderItem={renderItem}
            keyExtractor={(item) => getUniqueKey(item)}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          />

          <View style={styles.footer}>
            <View style={styles.priceRow}>
              <Text style={styles.totalLabel}>TOTAL AMOUNT</Text>
              <Text style={styles.totalValue}>${totalPrice.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
                style={styles.checkoutBtn}
                onPress={() => ensureAuth(!!isSignedIn, navigation, () => setShowPreferences(true))}
            >
              <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </>
      )}

      <PreferencesModal 
        visible={showPreferences} 
        onClose={() => setShowPreferences(false)} 
      />
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
    paddingTop: 10,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  brandIcon: {
    width: 24,
    height: 24,
    marginRight: 8,
  },
  headerTitle: {
    color: "#fff",
    fontSize: RFValue(16),
    fontFamily: "MBold",
    letterSpacing: 2,
  },
  clearText: {
    color: "#888",
    fontSize: RFValue(12),
    fontFamily: "MBold",
    textDecorationLine: "underline",
  },
  listContent: {
    padding: 20,
    paddingBottom: 100,
  },
  cartItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#161616",
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
  },
  imagePlaceholder: {
    width: 60,
    height: 60,
    backgroundColor: "#1A1A1A",
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  itemImage: {
    width: 50,
    height: 50,
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#fff",
    textTransform: "uppercase",
  },
  itemPrice: {
    fontSize: RFValue(12),
    color: "#FFA500",
    fontFamily: "MBold",
    marginTop: 4,
  },
  itemInstructions: {
    fontSize: RFValue(10),
    color: "#888",
    fontFamily: "MRegular",
    fontStyle: "italic",
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFA500",
    borderRadius: 15,
    paddingHorizontal: 4,
    paddingVertical: 2,
    marginRight: 15,
  },
  qtyBtn: {
    padding: 4,
  },
  qtyText: {
    fontSize: 14,
    fontFamily: "MBold",
    color: "#000",
    marginHorizontal: 8,
  },
  removeBtn: {
    padding: 5,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
  },
  emptyTitle: {
    fontSize: RFValue(18),
    fontFamily: "MBold",
    color: "#fff",
    marginTop: 20,
    letterSpacing: 1,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
    textAlign: "center",
    marginTop: 10,
  },
  browseBtn: {
    marginTop: 30,
    backgroundColor: "#FFA500",
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  browseBtnText: {
    color: "#000",
    fontSize: RFValue(14),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  footer: {
    padding: 20,
    paddingBottom: 35,
    backgroundColor: "#161616",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#fff",
  },
  totalValue: {
    fontSize: RFValue(18),
    fontFamily: "MBold",
    color: "#FFA500",
  },
  checkoutBtn: {
    backgroundColor: "#FFA500",
    height: 55,
    borderRadius: 8,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  checkoutText: {
    color: "#000",
    fontSize: RFValue(14),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  
  /* PREFERENCES MODAL STYLES */
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#1A1A1A",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    borderWidth: 1,
    borderColor: "#333",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 25,
  },
  modalTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "MBold",
  },
  prefSection: {
    marginBottom: 20,
  },
  prefLabel: {
    color: "#888",
    fontSize: 10,
    fontFamily: "MBold",
    letterSpacing: 1.5,
    marginBottom: 10,
    textTransform: "uppercase"
  },
  locationCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  locationTitle: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
    marginBottom: 4,
  },
  locationAddress: {
    color: "#888",
    fontSize: 12,
    fontFamily: "MRegular",
  },
  methodRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  methodBtn: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  methodBtnActive: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  methodText: {
    color: "#888",
    fontSize: 10,
    fontFamily: "MBold",
    textAlign: "center",
  },
  methodTextActive: {
    color: "#000",
  },
  timeModeRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    marginBottom: 20,
  },
  timeModeBtn: {
    flex: 1,
    backgroundColor: "#222",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#333",
    paddingVertical: 15,
    alignItems: "center",
  },
  timeModeBtnActive: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  timeModeText: {
    color: "#888",
    fontSize: 12,
    fontFamily: "MBold",
  },
  timeModeTextActive: {
    color: "#000",
  },
  inputBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderWidth: 1,
    borderColor: "#333",
    borderRadius: 8,
    paddingHorizontal: 15,
    paddingVertical: 12,
  },
  inputText: {
    flex: 1,
    color: "#fff",
    fontFamily: "MRegular",
    fontSize: 14,
  },
  updateOrderBtn: {
    backgroundColor: "#FFA500",
    height: 55,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
  },
  updateOrderBtnText: {
    color: "#000",
    fontSize: 16,
    fontFamily: "MBold",
  },
  
  /* SUB-MODAL FOR CURBSIDE & DELIVERY */
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
  }
});

export default CartScreen;
