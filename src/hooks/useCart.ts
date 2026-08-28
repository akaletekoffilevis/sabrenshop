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

export type CartPromo = {
  code: string;
  type: "PERCENT" | "FIXED";
  value: number;
};

export function computePromoDiscount(promo: CartPromo | null, subTotal: number) {
  if (!promo || subTotal <= 0) return 0;
  if (promo.type === "FIXED") return Math.max(0, Math.min(promo.value, subTotal));
  return Math.max(0, Math.min(subTotal, Math.round((subTotal * promo.value) / 100)));
}

type CartStore = {
  items: CartItem[];
  promo: CartPromo | null;
  setPromo: (promo: CartPromo | null) => void;
  addItem: (item: CartItem) => void;
  removeItem: (id: string, color?: string, size?: string) => void;
  updateQuantity: (id: string, quantity: number, color?: string, size?: string) => void;
  clear: () => void;
  count: () => number;
  total: () => number; // sous-total articles (hors remise)
  grandTotal: (deliveryFee?: number) => number; // avec remise + livraison
};

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      promo: null,
      setPromo: (promo) => set({ promo }),
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
      clear: () => set({ items: [], promo: null }),
      count: () => get().items.reduce((n, i) => n + i.quantity, 0),
      total: () => get().items.reduce((n, i) => n + i.price * i.quantity, 0),
      grandTotal: (deliveryFee = 0) => {
        const subTotal = get().items.reduce((n, i) => n + i.price * i.quantity, 0);
        return subTotal - computePromoDiscount(get().promo, subTotal) + Math.max(0, deliveryFee);
      },
    }),
    { name: "sabrenshop-cart" }
  )
);
