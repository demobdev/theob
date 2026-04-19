import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useOrder } from "../context/OrderContext";
import { useCart } from "../context/CartContext";

interface OrderHeaderProps {
  onOpenPreferences: () => void;
  navigation: any;
}

const OrderHeader: React.FC<OrderHeaderProps> = ({ onOpenPreferences, navigation }) => {
  const { fulfillmentMethod, locationName } = useOrder();
  const { totalItems } = useCart();

  const getFulfillmentLabel = () => {
    switch (fulfillmentMethod) {
      case "pickup_instore":
        return "In-Store Pickup";
      case "pickup_curbside":
        return "Curbside Pickup";
      case "delivery_partner":
        return "Delivery (Partner)";
      default:
        return "Pickup";
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.brandingSection}>
            <Image 
                source={require("../../assets/images/loading-icon.png")} 
                style={styles.headerLogo} 
                resizeMode="contain"
            />
            <View style={styles.selectorColumn}>
              {/* FULFILLMENT SELECTOR */}
              <TouchableOpacity style={styles.selector} onPress={onOpenPreferences}>
                <Text style={styles.selectorTitle}>{getFulfillmentLabel()}</Text>
                <Ionicons name="chevron-down" size={12} color="#FFA500" style={{ marginLeft: 4 }} />
              </TouchableOpacity>

              {/* LOCATION SELECTOR */}
              <TouchableOpacity style={styles.selector} onPress={onOpenPreferences}>
                <Ionicons name="location" size={10} color="#666" style={{ marginRight: 4 }} />
                <Text style={styles.locationTitle}>{locationName || "Detecting..."}</Text>
              </TouchableOpacity>
            </View>
        </View>

        {/* CART BUTTON */}
        <TouchableOpacity 
          style={styles.cartBtn} 
          onPress={() => navigation.navigate("CartScreen")}
        >
          <Ionicons name="bag-handle-outline" size={24} color="#fff" />
          {totalItems > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{totalItems}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#0F0F11",
    paddingTop: 10,
    paddingBottom: 15,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  brandingSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerLogo: {
    width: 35,
    height: 35,
  },
  selectorColumn: {
    justifyContent: "center",
  },
  selector: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 2,
  },
  selectorTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 0.5,
  },
  locationTitle: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: RFValue(10),
  },
  cartBtn: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: "#1A1A1A",
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FFA500",
    borderRadius: 10,
    width: 18,
    height: 18,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#0F0F11",
  },
  badgeText: {
    color: "#000",
    fontSize: 8,
    fontFamily: "MBold",
  },
});

export default OrderHeader;
