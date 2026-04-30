"use client";

import { ConvexReactClient } from "convex/react";
import { ConvexProviderWithClerk } from "convex/react-clerk";
import { ClerkProvider, useAuth } from "@clerk/clerk-expo";

const convexUrl =
  process.env.EXPO_PUBLIC_CONVEX_URL ||
  process.env.NEXT_PUBLIC_CONVEX_URL ||
  "https://quiet-mole-11.convex.cloud";
const clerkKey =
  process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

const convex = new ConvexReactClient(convexUrl);

export default function ConvexClientProvider({ children }) {
  return (
    <ClerkProvider publishableKey={clerkKey!}>
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
        {children}
      </ConvexProviderWithClerk>
    </ClerkProvider>
  );
}
