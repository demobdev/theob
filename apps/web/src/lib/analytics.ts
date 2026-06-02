import posthog from "posthog-js";

export function captureEvent(
  event: string,
  properties?: Record<string, string | number | boolean | null | undefined>,
) {
  if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;
  posthog.capture(event, properties);
}
