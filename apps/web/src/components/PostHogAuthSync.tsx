"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

/** Identifies the signed-in Clerk user in PostHog (client-side). */
export default function PostHogAuthSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    if (isSignedIn && user?.id) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
      return;
    }
    posthog.reset();
  }, [isSignedIn, user?.id, user?.primaryEmailAddress?.emailAddress, user?.fullName]);

  return null;
}
