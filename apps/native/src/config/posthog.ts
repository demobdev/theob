import PostHog from "posthog-react-native";

const apiKey = process.env.EXPO_PUBLIC_POSTHOG_KEY;
const host =
  process.env.EXPO_PUBLIC_POSTHOG_HOST ?? "https://us.i.posthog.com";
const isConfigured = Boolean(apiKey && !apiKey.includes("your_"));

if (__DEV__ && !isConfigured) {
  console.warn(
    "PostHog: set EXPO_PUBLIC_POSTHOG_KEY in apps/native/.env.local (disabled until then).",
  );
}

export const posthog = new PostHog(apiKey ?? "placeholder", {
  host,
  disabled: !isConfigured,
  captureAppLifecycleEvents: true,
  debug: __DEV__,
});

export const isPostHogEnabled = isConfigured;
