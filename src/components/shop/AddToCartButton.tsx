"use client";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({
  product,
  variant,
  round,
  className = "",
  outOfStock = false,
}: {
  product: {
    id: string;
    slug: string;
    name: string;
    price: number;
    compareAtPrice?: number | null;
    image?: string;
  };
  variant?: "black" | "gold";
  round?: boolean;
  className?: string;
  outOfStock?: boolean;
}) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id || product.slug, slug: product.slug, name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, image: product.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const base = round
    ? "flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition shadow-card"
    : "flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition w-full";
  const style = added
    ? "bg-whatsapp text-white"
    : outOfStock
    ? "bg-sabren-gray text-sabren-black/40 cursor-not-allowed"
    : variant === "gold"
    ? "bg-sabren-gold text-sabren-black hover:bg-sabren-gold-hover shadow-gold"
    : "bg-sabren-black text-white hover:bg-black";

  return (
    <button onClick={outOfStock ? undefined : handle} disabled={outOfStock} aria-disabled={outOfStock} className={`${base} ${style} ${className}`}>
      {outOfStock ? (
        <>
          <ShoppingBag className="w-4 h-4" /> {!round && "Épuisé"}
        </>
      ) : added ? (
        <>
          <Check className="w-4 h-4" /> {!round && "Ajouté !"}
        </>
      ) : (
        <>
          <ShoppingBag className="w-4 h-4" /> {!round && "Ajouter"}
        </>
      )}
    </button>
  );
}