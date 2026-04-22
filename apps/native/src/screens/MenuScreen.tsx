import React from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useQuery } from "convex/react";
import { api } from "../../../../convex/_generated/api";

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

    // NEW MAPPINGS
    case "supreme_pizza": return require("../../assets/images/menu/supreme_pizza.png");
    case "ham_pineapple": return require("../../assets/images/menu/ham_pineapple.png");
    case "chicken_alfredo_pizza": return require("../../assets/images/menu/chicken_alfredo_pizza.png");
    case "egg_breakfast": return require("../../assets/images/menu/egg_breakfast.png");
    case "pancakes": return require("../../assets/images/menu/pancakes.png");
    case "breakfast_skillet": return require("../../assets/images/menu/breakfast_skillet.png");
    
    default: return require("../../assets/images/menu/cheese_pizza.png");
  }
};

const MenuScreen = ({ route, navigation }) => {
  const { categoryId, categoryName } = route.params;
  
  const categoryProducts = useQuery(
    api.products.getProductsByCategory, 
    categoryId !== "all" ? { categoryId: categoryId as any } : "skip"
  );
  
  const allProducts = useQuery(
    api.products.getAllProducts, 
    categoryId === "all" ? {} : "skip"
  );

  const products = categoryId === "all" ? allProducts : categoryProducts;

  const renderProduct = ({ item }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => navigation.navigate("ProductDetailScreen", { product: item })}
    >
      <View style={styles.imagePlaceholder}>
        {item.image ? (
            <Image 
                source={getImageSource(item.image)} 
                style={{ width: "100%", height: "100%" }} 
                resizeMode="cover" 
            />
        ) : (
            <Ionicons name="pizza-outline" size={50} color="#555" />
        )}
      </View>
      <View style={styles.productInfo}>
        <Text style={styles.productName}>{item.name}</Text>
        <Text style={styles.productDesc} numberOfLines={2}>
          {item.description}
        </Text>
        <View style={styles.priceRow}>
          <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
          <View style={styles.addButton}>
            <Ionicons name="add" size={20} color="#111" />
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#d4af37" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{categoryName || "Menu"}</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Product List */}
      <FlatList
        data={products || []}
        renderItem={renderProduct}
        keyExtractor={(item) => item._id}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        columnWrapperStyle={styles.columnWrapper}
        ListEmptyComponent={() => (
           <View style={styles.emptyState}>
             <Text style={styles.emptyText}>Loading menu items...</Text>
           </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#111111",
  },
  header: {
    paddingTop: 40,
    backgroundColor: "#1A1A1A",
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#d4af37",
  },
  headerTitle: {
    color: "#d4af37",
    fontSize: RFValue(18),
    fontFamily: "MBold",
  },
  listContent: {
    padding: 10,
  },
  columnWrapper: {
    justifyContent: "space-between",
  },
  productCard: {
    backgroundColor: "#1e1e1e",
    width: width * 0.45,
    borderRadius: 15,
    marginBottom: 15,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333",
  },
  imagePlaceholder: {
    height: 120,
    backgroundColor: "#2a2a2a",
    justifyContent: "center",
    alignItems: "center",
  },
  productInfo: {
    padding: 12,
  },
  productName: {
    fontSize: RFValue(14),
    fontFamily: "MSemiBold",
    color: "#fff",
  },
  productDesc: {
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    color: "#888",
    marginTop: 4,
    height: 35,
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  productPrice: {
    fontSize: RFValue(14),
    color: "#d4af37",
    fontWeight: "bold",
  },
  addButton: {
    backgroundColor: "#d4af37",
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    padding: 20,
    alignItems: "center",
  },
  emptyText: {
    color: "#888",
    fontFamily: "MRegular",
  }
});

export default MenuScreen;
