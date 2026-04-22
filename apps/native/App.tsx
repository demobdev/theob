import React from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";

// Import Screens
import LandingScreen from "./src/screens/LandingScreen";
import LoginScreen from "./src/screens/LoginScreen";
import HomeScreen from "./src/screens/HomeScreen";
import MenuScreen from "./src/screens/MenuScreen";
import CollectPointsScreen from "./src/screens/CollectPointsScreen";
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import LiveGamesScreen from "./src/screens/LiveGamesScreen";
import RewardsScreen from "./src/screens/RewardsScreen";
import RewardDetailScreen from "./src/screens/RewardDetailScreen";
import RedeemInStoreScreen from "./src/screens/RedeemInStoreScreen";
import RedeemOnlineScreen from "./src/screens/RedeemOnlineScreen";
import PointsHistoryScreen from "./src/screens/PointsHistoryScreen";
import UploadReceiptScreen from "./src/screens/UploadReceiptScreen";
import MoreScreen from "./src/screens/MoreScreen";
import AboutScreen from "./src/screens/AboutScreen";
import AccountScreen from "./src/screens/AccountScreen";
import HelpCenterScreen from "./src/screens/HelpCenterScreen";
import OrderHistoryScreen from "./src/screens/OrderHistoryScreen";
import OrderDetailsScreen from "./src/screens/OrderDetailsScreen";
import SavedCardsScreen from "./src/screens/SavedCardsScreen";
import AddCardScreen from "./src/screens/AddCardScreen";
import TermsScreen from "./src/screens/TermsScreen";
import PrivacyPolicyScreen from "./src/screens/PrivacyPolicyScreen";
import NotificationSettingsScreen from "./src/screens/NotificationSettingsScreen";
import MyTeamsScreen from "./src/screens/MyTeamsScreen";

// Providers
import ConvexClientProvider from "./ConvexClientProvider";
import { CartProvider } from "./src/context/CartContext";
import { OrderProvider } from "./src/context/OrderContext";

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isLoaded } = useAuth();

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
      <Stack.Screen name="CollectPointsScreen" component={CollectPointsScreen} />
      <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
      <Stack.Screen name="RewardDetailScreen" component={RewardDetailScreen} />
      <Stack.Screen name="RedeemInStoreScreen" component={RedeemInStoreScreen} />
      <Stack.Screen name="RedeemOnlineScreen" component={RedeemOnlineScreen} />
      <Stack.Screen name="PointsHistoryScreen" component={PointsHistoryScreen} />
      <Stack.Screen name="UploadReceiptScreen" component={UploadReceiptScreen} />
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
      <Stack.Screen name="AboutScreen" component={AboutScreen} />
      <Stack.Screen name="AccountScreen" component={AccountScreen} />
      <Stack.Screen name="HelpCenterScreen" component={HelpCenterScreen} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
      <Stack.Screen name="OrderDetailsScreen" component={OrderDetailsScreen} />
      <Stack.Screen name="SavedCardsScreen" component={SavedCardsScreen} />
      <Stack.Screen name="AddCardScreen" component={AddCardScreen} />
      <Stack.Screen name="TermsScreen" component={TermsScreen} />
      <Stack.Screen name="PrivacyPolicyScreen" component={PrivacyPolicyScreen} />
      <Stack.Screen name="NotificationSettingsScreen" component={NotificationSettingsScreen} />
      <Stack.Screen name="MyTeamsScreen" component={MyTeamsScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

import TextureOverlay from "./src/components/TextureOverlay";

export default function App() {
  return (
    <ConvexClientProvider>
      <CartProvider>
        <OrderProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <TextureOverlay>
                <AppNavigation />
              </TextureOverlay>
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </OrderProvider>
      </CartProvider>
    </ConvexClientProvider>
  );
}
