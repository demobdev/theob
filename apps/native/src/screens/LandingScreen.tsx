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
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import PreferencesModal from "../components/PreferencesModal";
import BottomNavBar from "../components/BottomNavBar";
import { useCart } from "../context/CartContext";
import { useUser } from "@clerk/clerk-expo";
import QRCode from "react-native-qrcode-svg";

const { width } = Dimensions.get("window");

const RosterStatusCard = ({ profile, user, navigation }) => {
  const [memberQrVisible, setMemberQrVisible] = useState(false);
  if (!user) return null;

  const points = profile?.points || 0;
  const nextRewardPoints = 500;
  const progress = Math.min(points / nextRewardPoints, 1);
  const remaining = Math.max(nextRewardPoints - points, 0);

  // Secure member QR payload
  const userId = user?.id || "anonymous";
  const memberQrPayload = `OB-MEMBER|${userId}`;
  const memberDisplayCode = userId.substring(userId.length - 12);

  return (
    <>
    <ImageBackground 
      source={require("../../assets/images/leather_black.jpg")} 
      style={styles.rosterCard}
      imageStyle={styles.leatherOverlay}
    >
      <View style={styles.rosterHeader}>
        <View>
          <Text style={styles.rosterLabel}>YOUR MEMBER ROSTER</Text>
          <Text style={styles.rosterPoints}>{points.toLocaleString()} <Text style={styles.pointsSuffix}>PTS</Text></Text>
        </View>
        <TouchableOpacity style={styles.scanBtn} onPress={() => setMemberQrVisible(true)}>
          <Ionicons name="qr-code" size={20} color="#FFF" />
          <Text style={styles.scanBtnText}>SCAN</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBarBackground}>
          <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
        </View>
        <View style={styles.progressLabelRow}>
          <Text style={styles.progressText}>
            {remaining > 0 ? `${remaining} pts until next reward` : "Reward unlocked!"}
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate("RewardsScreen")}>
            <Text style={styles.viewRewardsText}>VIEW REWARDS</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ImageBackground>

    {/* MEMBER QR CODE MODAL */}
    <Modal visible={memberQrVisible} transparent animationType="fade">
      <View style={styles.memberQrOverlay}>
          <View style={styles.memberQrCard}>
              <QRCode
                value={memberQrPayload}
                size={width * 0.6}
                backgroundColor="#fff"
                color="#000"
                ecl="M"
              />
              <Text style={styles.memberQrCode}>{memberDisplayCode}</Text>
              <TouchableOpacity style={styles.memberQrClose} onPress={() => setMemberQrVisible(false)}>
                  <Text style={styles.memberQrCloseText}>Okay</Text>
              </TouchableOpacity>
          </View>
      </View>
    </Modal>
    </>
  );
};

const LandingScreen = ({ navigation }) => {
  const { totalItems } = useCart();
  const { user } = useUser();
  const [preferencesVisible, setPreferencesVisible] = useState(false);
  const [birthdayModalVisible, setBirthdayModalVisible] = useState(false);
  const [birthdayPoints, setBirthdayPoints] = useState(0);
  
  const checkBirthday = useMutation(api.loyalty.checkBirthdayReward);
  const profile = useQuery(api.loyalty.getUserProfile);
  
  // Read favorite teams from Clerk metadata
  const favoriteTeams = (user?.unsafeMetadata?.favoriteTeams as Record<string, string[]>) ?? {};
  const hasFavorites = Object.values(favoriteTeams).some((arr) => arr.length > 0);

  // Helper: does this game feature a favorite team?
  const isFavoriteGame = (game: any): boolean => {
    const sport = game.sport;
    const favs = favoriteTeams[sport] ?? [];
    if (favs.length === 0) return false;
    return (
      favs.includes(game.homeTeam?.abbr) ||
      favs.includes(game.awayTeam?.abbr)
    );
  };

  // Sports Logic — show today's games (live, final, upcoming)
  const todayGames = useQuery(api.sports_queries.getTodayGames) || [];
  const liveGames = todayGames.filter(g => g.status === "inprogress");
  // Sort: favorite team games bubble to front; take up to 10
  const gamesToDisplay = [...todayGames]
    .sort((a, b) => {
      const aFav = isFavoriteGame(a) ? 1 : 0;
      const bFav = isFavoriteGame(b) ? 1 : 0;
      return bFav - aFav;
    })
    .slice(0, 10);

  const categories = useQuery(api.products.getCategories) || [];

  // Carousel Logic
  const [activeSlide, setActiveSlide] = useState(0);
  const scrollRef = useRef<ScrollView>(null);
  
  // 3 distinct slide types:
  // 0 = Food hero (minimal pill label + Order Now)
  // 1 = Pure cinematic (no text, just atmosphere)
  // 2 = Branding slate (dark overlay + Join The Roster)
  const carouselItems = [
    { type: "food", label: "LOCAL FAVORITE", image: require("../../assets/images/menu/jumbo_wings.png") },
    { type: "cinematic", label: "", image: require("../../assets/images/menu/meat_lover_pizza.png") },
    { type: "brand", label: "", image: require("../../assets/images/hero.png") },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      const nextSlide = (activeSlide + 1) % carouselItems.length;
      setActiveSlide(nextSlide);
      scrollRef.current?.scrollTo({ x: nextSlide * width, animated: true });
    }, 5000);
    return () => clearInterval(timer);
  }, [activeSlide]);

  // Birthday check effect
  useEffect(() => {
    if (user) {
      const runCheck = async () => {
        try {
          const result = await checkBirthday();
          if (result.success && result.pointsAwarded) {
            setBirthdayPoints(result.pointsAwarded);
            setBirthdayModalVisible(true);
          }
        } catch (err) {
          console.error("Birthday check failed", err);
        }
      };
      runCheck();
    }
  }, [user]);

  const getCategoryImage = (categoryName) => {
    switch (categoryName?.toLowerCase()) {
      case "appetizers": return require("../../assets/images/menu/crispy_calamari.png");
      case "salads": return require("../../assets/images/menu/chopped_salad.png");
      case "sandwiches": return require("../../assets/images/menu/crabcake_sandwich.png");
      case "entrées": return require("../../assets/images/menu/coho_salmon.png");
      case "pizza": return require("../../assets/images/menu/meat_lover_pizza.png");
      case "brunch": return require("../../assets/images/menu/chicken_waffles.png");
      default: return require("../../assets/images/menu/jumbo_wings.png");
    }
  };

  const renderLiveGame = (game) => {
    const isLive = game.status === "inprogress";
    const isFav = isFavoriteGame(game);
    return (
      <TouchableOpacity 
          key={game._id} 
          style={[styles.statsCard, isFav && styles.statsCardFav]}
          onPress={() => navigation.navigate("LiveGamesScreen")}
      >
        <View style={styles.statsCardTop}>
          <Text style={styles.statsLeague}>{game.sport}</Text>
          {isFav && (
            <View style={styles.favBadge}>
              <Text style={styles.favBadgeText}>★ YOUR TEAM</Text>
            </View>
          )}
        </View>
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
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerFlexWrapper}>
        <View style={styles.floatingHeader}>
          <TouchableOpacity style={styles.logoShortcut} onPress={() => navigation.navigate("LandingScreen")}>
            <Image source={require("../../assets/images/b-logo.png")} style={styles.floatingBLogo} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartIconContainer} onPress={() => navigation.navigate("CartScreen")}>
            <Ionicons name="cart" size={32} color="#FFA500" />
            {totalItems > 0 && (
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{totalItems}</Text>
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
            scrollEnabled={true}
            onMomentumScrollEnd={(e) => setActiveSlide(Math.round(e.nativeEvent.contentOffset.x / width))}
          >
            {carouselItems.map((item, index) => {
              // SLIDE TYPE: Food — big bold text matching mockup
              if (item.type === "food") {
                return (
                  <ImageBackground 
                    key={index} 
                    source={item.image} 
                    style={styles.heroBackground}
                  >
                    <View style={styles.heroOverlay}>
                      <View style={styles.heroTextContainer}>
                        <View style={styles.foodEstRow}>
                          <View style={styles.foodEstLine} />
                          <Text style={styles.foodEstText}>LOCAL FAVORITE</Text>
                        </View>
                        <View style={{ transform: [{ skewX: '-10deg' }], marginLeft: 5, marginBottom: 15, paddingTop: 10 }}>
                          <Text style={styles.foodHugeText}>
                            BEST WINGS{"\n"}IN THE{"\n"}UPSTATE
                          </Text>
                        </View>
                        <Text style={styles.heroSubtitle}>
                          Crispy, saucy, and game-day ready. The legend of the stadium, served right at your table.
                        </Text>
                        <TouchableOpacity 
                          style={[styles.pizzaScheduleBtn, { backgroundColor: "#E31837" }]}
                          onPress={() => navigation.navigate("HomeScreen")}
                        >
                          <Text style={[styles.pizzaScheduleBtnText, { color: "#FFF" }]}>ORDER NOW</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                );
              }

              // SLIDE TYPE: Cinematic — Pizza & Sports Custom Layout
              if (item.type === "cinematic") {
                return (
                  <ImageBackground 
                    key={index} 
                    source={item.image} 
                    style={styles.heroBackground}
                  >
                    <View style={styles.heroPizzaOverlay}>
                      <View style={styles.pizzaTextContainer}>
                          <Text style={styles.pizzaEstText}>EST. 2026</Text>
                          <View style={{ transform: [{ skewX: '-10deg' }], marginLeft: 5, marginBottom: 15, paddingTop: 30 }}>
                            <Text style={styles.pizzaHugeText}>PIZZA &{"\n"}SPORTS</Text>
                          </View>
                          <Text style={styles.pizzaSubText}>Every game. Every seat. Every night.</Text>
                          
                          <TouchableOpacity 
                            style={styles.pizzaScheduleBtn}
                            onPress={() => navigation.navigate("LiveGamesScreen")}
                          >
                            <Text style={styles.pizzaScheduleBtnText}>VIEW SCHEDULE</Text>
                          </TouchableOpacity>
                      </View>
                    </View>
                  </ImageBackground>
                );
              }

              // SLIDE TYPE: Brand — dark overlay, THE OB identity + Join CTA
              return (
                <ImageBackground 
                  key={index} 
                  source={item.image} 
                  style={styles.heroBackground}
                >
                  <View style={styles.heroBrandOverlay}>
                    <View style={styles.brandSlateContent}>
                      <View style={styles.brandDividerLine} />
                      <Text style={styles.brandSlateEst}>EST. 2026</Text>
                      <Text style={styles.brandSlateName}>THE OWNER'S BOX</Text>
                      <Text style={styles.brandSlateLocation}>GREENVILLE, SOUTH CAROLINA</Text>
                      <View style={styles.brandDividerLine} />
                      <Text style={styles.brandSlateTagline}>Where The Game Lives</Text>
                      <TouchableOpacity
                        style={styles.joinRosterBtn}
                        onPress={() => navigation.navigate(user ? "AccountScreen" : "LoginScreen")}
                      >
                        <Text style={styles.joinRosterBtnText}>{user ? "MY ACCOUNT" : "JOIN THE ROSTER"}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </ImageBackground>
              );
            })}
          </ScrollView>

          {/* GLOBAL CAROUSEL PAGINATION ALONG THE BOTTOM */}
          <View pointerEvents="none" style={styles.carouselDots}>
            {carouselItems.map((_, i) => (
              <View key={i} style={[styles.dot, activeSlide === i && styles.activeDot]} />
            ))}
          </View>
        </View>

        {/* ROSTER STATUS CARD */}
        <RosterStatusCard profile={profile} user={user} navigation={navigation} />

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
            <View style={styles.cateringCard}>
                <View style={styles.cateringOverlay}>
                    <View style={styles.cateringContent}>
                        <Text style={styles.cateringTitle}>CATERING</Text>
                        <Text style={styles.cateringSubtitle}>CRAFTED FOR YOUR TEAM</Text>
                        <TouchableOpacity style={styles.cateringBtn}><Text style={styles.cateringBtnText}>LEARN MORE</Text></TouchableOpacity>
                    </View>
                    <Image source={require("../../assets/images/menu/philly.png")} style={styles.cateringInsetImg} />
                </View>
            </View>
        </View>

        {/* BOTTOM CATEGORIES */}
        <View style={styles.sectionBottom}>
          <Text style={styles.sectionTitle}>CATEGORIES</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoriesScroll}>
            {categories.map(cat => (
              <TouchableOpacity key={cat._id} style={styles.categoryCard} onPress={() => navigation.navigate("HomeScreen")}>
                <Image source={getCategoryImage(cat.name)} style={styles.categoryCardImage} />
                <View style={styles.categoryCardOverlay} />
                <Text style={styles.categoryCardName}>{cat.name.toUpperCase()}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PREFERENCES MODAL */}
        <PreferencesModal 
          visible={preferencesVisible} 
          onClose={() => setPreferencesVisible(false)} 
        />

        {/* BIRTHDAY CELEBRATION MODAL */}
        <Modal
          visible={birthdayModalVisible}
          transparent={true}
          animationType="fade"
        >
          <View style={styles.birthdayOverlay}>
            <View style={styles.birthdayCard}>
              <View style={styles.skewedGoldHeader}>
                <Text style={styles.celebrationText}>CELEBRATION</Text>
              </View>
              <Ionicons name="gift" size={60} color="#FFA500" style={{ marginVertical: 20 }} />
              <Text style={styles.birthdayTitle}>HAPPY BIRTHDAY!</Text>
              <Text style={styles.birthdaySubtitle}>
                As a gift from THE OWNER'S BOX, we've added
              </Text>
              <View style={styles.pointsBadge}>
                <Text style={styles.pointsCount}>{birthdayPoints} POINTS</Text>
              </View>
              <Text style={styles.birthdayNote}>
                to your account. Enjoy a drink or appetizer on us!
              </Text>
              <TouchableOpacity 
                style={styles.closeBirthdayBtn}
                onPress={() => setBirthdayModalVisible(false)}
              >
                <Text style={styles.closeBirthdayBtnText}>AWESOME!</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
  rosterCard: {
    margin: 20,
    marginTop: 10,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)", // Inner glow
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
    backgroundColor: "#161618",
    overflow: "hidden",
  },
  leatherOverlay: {
    opacity: 0.3,
    resizeMode: "cover",
  },
  rosterHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  rosterLabel: {
    fontSize: 10,
    fontFamily: "MBold",
    color: "#888",
    letterSpacing: 1,
    marginBottom: 4,
  },
  rosterPoints: {
    fontSize: RFValue(28),
    fontFamily: "MBold",
    color: "#FFF",
  },
  pointsSuffix: {
    fontSize: RFValue(14),
    color: "#FFA500",
  },
  scanBtn: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#E31837",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 20,
  },
  scanBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: 12,
    marginLeft: 6,
  },
  progressContainer: {
    marginTop: 5,
  },
  progressBarBackground: {
    width: "100%",
    height: 8,
    backgroundColor: "#333",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#FFA500",
    borderRadius: 4,
  },
  progressLabelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  progressText: {
    fontSize: 12,
    fontFamily: "MRegular",
    color: "#AAA",
  },
  viewRewardsText: {
    fontSize: 12,
    fontFamily: "MBold",
    color: "#FFA500",
  },
  heroBackground: {
    width: width,
    height: 600,
    justifyContent: "flex-end",
  },
  heroOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30,
    paddingHorizontal: 20,
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  heroTextContainer: {
    marginBottom: 40,
  },
  foodEstRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  foodEstLine: {
    width: 24,
    height: 2,
    backgroundColor: "#FFA500",
    marginRight: 10,
  },
  foodEstText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(11),
    letterSpacing: 3,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  foodHugeText: {
    color: "#FFF",
    fontSize: RFValue(42),
    fontFamily: "MBold",
    lineHeight: 52,
    letterSpacing: -1,
    paddingTop: 20,
    paddingRight: 25, // Prevents skew cutoff
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  heroSubtitle: {
    color: "#DDD",
    fontSize: RFValue(11),
    fontFamily: "MRegular",
    lineHeight: 18,
    marginBottom: 25,
    width: "85%",
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 5,
  },
  heroOrderBtn: {
    backgroundColor: "#E31837",
    paddingHorizontal: 28,
    paddingVertical: 14,
    borderRadius: 30,
    alignSelf: "flex-start",
  },
  heroOrderBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 2,
  },
  // --- Pizza & Sports Slide Styles ---
  heroPizzaOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  pizzaTextContainer: {
    paddingHorizontal: 25,
    marginBottom: 40,
  },
  pizzaEstText: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(11),
    letterSpacing: 3,
    marginBottom: 5,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  pizzaHugeText: {
    color: "#FFA500",
    fontSize: RFValue(42),
    fontFamily: "MBold",
    lineHeight: 52,
    letterSpacing: -1,
    paddingTop: 20,
    paddingRight: 25, // Prevents skew cutoff
    textShadowColor: "rgba(0,0,0,0.9)",
    textShadowOffset: { width: 0, height: 3 },
    textShadowRadius: 8,
  },
  pizzaSubText: {
    color: "#FFF",
    fontFamily: "MRegular",
    fontSize: RFValue(15),
    marginBottom: 35,
    textShadowColor: "rgba(0,0,0,0.8)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 5,
  },
  pizzaScheduleBtn: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 4, // More square like the mockup
    alignSelf: "flex-start",
  },
  pizzaScheduleBtnText: {
    color: "#0F0F11", // Dark black/grey
    fontFamily: "MBold",
    fontSize: RFValue(12),
    letterSpacing: 1.5,
  },
  // --- Cinematic Slide Styles (Backup) ---
  heroCinematicOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    paddingBottom: 30,
    alignItems: "center",
  },
  // Slide type: brand — strong dark overlay for text legibility
  heroBrandOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.75)",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 30,
    paddingTop: 120,
  },
  brandSlateContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 30,
  },
  brandDividerLine: {
    width: 60,
    height: 1,
    backgroundColor: "#E31837",
    marginVertical: 16,
  },
  brandSlateEst: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: RFValue(9),
    letterSpacing: 4,
  },
  brandSlateName: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(28),
    letterSpacing: 2,
    textAlign: "center",
    marginVertical: 8,
  },
  brandSlateLocation: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(11),
    letterSpacing: 3,
    textAlign: "center",
  },
  brandSlateTagline: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    letterSpacing: 1,
    marginTop: 4,
    fontStyle: "italic",
  },
  joinRosterBtn: {
    marginTop: 28,
    backgroundColor: "#FFA500",
    paddingHorizontal: 36,
    paddingVertical: 14,
    borderRadius: 12,
  },
  joinRosterBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 2,
  },
  carouselDots: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "rgba(255,255,255,0.3)",
  },
  activeDot: {
    backgroundColor: "#FFA500",
    width: 24,
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 35,
  },
  statsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginTop: 35,
    marginBottom: 18,
  },
  sectionTitle: {
    color: "#666",
    fontFamily: "MBold",
    fontSize: 9,
    letterSpacing: 2,
    marginRight: 8,
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
    width: 165,
    marginRight: 12,
    padding: 15,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  // Favorite team card — gold left border accent
  statsCardFav: {
    borderColor: "#FFA500",
    borderLeftWidth: 3,
  },
  statsCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  statsLeague: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 9,
  },
  favBadge: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  favBadgeText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 7,
    letterSpacing: 0.5,
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
  cateringCard: {
    height: 160,
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },
  cateringOverlay: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "rgba(0,0,0,0.4)",
    padding: 20,
    alignItems: "center",
    justifyContent: "space-between",
  },
  cateringContent: {
    flex: 1,
  },
  cateringInsetImg: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: "#FFA500",
  },
  cateringTitle: {
    color: "#FFA500",
    fontSize: RFValue(24),
    fontFamily: "MBold",
    letterSpacing: 2,
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
  // --- Birthday Modal Styles ---
  birthdayOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  birthdayCard: {
    backgroundColor: "#1C1C1E",
    width: "90%",
    borderRadius: 20,
    padding: 25,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#333",
  },
  skewedGoldHeader: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 20,
    paddingVertical: 5,
    transform: [{ skewX: "-10deg" }],
    marginBottom: 10,
  },
  celebrationText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 2,
  },
  birthdayTitle: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(20),
    textAlign: "center",
  },
  birthdaySubtitle: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: RFValue(12),
    textAlign: "center",
    marginTop: 10,
  },
  pointsBadge: {
    backgroundColor: "rgba(255,165,0,0.15)",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "rgba(255,165,0,0.3)",
    marginVertical: 15,
  },
  pointsCount: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: RFValue(18),
  },
  birthdayNote: {
    color: "#666",
    fontFamily: "MRegular",
    fontSize: RFValue(11),
    textAlign: "center",
    marginBottom: 25,
  },
  closeBirthdayBtn: {
    backgroundColor: "#E31837",
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
  },
  closeBirthdayBtnText: {
    color: "#FFF",
    fontFamily: "MBold",
    fontSize: RFValue(13),
    letterSpacing: 2,
  },
  // Member QR Modal
  memberQrOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.85)",
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  memberQrCard: {
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 24,
    padding: 40,
    alignItems: "center",
  },
  memberQrCode: {
    fontSize: 20,
    fontFamily: "MBold",
    color: "#333",
    letterSpacing: 1,
    marginTop: 25,
    marginBottom: 5,
  },
  memberQrClose: {
    backgroundColor: "#E31837",
    width: "100%",
    paddingVertical: 16,
    borderRadius: 12,
    marginTop: 30,
    alignItems: "center",
  },
  memberQrCloseText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
  },
});

export default LandingScreen;
