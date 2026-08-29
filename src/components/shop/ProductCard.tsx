"use client";
import Link from "next/link";
import { formatPrice, discountPercent, isNewProduct } from "@/lib/utils";
import { Heart, Star, Image as ImageIcon, ShoppingCart } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";
import { useWishlist } from "@/hooks/useWishlist";

export function ProductCard({ product }: { product: any }) {
  const disc = discountPercent(product.price, product.compareAtPrice);
  const img = product.images?.[0];
  const stockLow = product.stock !== undefined && product.stock > 0 && product.stock <= 5;
  const outOfStock = product.stock !== undefined && product.stock === 0;
  const { ids, toggle } = useWishlist();
  const key = product.id || product.slug;
  const wished = ids.includes(key);
  const isNew = isNewProduct(product.createdAt, product.isNew);

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-sabren-gray shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
      <Link href={`/produit/${product.slug}`} className="block relative aspect-square bg-sabren-cream overflow-hidden">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" decoding="async" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sabren-black/25 bg-sabren-cream">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          {disc > 0 && <span className="bg-sabren-pink text-sabren-black text-[11px] font-black px-2 py-1 rounded-full shadow">-{disc}%</span>}
          {isNew && !outOfStock && <span className="bg-sabren-black text-sabren-gold text-[10px] font-bold px-2 py-1 rounded-full">NOUVEAU</span>}
          {product.isFeatured && !isNew && !outOfStock && <span className="bg-sabren-gold text-sabren-black text-[10px] font-bold px-2 py-1 rounded-full">MEILLEUR VENDU</span>}
          {outOfStock && <span className="bg-sabren-black/85 text-white text-[11px] font-black px-2.5 py-1 rounded-full tracking-wide">ÉPUISÉ</span>}
        </div>
        <button
          onClick={(e) => { e.preventDefault(); toggle(key); }}
          className={`absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-card transition hover:scale-110 ${wished ? "text-sabren-pink" : "text-sabren-black/40 hover:text-sabren-pink"}`}
          aria-label="Ajouter aux favoris"
        >
          <Heart className={`w-4 h-4 ${wished ? "fill-sabren-pink" : ""}`} />
        </button>
        {stockLow && (
          <span className="absolute bottom-2 left-2 bg-white/90 text-[10px] font-semibold text-orange-600 px-2 py-0.5 rounded-full backdrop-blur">
            Plus que {product.stock} en stock
          </span>
        )}
      </Link>

      <div className="p-3 md:p-4">
        <div className="flex items-center text-[10px] md:text-[11px]">
          <span className="flex text-sabren-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 md:w-3.5 md:h-3.5 ${i < Math.round(product.rating || 0) ? "fill-sabren-gold text-sabren-gold" : "text-sabren-gray-dark"}`} />
            ))}
          </span>
        </div>

        <Link href={`/produit/${product.slug}`} className="block mt-1.5 text-sm md:text-[15px] font-semibold leading-snug line-clamp-2 min-h-[2.6em] hover:text-sabren-gold transition-colors">
          {product.name}
        </Link>

        <div className="mt-1.5 md:mt-2 flex items-baseline gap-1.5 md:gap-2 flex-wrap">
          <span className="text-base md:text-[17px] font-black text-sabren-black">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-[11px] md:text-xs line-through text-sabren-black/35">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        <div className="mt-2 md:mt-3">
          <AddToCartButton product={product} round outOfStock={outOfStock} className="ml-auto lg:hidden" />
          <AddToCartButton product={product} outOfStock={outOfStock} className="hidden lg:flex" />
        </div>
      </div>
    </div>
  );
}