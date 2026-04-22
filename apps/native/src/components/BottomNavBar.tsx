import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { ensureAuth } from "../utils/authGuard";

const BottomNavBar = ({ activeTab, navigation }) => {
  const { isSignedIn } = useAuth();

  const tabs = [
    { name: "HOME", isLogo: true, route: "LandingScreen" },
    { name: "GAMES", icon: "trophy-outline", activeIcon: "trophy", route: "LiveGamesScreen" },
    { name: "ORDER", icon: "cart-outline", activeIcon: "cart", route: "HomeScreen" },
    { name: "REWARDS", icon: "gift-outline", activeIcon: "gift", route: "RewardsScreen" },
    { name: "MORE", icon: "menu-outline", activeIcon: "menu", route: "MoreScreen" },
  ];

  const handlePress = (tab) => {
    // TOGGLE LOGIC: If already on MoreScreen, navigate back (close drawer)
    if (tab.name === "MORE" && activeTab === "MORE") {
        navigation.goBack();
    } else {
        navigation.navigate(tab.route);
    }
  };

  return (
    <View style={styles.navBar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.name;
        
        if (tab.isLogo) {
          return (
            <TouchableOpacity
                key={tab.name}
                style={styles.logoItem}
                onPress={() => handlePress(tab)}
            >
                <Image 
                    source={require("../../assets/images/b-logo.png")} 
                    style={[styles.bLogo, { opacity: isActive ? 1 : 0.6 }]} 
                />
            </TouchableOpacity>
          );
        }

        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.navItem}
            onPress={() => handlePress(tab)}
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
    height: 80,
    borderTopWidth: 1,
    borderTopColor: "#333",
    paddingBottom: 20,
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
  logoItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bLogo: {
    width: 32,
    height: 32,
    resizeMode: "contain",
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
