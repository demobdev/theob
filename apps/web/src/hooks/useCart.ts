import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  modifiers: {
    name: string;
    options: {
      name: string;
      priceExtra: number;
    }[];
  }[];
  specialInstructions?: string;
};

type CartStore = {
  items: CartItem[];
  fulfillment: "in-store" | "curbside" | "delivery" | null;
  location: string;
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  setFulfillment: (type: "in-store" | "curbside" | "delivery") => void;
  setLocation: (location: string) => void;
  clearCart: () => void;
  getTotal: () => number;
  isFulfillmentModalOpen: boolean;
  setFulfillmentModalOpen: (open: boolean) => void;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      fulfillment: null,
      location: "Greenville",
      addItem: (item) => set((state) => {
        // Simple logic: if product + modifiers match, increase quantity
        // For simplicity now, just append as new unique items
        return { items: [...state.items, item] };
      }),
      removeItem: (id) => set((state) => ({
        items: state.items.filter((i) => i.id !== id),
      })),
      updateQuantity: (id, quantity) => set((state) => ({
        items: state.items.map((i) => 
          i.id === id ? { ...i, quantity: Math.max(1, quantity) } : i
        ),
      })),
      setFulfillment: (type) => set({ fulfillment: type }),
      setLocation: (location) => set({ location }),
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce((acc, item) => {
          const itemBasePrice = item.price;
          const modifierPrice = item.modifiers.reduce((mAcc, mod) => {
            return mAcc + mod.options.reduce((oAcc, opt) => oAcc + opt.priceExtra, 0);
          }, 0);
          return acc + (itemBasePrice + modifierPrice) * item.quantity;
        }, 0);
      },
      isFulfillmentModalOpen: false,
      setFulfillmentModalOpen: (open) => set({ isFulfillmentModalOpen: open }),
    }),
    {
      name: "ob-cart-storage",
    }
  )
);
