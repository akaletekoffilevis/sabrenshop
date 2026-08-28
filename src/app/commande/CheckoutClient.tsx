"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/utils";
import { useState } from "react";
import { ShoppingBag, UserRound, Phone, MapPin, MessageCircle, Banknote, Loader2, Store, Truck, ChevronLeft, Tag } from "lucide-react";

const inputCls = "w-full bg-white border border-sabren-gray rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-none focus:border-sabren-gold transition";

export function CheckoutClient({ deliveryFee = 100 }: { deliveryFee?: number }) {
  const router = useRouter();
  const { items, total, clear, promo } = useCart();

  const [form, setForm] = useState({
    customerName: "", phone: "", whatsapp: "", email: "", ville: "", quartier: "", address: "", notes: "",
  });
  const [isPickup, setIsPickup] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "WHATSAPP">("COD");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const subTotal = total();
  const discount = promo ? Math.min(promo.type === "FIXED" ? promo.value : Math.round((subTotal * promo.value) / 100), subTotal) : 0;
  const grandTotal = subTotal - discount + (items.length && !isPickup ? deliveryFee : 0);

  const set = (k: keyof typeof form, v: string) => setForm((f) => ({ ...f, [k]: v }));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          whatsapp: form.whatsapp || null,
          email: form.email || null,
          address: form.address || null,
          notes: form.notes || null,
          isPickup,
          paymentMethod,
          promoCode: promo?.code ?? null,
          items: items.map((i) => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity, color: i.color ?? null, size: i.size ?? null, image: i.image ?? null })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la commande.");
        setSubmitting(false);
        return;
      }
      clear();
      router.push(`/commande/succes?num=${encodeURIComponent(data.order.orderNumber)}`);
    } catch {
      setError("Erreur serveur, réessayez.");
      setSubmitting(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-3xl border border-sabren-gray shadow-card">
        <div className="w-20 h-20 mx-auto rounded-2xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center mb-5">
          <ShoppingBag className="w-9 h-9 text-sabren-gold" />
        </div>
        <h1 className="font-display font-bold text-xl">Votre panier est vide</h1>
        <p className="text-sm text-sabren-black/55 mt-2">Ajoutez des articles avant de passer commande.</p>
        <Link href="/boutique" className="inline-flex items-center gap-2 mt-6 bg-sabren-gold text-sabren-black font-bold rounded-full px-7 py-3 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
          Découvrir la boutique
        </Link>
      </div>
    );
  }

  return (
    <>
      <nav className="flex items-center gap-1.5 text-xs text-sabren-black/45 mb-4">
        <Link href="/panier" className="hover:text-sabren-gold flex items-center gap-1"><ChevronLeft className="w-3.5 h-3.5" /> Panier</Link>
        <span>/</span>
        <span className="text-sabren-black/70 font-semibold">Commande</span>
      </nav>
      <h1 className="font-display font-black text-2xl md:text-3xl mb-6">Finaliser la commande</h1>

      <form onSubmit={submit} className="grid lg:grid-cols-3 gap-6 items-start">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5">
            <h2 className="flex items-center gap-2 font-bold text-sm mb-4"><UserRound className="w-4 h-4 text-sabren-gold" /> Vos informations</h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="relative">
                <UserRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                <input className={inputCls} placeholder="Nom complet *" value={form.customerName} onChange={(e) => set("customerName", e.target.value)} required />
              </div>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                <input className={inputCls} placeholder="Téléphone *" value={form.phone} onChange={(e) => set("phone", e.target.value)} required />
              </div>
              <div className="relative">
                <MessageCircle className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                <input className={inputCls} placeholder="WhatsApp (pour le suivi)" value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} />
              </div>
              <div className="relative">
                <UserRound className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                <input className={inputCls} type="email" placeholder="Email (optionnel)" value={form.email} onChange={(e) => set("email", e.target.value)} />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5">
            <h2 className="flex items-center gap-2 font-bold text-sm mb-4"><MapPin className="w-4 h-4 text-sabren-gold" /> Livraison ou retrait</h2>
            <div className="grid grid-cols-2 gap-3 mb-4">
              <button type="button" onClick={() => setIsPickup(false)} className={`flex flex-col items-start gap-0.5 rounded-xl border-2 px-4 py-3 text-sm font-bold transition text-left ${!isPickup ? "border-sabren-gold bg-sabren-gold/10" : "border-sabren-gray"}`}>
                <span className="flex items-center gap-2"><Truck className="w-4 h-4" /> Livraison</span>
                <span className="text-[11px] font-normal text-sabren-black/60">+ {formatPrice(deliveryFee)} (frais à la charge du client)</span>
              </button>
              <button type="button" onClick={() => setIsPickup(true)} className={`flex flex-col items-start gap-0.5 rounded-xl border-2 px-4 py-3 text-sm font-bold transition text-left ${isPickup ? "border-sabren-gold bg-sabren-gold/10" : "border-sabren-gray"}`}>
                <span className="flex items-center gap-2"><Store className="w-4 h-4" /> Retrait boutique</span>
                <span className="text-[11px] font-normal text-sabren-black/60">0 FCFA — Niamey</span>
              </button>
            </div>
            {!isPickup ? (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                  <input className={inputCls} placeholder="Ville *" value={form.ville} onChange={(e) => set("ville", e.target.value)} required />
                </div>
                <div className="relative">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                  <input className={inputCls} placeholder="Quartier *" value={form.quartier} onChange={(e) => set("quartier", e.target.value)} required />
                </div>
                <div className="relative md:col-span-2">
                  <MapPin className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-sabren-black/35" />
                  <input className={inputCls} placeholder="Adresse complète / points de repère" value={form.address} onChange={(e) => set("address", e.target.value)} />
                </div>
              </div>
            ) : (
              <p className="text-sm text-sabren-black/55 bg-sabren-cream rounded-xl px-4 py-3">Retrait à la boutique : Niamey. Nous vous contactons pour le rendez-vous.</p>
            )}
            <div className="relative mt-4">
              <textarea className="w-full bg-white border border-sabren-gray rounded-xl px-3.5 py-2.5 text-sm outline-none focus:border-sabren-gold transition" rows={2} placeholder="Note pour la commande (optionnel)" value={form.notes} onChange={(e) => set("notes", e.target.value)} />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5">
            <h2 className="flex items-center gap-2 font-bold text-sm mb-4"><Banknote className="w-4 h-4 text-sabren-gold" /> Paiement</h2>
            <div className="grid grid-cols-2 gap-3">
              <button type="button" onClick={() => setPaymentMethod("COD")} className={`flex flex-col items-start gap-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition text-left ${paymentMethod === "COD" ? "border-sabren-gold bg-sabren-gold/10" : "border-sabren-gray"}`}>
                <span>Paiement à la livraison</span>
                <span className="text-[11px] font-normal text-sabren-black/50">Payez en espèces à la réception</span>
              </button>
              <button type="button" onClick={() => setPaymentMethod("WHATSAPP")} className={`flex flex-col items-start gap-1 rounded-xl border-2 px-4 py-3 text-sm font-bold transition text-left ${paymentMethod === "WHATSAPP" ? "border-sabren-gold bg-sabren-gold/10" : "border-sabren-gray"}`}>
                <span>WhatsApp</span>
                <span className="text-[11px] font-normal text-sabren-black/50">Finaliser par message WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 lg:sticky lg:top-28 space-y-3">
          <h2 className="font-display font-bold text-lg">Votre commande</h2>
          <div className="space-y-2">
            {items.map((i) => (
              <div key={`${i.id}-${i.color}-${i.size}`} className="flex items-center justify-between gap-3 text-sm">
                <span className="text-sabren-black/70 truncate">{i.name} <span className="text-sabren-black/40">× {i.quantity}</span></span>
                <span className="font-semibold shrink-0">{formatPrice(i.price * i.quantity)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-sabren-gray pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between"><span className="text-sabren-black/55">Sous-total</span><span className="font-semibold">{formatPrice(subTotal)}</span></div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600 items-center">
                <span className="flex items-center gap-1"><Tag className="w-3.5 h-3.5" /> Remise ({promo?.code})</span>
                <span className="font-semibold">-{formatPrice(discount)}</span>
              </div>
            )}
            <div className="flex justify-between"><span className="text-sabren-black/55">Frais de livraison</span><span className="font-semibold">{isPickup ? "0 FCFA" : formatPrice(deliveryFee)}</span></div>
            <div className="flex justify-between items-center pt-1"><span className="font-bold">Total</span><span className="font-black text-lg">{formatPrice(grandTotal)}</span></div>
          </div>

          {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}

          <button type="submit" disabled={submitting || items.length === 0} className="w-full bg-sabren-gold text-sabren-black font-bold rounded-full py-3.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold disabled:opacity-60 flex items-center justify-center gap-2">
            {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
            {submitting ? "Envoi de la commande..." : "Confirmer ma commande"}
          </button>
          <p className="text-[11px] text-center text-sabren-black/55">Total en FCFA, payable à la livraison ou via WhatsApp. Frais de livraison à la charge du client. Retour possible sous 7 jours.</p>
        </div>
      </form>
    </>
  );
}