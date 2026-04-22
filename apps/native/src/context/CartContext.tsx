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
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const getUniqueKey = (item: Omit<CartItem, "quantity"> | CartItem) => {
  const modKey = item.selectedModifiers ? JSON.stringify(item.selectedModifiers) : "";
  return item.id + (item.instructions || "") + modKey;
};

const CART_STORAGE_KEY = "@theob_cart_items";

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [appliedReward, setAppliedReward] = useState<any | null>(null);

  // Load cart on mount
  React.useEffect(() => {
    const loadCart = async () => {
      try {
        const saved = await AsyncStorage.getItem(CART_STORAGE_KEY);
        if (saved) {
          setItems(JSON.parse(saved));
        }
      } catch (e) {
        console.error("Failed to load cart", e);
      }
    };
    loadCart();
  }, []);

  // Save cart on change
  React.useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
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
  };

  const applyReward = (reward: any) => {
    setAppliedReward(reward);
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
    if (appliedReward.rewardType === "discount") {
        return Math.min(subtotal, 10); // Mock $10 discount logic
    }
    if (appliedReward.rewardType === "free_item") {
        // Find most expensive eligible item if eligibleMenuItemIds exists
        // For now, simplify: if any item is in cart, deduct roughly $15 for pizza
        return subtotal > 0 ? 15.00 : 0; 
    }
    return 0;
  }, [appliedReward, subtotal]);

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
