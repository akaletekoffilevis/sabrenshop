"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { Home, ShoppingBag, MessageCircle, LayoutGrid } from "lucide-react";

export function MobileBottomNav() {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-sabren-gray grid grid-cols-4">
      <Link href="/" className="flex flex-col items-center py-2.5 text-[10px] font-semibold text-sabren-black/60 hover:text-sabren-gold">
        <Home className="w-5 h-5" /> Accueil
      </Link>
      <Link href="/boutique" className="flex flex-col items-center py-2.5 text-[10px] font-semibold text-sabren-black/60 hover:text-sabren-gold">
        <LayoutGrid className="w-5 h-5" /> Boutique
      </Link>
      <Link href="/panier" className="relative flex flex-col items-center py-2.5 text-[10px] font-semibold text-sabren-black/60 hover:text-sabren-gold">
        <span className="relative">
          <ShoppingBag className="w-5 h-5" />
          {count > 0 && <span className="absolute -top-1.5 -right-2 bg-sabren-gold text-sabren-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
        </span>
        Panier
      </Link>
      <a
        href={`https://wa.me/22789148454?text=${encodeURIComponent("Bonjour Sabren'Shop, je souhaite commander.")}`}
        target="_blank"
        className="flex flex-col items-center py-2.5 text-[10px] font-bold text-whatsapp-dark"
      >
        <MessageCircle className="w-5 h-5" /> WhatsApp
      </a>
    </nav>
  );
}