import { useEffect } from "react";
import { usePostHog } from "posthog-react-native";
import { useUser } from "@clerk/clerk-expo";

/** Links Clerk identity to PostHog when the user signs in or out. */
export default function PostHogUserSync() {
  const posthog = usePostHog();
  const { user, isSignedIn } = useUser();

  useEffect(() => {
    if (isSignedIn && user?.id) {
      posthog.identify(user.id, {
        email: user.primaryEmailAddress?.emailAddress,
        name: user.fullName ?? undefined,
      });
      return;
    }
    posthog.reset();
  }, [isSignedIn, user?.id, posthog, user?.primaryEmailAddress?.emailAddress, user?.fullName]);

  return null;
}
