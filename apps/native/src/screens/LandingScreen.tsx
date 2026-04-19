import React, { useState, useEffect, useRef } from "react";
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
  Modal,
  Platform,
  StatusBar
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "convex/react";
import { api } from "@packages/backend/convex/_generated/api";
import PreferencesModal from "../components/PreferencesModal";
import BottomNavBar from "../components/BottomNavBar";
import { useCart } from "../context/CartContext";

const { width } = Dimensions.get("window");

const LandingScreen = ({ navigation }) => {
  const { cartCount } = useCart();
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  
  // Sports Logic
  const liveGames = useQuery(api.sports_queries.getLiveGames) || [];
  const upcomingGames = useQuery(api.sports_queries.getUpcomingGames, { limit: 10 }) || [];
  const gamesToDisplay = liveGames.length > 0 ? liveGames : upcomingGames;

  const categories = useQuery(api.products.getCategories) || [];

  // Carousel Logic
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  const carouselItems = [
    { title: "THE BOX", sub: "CRAFT SERIES", label: "SEASON 1", image: require("../../assets/images/menu/meat_lover_pizza.png") },
    { title: "GAME DAY", sub: "JUMBO WINGS", label: "LOCAL FAVORITE", image: require("../../assets/images/menu/jumbo_wings.png") },
    { title: "OFF THE", sub: "FRESH SALADS", label: "CRAFTED DAILY", image: require("../../assets/images/menu/chopped_salad.png") },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % carouselItems.length;
      setActiveSlide(nextSlide);
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  const getImageSource = (imgStr) => {
    switch (imgStr) {
      case "pizza": return require("../../assets/images/menu/meat_lover_pizza.png");
      case "wings": return require("../../assets/images/menu/jumbo_wings.png");
      case "salads": return require("../../assets/images/menu/chopped_salad.png");
      case "sides": return require("../../assets/images/menu/crab_dip.png");
      default: return require("../../assets/images/menu/cheese_pizza.png");
    }
  };

  const renderLiveGame = (game) => {
    const isLive = game.status === "inprogress";
    return (
      <TouchableOpacity 
          key={game._id} 
          style={styles.statsCard}
          onPress={() => navigation.navigate("LiveGamesScreen")}
      >
        <Text style={styles.statsLeague}>{game.sport}</Text>
        <View style={styles.statsTeams}>
          <View style={styles.teamLine}>
            <View style={styles.teamBrand}>
                {game.awayTeam?.logoUrl && <Image source={{ uri: game.awayTeam.logoUrl }} style={styles.teamLogoMini} />}
                <Text style={styles.teamNameText}>{game.awayTeam?.abbr}</Text>
            </View>
            <Text style={styles.scoreText}>{game.awayTeam?.score ?? "-"}</Text>
          </View>
          <View style={styles.teamLine}>
            <View style={styles.teamBrand}>
                {game.homeTeam?.logoUrl && <Image source={{ uri: game.homeTeam.logoUrl }} style={styles.teamLogoMini} />}
                <Text style={styles.teamNameText}>{game.homeTeam?.abbr}</Text>
            </View>
            <Text style={styles.scoreText}>{game.homeTeam?.score ?? "-"}</Text>
          </View>
        </View>
        
        <View style={styles.statusRow}>
            {isLive ? (
                <View style={styles.liveStatusBtn}>
                    <View style={styles.greenPulse} />
                    <Text style={styles.liveStatusText}>LIVE NOW</Text>
                </View>
            ) : game.status === "closed" ? (
                <View style={styles.finalStatusBtn}>
                    <Text style={styles.finalStatusText}>FINAL</Text>
                </View>
            ) : (
                <Text style={styles.startTimeText}>
                    {new Date(game.startsAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Text>
            )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" transparent={true} />
      
      <View style={styles.headerFlexWrapper}>
        <View style={styles.floatingHeader}>
          <TouchableOpacity style={styles.logoShortcut} onPress={() => navigation.navigate("LandingScreen")}>
            <Image source={require("../../assets/images/b-logo.png")} style={styles.floatingBLogo} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate("CartScreen")}>
            <Ionicons name="cart" size={32} color="#FFA500" />
            {cartCount > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false}
        bounces={false}
        scrollEventThrottle={16}
      >
        {/* FULL-BLEED HERO CAROUSEL */}
        <View style={styles.heroSection}>
          <ScrollView 
            ref={scrollRef} horizontal pagingEnabled 
            showsHorizontalScrollIndicator={false}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {carouselItems.map((item, index) => (
              <ImageBackground key={index} source={item.image} style={styles.heroBackground}>
                <View style={styles.heroOverlayContent}>
                    <Text style={styles.heroBrandText}>THE OWNER'S BOX</Text>
                    <Text style={styles.heroLocationText}>GREENVILLE, SC • EST 2026</Text>
                    
                    <View style={styles.topPromoBanner}>
                        <Text style={styles.promoLabel}>{item.label}</Text>
                        <Text style={styles.promoTitle}>{item.title}</Text>
                        <Text style={styles.promoSeries}>{item.sub}</Text>
                    </View>

                    <TouchableOpacity 
                        style={styles.floatingOrderBtn}
                        onPress={() => navigation.navigate("HomeScreen")}
                    >
                        <Text style={styles.floatingOrderBtnText}>Order Now</Text>
                    </TouchableOpacity>

                    <View style={styles.carouselDots}>
                        {carouselItems.map((_, i) => (
                          <View key={i} style={[styles.dot, activeSlide === i && styles.activeDot]} />
                        ))}
                    </View>
                </View>
              </ImageBackground>
            ))}
          </ScrollView>
        </View>

        {/* SPORTS TICKER - WITH LOGOS AND SCORES */}
        <View style={styles.section}>
          <View style={styles.statsHeaderRow}>
             <Text style={styles.sectionTitle}>{liveGames.length > 0 ? "LIVE NOW" : "UPCOMING GAMES"}</Text>
             {liveGames.length > 0 && <View style={styles.livePulse} />}
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
            {gamesToDisplay.map(game => renderLiveGame(game))}
          </ScrollView>
        </View>

        {/* CATERING BANNER */}
        <View style={styles.section}>
            <ImageBackground source={require("../../assets/images/menu/meat_lover_pizza.png")} style={styles.cateringImage} imageStyle={{ borderRadius: 15 }}>
                <View style={styles.cateringOverlay}>
                    <Text style={styles.cateringTitle}>CATERING</Text>
                    <Text style={styles.cateringSubtitle}>CRAFTED FOR YOUR TEAM</Text>
                    <TouchableOpacity style={styles.cateringBtn}><Text style={styles.cateringBtnText}>LEARN MORE</Text></TouchableOpacity>
                </View>
            </ImageBackground>
        </View>

        {/* BOTTOM CATEGORIES */}
        <View style={styles.sectionBottom}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map(cat => (
              <TouchableOpacity key={cat._id} style={styles.categoryCard} onPress={() => navigation.navigate("HomeScreen")}>
                <Image source={getImageSource(cat.slug || cat.image)} style={styles.categoryCardImage} />
                <View style={styles.categoryCardOverlay} />
                <Text style={styles.categoryCardName}>{cat.name.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={{ height: 120 }} />
      </ScrollView>

      <BottomNavBar activeTab="HOME" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  headerFlexWrapper: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 2000,
    backgroundColor: "transparent",
  },
  floatingHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
    paddingTop: Platform.OS === 'ios' ? 55 : 35,
    backgroundColor: "transparent",
  },
  logoShortcut: {
    width: 60,
    height: 60,
    justifyContent: "center",
  },
  floatingBLogo: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  cartIconContainer: {
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cartBadge: {
    position: "absolute",
    top: 5,
    right: 0,
    backgroundColor: "#FFA500", // BOX GOLD
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#000", // BLACK ON GOLD
    fontSize: 9,
    fontFamily: "MBold",
  },
  heroSection: {
    width: "100%",
  },
  heroBackground: {
    width: width,
    height: 600,
    justifyContent: "flex-end",
  },
  heroOverlayContent: {
    backgroundColor: "rgba(0,0,0,0.3)",
    width: "100%",
    paddingBottom: 40,
    alignItems: "center",
  },
  heroBrandText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(22),
    letterSpacing: 1,
  },
  heroLocationText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(10),
    letterSpacing: 2,
    marginTop: 5,
    marginBottom: 25,
  },
  topPromoBanner: {
    backgroundColor: "rgba(255, 165, 0, 0.95)",
    paddingVertical: 15,
    alignItems: "center",
    width: "100%",
  },
  promoLabel: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: RFValue(11),
    letterSpacing: 4,
  },
  promoTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(38),
    letterSpacing: 1,
  },
  promoSeries: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: RFValue(14),
    letterSpacing: 3,
  },
  floatingOrderBtn: {
    marginTop: 25,
    borderWidth: 2,
    borderColor: "#FFA500",
    paddingHorizontal: 50,
    paddingVertical: 12,
    borderRadius: 30,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  floatingOrderBtnText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(15),
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 25,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    backgroundColor: "#fff",
    width: 15,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 35,
  },
  statsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 15,
  },
  sectionTitle: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 2,
  },
  livePulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#E31837",
  },
  statsScroll: {
    gap: 12,
  },
  statsCard: {
    backgroundColor: "#1C1C1E",
    width: 155,
    marginRight: 12,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  statsLeague: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 9,
    marginBottom: 10,
  },
  statsTeams: {
    gap: 10,
  },
  teamLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  teamBrand: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  teamLogoMini: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  teamNameText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 15,
  },
  scoreText: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 16,
  },
  liveStatusBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  liveStatusText: {
    color: '#4ade80',
    fontFamily: 'MBold',
    fontSize: 9,
    letterSpacing: 1,
  },
  greenPulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#4ade80',
    marginRight: 6,
  },
  finalStatusBtn: {
    marginTop: 10,
  },
  finalStatusText: {
    color: '#888',
    fontFamily: 'MBold',
    fontSize: 9,
  },
  statusRow: {
    marginTop: 5,
  },
  startTimeText: {
    color: "#666",
    fontFamily: "MRegular",
    fontSize: 9,
    marginTop: 10,
  },
  cateringImage: {
    width: "100%",
    height: 180,
  },
  cateringOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 25,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 15,
  },
  cateringTitle: {
    color: "#fff",
    fontSize: RFValue(32),
    fontFamily: "MBold",
    fontStyle: 'italic',
  },
  cateringSubtitle: {
    color: "#FFA500",
    fontSize: RFValue(12),
    fontFamily: "MBold",
  },
  cateringBtn: {
    backgroundColor: "#FFA500", // NOW GOLD
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    marginTop: 15,
  },
  cateringBtnText: {
    color: "#000", // BLACK ON GOLD
    fontFamily: "MBold",
    fontSize: 9,
  },
  sectionBottom: {
    paddingHorizontal: 20,
    marginTop: 50,
  },
  categoriesScroll: {
    gap: 15,
    marginTop: 20,
  },
  categoryCard: {
    width: 140,
    height: 140,
    borderRadius: 15,
    overflow: "hidden",
  },
  categoryCardImage: {
    width: "100%",
    height: "100%",
  },
  categoryCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  categoryCardName: {
    position: "absolute",
    bottom: 12,
    width: "100%",
    textAlign: "center",
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(10),
  },
});

export default LandingScreen;
