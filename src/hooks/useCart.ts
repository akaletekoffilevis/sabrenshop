"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  compareAtPrice?: number | null;
  image?: string;
  quantity: number;
  color?: string;
  size?: string;
};

type CartStore = {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number;
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id && i.color === item.color && i.size === item.size);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.color === item.color && i.size === item.size ? { ...i, quantity: i.quantity + item.quantity } : i
              ),
            };
          }
          return { items: [...state.items, item] };
        }),
      removeItem: (id, color, size) => set((s) => ({ items: s.items.filter((i) => !(i.id === id && i.color === color && i.size === size)) })),
      updateQuantity: (id, quantity, color, size) =>
        set((s) => ({
          items: quantity <= 0 ? s.items.filter((i) => !(i.id === id && i.color === color && i.size === size)) : s.items.map((i) => (i.id === id && i.color === color && i.size === size ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      total: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
    }),
    { name: "sabrenshop-cart" }
  )
);
