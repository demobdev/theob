import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";

const BottomNavBar = ({ activeTab, navigation }) => {
  const tabs = [
    { name: "GAMES", icon: "trophy-outline", activeIcon: "trophy", route: "LiveGamesScreen" },
    { name: "ORDER", icon: "cart-outline", activeIcon: "cart", route: "HomeScreen" },
    { name: "REWARDS", icon: "gift-outline", activeIcon: "gift", route: "RewardsScreen" },
    { name: "MORE", icon: "menu-outline", activeIcon: "menu", route: "MoreScreen" },
  ];

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => navigation.navigate(tab.route)}
          >
            <Ionicons
              name={isActive ? (tab.activeIcon as any) : (tab.icon as any)}
              size={22}
              color={isActive ? "#FFA500" : "#888"}
            />
            <Text style={[styles.navText, isActive && styles.navTextActive]}>
              {tab.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  navBar: {
    flexDirection: "row",
    backgroundColor: "#161616",
    height: 75,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingBottom: 15,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "space-around",
    alignItems: "center",
  },
  navItem: {
    paddingVertical: 10,
    alignItems: "center",
    flex: 1,
  },
  navText: {
    fontSize: 9,
    color: "#666",
    marginTop: 4,
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  navTextActive: {
    color: "#FFA500",
  },
});

export default BottomNavBar;
