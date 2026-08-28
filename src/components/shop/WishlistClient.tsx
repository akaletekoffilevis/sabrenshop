"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { Heart } from "lucide-react";
import { ProductCard } from "@/components/shop/ProductCard";
import { useWishlist } from "@/hooks/useWishlist";

export function WishlistClient() {
  const { ids } = useWishlist();
  const [products, setProducts] = useState<any[] | null>(null);

  useEffect(() => {
    let alive = true;
    if (!ids.length) {
      setProducts([]);
      return;
    }
    const params = new URLSearchParams({ ids: ids.join(",") });
    fetch(`/api/products?${params.toString()}`)
      .then((r) => r.json())
      .then((d) => { if (alive) setProducts(d.products || []); })
      .catch(() => { if (alive) setProducts([]); });
    return () => { alive = false; };
  }, [ids.join(",")]);

  if (products === null) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-20 text-sabren-black/40">
        <div className="w-8 h-8 border-2 border-sabren-gold border-t-transparent rounded-full animate-spin" />
        <p className="text-sm">Chargement de vos favoris…</p>
      </div>
    );
  }

  if (!products.length) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
        <span className="w-16 h-16 rounded-full bg-sabren-cream text-sabren-black/30 flex items-center justify-center">
          <Heart className="w-7 h-7" />
        </span>
        <div>
          <p className="font-display font-bold text-lg">Aucun favori pour l&apos;instant</p>
          <p className="text-sm text-sabren-black/50">Touchez le cœur sur un produit pour le retrouver ici.</p>
        </div>
        <Link href="/boutique" className="mt-2 inline-flex items-center rounded-full bg-sabren-gold text-sabren-black font-bold px-6 py-2.5 text-sm hover:bg-sabren-gold-dark transition">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      {products.map((p) => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  );
}