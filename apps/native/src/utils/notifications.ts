import { Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { ObAlertConfig } from "../components/ObAlertModal";

const NOTIFICATIONS_PREF_KEY = "notificationsEnabled";

export type ShowObAlert = (config: ObAlertConfig) => void;

export async function requestOnboardingNotifications(
  showAlert: ShowObAlert
): Promise<boolean> {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "The Owner's Box",
        importance: Notifications.AndroidImportance.DEFAULT,
      });
    }

    const { status: existing } = await Notifications.getPermissionsAsync();
    let finalStatus = existing;

    if (existing !== "granted") {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    const granted = finalStatus === "granted";
    await AsyncStorage.setItem(NOTIFICATIONS_PREF_KEY, granted ? "true" : "false");

    if (granted) {
      showAlert({
        title: "Notifications enabled",
        message: "You'll get game-day deals, menu drops, and special surprises.",
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
        message: "Permission wasn't granted. You can enable alerts later in Settings.",
        buttons: [{ text: "OK", style: "primary" }],
      });
    }

    return granted;
  } catch (e) {
    console.warn("Notification permission request failed:", e);
    showAlert({
      title: "Notifications unavailable",
      message:
        "Push notifications aren't available in this build yet. You can enable them later in Settings.",
      buttons: [{ text: "OK", style: "primary" }],
    });
    return false;
  }
}
