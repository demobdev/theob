import { useEffect } from "react";
import { Platform } from "react-native";
import { useAuth } from "@clerk/clerk-expo";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import {
  canUsePushNotifications,
  getCachedExpoPushToken,
  registerForPushNotifications,
} from "../utils/notifications";

/** Registers Expo push token with Convex after sign-in. */
export default function AuthPushRegistrar() {
  const { isSignedIn } = useAuth();
  const registerPushToken = useMutation(api.pushNotifications.registerPushToken);
  const removePushToken = useMutation(api.pushNotifications.removePushToken);

  useEffect(() => {
    if (!isSignedIn || !canUsePushNotifications()) return;

    const platform = Platform.OS === "ios" ? "ios" : "android";

    void (async () => {
      const cached = await getCachedExpoPushToken();
      if (cached) {
        await registerPushToken({ token: cached, platform }).catch(
          () => undefined,
        );
      }
      await registerForPushNotifications(registerPushToken);
    })();
  }, [isSignedIn, registerPushToken]);

  useEffect(() => {
    if (isSignedIn) return;

    void (async () => {
      const cached = await getCachedExpoPushToken();
      if (cached) {
        await removePushToken({ token: cached }).catch(() => undefined);
      }
    })();
  }, [isSignedIn, removePushToken]);

  return null;
}
