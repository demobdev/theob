import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  ImageBackground,
  Animated,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";
import BottomNavBar from "../components/BottomNavBar";
import PreferencesModal from "../components/PreferencesModal";
import { useCart } from "../context/CartContext";
import { useOrder } from "../context/OrderContext";
import { useEffect, useRef } from "react";

const { width } = Dimensions.get("window");

const getImageSource = (imgStr) => {
  switch (imgStr) {
    case "boneless_wings": return require("../../assets/images/menu/boneless_wings.png");
    case "cheese_pizza": return require("../../assets/images/menu/cheese_pizza.png");
    case "queso_chorizo": return require("../../assets/images/menu/queso_chorizo.png");
    case "spicy_bang_bang": return require("../../assets/images/menu/spicy_bang_bang.png");
    case "crispy_calamari": return require("../../assets/images/menu/crispy_calamari.png");
    case "chopped_salad": return require("../../assets/images/menu/chopped_salad.png");
    case "goat_cheese_salad": return require("../../assets/images/menu/goat_cheese_salad.png");
    case "chicago_dog": return require("../../assets/images/menu/chicago_dog.png");
    case "crabcake_sandwich": return require("../../assets/images/menu/crabcake_sandwich.png");
    case "cauliflower_wings": return require("../../assets/images/menu/cauliflower_wings.png");
    case "crab_dip": return require("../../assets/images/menu/crab_dip.png");
    case "fried_shrimp": return require("../../assets/images/menu/fried_shrimp.png");
    case "bar_chicken": return require("../../assets/images/menu/bar_chicken.png");
    case "philly": return require("../../assets/images/menu/philly.png");
    case "rib_eye": return require("../../assets/images/menu/rib_eye.png");
    case "coho_salmon": return require("../../assets/images/menu/coho_salmon.png");
    case "picanha_steak": return require("../../assets/images/menu/picanha_steak.png");
    case "ny_strip": return require("../../assets/images/menu/ny_strip.png");
    case "short_rib_hash": return require("../../assets/images/menu/short_rib_hash.png");
    case "neapolitan_pizza": return require("../../assets/images/menu/neapolitan_pizza.png");
    case "caesar_salad": return require("../../assets/images/menu/caesar_salad.png");
    case "jumbo_wings": return require("../../assets/images/menu/jumbo_wings.png");
    case "meat_lover_pizza": return require("../../assets/images/menu/meat_lover_pizza.png");
    case "short_rib_nachos": return require("../../assets/images/menu/short_rib_nachos.png");
    case "steak_and_eggs": return require("../../assets/images/menu/steak_and_eggs.png");
    case "chicken_waffles": return require("../../assets/images/menu/chicken_waffles.png");

    // DRINKS
    case "beer": return require("../../assets/images/menu/cheese_pizza.png"); // Placeholder
    case "soda": return require("../../assets/images/menu/crab_dip.png"); // Placeholder
    case "cocktail": return require("../../assets/images/menu/philly.png"); // Placeholder
    
    // NEW MAPPINGS
    case "supreme_pizza": return require("../../assets/images/menu/supreme_pizza.png");
    case "ham_pineapple": return require("../../assets/images/menu/ham_pineapple.png");
    case "chicken_alfredo_pizza": return require("../../assets/images/menu/chicken_alfredo_pizza.png");
    case "egg_breakfast": return require("../../assets/images/menu/egg_breakfast.png");
    case "pancakes": return require("../../assets/images/menu/pancakes.png");
    case "breakfast_skillet": return require("../../assets/images/menu/breakfast_skillet.png");

    case "pizza": return require("../../assets/images/menu/meat_lover_pizza.png");
    case "wings": return require("../../assets/images/menu/jumbo_wings.png");
    case "salads": return require("../../assets/images/menu/chopped_salad.png");
    case "sides": return require("../../assets/images/menu/crab_dip.png");
    default: return require("../../assets/images/menu/cheese_pizza.png");
  }
};

const ProductCard = ({ item, navigation, addToCart }) => {
    const [added, setAdded] = useState(false);

    const handleAdd = () => {
      addToCart({ id: item._id, name: item.name, price: item.price, image: item.image });
      setAdded(true);
      setTimeout(() => setAdded(false), 2000);
    };

    return (
        <TouchableOpacity 
            style={styles.productCard} 
            onPress={() => navigation.navigate("ProductDetailScreen", { product: item })}
        >
        <Image source={item.image ? getImageSource(item.image) : null} style={styles.productImage} />
        <View style={styles.productDetails}>
            <Text style={styles.productName}>{item.name.toUpperCase()}</Text>
            <Text style={styles.productDesc} numberOfLines={2}>{item.description}</Text>
            <View style={styles.productFooter}>
            <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            <TouchableOpacity 
                style={[styles.addBtn, added && { backgroundColor: '#22c55e' }]} 
                onPress={handleAdd}
            >
                <Text style={styles.addBtnText}>{added ? "ADDED ✓" : "ADD +"}</Text>
            </TouchableOpacity>
            </View>
        </View>
        </TouchableOpacity>
    );
};

const HomeScreen = ({ navigation }) => {
  const { addToCart, totalItems } = useCart();
  const { fulfillmentMethod, locationName } = useOrder();
  const [activeCategory, setActiveCategory] = useState(null);
  const [preferencesVisible, setPreferencesVisible] = useState(false);

  // Animation for the header arrows
  const rotation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(rotation, {
      toValue: preferencesVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [preferencesVisible]);

  const spin = rotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"]
  });

  const getFulfillmentDisplayLabel = () => {
    switch (fulfillmentMethod) {
      case "pickup_instore": return "In-Store Pickup";
      case "pickup_curbside": return "Curbside Pickup";
      case "delivery_partner": return "Delivery Service";
      default: return "In-Store Pickup";
    }
  };

  const categories = useQuery(api.products.getCategories) || [];
  const allProducts = useQuery(api.products.getAllProducts);
  
  const filteredProducts = useQuery(
    api.products.getProductsByCategory,
    activeCategory ? { categoryId: activeCategory } : "skip"
  );
  const products = activeCategory ? filteredProducts : allProducts;

  const { shopNotice } = useOrder();
  const [bannerHidden, setBannerHidden] = useState(false);

  const renderProductCard = ({ item }) => (
      <ProductCard item={item} navigation={navigation} addToCart={addToCart} />
  );

  const getDynamicBanner = () => {
    // 1. Check for shop notice first
    if (shopNotice && shopNotice !== "") {
      const parts = shopNotice.split(/(@\w+)/g);
      return (
        <Text style={styles.goldBannerText}>
          {parts.map((part, index) => {
            if (part && part.startsWith("@")) {
              return <Text key={index} style={styles.underlineVariable}>{part.substring(1)}</Text>;
            }
            return part || "";
          })}
        </Text>
      );
    }

    // 2. Fallback to fulfillment
    return (
      <Text style={styles.goldBannerText}>
        Ready for <Text style={styles.underlineVariable}>{getFulfillmentDisplayLabel()}</Text>? Order now!
      </Text>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" translucent={true} />
      
      {/* FLOATING TRANSPARENT HEADER */}
      <View style={styles.floatingHeader}>
          <TouchableOpacity style={styles.logoShortcut} onPress={() => navigation.navigate("LandingScreen")}>
              <Image source={require("../../assets/images/b-logo.png")} style={styles.headerBLogo} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.locationContainer} onPress={() => setPreferencesVisible(true)}>
              <View style={styles.selectorRow}>
                  <Text style={styles.selectorMainText}>{getFulfillmentDisplayLabel()}</Text>
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="chevron-down" size={18} color="#fff" />
                  </Animated.View>
              </View>
              <View style={styles.selectorSubRow}>
                  <Text style={styles.selectorSubText}>{locationName || "Greenville (1 mi)"}</Text>
                  <Animated.View style={{ transform: [{ rotate: spin }] }}>
                    <Ionicons name="chevron-down" size={14} color="#FFA500" />
                  </Animated.View>
              </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cartBtn} onPress={() => navigation.navigate("CartScreen")}>
              <Ionicons name="cart" size={32} color="#FFA500" />
              {totalItems > 0 && (
                  <View style={styles.cartBadge}><Text style={styles.cartBadgeText}>{totalItems}</Text></View>
              )}
          </TouchableOpacity>
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 100 }} 
        bounces={true}
        scrollEventThrottle={16}
      >
        {/* PARALLAX FOOD HERO */}
        <View style={styles.heroContainer}>
            <ImageBackground 
                source={require("../../assets/images/menu/meat_lover_pizza.png")} 
                style={styles.heroImage}
                resizeMode="cover"
            >
                <LinearGradient 
                    colors={['rgba(15,15,17,0.3)', 'rgba(15,15,17,0.6)', '#0F0F11']} 
                    style={StyleSheet.absoluteFill}
                />
                <View style={styles.heroContent}>
                    <Text style={styles.heroTag}>THE OWNER'S FAVORITES</Text>
                    <Text style={styles.heroTitle}>CRAFT PIZZA & WINGS</Text>
                    <Text style={styles.heroSub}>STADIUM STANDARDS. REIMAGINED.</Text>
                </View>
            </ImageBackground>
        </View>
        {/* GOLD STATUS BANNER - FLOATING AT TOP OF FEED */}
        {!bannerHidden && (
          <View style={styles.goldBanner}>
              {getDynamicBanner()}
              <TouchableOpacity onPress={() => setBannerHidden(true)}><Ionicons name="close" size={20} color="#000" /></TouchableOpacity>
          </View>
        )}

        {/* CATEGORIES SCROLLER */}
        <View style={styles.categoryWrap}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryScroll}>
            {categories.map(cat => (
              <TouchableOpacity 
                key={cat._id} 
                style={[styles.catTab, activeCategory === cat._id && styles.activeCatTab]}
                onPress={() => setActiveCategory(cat._id === activeCategory ? null : cat._id)}
              >
                <Text style={[styles.catTabText, activeCategory === cat._id && styles.activeCatTabText]}>
                    {cat.name.toUpperCase()}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* PRODUCT FEED */}
        <View style={styles.productWrap}>
            <FlatList
                data={products}
                renderItem={renderProductCard}
                keyExtractor={item => item._id}
                scrollEnabled={false}
                contentContainerStyle={styles.gridContainer}
            />
        </View>
      </ScrollView>

      <PreferencesModal visible={preferencesVisible} onClose={() => setPreferencesVisible(false)} />
      <BottomNavBar activeTab="ORDER" navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  floatingHeader: {
    position: "absolute",
    top: 40,
    left: 20,
    right: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    zIndex: 1000,
    backgroundColor: "transparent",
  },
  logoShortcut: {
    width: 60,
    height: 55,
    justifyContent: "center",
  },
  headerBLogo: {
    width: 48,
    height: 48,
    resizeMode: "contain",
  },
  locationContainer: {
    flex: 1,
    alignItems: "center",
  },
  selectorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  selectorSubRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 1,
  },
  selectorMainText: {
    color: "#fff",
    fontSize: RFValue(15),
    fontFamily: "MBold",
  },
  selectorSubText: {
    color: "#FFA500",
    fontSize: RFValue(11),
    fontFamily: "MRegular",
  },
  cartBtn: {
    width: 60,
    height: 55,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  cartBadge: {
    position: "absolute",
    top: 5,
    right: 0,
    backgroundColor: "#FFA500",
    width: 17,
    height: 17,
    borderRadius: 8.5,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "#000",
    fontSize: 9,
    fontFamily: "MBold",
  },
  heroContainer: {
    width: width,
    height: 400,
  },
  heroImage: {
    width: width,
    height: '100%',
    justifyContent: 'flex-end',
    paddingBottom: 40,
    paddingHorizontal: 25,
  },
  heroContent: {
    zIndex: 10,
  },
  heroTag: {
    color: "#FFA500",
    fontFamily: "MBold",
    fontSize: 10,
    letterSpacing: 2,
  },
  heroTitle: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: RFValue(32),
    marginTop: 5,
  },
  heroSub: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: 11,
    marginTop: 5,
  },
  goldBanner: {
    backgroundColor: "#FFA500",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 20,
    marginHorizontal: 15,
    borderRadius: 12,
    marginTop: -20, // OVERLAP THE HERO GRADIENT
    zIndex: 20,
  },
  goldBannerText: {
    color: "#000",
    fontSize: 12,
    fontFamily: "MRegular",
    flex: 1,
  },
  boldText: {
    fontFamily: "MBold",
  },
  underlineVariable: {
    fontFamily: "MBold",
    textDecorationLine: "underline",
  },
  categoryWrap: {
    marginTop: 25,
    marginBottom: 15,
  },
  categoryScroll: {
    paddingHorizontal: 15,
    gap: 12,
  },
  catTab: {
    backgroundColor: "#1C1C1E",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#333",
  },
  activeCatTab: {
    backgroundColor: "#FFA500",
    borderColor: "#FFA500",
  },
  catTabText: {
    color: "#888",
    fontFamily: "MBold",
    fontSize: 11,
  },
  activeCatTabText: {
    color: "#000",
  },
  productWrap: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  gridContainer: {
    paddingBottom: 20,
  },
  productCard: {
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
    flexDirection: "row",
    height: 120,
    marginBottom: 15,
  },
  productImage: {
    width: 120,
    height: 120,
  },
  productDetails: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  productName: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 14,
  },
  productDesc: {
    color: "#888",
    fontFamily: "MRegular",
    fontSize: 11,
    lineHeight: 16,
  },
  productFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    color: "#fff",
    fontFamily: "MBold",
    fontSize: 15,
  },
  addBtn: {
    backgroundColor: "#FFA500",
    paddingHorizontal: 15,
    paddingVertical: 6,
    borderRadius: 15,
  },
  addBtnText: {
    color: "#000",
    fontFamily: "MBold",
    fontSize: 9,
  },
});

export default HomeScreen;
