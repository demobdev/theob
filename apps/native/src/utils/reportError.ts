import * as Sentry from "@sentry/react-native";
import { posthog, isPostHogEnabled } from "../config/posthog";

/**
 * Report a handled error to Sentry + PostHog (when configured).
 */
export function reportError(
  error: unknown,
  context?: Record<string, string | number | boolean>,
) {
  const err = error instanceof Error ? error : new Error(String(error));

  if (process.env.EXPO_PUBLIC_SENTRY_DSN) {
    Sentry.captureException(err, { extra: context });
  }

  if (isPostHogEnabled) {
    posthog.capture("$exception", {
      $exception_message: err.message,
      $exception_type: err.name,
      $exception_stack_trace_raw: err.stack,
      ...context,
    });
  }
}
