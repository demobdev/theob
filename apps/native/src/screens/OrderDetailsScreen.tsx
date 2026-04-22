import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Image,
  Linking,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const OrderDetailsScreen = ({ route, navigation }) => {
  const { order } = route.params;

  if (!order) return null;

  const date = new Date(order.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const openMap = () => {
    const address = encodeURIComponent("1757 Woodruff Rd. STE A, Greenville, SC 29607");
    const url = Platform.select({
      ios: `maps:0,0?q=${address}`,
      android: `geo:0,0?q=${address}`,
    });
    if (url) Linking.openURL(url);
  };

  const callStore = () => {
    Linking.openURL("tel:8642888988");
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={28} color="#FFF" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Order Details</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* HERO IMAGE */}
        <Image 
          source={require("../../assets/images/menu/cheese_pizza.png")} 
          style={styles.heroImage} 
          resizeMode="cover" 
        />

        {/* STATUS SECTION */}
        <View style={styles.statusContainer}>
          <View style={styles.statusBadge}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statusText}>{order.status.charAt(0).toUpperCase() + order.status.slice(1)}</Text>
          </View>
          <Text style={styles.orderNumber}>Order number: {order._id.substring(0, 16).toUpperCase()}</Text>
          <Text style={styles.orderDate}>{date}</Text>
        </View>

        <View style={styles.divider} />

        {/* ORDER TYPE */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>ORDER TYPE</Text>
          <Text style={styles.sectionValue}>{order.destination || "In-Store Pickup"}</Text>
          <Text style={styles.sectionSubValue}>{order.pickupTime || "ASAP"}</Text>
        </View>

        <View style={styles.divider} />

        {/* VEHICLE DETAILS (for Curbside) */}
        {order.destination === "Curbside" && order.carDetails && (
          <>
            <View style={styles.section}>
              <Text style={styles.sectionLabel}>VEHICLE INFORMATION</Text>
              <Text style={styles.sectionValue}>
                {order.carDetails.color} {order.carDetails.make} {order.carDetails.model}
              </Text>
            </View>
            <View style={styles.divider} />
          </>
        )}

        {/* STORE LOCATION */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STORE LOCATION</Text>
          <View style={styles.locationContainer}>
            <View style={styles.mapIcon}>
              <Ionicons name="location" size={20} color="#E31837" />
            </View>
            <View style={styles.locationDetails}>
              <Text style={styles.locationName}>Greenville</Text>
              <Text style={styles.locationAddress}>1757 Woodruff Rd. Suite A</Text>
              <Text style={styles.locationAddress}>Greenville, South Carolina 29607</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.directionsBtn} onPress={openMap}>
            <Text style={styles.directionsBtnText}>GET DIRECTIONS</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.divider} />

        {/* STORE CONTACT */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>STORE CONTACT INFORMATION</Text>
          <View style={styles.contactRow}>
            <Text style={styles.phoneText}>(864) 288-8988</Text>
            <TouchableOpacity onPress={callStore} style={styles.phoneIcon}>
              <Ionicons name="call" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.divider} />

        {/* ITEMS BREAKDOWN */}
        <View style={styles.section}>
          {order.items.map((item, idx) => (
            <View key={idx} style={styles.itemRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>
                  {item.name.toUpperCase()} ({item.quantity})
                </Text>
                {item.instructions && (
                  <Text style={styles.itemSubText}>{item.instructions}</Text>
                )}
              </View>
              <Text style={styles.itemPrice}>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.divider} />

        {/* PRICING */}
        <View style={styles.pricingSection}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Item Total:</Text>
            <Text style={styles.priceValue}>${order.subtotal.toFixed(2)}</Text>
          </View>
          {/* Mocking a free pizza discount if observed in images */}
          {order.discount > 0 && (
            <View style={styles.priceRow}>
              <Text style={[styles.priceLabel, { color: "#E31837" }]}>Loyalty Reward:</Text>
              <Text style={[styles.priceValue, { color: "#E31837" }]}>-${order.discount.toFixed(2)}</Text>
            </View>
          )}
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Sub-Total:</Text>
            <Text style={styles.priceValue}>${(order.subtotal - (order.discount || 0)).toFixed(2)}</Text>
          </View>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>Tax:</Text>
            <Text style={styles.priceValue}>${order.tax.toFixed(2)}</Text>
          </View>
          <View style={[styles.priceRow, { marginTop: 10 }]}>
            <Text style={styles.totalLabel}>Order Total:</Text>
            <Text style={styles.totalValue}>${order.total.toFixed(2)}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        {/* PAYMENT */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>PAYMENT</Text>
          <View style={styles.paymentRow}>
            <Ionicons name="card-outline" size={20} color="#888" />
            <Text style={styles.paymentText}>**** **** **** 8757</Text>
          </View>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* FOOTER BUTTON */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.orderAgainBtn} onPress={() => navigation.navigate("HomeScreen")}>
          <Text style={styles.orderAgainText}>Order again</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFF", // Matching the clean image background
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    height: 60,
    backgroundColor: "#FFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    padding: 5,
  },
  headerTitle: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#000",
  },
  scrollContent: {
    paddingBottom: 20,
  },
  heroImage: {
    width: "100%",
    height: 200,
  },
  statusContainer: {
    alignItems: "center",
    paddingVertical: 25,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  statusText: {
    fontSize: RFValue(18),
    fontFamily: "MRegular",
    color: "#333",
    marginLeft: 8,
  },
  orderNumber: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#AAA",
    marginBottom: 4,
  },
  orderDate: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#AAA",
  },
  divider: {
    height: 10,
    backgroundColor: "#F8F8F8",
    width: "100%",
  },
  section: {
    padding: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontFamily: "MRegular",
    color: "#AAA",
    letterSpacing: 1,
    marginBottom: 12,
  },
  sectionValue: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#333",
    marginBottom: 4,
  },
  sectionSubValue: {
    fontSize: RFValue(14),
    fontFamily: "MRegular",
    color: "#888",
  },
  locationContainer: {
    flexDirection: "row",
    marginBottom: 20,
  },
  mapIcon: {
    width: 40,
    height: 40,
    backgroundColor: "#FEECEE",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  locationDetails: {
    flex: 1,
  },
  locationName: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#333",
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
  },
  directionsBtn: {
    backgroundColor: "#E31837",
    paddingVertical: 12,
    borderRadius: 4,
    alignItems: "center",
  },
  directionsBtnText: {
    color: "#FFF",
    fontSize: 12,
    fontFamily: "MBold",
  },
  contactRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  phoneText: {
    fontSize: RFValue(16),
    fontFamily: "MRegular",
    color: "#333",
  },
  phoneIcon: {
    width: 32,
    height: 32,
    backgroundColor: "#E31837",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  itemName: {
    fontSize: RFValue(13),
    fontFamily: "MBold",
    color: "#333",
  },
  itemSubText: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#888",
    marginTop: 4,
  },
  itemPrice: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#333",
  },
  pricingSection: {
    padding: 20,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  priceLabel: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#333",
  },
  priceValue: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#333",
  },
  totalLabel: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#000",
  },
  totalValue: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#000",
  },
  paymentRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  paymentText: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#AAA",
    marginLeft: 10,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: "#FFF",
    paddingHorizontal: 20,
    paddingTop: 15,
    paddingBottom: 35,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  orderAgainBtn: {
    backgroundColor: "#E31837",
    height: 55,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  orderAgainText: {
    color: "#FFF",
    fontSize: RFValue(14),
    fontFamily: "MRegular",
  },
});

export default OrderDetailsScreen;
