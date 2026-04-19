import React, { useState, useMemo } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  Dimensions,
  SafeAreaView,
  TextInput
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { RFValue } from "react-native-responsive-fontsize";
import { useCart } from "../context/CartContext";

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
    default: return require("../../assets/images/menu/cheese_pizza.png");
  }
};

const ProductDetailScreen = ({ route, navigation }) => {
  const { product } = route.params;
  const { addToCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [instructions, setInstructions] = useState("");
  
  const initialModifiers = useMemo(() => {
    const mods = {};
    product.modifiers?.forEach(m => {
      if (m.required && m.options.length > 0) {
        mods[m.name] = m.options[0].name;
      }
    });
    return mods;
  }, [product.modifiers]);

  const [selectedModifiers, setSelectedModifiers] = useState(initialModifiers);

  const calculateTotalPrice = () => {
    let basePrice = product.price;
    product.modifiers?.forEach(m => {
      const selectedOptionName = selectedModifiers[m.name];
      const option = m.options.find(o => o.name === selectedOptionName);
      if (option) basePrice += option.priceExtra || 0;
    });
    return basePrice * quantity;
  };

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
        let itemPrice = product.price;
        product.modifiers?.forEach(m => {
          const selectedOptionName = selectedModifiers[m.name];
          const option = m.options.find(o => o.name === selectedOptionName);
          if (option) itemPrice += option.priceExtra || 0;
        });

        addToCart({
            id: product._id,
            name: product.name,
            price: itemPrice,
            image: product.image,
            instructions: instructions.trim(),
            selectedModifiers: selectedModifiers
        });
    }
    navigation.goBack();
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* HEADER SECTION */}
      <View style={styles.topHeader}>
         <TouchableOpacity onPress={() => navigation.goBack()} style={styles.closeBtn}>
            <Ionicons name="close" size={28} color="#fff" />
         </TouchableOpacity>
         
         <View style={styles.headerQuantity}>
            <TouchableOpacity onPress={() => setQuantity(Math.max(1, quantity - 1))} style={styles.qtyActionBtn}>
                <Ionicons name="remove" size={20} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.qtyDisplay}>{quantity}</Text>
            <TouchableOpacity onPress={() => setQuantity(quantity + 1)} style={styles.qtyActionBtn}>
                <Ionicons name="add" size={20} color="#fff" />
            </TouchableOpacity>
         </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {product.image && getImageSource(product.image) && (
           <View style={styles.mainImageWrapper}>
              <Image source={getImageSource(product.image)} style={styles.mainImage} />
           </View>
        )}

        <View style={styles.infoSection}>
           <Text style={styles.nameText}>{product.name.toUpperCase()}</Text>
           <Text style={styles.descText}>{product.description}</Text>
        </View>

        {/* Dynamic Modifiers */}
        {product.modifiers?.map((mod, modIdx) => (
          <View key={modIdx} style={styles.modifierSection}>
            <View style={styles.modifierHeader}>
               <Text style={styles.modifierTitle}>{mod.name.toUpperCase()}</Text>
               {mod.required && <Text style={styles.requiredTag}>REQUIRED</Text>}
            </View>
            
            <View style={styles.optionsList}>
               {mod.options.map((option, optIdx) => {
                 const isSelected = selectedModifiers[mod.name] === option.name;
                 return (
                   <TouchableOpacity 
                     key={optIdx} 
                     style={styles.optionRow}
                     onPress={() => setSelectedModifiers({...selectedModifiers, [mod.name]: option.name})}
                     activeOpacity={0.7}
                   >
                     <View style={[styles.radioOuter, isSelected && styles.radioOuterSelected]}>
                        {isSelected && <View style={styles.radioInner} />}
                     </View>
                     
                     <View style={styles.optionInfo}>
                        <Text style={[styles.optionName, isSelected && styles.optionNameSelected]}>{option.name}</Text>
                        {option.priceExtra > 0 && <Text style={styles.extraPrice}>+ ${option.priceExtra.toFixed(2)}</Text>}
                     </View>
                   </TouchableOpacity>
                 );
               })}
            </View>
          </View>
        ))}

        {/* Special Instructions */}
        <View style={styles.instructionSection}>
           <Text style={styles.modifierTitle}>SPECIAL INSTRUCTIONS</Text>
           <TextInput
             style={styles.instructionInput}
             placeholder="Allergies, extra sauce, etc..."
             placeholderTextColor="#444"
             multiline
             value={instructions}
             onChangeText={setInstructions}
           />
        </View>
        
        <View style={{ height: 120 }} />
      </ScrollView>

      <View style={styles.footer}>
         <TouchableOpacity style={styles.submitBtn} onPress={handleAddToCart}>
            <Text style={styles.submitBtnText}>ADD TO ORDER</Text>
            <Text style={styles.submitBtnPrice}>${calculateTotalPrice().toFixed(2)}</Text>
         </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F0F11",
  },
  topHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: "#161616",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  closeBtn: {
    padding: 5,
  },
  headerQuantity: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#222",
    borderRadius: 25,
    paddingHorizontal: 5,
  },
  qtyActionBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#333",
    justifyContent: "center",
    alignItems: "center",
  },
  qtyDisplay: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "MBold",
    marginHorizontal: 15,
  },
  mainImageWrapper: {
    width: "100%",
    height: 300,
    backgroundColor: "#161616",
  },
  mainImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  infoSection: {
    padding: 25,
    backgroundColor: "#161616",
    borderBottomWidth: 1,
    borderBottomColor: "#333",
    marginBottom: 20,
  },
  nameText: {
    color: "#fff",
    fontSize: RFValue(20),
    fontFamily: "MBold",
    letterSpacing: 1,
    textAlign: "left",
    marginBottom: 8,
  },
  descText: {
    color: "#999",
    fontSize: RFValue(12),
    fontFamily: "MRegular",
    textAlign: "left",
    lineHeight: 18,
  },
  modifierSection: {
    backgroundColor: "#161616",
    marginBottom: 20,
    padding: 25,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  modifierHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modifierTitle: {
    color: "#666",
    fontSize: RFValue(11),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  requiredTag: {
    color: "#FFA500",
    fontSize: 9,
    fontFamily: "MBold",
    backgroundColor: "rgba(255, 165, 0, 0.1)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  optionsList: {
    gap: 15,
  },
  optionRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
  },
  radioOuter: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#444",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 15,
  },
  radioOuterSelected: {
    borderColor: "#FFA500",
  },
  radioInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FFA500",
  },
  optionInfo: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  optionName: {
    color: "#999",
    fontSize: RFValue(14),
    fontFamily: "MSemiBold",
  },
  optionNameSelected: {
    color: "#fff",
  },
  extraPrice: {
    color: "#666",
    fontSize: 12,
    fontFamily: "MRegular",
  },
  instructionSection: {
    padding: 25,
    backgroundColor: "#161616",
    marginBottom: 60,
  },
  instructionInput: {
    backgroundColor: "#0F0F11",
    borderRadius: 8,
    padding: 15,
    color: "#fff",
    minHeight: 100,
    textAlignVertical: "top",
    marginTop: 15,
    borderWidth: 1,
    borderColor: "#333",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
    paddingBottom: 40,
    backgroundColor: "#161616",
    borderTopWidth: 1,
    borderTopColor: "#333",
  },
  submitBtn: {
    backgroundColor: "#E31837",
    height: 55,
    borderRadius: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 25,
  },
  submitBtnText: {
    color: "#fff",
    fontSize: RFValue(13),
    fontFamily: "MBold",
    letterSpacing: 1,
  },
  submitBtnPrice: {
    color: "#fff",
    fontSize: RFValue(13),
    fontFamily: "MBold",
  },
});

export default ProductDetailScreen;
