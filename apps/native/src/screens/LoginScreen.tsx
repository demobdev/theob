import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Dimensions,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ImageBackground,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

// ── Brand tokens ────────────────────────────────────────────────────────────
const RED       = "#E31837";   // Primary CTA — THE OB red
const GOLD      = "#FFA500";   // Brand accent — logo, links
const DARK      = "#0F0F11";   // Background
const DARK_CARD = "#1A1A1A";   // Card / input surface
const BORDER    = "#2A2A2A";   // Subtle borders
const TEXT_MUTED = "#888";

type AuthMode = "options" | "email-signin" | "email-signup" | "verify";

const LoginScreen = ({ navigation }: any) => {
  const [mode, setMode]               = useState<AuthMode>("options");
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [email, setEmail]             = useState("");
  const [code, setCode]               = useState("");
  const [firstName, setFirstName]     = useState("");
  const [lastName, setLastName]       = useState("");
  const [verifyType, setVerifyType]   = useState<"signin" | "signup" | null>(null);

  const { startOAuthFlow: startGoogleAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleAuthFlow }  = useOAuth({ strategy: "oauth_apple" });
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const clearError = () => setError(null);

  // ── Auth handlers ─────────────────────────────────────────────────────────

  const onSSOPress = async (provider: "google" | "apple") => {
    setLoading(true);
    clearError();
    try {
      const flow = provider === "google" ? startGoogleAuthFlow : startAppleAuthFlow;
      const { createdSessionId, setActive } = await flow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        navigation.navigate("LandingScreen");
      }
    } catch (err: any) {
      console.error("SSO Error:", err);
      setError(err?.errors?.[0]?.message || err?.message || "Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const onEmailSignIn = async () => {
    if (!signInLoaded) return;
    setLoading(true);
    clearError();
    try {
      const { supportedFirstFactors } = await signIn.create({ identifier: email });
      const emailCodeFactor = supportedFirstFactors?.find((factor: any) => factor.strategy === "email_code");
      
      if (emailCodeFactor) {
        await signIn.prepareFirstFactor({
          strategy: "email_code",
          emailAddressId: emailCodeFactor.emailAddressId,
        });
        setVerifyType("signin");
        setMode("verify");
      } else {
        setError("Passwordless sign-in not supported for this account.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Sign-in failed. Check your email.");
    } finally {
      setLoading(false);
    }
  };

  const onEmailSignUp = async () => {
    if (!signUpLoaded) return;
    setLoading(true);
    clearError();
    try {
      await signUp.create({ emailAddress: email, firstName, lastName });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setVerifyType("signup");
      setMode("verify");
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Sign-up failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async () => {
    setLoading(true);
    clearError();
    try {
      if (verifyType === "signup" && signUpLoaded) {
        const result = await signUp.attemptEmailAddressVerification({ code });
        if (result.status === "complete" && setSignUpActive) {
          await setSignUpActive({ session: result.createdSessionId });
          navigation.navigate("LandingScreen");
        } else if (result.status === "missing_requirements") {
          const missingArr = (result as any).missingFields || (result as any).unverifiedFields || [];
          const missing = missingArr.join(", ") || "Unknown fields";
          setError(`Missing requirements: ${missing}`);
        } else {
          setError(`Status: "${result.status}" — incomplete.`);
        }
      } else if (verifyType === "signin" && signInLoaded) {
        const result = await signIn.attemptFirstFactor({ strategy: "email_code", code });
        if (result.status === "complete" && setSignInActive) {
          await setSignInActive({ session: result.createdSessionId });
          navigation.navigate("LandingScreen");
        } else {
          setError(`Status: "${result.status}" — incomplete.`);
        }
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  // ── Shared render helpers ────────────────────────────────────────────────

  const renderBrandHeader = () => (
    <>
      <View style={styles.logoWrapper}>
        <Image
          source={require("../assets/icons/logo.png")}
          style={styles.logo}
          resizeMode="contain"
        />
      </View>
      <Text style={styles.brandName}>THE OWNER'S BOX</Text>
      <Text style={styles.tagline}>GREENVILLE, SC  •  EST. 2026</Text>
      <View style={styles.divider} />
    </>
  );

  const renderHeader = (title: string, sub: string, onBack?: () => void) => (
    <View style={styles.headerBlock}>
      {onBack && (
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color={GOLD} />
        </TouchableOpacity>
      )}
      <Text style={styles.headline}>{title}</Text>
      <Text style={styles.subtitle}>{sub}</Text>
    </View>
  );

  const renderInput = (
    placeholder: string,
    value: string,
    onChangeText: (t: string) => void,
    opts?: {
      keyboardType?: any;
      secureTextEntry?: boolean;
      onToggleSecure?: () => void;
      autoCapitalize?: any;
    }
  ) => (
    <View style={styles.inputWrapper}>
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={TEXT_MUTED}
        value={value}
        onChangeText={onChangeText}
        keyboardType={opts?.keyboardType ?? "default"}
        secureTextEntry={opts?.secureTextEntry ?? false}
        autoCapitalize={opts?.autoCapitalize ?? "none"}
        autoCorrect={false}
      />
      {opts?.onToggleSecure && (
        <TouchableOpacity style={styles.eyeBtn} onPress={opts.onToggleSecure}>
          <Ionicons
            name={opts.secureTextEntry ? "eye-off-outline" : "eye-outline"}
            size={18}
            color={TEXT_MUTED}
          />
        </TouchableOpacity>
      )}
    </View>
  );

  // ── Mode: Options (landing) ──────────────────────────────────────────────
  if (mode === "options") {
    return (
      <ImageBackground 
        source={require("../../assets/images/leather_black.jpg")}
        style={styles.container}
        imageStyle={styles.leatherTexture}
      >
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          {renderBrandHeader()}
          {renderHeader(
            "Welcome to The Box",
            "Sign in to earn points, track\nyour teams, and order game-day food."
          )}

          <View style={styles.buttonGroup}>
            <TouchableOpacity style={styles.authButton} onPress={() => onSSOPress("google")} disabled={loading}>
              <Image style={styles.buttonIcon} source={require("../assets/icons/google.png")} />
              <Text style={styles.authButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.authButton, styles.appleButton]} onPress={() => onSSOPress("apple")} disabled={loading}>
              <AntDesign name="apple" size={20} color="#fff" style={styles.ssoIcon} />
              <Text style={[styles.authButtonText, styles.appleButtonText]}>Continue with Apple</Text>
            </TouchableOpacity>

            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            <TouchableOpacity style={styles.emailButton} onPress={() => setMode("email-signin")}>
              <Ionicons name="mail-outline" size={18} color={RED} style={styles.ssoIcon} />
              <Text style={styles.emailButtonText}>Sign in with Email</Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setMode("email-signup")} style={styles.signupLink}>
              <Text style={styles.signupLinkText}>
                New to The Box? <Text style={styles.signupLinkAccent}>Join the Roster →</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="small" color={RED} style={{ marginTop: 20 }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>
        <View style={styles.footer}>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>GREENVILLE, SC</Text>
          <View style={styles.footerDot} />
        </View>
      </ImageBackground>
    );
  }

  // ── Mode: Email Sign-In ──────────────────────────────────────────────────
  if (mode === "email-signin") {
    return (
      <ImageBackground 
        source={require("../../assets/images/leather_black.jpg")}
        style={styles.container}
        imageStyle={styles.leatherTexture}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {renderBrandHeader()}
            {renderHeader("Welcome Back", "Sign in to The Owner's Box", () => setMode("options"))}
            {renderInput("Email address", email, setEmail, { keyboardType: "email-address" })}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.primaryButton} onPress={onEmailSignIn} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>SIGN IN</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode("email-signup")} style={styles.signupLink}>
              <Text style={styles.signupLinkText}>No account? <Text style={styles.signupLinkAccent}>Join the Roster →</Text></Text>
            </TouchableOpacity>
            <View style={[styles.orRow, { marginTop: 24, marginBottom: 16 }]}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>
            <View style={styles.buttonGroup}>
              <TouchableOpacity style={styles.authButton} onPress={() => onSSOPress("google")} disabled={loading}>
                <Image style={styles.buttonIcon} source={require("../assets/icons/google.png")} />
                <Text style={styles.authButtonText}>Continue with Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.authButton, styles.appleButton]} onPress={() => onSSOPress("apple")} disabled={loading}>
                <AntDesign name="apple" size={20} color="#fff" style={styles.ssoIcon} />
                <Text style={[styles.authButtonText, styles.appleButtonText]}>Continue with Apple</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  // ── Mode: Email Sign-Up ──────────────────────────────────────────────────
  if (mode === "email-signup") {
    return (
      <ImageBackground 
        source={require("../../assets/images/leather_black.jpg")}
        style={styles.container}
        imageStyle={styles.leatherTexture}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {renderBrandHeader()}
            {renderHeader("Join the Roster", "Create your account and start earning.", () => setMode("options"))}
            <View style={styles.row}>
              <View style={{ flex: 1 }}>{renderInput("First name", firstName, setFirstName, { autoCapitalize: "words" })}</View>
              <View style={{ width: 15 }} />
              <View style={{ flex: 1 }}>{renderInput("Last name", lastName, setLastName, { autoCapitalize: "words" })}</View>
            </View>
            {renderInput("Email address", email, setEmail, { keyboardType: "email-address" })}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.primaryButton} onPress={onEmailSignUp} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>JOIN THE ROSTER</Text>}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setMode("email-signin")} style={styles.signupLink}>
              <Text style={styles.signupLinkText}>Already in the Box? <Text style={styles.signupLinkAccent}>Sign in →</Text></Text>
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  // ── Mode: Verify Email ───────────────────────────────────────────────────
  if (mode === "verify") {
    return (
      <ImageBackground 
        source={require("../../assets/images/leather_black.jpg")}
        style={styles.container}
        imageStyle={styles.leatherTexture}
      >
        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
          <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
            {renderBrandHeader()}
            {renderHeader("Check Your Email", `We sent a code to\n${email}`, () => setMode("email-signup"))}
            {renderInput("6-digit code", code, setCode, { keyboardType: "number-pad" })}
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity style={styles.primaryButton} onPress={onVerify} disabled={loading}>
              {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.primaryButtonText}>VERIFY & ENTER</Text>}
            </TouchableOpacity>
          </ScrollView>
        </KeyboardAvoidingView>
      </ImageBackground>
    );
  }

  return null;
};

// ── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: "100%",
    backgroundColor: DARK,
  },
  leatherTexture: {
    opacity: 0.15,
  },
  row: {
    flexDirection: "row",
    width: "100%",
  },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 50,
  },
  logoWrapper: {
    width: 100,
    height: 100,
    borderRadius: 22,
    backgroundColor: DARK_CARD,
    borderWidth: 1.5,
    borderColor: GOLD,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
    shadowColor: GOLD,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.25,
    shadowRadius: 14,
    elevation: 10,
  },
  logo: {
    width: 72,
    height: 72,
  },
  brandName: {
    color: "#FFF",
    fontSize: RFValue(16),
    fontFamily: "MBold",
    letterSpacing: 3,
    textAlign: "center",
  },
  tagline: {
    color: GOLD,
    fontSize: RFValue(9),
    fontFamily: "MBold",
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 4,
  },
  divider: {
    width: 44,
    height: 2,
    backgroundColor: RED,
    marginVertical: 22,
    borderRadius: 1,
  },
  headerBlock: {
    width: "100%",
    alignItems: "center",
    marginBottom: 24,
    position: "relative",
  },
  backBtn: {
    position: "absolute",
    left: 0,
    top: 0,
    padding: 4,
  },
  headline: {
    color: "#FFF",
    fontSize: RFValue(22),
    fontFamily: "MBold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    color: TEXT_MUTED,
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    textAlign: "center",
    lineHeight: 20,
  },
  buttonGroup: {
    width: "100%",
    gap: 10,
  },
  authButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FFF",
    borderRadius: 12,
    height: 52,
    width: "100%",
  },
  appleButton: {
    backgroundColor: "#1C1C1E",
    borderWidth: 1,
    borderColor: BORDER,
  },
  emailButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: DARK_CARD,
    borderRadius: 12,
    height: 52,
    width: "100%",
    borderWidth: 1,
    borderColor: RED,
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  ssoIcon: {
    marginRight: 12,
  },
  authButtonText: {
    color: "#1A1A1A",
    fontSize: RFValue(14),
    fontFamily: "MBold",
  },
  appleButtonText: {
    color: "#FFF",
  },
  emailButtonText: {
    color: RED,
    fontSize: RFValue(14),
    fontFamily: "MBold",
  },
  orRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  orLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
  },
  orText: {
    color: TEXT_MUTED,
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    marginHorizontal: 12,
  },
  signupLink: {
    alignItems: "center",
    marginTop: 10,
  },
  signupLinkText: {
    color: TEXT_MUTED,
    fontSize: RFValue(13),
    fontFamily: "MRegular",
  },
  signupLinkAccent: {
    color: GOLD,
    fontFamily: "MBold",
  },
  inputWrapper: {
    width: "100%",
    height: 52,
    backgroundColor: DARK_CARD,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  input: {
    flex: 1,
    color: "#FFF",
    fontSize: RFValue(14),
    fontFamily: "MRegular",
  },
  eyeBtn: {
    padding: 4,
  },
  primaryButton: {
    width: "100%",
    height: 54,
    backgroundColor: RED,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: RED,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  primaryButtonText: {
    color: "#FFF",
    fontSize: RFValue(14),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  errorText: {
    color: "#FF4D4D",
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    textAlign: "center",
    marginBottom: 10,
    lineHeight: 18,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingBottom: 32,
    gap: 8,
  },
  footerDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: RED,
    opacity: 0.6,
  },
  footerText: {
    color: TEXT_MUTED,
    fontSize: RFValue(10),
    fontFamily: "MRegular",
    letterSpacing: 3,
  },
});

export default LoginScreen;
