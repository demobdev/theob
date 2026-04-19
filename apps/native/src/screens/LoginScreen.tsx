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
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { useOAuth, useSignIn, useSignUp } from "@clerk/clerk-expo";
import { AntDesign, Ionicons } from "@expo/vector-icons";

const { width } = Dimensions.get("window");

const GOLD = "#d4af37";
const DARK = "#0f0f0f";
const DARK_CARD = "#1a1a1a";
const BORDER = "#2e2e2e";
const TEXT_MUTED = "#888";

type AuthMode = "options" | "email-signin" | "email-signup" | "verify";

const LoginScreen = () => {
  const [mode, setMode] = useState<AuthMode>("options");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [firstName, setFirstName] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { startOAuthFlow: startGoogleAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const { startOAuthFlow: startAppleAuthFlow } = useOAuth({ strategy: "oauth_apple" });
  const { signIn, setActive: setSignInActive, isLoaded: signInLoaded } = useSignIn();
  const { signUp, setActive: setSignUpActive, isLoaded: signUpLoaded } = useSignUp();

  const clearError = () => setError(null);

  // SSO
  const onSSOPress = async (provider: "google" | "apple") => {
    setLoading(true);
    clearError();
    try {
      const flow = provider === "google" ? startGoogleAuthFlow : startAppleAuthFlow;
      const { createdSessionId, setActive } = await flow();
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (err: any) {
      setError("Sign-in failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Email sign-in
  const onEmailSignIn = async () => {
    if (!signInLoaded) return;
    setLoading(true);
    clearError();
    try {
      const result = await signIn.create({ identifier: email, password });
      if (result.status === "complete" && setSignInActive) {
        await setSignInActive({ session: result.createdSessionId });
      } else {
        setError("Sign-in incomplete. Check your email.");
      }
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Sign-in failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  // Email sign-up
  const onEmailSignUp = async () => {
    if (!signUpLoaded) return;
    setLoading(true);
    clearError();
    try {
      await signUp.create({ emailAddress: email, password, firstName });
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });
      setMode("verify");
    } catch (err: any) {
      setError(err?.errors?.[0]?.message ?? "Sign-up failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Verify email code
  const onVerify = async () => {
    if (!signUpLoaded) return;
    setLoading(true);
    clearError();
    try {
      const result = await signUp.attemptEmailAddressVerification({ code });
      console.log("Verify result status:", result.status, "sessionId:", result.createdSessionId);

      if (result.status === "complete") {
        if (result.createdSessionId && setSignUpActive) {
          await setSignUpActive({ session: result.createdSessionId });
        } else {
          setError("Signed up but no session returned. Check Clerk dashboard.");
        }
      } else {
        setError(
          `Status: "${result.status}" — Enable Email+Password in Clerk Dashboard:\nConfigure → Email, Phone, Username → Password`
        );
      }
    } catch (err: any) {
      console.log("Verify error:", JSON.stringify(err?.errors));
      const errCode = err?.errors?.[0]?.code ?? "";
      const errMsg = err?.errors?.[0]?.message ?? "";

      if (errCode === "form_identifier_already_verified" || errMsg.toLowerCase().includes("already verified")) {
        setError("Account already verified. Redirecting to sign in…");
        setTimeout(() => { clearError(); setMode("email-signin"); }, 1500);
      } else {
        setError(errMsg || `Clerk error code: ${errCode}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // ---- Render helpers ----

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

  // ---- Main options screen ----
  if (mode === "options") {
    return (
      <View style={styles.container}>
        <View style={styles.topAccent} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Image
              source={require("../assets/icons/logo.png")}
              style={styles.logo}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.brandName}>THE OB</Text>
          <Text style={styles.tagline}>#THEOB SPORTS BAR</Text>
          <View style={styles.divider} />
          {renderHeader("Welcome", "Sign in to track games,\norder food, and earn rewards")}

          <View style={styles.buttonGroup}>
            {/* Google */}
            <TouchableOpacity
              style={styles.authButton}
              onPress={() => onSSOPress("google")}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Image style={styles.buttonIcon} source={require("../assets/icons/google.png")} />
              <Text style={styles.authButtonText}>Continue with Google</Text>
            </TouchableOpacity>

            {/* Apple */}
            <TouchableOpacity
              style={[styles.authButton, styles.appleButton]}
              onPress={() => onSSOPress("apple")}
              disabled={loading}
              activeOpacity={0.8}
            >
              <AntDesign name="apple" size={20} color="#fff" style={styles.appleIcon} />
              <Text style={[styles.authButtonText, styles.appleButtonText]}>
                Continue with Apple
              </Text>
            </TouchableOpacity>

            {/* Divider */}
            <View style={styles.orRow}>
              <View style={styles.orLine} />
              <Text style={styles.orText}>OR</Text>
              <View style={styles.orLine} />
            </View>

            {/* Email sign-in */}
            <TouchableOpacity
              style={styles.emailButton}
              onPress={() => setMode("email-signin")}
              activeOpacity={0.8}
            >
              <Ionicons name="mail-outline" size={18} color={GOLD} style={styles.appleIcon} />
              <Text style={styles.emailButtonText}>Sign in with Email</Text>
            </TouchableOpacity>

            {/* Sign up link */}
            <TouchableOpacity onPress={() => setMode("email-signup")} style={styles.signupLink}>
              <Text style={styles.signupLinkText}>
                New here?{" "}
                <Text style={styles.signupLinkGold}>Create an account →</Text>
              </Text>
            </TouchableOpacity>
          </View>

          {loading && <ActivityIndicator size="small" color={GOLD} style={{ marginTop: 20 }} />}
          {error && <Text style={styles.errorText}>{error}</Text>}
        </ScrollView>

        <View style={styles.footer}>
          <View style={styles.footerDot} />
          <Text style={styles.footerText}>GREENVILLE, SC</Text>
          <View style={styles.footerDot} />
        </View>
      </View>
    );
  }

  // ---- Email sign-in ----
  if (mode === "email-signin") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topAccent} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Image source={require("../assets/icons/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          {renderHeader("Sign In", "Welcome back to The OB", () => setMode("options"))}

          {renderInput("Email address", email, setEmail, { keyboardType: "email-address" })}
          {renderInput("Password", password, setPassword, {
            secureTextEntry: !showPassword,
            onToggleSecure: () => setShowPassword((p) => !p),
          })}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onEmailSignIn}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <Text style={styles.primaryButtonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode("email-signup")} style={styles.signupLink}>
            <Text style={styles.signupLinkText}>
              No account? <Text style={styles.signupLinkGold}>Sign up →</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ---- Email sign-up ----
  if (mode === "email-signup") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topAccent} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Image source={require("../assets/icons/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          {renderHeader("Create Account", "Join The Owner's Box loyalty family", () => setMode("options"))}

          {renderInput("First name", firstName, setFirstName, { autoCapitalize: "words" })}
          {renderInput("Email address", email, setEmail, { keyboardType: "email-address" })}
          {renderInput("Password", password, setPassword, {
            secureTextEntry: !showPassword,
            onToggleSecure: () => setShowPassword((p) => !p),
          })}

          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onEmailSignUp}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <Text style={styles.primaryButtonText}>Create Account</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setMode("email-signin")} style={styles.signupLink}>
            <Text style={styles.signupLinkText}>
              Already have an account? <Text style={styles.signupLinkGold}>Sign in →</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  // ---- Verify email ----
  if (mode === "verify") {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.topAccent} />
        <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
          <View style={styles.logoWrapper}>
            <Image source={require("../assets/icons/logo.png")} style={styles.logo} resizeMode="contain" />
          </View>
          {renderHeader(
            "Check Your Email",
            `We sent a 6-digit code to\n${email}`,
            () => setMode("email-signup")
          )}

          {renderInput("6-digit code", code, setCode, { keyboardType: "number-pad" })}
          {error && <Text style={styles.errorText}>{error}</Text>}

          <TouchableOpacity
            style={styles.primaryButton}
            onPress={onVerify}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#1a1a1a" />
            ) : (
              <Text style={styles.primaryButtonText}>Verify & Enter</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }

  return null;
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: DARK },
  topAccent: { position: "absolute", top: 0, left: 0, right: 0, height: 3, backgroundColor: GOLD, zIndex: 10 },
  content: {
    flexGrow: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
    paddingVertical: 40,
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
    shadowOpacity: 0.3,
    shadowRadius: 14,
    elevation: 10,
  },
  logo: { width: 72, height: 72 },
  brandName: { color: GOLD, fontSize: RFValue(15), fontFamily: "MBold", letterSpacing: 4, textAlign: "center" },
  tagline: { color: TEXT_MUTED, fontSize: RFValue(9), fontFamily: "MRegular", letterSpacing: 3, textAlign: "center", marginTop: 4 },
  divider: { width: 44, height: 1.5, backgroundColor: GOLD, opacity: 0.5, marginVertical: 20 },
  headerBlock: { width: "100%", alignItems: "center", marginBottom: 24, position: "relative" },
  backBtn: { position: "absolute", left: 0, top: 0, padding: 4 },
  headline: { color: "#fff", fontSize: RFValue(22), fontFamily: "MBold", textAlign: "center", marginBottom: 6 },
  subtitle: { color: TEXT_MUTED, fontSize: RFValue(13), fontFamily: "MRegular", textAlign: "center", lineHeight: 20 },
  buttonGroup: { width: "100%", gap: 10 },
  authButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: "#fff", borderRadius: 12, height: 50, width: "100%",
  },
  appleButton: { backgroundColor: "#1c1c1e", borderWidth: 1, borderColor: BORDER },
  emailButton: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    backgroundColor: DARK_CARD, borderRadius: 12, height: 50, width: "100%",
    borderWidth: 1, borderColor: GOLD,
  },
  buttonIcon: { width: 20, height: 20, marginRight: 12 },
  appleIcon: { marginRight: 12 },
  authButtonText: { color: "#1a1a1a", fontSize: RFValue(14), fontFamily: "MSemiBold" },
  appleButtonText: { color: "#fff" },
  emailButtonText: { color: GOLD, fontSize: RFValue(14), fontFamily: "MSemiBold" },
  orRow: { flexDirection: "row", alignItems: "center", marginVertical: 4 },
  orLine: { flex: 1, height: 1, backgroundColor: BORDER },
  orText: { color: TEXT_MUTED, fontSize: RFValue(11), fontFamily: "MRegular", marginHorizontal: 12 },
  signupLink: { alignItems: "center", marginTop: 8 },
  signupLinkText: { color: TEXT_MUTED, fontSize: RFValue(13), fontFamily: "MRegular" },
  signupLinkGold: { color: GOLD, fontFamily: "MSemiBold" },
  inputWrapper: {
    width: "100%", height: 50, backgroundColor: DARK_CARD, borderRadius: 12,
    borderWidth: 1, borderColor: BORDER, marginBottom: 12,
    flexDirection: "row", alignItems: "center", paddingHorizontal: 16,
  },
  input: { flex: 1, color: "#fff", fontSize: RFValue(14), fontFamily: "MRegular" },
  eyeBtn: { padding: 4 },
  primaryButton: {
    width: "100%", height: 52, backgroundColor: GOLD, borderRadius: 12,
    justifyContent: "center", alignItems: "center", marginTop: 8,
    shadowColor: GOLD, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10,
  },
  primaryButtonText: { color: "#1a1a1a", fontSize: RFValue(15), fontFamily: "MBold" },
  errorText: { color: "#ff4d4d", fontSize: RFValue(12), fontFamily: "MRegular", textAlign: "center", marginBottom: 10 },
  footer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingBottom: 32, gap: 8 },
  footerDot: { width: 4, height: 4, borderRadius: 2, backgroundColor: GOLD, opacity: 0.6 },
  footerText: { color: TEXT_MUTED, fontSize: RFValue(10), fontFamily: "MRegular", letterSpacing: 3 },
});

export default LoginScreen;
