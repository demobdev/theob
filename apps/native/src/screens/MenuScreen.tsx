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
import { api } from "@packages/backend/convex/_generated/api";

const { width } = Dimensions.get("window");

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
        <Ionicons name="pizza-outline" size={50} color="#555" />
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
