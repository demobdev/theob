"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import posthog from "posthog-js";

/** Links configured analytics to a stable ID without sending profile details. */
export default function PostHogAuthSync() {
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (!process.env.NEXT_PUBLIC_POSTHOG_KEY) return;

    if (isSignedIn && user?.id) {
      posthog.identify(user.id);
      return;
    }
    posthog.reset();
  }, [isSignedIn, user?.id]);

  return null;
}
