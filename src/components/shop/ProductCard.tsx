import Link from "next/link";
import { formatPrice, discountPercent } from "@/lib/utils";
import { Heart, Star, MessageCircle, Image as ImageIcon } from "lucide-react";
import { AddToCartButton } from "./AddToCartButton";

export function ProductCard({ product }: { product: any }) {
  const disc = discountPercent(product.price, product.compareAtPrice);
  const img = product.images?.[0];
  const stockLow = product.stock !== undefined && product.stock > 0 && product.stock <= 5;

  return (
    <div className="group relative bg-white rounded-2xl overflow-hidden border border-sabren-gray shadow-card hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-300">
      <Link href={`/produit/${product.slug}`} className="block relative aspect-square bg-sabren-cream overflow-hidden">
        {img ? (
          <img src={img} alt={product.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" loading="lazy" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-sabren-black/25 bg-sabren-cream">
            <ImageIcon className="w-10 h-10" />
          </div>
        )}
        <div className="absolute top-2 left-2 flex flex-col gap-1.5 items-start">
          {disc > 0 && <span className="bg-sabren-pink text-sabren-black text-[11px] font-black px-2 py-1 rounded-full shadow">-{disc}%</span>}
          {product.isNew && <span className="bg-sabren-black text-sabren-gold text-[10px] font-bold px-2 py-1 rounded-full">NOUVEAU</span>}
          {product.isFeatured && !product.isNew && <span className="bg-sabren-gold text-sabren-black text-[10px] font-bold px-2 py-1 rounded-full">MEILLEUR VENDU</span>}
        </div>
        <button className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white/95 backdrop-blur flex items-center justify-center shadow-card hover:text-sabren-pink transition" aria-label="Ajouter aux favoris">
          <Heart className="w-4 h-4" />
        </button>
        {stockLow && (
          <span className="absolute bottom-2 left-2 bg-white/90 text-[10px] font-semibold text-orange-600 px-2 py-0.5 rounded-full backdrop-blur">
            Plus que {product.stock} en stock
          </span>
        )}
      </Link>

      <div className="p-3 md:p-4">
        <div className="flex items-center gap-1 text-[11px]">
          <span className="flex text-sabren-gold">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className={`w-3 h-3 ${i < Math.round(product.rating || 5) ? "fill-sabren-gold text-sabren-gold" : "text-sabren-gray-dark"}`} />
            ))}
          </span>
          <span className="text-sabren-black/40 ml-1">({product.rating ?? 5})</span>
        </div>

        <Link href={`/produit/${product.slug}`} className="block mt-1.5 text-sm font-semibold leading-snug line-clamp-2 min-h-[2.4em] hover:text-sabren-gold transition-colors">
          {product.name}
        </Link>

        <div className="mt-2 flex items-baseline gap-2 flex-wrap">
          <span className="text-base font-black text-sabren-black">{formatPrice(product.price)}</span>
          {product.compareAtPrice && product.compareAtPrice > product.price && (
            <span className="text-xs line-through text-sabren-black/35">{formatPrice(product.compareAtPrice)}</span>
          )}
        </div>

        <div className="mt-3 flex gap-2">
          <AddToCartButton product={product} className="flex-1" />
          <a
            href={`https://wa.me/22789148454?text=${encodeURIComponent(`Bonjour Sabren'Shop,\nJe souhaite commander : ${product.name} - ${formatPrice(product.price)}`)}`}
            target="_blank"
            className="inline-flex items-center justify-center w-10 rounded-full bg-whatsapp hover:bg-whatsapp-dark text-white transition"
            aria-label="Commander sur WhatsApp"
          >
            <MessageCircle className="w-4 h-4" />
          </a>
        </div>
      </div>
    </div>
  );
}