import * as Sentry from "@sentry/react-native";

const dsn = process.env.EXPO_PUBLIC_SENTRY_DSN;

export function initSentry(): boolean {
  if (!dsn || dsn.includes("your_")) {
    if (__DEV__) {
      console.warn(
        "Sentry: set EXPO_PUBLIC_SENTRY_DSN in apps/native/.env.local",
      );
    }
    return false;
  }

  Sentry.init({
    dsn,
    environment: __DEV__ ? "development" : "production",
    tracesSampleRate: __DEV__ ? 1.0 : 0.2,
    enableAutoSessionTracking: true,
    attachStacktrace: true,
  });

  return true;
}

export { Sentry };
