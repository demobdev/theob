import { Alert } from "react-native";

/**
 * Ensures the user is authenticated before performing an action.
 * If not authenticated, shows an alert with a 'Sign In' button.
 * 
 * @param isSignedIn - Boolean from useAuth() or useUser()
 * @param navigation - Navigation object to perform redirection
 * @param action - Optional callback to perform if authenticated
 * @param message - Custom message to show in the alert
 */
export const ensureAuth = (
  isSignedIn: boolean, 
  navigation: any, 
  action?: () => void,
  message: string = "Sign in to access this feature and start earning points!"
) => {
  if (isSignedIn) {
    if (action) action();
    return true;
  }

  Alert.alert(
    "Join the Roster",
    message,
    [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Sign In", 
        onPress: () => navigation.navigate("LoginScreen") 
      }
    ]
  );
  return false;
};
