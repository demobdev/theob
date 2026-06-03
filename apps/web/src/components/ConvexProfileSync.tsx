"use client";

import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/nextjs";
import { useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";

/**
 * Ensures a Convex user_profiles row exists when the user signs in on web.
 * Same Clerk userId as native → same profile if they use the same Clerk account.
 */
export default function ConvexProfileSync() {
  const { isSignedIn, isLoaded } = useAuth();
  const ensureUser = useMutation(api.loyalty.ensureUser);
  const didRun = useRef(false);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || didRun.current) return;
    didRun.current = true;
    ensureUser().catch((err) => {
      console.error("[ConvexProfileSync] ensureUser failed:", err);
      didRun.current = false;
    });
  }, [isLoaded, isSignedIn, ensureUser]);

  return null;
}
