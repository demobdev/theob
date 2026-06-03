import type { ShowObAlert } from "../hooks/useObAlert";

/**
 * Ensures the user is authenticated before performing an action.
 * If not authenticated, shows a leather OB alert with a 'Sign In' button.
 */
export const ensureAuth = (
  isSignedIn: boolean,
  navigation: { navigate: (screen: string) => void },
  showAlert: ShowObAlert,
  action?: () => void,
  message: string = "Sign in to access this feature and start earning points!"
) => {
  if (isSignedIn) {
    if (action) action();
    return true;
  }

  showAlert({
    title: "Join the Roster",
    message,
    buttons: [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign In",
        style: "primary",
        onPress: () => navigation.navigate("LoginScreen"),
      },
    ],
  });
  return false;
};
