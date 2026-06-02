import * as Sentry from "@sentry/nextjs";
import posthog from "posthog-js";

export function reportError(
  error: unknown,
  context?: Record<string, string | number | boolean>,
) {
  const err = error instanceof Error ? error : new Error(String(error));
  Sentry.captureException(err, { extra: context });

  if (process.env.NEXT_PUBLIC_POSTHOG_KEY) {
    posthog.captureException(err, context);
  }
}
