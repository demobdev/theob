import React, { useRef } from "react";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import * as Notifications from "expo-notifications";
import {
  NavigationContainer,
  type NavigationContainerRef,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { useAuth } from "@clerk/clerk-expo";
import { PostHogProvider } from "posthog-react-native";
import { posthog } from "./src/config/posthog";
import { Sentry } from "./src/config/sentry";
import PostHogUserSync from "./src/components/PostHogUserSync";
import AuthPushRegistrar from "./src/components/AuthPushRegistrar";
import PushNotificationHandler from "./src/components/PushNotificationHandler";

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

import OnboardingScreen from "./src/screens/OnboardingScreen";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useState } from "react";

// Providers
import ConvexClientProvider from "./ConvexClientProvider";
import { CartProvider } from "./src/context/CartContext";
import { OrderProvider } from "./src/context/OrderContext";

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const Stack = createNativeStackNavigator();

function AppNavigation() {
  const { isLoaded } = useAuth();
  const [initialRoute, setInitialRoute] = useState<string | null>(null);

  useEffect(() => {
    const checkOnboarding = async () => {
      try {
        const hasSeen = await AsyncStorage.getItem("hasSeenOnboarding");
        setInitialRoute(hasSeen === "true" ? "LandingScreen" : "OnboardingScreen");
        
        // Artificial delay to let the brand "breathe"
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (e) {
        console.warn(e);
      } finally {
        // Tell the splash screen to hide
        await SplashScreen.hideAsync();
      }
    };
    checkOnboarding();
  }, []);

  if (!isLoaded || initialRoute === null) {
    return null;
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName={initialRoute}>
      <Stack.Screen name="OnboardingScreen" component={OnboardingScreen} />
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

function App() {
  const navigationRef = useRef<NavigationContainerRef<Record<string, unknown>>>(null);
  const routeNameRef = useRef<string | undefined>(undefined);

  return (
    <ConvexClientProvider>
      <PostHogProvider
        client={posthog}
        autocapture={{
          captureScreens: false,
          captureTouches: true,
        }}
      >
        <PostHogUserSync />
        <AuthPushRegistrar />
        <CartProvider>
          <OrderProvider>
            <SafeAreaProvider>
              <NavigationContainer
                ref={navigationRef}
                onReady={() => {
                  routeNameRef.current =
                    navigationRef.current?.getCurrentRoute()?.name;
                }}
                onStateChange={() => {
                  const previous = routeNameRef.current;
                  const current =
                    navigationRef.current?.getCurrentRoute()?.name;
                  if (current && previous !== current) {
                    posthog.screen(current, {
                      previous_screen: previous ?? null,
                    });
                  }
                  routeNameRef.current = current;
                }}
              >
                <PushNotificationHandler navigationRef={navigationRef} />
                <TextureOverlay>
                  <AppNavigation />
                </TextureOverlay>
                <StatusBar style="auto" />
              </NavigationContainer>
            </SafeAreaProvider>
          </OrderProvider>
        </CartProvider>
      </PostHogProvider>
    </ConvexClientProvider>
  );
}

export default Sentry.wrap(App);
