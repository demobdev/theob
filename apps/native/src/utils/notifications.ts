import { Alert, Linking, Platform } from "react-native";
import * as Notifications from "expo-notifications";
import AsyncStorage from "@react-native-async-storage/async-storage";

const NOTIFICATIONS_PREF_KEY = "notificationsEnabled";

export async function requestOnboardingNotifications(): Promise<boolean> {
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
      Alert.alert(
        "Notifications enabled",
        "You'll get game-day deals, menu drops, and special surprises."
      );
    } else if (finalStatus === "denied") {
      Alert.alert(
        "Notifications off",
        "You can turn them on anytime in your device settings.",
        [
          { text: "Not now", style: "cancel" },
          {
            text: "Open Settings",
            onPress: () => Linking.openSettings(),
          },
        ]
      );
    } else {
      Alert.alert(
        "Notifications",
        "Permission wasn't granted. You can enable alerts later in Settings."
      );
    }

    return granted;
  } catch (e) {
    console.warn("Notification permission request failed:", e);
    Alert.alert(
      "Notifications unavailable",
      "Push notifications aren't available in this build yet. You can enable them later in Settings."
    );
    return false;
  }
}
