import React, { createContext, useContext, useState, useMemo } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export type CartItem = {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  instructions?: string;
  selectedModifiers?: Record<string, string>;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (uniqueId: string) => void;
  updateQuantity: (uniqueId: string, delta: number) => void;
  clearCart: () => void;
  applyReward: (reward: any) => void;
  appliedReward: any | null;
  totalItems: number;
  totalPrice: number;
  subtotal: number;
  discount: number;
  cartExpired: boolean;
  dismissExpiredNotice: () => void;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const getUniqueKey = (item: Omit<CartItem, "quantity"> | CartItem) => {
  const modKey = item.selectedModifiers ? JSON.stringify(item.selectedModifiers) : "";
  return item.id + (item.instructions || "") + modKey;
};

const CART_STORAGE_KEY = "@theob_cart_items";
const CART_TIMESTAMP_KEY = "@theob_cart_saved_at";
const CART_EXPIRY_MS = 6 * 60 * 60 * 1000; // 6 hours

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedReward, setAppliedReward] = useState<any | null>(null);
  const [cartExpired, setCartExpired] = useState(false);

  // Load cart on mount — auto-clear if older than 6 hours
  React.useEffect(() => {
    const loadCart = async () => {
      try {
        const [saved, savedAt] = await Promise.all([
          AsyncStorage.getItem(CART_STORAGE_KEY),
          AsyncStorage.getItem(CART_TIMESTAMP_KEY),
        ]);
        if (saved && savedAt) {
          const age = Date.now() - parseInt(savedAt, 10);
          if (age > CART_EXPIRY_MS) {
            await AsyncStorage.multiRemove([CART_STORAGE_KEY, CART_TIMESTAMP_KEY]);
            setCartExpired(true);
            return;
          }
          setItems(JSON.parse(saved));
        } else if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    };
    loadCart();
  }, []);

  // Save cart + timestamp on every change
  React.useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        await AsyncStorage.setItem(CART_TIMESTAMP_KEY, String(Date.now()));
      } catch (e) {
        console.error("Failed to save cart", e);
      }
    };
    saveCart();
  }, [items]);

  const addToCart = (newItem: Omit<CartItem, "quantity">) => {
    setItems((prev) => {
      const newKey = getUniqueKey(newItem);
      const existingIdx = prev.findIndex((i) => getUniqueKey(i) === newKey);

      if (existingIdx > -1) {
        const newItems = [...prev];
        newItems[existingIdx] = {
          ...newItems[existingIdx],
          quantity: newItems[existingIdx].quantity + 1,
        };
        return newItems;
      }
      return [...prev, { ...newItem, quantity: 1 }];
    });
  };

  const removeFromCart = (uniqueId: string) => {
    setItems((prev) => prev.filter((i) => getUniqueKey(i) !== uniqueId));
  };

  const updateQuantity = (uniqueId: string, delta: number) => {
    setItems((prev) =>
      prev
        .map((i) => {
          return getUniqueKey(i) === uniqueId 
            ? { ...i, quantity: Math.max(0, i.quantity + delta) } 
            : i;
        })
        .filter((i) => i.quantity > 0)
    );
  };

  const clearCart = () => {
    setItems([]);
    setAppliedReward(null);
    AsyncStorage.multiRemove([CART_STORAGE_KEY, CART_TIMESTAMP_KEY]).catch(() => {});
  };

  const dismissExpiredNotice = () => setCartExpired(false);

  const applyReward = (reward: any) => {
    setAppliedReward(reward);

    // SMART LOGIC: Auto-add item if it's a specific "Free Item" reward
    if (reward?._id === "promo_wings") {
      const hasWings = items.some(i => i.name.toLowerCase().includes("wing"));
      if (!hasWings) {
        addToCart({
          id: "jumbo_wings",
          name: "Jumbo Owner's Wings",
          price: 15.99,
          image: "jumbo_wings"
        });
      }
    }
  };

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  const discount = useMemo(() => {
    if (!appliedReward) return 0;
    
    // FREE OWNER'S WINGS PROMO
    if (appliedReward._id === "promo_wings") {
      const wingItem = items.find(i => i.name.toLowerCase().includes("wing"));
      return wingItem ? wingItem.price : 0;
    }

    if (appliedReward.rewardType === "discount") {
        return Math.min(subtotal, 10); // Standard $10 discount
    }

    if (appliedReward.rewardType === "free_item") {
        // Find if any item in cart matches the reward
        // For simplicity, if it's a free item reward, deduct the price of the first item
        // or a fixed amount if no items. In a real app, this would be more specific.
        return items.length > 0 ? items[0].price : 0;
    }
    return 0;
  }, [appliedReward, items, subtotal]);

  const totalPrice = subtotal - discount;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        applyReward,
        appliedReward,
        totalItems,
        totalPrice,
        subtotal,
        discount,
        cartExpired,
        dismissExpiredNotice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
