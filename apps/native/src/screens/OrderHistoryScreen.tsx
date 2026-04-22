import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  FlatList,
  StatusBar,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

const OrderHistoryScreen = ({ navigation }) => {
  const [activeTab, setActiveTab] = React.useState("Previous"); // "Previous" | "Upcoming"
  const orders = useQuery(api.orders.getOrderHistory) || [];

  const previousOrders = orders.filter(o => o.status === "completed" || o.status === "cancelled");
  const upcomingOrders = orders.filter(o => o.status === "pending" || o.status === "in-progress" || o.status === "scheduled");

  const displayOrders = activeTab === "Previous" ? previousOrders : upcomingOrders;

  const renderOrderItem = ({ item }) => {
    const date = new Date(item.createdAt).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });

    return (
      <TouchableOpacity 
        style={styles.orderCard} 
        onPress={() => navigation.navigate("OrderDetailsScreen", { order: item })}
      >
        <View style={styles.orderHeader}>
          <Text style={styles.orderDate}>{date}</Text>
          <Text style={styles.orderStatus}>{item.status.toUpperCase()}</Text>
        </View>
        
        <View style={styles.orderBody}>
          <Text style={styles.orderId}>Order #{item._id.substring(0, 8).toUpperCase()}</Text>
          <Text style={styles.orderTotal}>${item.total.toFixed(2)}</Text>
        </View>

        <Text style={styles.itemSummary}>
          {item.items.length} {item.items.length === 1 ? "item" : "items"} • {item.destination}
        </Text>
        
        <View style={styles.pointsEarned}>
          <Ionicons name="flame" size={14} color="#FFA500" />
          <Text style={styles.pointsText}>+{item.pointsAwarded || 0} Points earned</Text>
        </View>
      </TouchableOpacity>
    );
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
        <Text style={styles.headerTitle}>ORDER HISTORY</Text>
        <TouchableOpacity onPress={() => navigation.navigate("LandingScreen")}>
          <Text style={styles.logoText}>#THEOB</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabContainer}>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "Previous" && styles.activeTab]}
          onPress={() => setActiveTab("Previous")}
        >
          <Text style={[styles.tabText, activeTab === "Previous" && styles.activeTabText]}>Previous</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.tab, activeTab === "Upcoming" && styles.activeTab]}
          onPress={() => setActiveTab("Upcoming")}
        >
          <Text style={[styles.tabText, activeTab === "Upcoming" && styles.activeTabText]}>Upcoming</Text>
        </TouchableOpacity>
      </View>

      {displayOrders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="receipt-outline" size={80} color="#EEE" />
          <Text style={styles.emptyTitle}>
            {activeTab === "Previous" ? "NO ORDERS YET" : "NO UPCOMING ORDERS"}
          </Text>
          <Text style={styles.emptySubtitle}>
            {activeTab === "Previous" 
              ? "Your past orders and tickets will appear here." 
              : "You have no upcoming orders"}
          </Text>
          {activeTab === "Previous" && (
            <TouchableOpacity 
              style={styles.orderBtn}
              onPress={() => navigation.navigate("HomeScreen")}
            >
              <Text style={styles.orderBtnText}>START AN ORDER</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <FlatList
          data={displayOrders}
          renderItem={renderOrderItem}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
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
  headerIcon: {
    width: 36,
    height: 36,
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
  listContent: {
    padding: 20,
    paddingTop: 10,
  },
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#0F0F11",
    borderBottomWidth: 1,
    borderBottomColor: "#1A1A1A",
  },
  tab: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  activeTab: {
    borderBottomColor: "#E31837",
  },
  tabText: {
    fontSize: RFValue(13),
    fontFamily: "MRegular",
    color: "#666",
  },
  activeTabText: {
    color: "#E31837",
    fontFamily: "MBold",
  },
  orderCard: {
    backgroundColor: "#161618",
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: "#222",
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  orderDate: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#FFF",
  },
  orderStatus: {
    fontSize: RFValue(10),
    fontFamily: "MBold",
    color: "#4CAF50",
    letterSpacing: 1,
  },
  orderBody: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  orderId: {
    fontSize: RFValue(11),
    fontFamily: "MBold",
    color: "#888",
  },
  orderTotal: {
    fontSize: RFValue(14),
    fontFamily: "MBold",
    color: "#FFF",
  },
  itemSummary: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#666",
    marginBottom: 12,
  },
  pointsEarned: {
    flexDirection: "row",
    alignItems: "center",
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  pointsText: {
    fontSize: RFValue(10),
    fontFamily: "MSemiBold",
    color: "#FFA500",
    marginLeft: 6,
  },
  emptyIcon: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 40,
    marginTop: -50,
  },
  emptyTitle: {
    fontSize: RFValue(16),
    fontFamily: "MBold",
    color: "#FFF",
    marginTop: 20,
  },
  emptySubtitle: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
    textAlign: "center",
    marginTop: 8,
  },
  orderBtn: {
    marginTop: 30,
    backgroundColor: "#E31837",
    height: 55,
    paddingHorizontal: 30,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  orderBtnText: {
    color: "#FFF",
    fontSize: RFValue(12),
    fontFamily: "MBold",
    letterSpacing: 2,
  }
});

export default OrderHistoryScreen;
