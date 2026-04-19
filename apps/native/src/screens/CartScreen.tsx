import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Image,
  SafeAreaView
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useCart } from "../context/CartContext";
import { useMutation } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";

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
    default: return null;
  }
};

const CartScreen = ({ navigation }) => {
  const { items, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart();

  const renderItem = ({ item }) => {
    const itemUniqueId = item.id + (item.instructions || "");

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
    try {
      const subtotal = totalPrice;
      const tax = subtotal * 0.0825; // Example tax
      const total = subtotal + tax;

      await placeOrder({
        items: items,
        subtotal: subtotal,
        tax: tax,
        total: total,
      });

      alert(`Order Placed Successfully! You earned ${Math.floor(subtotal)} Box Score points!`);
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
            keyExtractor={(item) => item.id + (item.instructions || "")}
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
                onPress={handleCheckout}
            >
              <Text style={styles.checkoutText}>PROCEED TO CHECKOUT</Text>
              <Ionicons name="arrow-forward" size={20} color="#000" style={{ marginLeft: 10 }} />
            </TouchableOpacity>
          </View>
        </>
      )}
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
});

export default CartScreen;
