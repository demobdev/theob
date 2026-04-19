import React, { createContext, useContext, useState, useMemo } from "react";

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
  totalItems: number;
  totalPrice: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

const getUniqueKey = (item: Omit<CartItem, "quantity"> | CartItem) => {
  const modKey = item.selectedModifiers ? JSON.stringify(item.selectedModifiers) : "";
  return item.id + (item.instructions || "") + modKey;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>([]);

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

  const clearCart = () => setItems([]);

  const totalItems = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity, 0),
    [items]
  );

  const totalPrice = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [items]
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalPrice,
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
