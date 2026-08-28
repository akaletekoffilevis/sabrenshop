import type { Metadata } from "next";
import { Heart } from "lucide-react";
import { WishlistClient } from "@/components/shop/WishlistClient";

export const metadata: Metadata = {
  title: "Mes favoris",
  description: "Retrouvez tous vos produits préférés de Sabren'Shop.",
};

export default function FavorisPage() {
  return (
    <div className="max-w-7xl mx-auto container-px lg:px-8 py-8 md:py-12">
      <div className="flex items-center gap-3 mb-8">
        <span className="w-10 h-10 rounded-2xl bg-sabren-gold/15 text-sabren-gold-ink flex items-center justify-center">
          <Heart className="w-5 h-5" />
        </span>
        <div>
          <h1 className="font-display font-black text-xl md:text-2xl">MES FAVORIS</h1>
          <p className="text-sm text-sabren-black/50">Vos coups de cœur, sauvegardés sur cet appareil.</p>
        </div>
      </div>
      <WishlistClient />
    </div>
  );
}