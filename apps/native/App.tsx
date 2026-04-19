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
import ProductDetailScreen from "./src/screens/ProductDetailScreen";
import CartScreen from "./src/screens/CartScreen";
import LiveGamesScreen from "./src/screens/LiveGamesScreen";
import RewardsScreen from "./src/screens/RewardsScreen";
import MoreScreen from "./src/screens/MoreScreen";

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
      <Stack.Screen name="RewardsScreen" component={RewardsScreen} />
      <Stack.Screen name="MoreScreen" component={MoreScreen} />
      <Stack.Screen name="LoginScreen" component={LoginScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <ConvexClientProvider>
      <CartProvider>
        <OrderProvider>
          <SafeAreaProvider>
            <NavigationContainer>
              <AppNavigation />
              <StatusBar style="auto" />
            </NavigationContainer>
          </SafeAreaProvider>
        </OrderProvider>
      </CartProvider>
    </ConvexClientProvider>
  );
}
