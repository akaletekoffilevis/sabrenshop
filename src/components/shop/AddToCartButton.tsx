"use client";
import { useCart } from "@/hooks/useCart";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

export function AddToCartButton({
  product,
  variant,
  className = "",
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
  className?: string;
}) {
  const addItem = useCart((s) => s.addItem);
  const [added, setAdded] = useState(false);

  const handle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id: product.id, slug: product.slug, name: product.name, price: product.price, compareAtPrice: product.compareAtPrice, image: product.image, quantity: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  const base =
    "inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-xs font-bold transition w-full";
  const style = added
    ? "bg-whatsapp text-white"
    : variant === "gold"
    ? "bg-sabren-gold text-sabren-black hover:bg-sabren-gold-hover shadow-gold"
    : "bg-sabren-black text-white hover:bg-black";

  return (
    <button onClick={handle} className={`${base} ${style} ${className}`}>
      {added ? (
        <>
          <Check className="w-3.5 h-3.5" /> Ajouté !
        </>
      ) : (
        <>
          <ShoppingBag className="w-3.5 h-3.5" /> Ajouter
        </>
      )}
    </button>
  );
}