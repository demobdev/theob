import React, { useState, useRef } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  ImageBackground,
  TouchableOpacity,
  Dimensions,
  SafeAreaView,
  StatusBar,
  Switch
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Video, ResizeMode } from "expo-av";

const { width, height } = Dimensions.get("window");

const OnboardingScreen = ({ navigation }) => {
  const [activeSlide, setActiveSlide] = useState(0);
  const [dontShowAgain, setDontShowAgain] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const slides = [
    {
      id: 1,
      type: "hero",
      title: "SCORE.\nSAVOR.\nREPEAT.",
      subtitle: "JOIN THE ROSTER",
      description: "Earn points on every order. Stack them to earn rewards, starting with a FREE order of our signature OWNER'S WINGS after your first purchase.",
      image: require("../../assets/images/menu/jumbo_wings.png"),
      color: "#D4AF37",
      isMacro: true
    },
    {
      id: 2,
      type: "feature",
      title: "KEEP POINTS\nSCORING!",
      subtitle: "REWARDS IN EVERY ROUND",
      description: "Earn points with every purchase at The Owner's Box. Whether it's wings, pizza, or a cold one, every round gets you closer to your next reward.",
      icon: "card-outline",
      infoTitle: "LINK YOUR CARD",
      infoText: "Just use the same credit card on every visit and your points will stack up automatically.",
      cta: "Enable Notifications",
      footerText: "BE THE FIRST TO KNOW\nGet game-day deals, secret menu items and special surprises.",
      image: require("../../assets/images/ob-collage.png"),
      color: "#D4AF37",
      overlayOpacity: 0.95
    },
    {
      id: 3,
      type: "video",
      title: "WHERE THE\nGAME LIVES",
      subtitle: "SPORTS & SPIRITS",
      description: "Every game, every seat, every night on our massive wall of screens. Immerse yourself in the ultimate sports atmosphere.",
      items: [
        "Massive HD screen walls for every game",
        "Member happy hours & secret menu items",
        "FREE Beer & Pizza on your birthday"
      ],
      video: require("../../assets/videos/homerun-hero.mp4"),
      color: "#D4AF37",
      overlayOpacity: 0.5,
      videoTranslateX: -250 // Aggressive shift left to show the hitter
    }
  ];

  const handleFinish = async () => {
    if (dontShowAgain) {
      await AsyncStorage.setItem("hasSeenOnboarding", "true");
    }
    navigation.navigate("LoginScreen");
  };

  const nextSlide = () => {
    if (activeSlide < slides.length - 1) {
      scrollRef.current?.scrollTo({ x: (activeSlide + 1) * width, animated: true });
      setActiveSlide(activeSlide + 1);
    } else {
      handleFinish();
    }
  };

  const skip = () => {
    handleFinish();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
        bounces={false}
      >
        {slides.map((slide, index) => (
          <View key={slide.id} style={styles.slide}>
            {/* Background Layer */}
            {slide.type === "video" ? (
              <View style={styles.background}>
                <Video
                  source={slide.video}
                  style={{ 
                    position: "absolute",
                    width: width * 2.5, 
                    height: height,
                    transform: [{ translateX: slide.videoTranslateX || 0 }] 
                  }}
                  resizeMode={ResizeMode.COVER}
                  shouldPlay={activeSlide === index}
                  isLooping
                  isMuted
                />
                <View style={[styles.overlay, { backgroundColor: `rgba(0,0,0,${slide.overlayOpacity || 0.4})` }]} />
              </View>
            ) : (
              <ImageBackground 
                source={slide.image} 
                style={styles.background}
                imageStyle={slide.isMacro ? { transform: [{ scale: 1.2 }], opacity: 0.9 } : { opacity: 0.9 }}
              >
                <View style={[styles.overlay, slide.overlayOpacity ? { backgroundColor: `rgba(0,0,0,${slide.overlayOpacity})` } : null]} />
              </ImageBackground>
            )}

            {/* Content Layer (Always on top) */}
            <View style={StyleSheet.absoluteFill}>
              <SafeAreaView style={styles.content}>
                {/* Top Bar */}
                <View style={styles.header}>
                  <TouchableOpacity style={styles.skipBtn} onPress={skip}>
                    <Ionicons name="close" size={28} color="#FFF" />
                  </TouchableOpacity>
                  {activeSlide === slides.length - 1 && (
                    <View style={styles.toggleRow}>
                      <Text style={styles.toggleLabel}>Don't show again</Text>
                      <Switch 
                        value={dontShowAgain} 
                        onValueChange={setDontShowAgain}
                        trackColor={{ false: "#333", true: "#D4AF37" }}
                        thumbColor={dontShowAgain ? "#FFF" : "#888"}
                        ios_backgroundColor="#333"
                        style={{ transform: [{ scaleX: 0.7 }, { scaleY: 0.7 }] }}
                      />
                    </View>
                  )}
                </View>

                <View style={styles.mainContent}>
                  <View style={styles.textSection}>
                    <Text style={[styles.title, { color: slide.color }]}>{slide.title}</Text>

                    {slide.icon && (
                      <View style={styles.iconContainer}>
                        <Ionicons name={slide.icon as any} size={48} color={slide.color} />
                      </View>
                    )}
                    
                    {slide.subtitle && (
                      <Text style={styles.subtitle}>{slide.subtitle}</Text>
                    )}

                    {slide.description && (
                      <Text style={styles.description}>{slide.description}</Text>
                    )}

                    {slide.infoTitle && (
                      <View style={styles.infoBlock}>
                        <Text style={styles.infoTitle}>{slide.infoTitle}</Text>
                        <Text style={styles.infoText}>{slide.infoText}</Text>
                      </View>
                    )}

                    {slide.items && (
                      <View style={styles.itemsContainer}>
                        {slide.items.map((item, i) => (
                          <View key={i} style={styles.itemRow}>
                            <Ionicons name="star" size={18} color={slide.color} />
                            <Text style={styles.itemText}>{item}</Text>
                          </View>
                        ))}
                      </View>
                    )}

                    {slide.cta && (
                      <TouchableOpacity style={[styles.ctaBtn, slide.cta === "Enable Notifications" && styles.notifyBtn]}>
                        <Text style={[styles.ctaText, slide.cta === "Enable Notifications" && styles.notifyText]}>{slide.cta}</Text>
                      </TouchableOpacity>
                    )}

                    {slide.footerText && (
                      <Text style={styles.footerInfoText}>{slide.footerText}</Text>
                    )}

                    {/* Centered Continue/Next Button */}
                    <TouchableOpacity style={styles.mainActionBtn} onPress={nextSlide}>
                      <Text style={styles.mainActionText}>
                        {activeSlide === slides.length - 1 ? "CONTINUE" : "NEXT"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Centered Pagination Dots at Bottom with Arrows */}
                <View style={styles.paginationContainer}>
                  <TouchableOpacity 
                    style={[styles.navArrow, activeSlide === 0 && { opacity: 0 }]} 
                    onPress={() => {
                      if (activeSlide > 0) {
                        scrollRef.current?.scrollTo({ x: (activeSlide - 1) * width, animated: true });
                        setActiveSlide(activeSlide - 1);
                      }
                    }}
                    disabled={activeSlide === 0}
                  >
                    <Ionicons name="chevron-back" size={26} color="#FFF" />
                  </TouchableOpacity>

                  <View style={styles.dotsRow}>
                    {slides.map((_, i) => (
                      <View key={i} style={[styles.dot, activeSlide === i && styles.activeDot]} />
                    ))}
                  </View>

                  <TouchableOpacity 
                    style={[styles.navArrow, activeSlide === slides.length - 1 && { opacity: 0 }]} 
                    onPress={nextSlide}
                    disabled={activeSlide === slides.length - 1}
                  >
                    <Ionicons name="chevron-forward" size={26} color="#FFF" />
                  </TouchableOpacity>
                </View>
              </SafeAreaView>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
  },
  slide: {
    width: width,
    height: height,
    overflow: "hidden", // Prevent overlap visual
  },
  background: {
    flex: 1,
    width: width, // Ensure background is exactly width
    height: "100%",
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.7)",
  },
  content: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: "space-between",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 10,
  },
  skipBtn: {
    padding: 10,
  },
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  toggleLabel: {
    color: "#AAA",
    fontSize: 8,
    fontFamily: "MBold",
    marginRight: 6,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  mainContent: {
    flex: 1,
    justifyContent: "center",
  },
  navArrow: {
    padding: 10,
  },
  textSection: {
    paddingHorizontal: 10,
    alignItems: "center",
  },
  title: {
    fontSize: RFValue(36),
    fontFamily: "MBold",
    lineHeight: RFValue(42),
    letterSpacing: -1,
    marginBottom: 20,
    textTransform: "uppercase",
    textAlign: "center",
  },
  subtitle: {
    fontSize: RFValue(12),
    fontFamily: "MBold",
    color: "#FFF",
    letterSpacing: 2,
    marginBottom: 15,
    textTransform: "uppercase",
    textAlign: "center",
  },
  description: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#BBB",
    lineHeight: 22,
    textAlign: "center",
    maxWidth: "90%",
  },
  itemsContainer: {
    marginTop: 25,
    width: "100%",
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingHorizontal: 10,
  },
  itemText: {
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    color: "#DDD",
    marginLeft: 12,
    flex: 1,
    lineHeight: 18,
  },
  ctaBtn: {
    backgroundColor: "rgba(255,255,255,0.1)",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  ctaText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: 12,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  iconContainer: {
    marginBottom: 20,
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  infoBlock: {
    marginTop: 25,
    alignItems: "center",
  },
  infoTitle: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: 14,
    letterSpacing: 1.5,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  infoText: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: 11,
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  notifyBtn: {
    backgroundColor: "#222",
    borderColor: "#D4AF37",
    borderWidth: 1,
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 25,
    marginTop: 30,
  },
  notifyText: {
    color: "#D4AF37",
    fontSize: 12,
  },
  footerInfoText: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    textAlign: "center",
    marginTop: 30,
    letterSpacing: 1.2,
    lineHeight: 14,
    textTransform: "uppercase",
  },
  mainActionBtn: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderWidth: 1.5,
    borderColor: "#FFF",
    borderRadius: 4,
  },
  mainActionText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: 14,
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  dotsRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
    marginHorizontal: 5,
  },
  activeDot: {
    backgroundColor: "#FFF",
    width: 6,
  }
});

export default OnboardingScreen;
