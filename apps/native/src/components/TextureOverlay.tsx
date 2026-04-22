import React from "react";
import { StyleSheet, View, Image } from "react-native";

interface TextureOverlayProps {
  children: React.ReactNode;
}

/**
 * Foundational component of THE OB Texture System.
 * Layered on top of the entire app at 15% opacity to provide a premium matte feel.
 */
const TextureOverlay: React.FC<TextureOverlayProps> = ({ children }) => {
  return (
    <View style={styles.container}>
      {/* APP CONTENT */}
      {children}

      {/* TEXTURE LAYER (Absolute Fill) */}
      <View style={[styles.overlay, { opacity: 0.15 }]} pointerEvents="none">
        <Image
          source={require("../../assets/images/noise_grain.png")}
          style={styles.imageTexture}
          resizeMode="repeat"
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
  },
  imageTexture: {
    width: "100%",
    height: "100%",
  },
});

export default TextureOverlay;
