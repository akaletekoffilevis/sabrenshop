"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { whatsappLink, cartWhatsappMessage } from "@/lib/whatsapp";
import { ShoppingBag, Trash2, Minus, Plus, MessageCircle, Tag } from "lucide-react";
import { useState } from "react";

export function PanierClient() {
  const { items, updateQuantity, removeItem, total } = useCart();
  const [promo, setPromo] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const deliveryFee = 100;
  const subTotal = total();
  const grandTotal = subTotal + (items.length ? deliveryFee : 0);

  const waLink = whatsappLink(
    cartWhatsappMessage(
      items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, color: i.color, size: i.size })),
      grandTotal
    )
  );

  const applyPromo = () => {
    if (!promo.trim()) {
      setPromoMsg("Entrez un code promo.");
      return;
    }
    setPromoMsg("Les codes promo arrivent en phase 2. Contactez-nous sur WhatsApp pour une offre spéciale.");
  };

  return (
    <>
      <nav className="flex items-center gap-1.5 text-xs text-sabren-black/45 mb-4">
        <Link href="/" className="hover:text-sabren-gold">Accueil</Link>
        <span>/</span>
        <span className="text-sabren-black/70 font-semibold">Mon panier</span>
      </nav>

      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display font-black text-2xl md:text-3xl">Mon panier</h1>
        <span className="text-sm font-semibold text-sabren-black/55">{items.length} article{items.length > 1 ? "s" : ""}</span>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl border border-sabren-gray shadow-card">
          <div className="w-20 h-20 mx-auto rounded-2xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center mb-5">
            <ShoppingBag className="w-9 h-9 text-sabren-gold" />
          </div>
          <h2 className="font-display font-bold text-xl">Votre panier est vide</h2>
          <p className="text-sm text-sabren-black/55 mt-2">Découvrez nos meilleures ventes et commandez en 1 clic.</p>
          <Link href="/boutique" className="inline-flex items-center gap-2 mt-6 bg-sabren-gold text-sabren-black font-bold rounded-full px-7 py-3 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
            Découvrir la boutique
          </Link>
        </div>
      ) : (
        <div className="grid lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-3">
            {items.map((i) => (
              <div key={`${i.id}-${i.color}-${i.size}`} className="bg-white rounded-2xl border border-sabren-gray shadow-card p-3.5 flex gap-4">
                <Link href={`/produit/${i.slug}`} className="shrink-0 w-24 h-24 rounded-xl overflow-hidden bg-sabren-cream border border-sabren-gray">
                  {i.image ? <img src={i.image} alt={i.name} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-sabren-black/20"><ShoppingBag className="w-5 h-5" /></span>}
                </Link>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <Link href={`/produit/${i.slug}`} className="font-semibold text-sm leading-snug line-clamp-2 hover:text-sabren-gold transition">{i.name}</Link>
                    <button onClick={() => removeItem(i.id, i.color, i.size)} className="p-1.5 text-sabren-black/35 hover:text-red-500 transition shrink-0" aria-label="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  {[i.color, i.size].filter(Boolean).length > 0 && (
                    <p className="text-xs text-sabren-black/45 mt-0.5 capitalize">{[i.color, i.size].filter(Boolean).join(" · ")}</p>
                  )}
                  <div className="flex items-center justify-between mt-2.5">
                    <div className="flex items-center border border-sabren-gray rounded-full overflow-hidden bg-white">
                      <button onClick={() => updateQuantity(i.id, i.quantity - 1, i.color, i.size)} className="p-2 hover:bg-sabren-gray transition" aria-label="Diminuer"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="px-3 text-sm font-bold">{i.quantity}</span>
                      <button onClick={() => updateQuantity(i.id, i.quantity + 1, i.color, i.size)} className="p-2 hover:bg-sabren-gray transition" aria-label="Augmenter"><Plus className="w-3.5 h-3.5" /></button>
                    </div>
                    <div className="text-right">
                      <p className="font-black text-sm">{formatPrice(i.price * i.quantity)}</p>
                      {i.compareAtPrice && i.compareAtPrice > i.price && (
                        <p className="text-[11px] line-through text-sabren-black/35">{formatPrice(i.compareAtPrice * i.quantity)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 lg:sticky lg:top-28 space-y-4">
            <h2 className="font-display font-bold text-lg">Résumé de commande</h2>

            <div>
              <div className="flex items-center gap-2 bg-sabren-cream rounded-full pl-4 border border-transparent focus-within:border-sabren-gold focus-within:bg-white transition">
                <Tag className="w-4 h-4 text-sabren-gold shrink-0" />
                <input value={promo} onChange={(e) => setPromo(e.target.value)} placeholder="Code promo" className="flex-1 bg-transparent outline-none text-sm py-2.5" />
                <button onClick={applyPromo} className="bg-sabren-black text-white text-xs font-bold rounded-full px-4 py-2.5 hover:bg-black transition shrink-0">Appliquer</button>
              </div>
              {promoMsg && <p className="text-[11px] text-sabren-black/50 mt-1.5 px-1">{promoMsg}</p>}
            </div>

            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between">
                <span className="text-sabren-black/60">Sous-total</span>
                <span className="font-semibold">{formatPrice(subTotal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sabren-black/60">Livraison</span>
                <span className="font-semibold">{formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-xs text-sabren-black/45">
                <span>Livraison partout au Niger</span>
                <button className="text-sabren-gold hover:underline">Retrait boutique ?</button>
              </div>
              <div className="flex justify-between items-center border-t border-sabren-gray pt-3">
                <span className="font-bold">Total</span>
                <span className="font-black text-lg text-sabren-black">{formatPrice(grandTotal)}</span>
              </div>
            </div>

            <div className="grid gap-2.5">
              <a href={waLink} target="_blank" className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-full py-3.5 text-sm transition">
                <MessageCircle className="w-4 h-4" /> COMMANDER VIA WHATSAPP
              </a>
              <Link href="/boutique" className="inline-flex items-center justify-center border border-sabren-gray font-bold rounded-full py-3 text-sm hover:border-sabren-gold transition">
                Continuer mes achats
              </Link>
            </div>
            <p className="text-[11px] text-center text-sabren-black/45">Paiement à la livraison disponible — WhatsApp reste disponible.</p>
          </div>
        </div>
      )}
    </>
  );
}