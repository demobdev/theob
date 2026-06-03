import React, { useEffect, useRef, useState } from "react";
import { Animated, ImageBackground, StyleSheet, View } from "react-native";

/** Menu hero shots — first onboarding slide only */
export const HERO_MENU_IMAGES = [
  require("../../../assets/images/menu/jumbo_wings.png"),
  require("../../../assets/images/menu/spicy_bang_bang.png"),
  require("../../../assets/images/menu/supreme_pizza.png"),
  require("../../../assets/images/menu/rib_eye.png"),
  require("../../../assets/images/menu/chicken_waffles.png"),
  require("../../../assets/images/menu/neapolitan_pizza.png"),
] as const;

const CAROUSEL_INTERVAL_MS = 4500;
const TRANSITION_MS = 520;
const PUSH_OFFSET = 22;

type Props = {
  /** Auto-rotate only while the user is on onboarding slide 1 */
  active: boolean;
};

export default function HeroBackgroundCarousel({ active }: Props) {
  const [index, setIndex] = useState(0);
  const opacity = useRef(new Animated.Value(1)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const animatingRef = useRef(false);

  useEffect(() => {
    if (!active) {
      setIndex(0);
      opacity.setValue(1);
      translateX.setValue(0);
      animatingRef.current = false;
      return;
    }

    const advance = () => {
      if (animatingRef.current) return;
      animatingRef.current = true;

      Animated.parallel([
        Animated.timing(opacity, {
          toValue: 0,
          duration: TRANSITION_MS,
          useNativeDriver: true,
        }),
        Animated.timing(translateX, {
          toValue: -PUSH_OFFSET,
          duration: TRANSITION_MS,
          useNativeDriver: true,
        }),
      ]).start(({ finished }) => {
        if (!finished) {
          animatingRef.current = false;
          return;
        }

        setIndex((prev) => (prev + 1) % HERO_MENU_IMAGES.length);
        translateX.setValue(PUSH_OFFSET);

        Animated.parallel([
          Animated.timing(opacity, {
            toValue: 1,
            duration: TRANSITION_MS,
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: TRANSITION_MS,
            useNativeDriver: true,
          }),
        ]).start(() => {
          animatingRef.current = false;
        });
      });
    };

    const intervalId = setInterval(advance, CAROUSEL_INTERVAL_MS);
    return () => clearInterval(intervalId);
  }, [active, opacity, translateX]);

  return (
    <View style={styles.root}>
      <Animated.View
        style={[
          styles.imageWrap,
          { opacity, transform: [{ translateX }] },
        ]}
      >
        <ImageBackground
          source={HERO_MENU_IMAGES[index]}
          style={styles.image}
          imageStyle={styles.imageInner}
        />
      </Animated.View>
      <View style={styles.overlay} />
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#000",
  },
  imageWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  image: {
    flex: 1,
  },
  imageInner: {
    transform: [{ scale: 1.2 }],
    opacity: 0.9,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
});
