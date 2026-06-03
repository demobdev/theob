import React from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";

export const OB_GOLD = "#D4AF37";
export const OB_CREAM = "#F5F0E8";
/** Subtle leather grain over cream — matches app texture system (~15%) */
export const OB_LEATHER_TEXTURE_OPACITY = 0.12;

const CREAM_LEATHER = require("../../assets/images/cream_leather.png");

export type ObAlertButton = {
  text: string;
  style?: "cancel" | "default" | "primary";
  onPress?: () => void;
};

export type ObAlertConfig = {
  title: string;
  message: string;
  buttons?: ObAlertButton[];
};

type Props = {
  visible: boolean;
  config: ObAlertConfig | null;
  onClose: () => void;
};

export default function ObAlertModal({ visible, config, onClose }: Props) {
  if (!config) return null;

  const buttons =
    config.buttons && config.buttons.length > 0
      ? config.buttons
      : [{ text: "OK", style: "primary" as const }];

  const handlePress = (button: ObAlertButton) => {
    button.onPress?.();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <Pressable style={StyleSheet.absoluteFill} onPress={onClose} accessibilityRole="button" />
        <View style={styles.card} accessibilityViewIsModal>
          <View style={styles.creamBase} />
          <Image
            source={CREAM_LEATHER}
            style={[styles.leatherTexture, { opacity: OB_LEATHER_TEXTURE_OPACITY }]}
            resizeMode="cover"
          />
          <View style={styles.content}>
            <Text style={styles.title}>{config.title}</Text>
            <Text style={styles.message}>{config.message}</Text>
            <View style={styles.buttonStack}>
              {buttons.map((button, index) => {
                const isPrimary = button.style === "primary" || button.style === "default";
                const isCancel = button.style === "cancel";
                return (
                  <TouchableOpacity
                    key={`${button.text}-${index}`}
                    style={[
                      styles.button,
                      isPrimary && styles.buttonPrimary,
                      isCancel && styles.buttonCancel,
                    ]}
                    onPress={() => handlePress(button)}
                    activeOpacity={0.85}
                  >
                    <Text
                      style={[
                        styles.buttonText,
                        isPrimary && styles.buttonTextPrimary,
                        isCancel && styles.buttonTextCancel,
                      ]}
                    >
                      {button.text}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.78)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 28,
  },
  card: {
    width: "100%",
    maxWidth: 340,
    borderRadius: 12,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(212,175,55,0.35)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 16,
    elevation: 12,
  },
  creamBase: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: OB_CREAM,
  },
  leatherTexture: {
    ...StyleSheet.absoluteFillObject,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 22,
  },
  title: {
    fontFamily: "MBold",
    fontSize: 16,
    letterSpacing: 1.2,
    textTransform: "uppercase",
    color: "#1C1810",
    textAlign: "center",
    marginBottom: 12,
  },
  message: {
    fontFamily: "MRegular",
    fontSize: 13,
    lineHeight: 20,
    color: "#4A4438",
    textAlign: "center",
    marginBottom: 22,
  },
  buttonStack: {
    gap: 10,
  },
  button: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(28,24,16,0.15)",
    backgroundColor: "rgba(28,24,16,0.04)",
  },
  buttonPrimary: {
    backgroundColor: "#222",
    borderColor: OB_GOLD,
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: "MBold",
    fontSize: 12,
    letterSpacing: 1,
    textTransform: "uppercase",
    color: "#4A4438",
  },
  buttonTextPrimary: {
    color: OB_GOLD,
  },
  buttonCancel: {
    backgroundColor: "transparent",
    borderColor: "transparent",
  },
  buttonTextCancel: {
    color: "#7A7368",
    fontSize: 11,
  },
});
