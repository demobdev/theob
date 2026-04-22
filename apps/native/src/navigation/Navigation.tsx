import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";
import LandingScreen from "../screens/LandingScreen";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import MenuScreen from "../screens/MenuScreen";
import ProductDetailScreen from "../screens/ProductDetailScreen";
import CartScreen from "../screens/CartScreen";
import LiveGamesScreen from "../screens/LiveGamesScreen";
import RewardsScreen from "../screens/RewardsScreen";
import MoreScreen from "../screens/MoreScreen";
import AboutScreen from "../screens/AboutScreen";
import AccountScreen from "../screens/AccountScreen";
import HelpCenterScreen from "../screens/HelpCenterScreen";
import TermsScreen from "../screens/TermsScreen";
import PrivacyPolicyScreen from "../screens/PrivacyPolicyScreen";
import OrderHistoryScreen from "../screens/OrderHistoryScreen";
import SavedCardsScreen from "../screens/SavedCardsScreen";

const Stack = createNativeStackNavigator();

const Navigation = () => {
  const { isLoaded } = useAuth();

  // Wait for Clerk to load the session state
  if (!isLoaded) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="LandingScreen">
      <Stack.Screen name="LandingScreen" component={LandingScreen} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="LiveGamesScreen" component={LiveGamesScreen} />
      <Stack.Screen name="MenuScreen" component={MenuScreen} />
      <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
      <Stack.Screen name="CartScreen" component={CartScreen} />
      <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="TermsScreen" component={TermsScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <Stack.Screen name="SavedCardsScreen" component={SavedCardsScreen} />
      
      {/* Auth Module */}
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
};

export default Navigation;
