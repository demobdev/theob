import { Linking, Platform } from "react-native";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ShowObAlert } from "../hooks/useObAlert";

export type { ShowObAlert };

const NOTIFICATIONS_PREF_KEY = "notificationsEnabled";
const CACHED_PUSH_TOKEN_KEY = "expoPushToken";

export type RegisterPushTokenFn = (args: {
  token: string;
  platform: "ios" | "android";
}) => Promise<unknown>;

export function isExpoGo(): boolean {
  return Constants.appOwnership === "expo";
}

export function canUsePushNotifications(): boolean {
  return !isExpoGo() && Device.isDevice;
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "The Owner's Box",
      importance: Notifications.AndroidImportance.DEFAULT,
    });
  }
}

export async function getExpoPushToken(): Promise<string | null> {
  if (!canUsePushNotifications()) return null;

  const { status: existing } = await Notifications.getPermissionsAsync();
  if (existing !== "granted") return null;

  await ensureAndroidChannel();

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId;
  if (!projectId) {
    console.warn("Missing EAS projectId for Expo push token");
    return null;
  }

  const tokenData = await Notifications.getExpoPushTokenAsync({ projectId });
  return tokenData.data;
}

export async function cacheExpoPushToken(token: string): Promise<void> {
  await AsyncStorage.setItem(CACHED_PUSH_TOKEN_KEY, token);
}

export async function getCachedExpoPushToken(): Promise<string | null> {
  return AsyncStorage.getItem(CACHED_PUSH_TOKEN_KEY);
}

export async function registerForPushNotifications(
  registerToken?: RegisterPushTokenFn,
): Promise<string | null> {
  if (!canUsePushNotifications()) return null;

  try {
    const token = await getExpoPushToken();
    if (!token) return null;

    await cacheExpoPushToken(token);

    if (registerToken) {
      await registerToken({
        token,
        platform: Platform.OS === "ios" ? "ios" : "android",
      });
    }

    return token;
  } catch (e) {
    console.warn("Push token registration failed:", e);
    return null;
  }
}

export async function requestOnboardingNotifications(
  showAlert: ShowObAlert,
  registerToken?: RegisterPushTokenFn,
): Promise<boolean> {
  try {
    if (isExpoGo()) {
      await AsyncStorage.setItem(NOTIFICATIONS_PREF_KEY, "false");
      return false;
    }

    await ensureAndroidChannel();

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const granted = finalStatus === "granted";
    await AsyncStorage.setItem(
      NOTIFICATIONS_PREF_KEY,
      granted ? "true" : "false",
    );

    if (granted) {
      await registerForPushNotifications(registerToken);
      showAlert({
        title: "Notifications enabled",
        message:
          "You'll get game-day deals, menu drops, and special surprises.",
        buttons: [{ text: "OK", style: "primary" }],
      });
    } else if (finalStatus === "denied") {
      showAlert({
        title: "Notifications off",
        message: "You can turn them on anytime in your device settings.",
        buttons: [
          { text: "Not now", style: "cancel" },
          {
            text: "Open Settings",
            style: "primary",
            onPress: () => Linking.openSettings(),
          },
        ],
      });
    } else {
      showAlert({
        title: "Notifications",
        message:
          "Permission wasn't granted. You can enable alerts later in Settings.",
        buttons: [{ text: "OK", style: "primary" }],
      });
    }

    return granted;
  } catch (e) {
    if (!isExpoGo()) {
      console.warn("Notification permission request failed:", e);
    }
    return false;
  }
}
