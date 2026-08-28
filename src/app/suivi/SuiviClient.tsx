"use client";
import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { Search, Loader2, Store, MessageCircle, Truck } from "lucide-react";

const STEPS = ["NEW", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED"];

const STEP_LABEL: Record<string, string> = {
  NEW: "Commande reçue",
  CONFIRMED: "Confirmée",
  PREPARING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
};

const STEP_ICON: Record<string, string> = {
  NEW: "📦",
  CONFIRMED: "✅",
  PREPARING: "🔧",
  SHIPPED: "🚚",
  DELIVERED: "🏠",
};

export function SuiviClient() {
  const [form, setForm] = useState({ orderNumber: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [order, setOrder] = useState<any>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setOrder(null);
    setBusy(true);
    try {
      const res = await fetch("/api/orders/lookup", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Erreur lors de la recherche."); return; }
      setOrder(data.order);
    } catch {
      setError("Erreur serveur, réessayez.");
    } finally {
      setBusy(false);
    }
  };

  const idx = order ? STEPS.indexOf(order.status) : -1;

  return (
    <div className="max-w-xl mx-auto">
      <h1 className="font-display font-black text-2xl text-center mb-1">Suivre ma commande</h1>
      <p className="text-sm text-sabren-black/55 text-center mb-6">
        Entrez le numéro reçu (ex : SAB-2026-0001) et le téléphone utilisé lors de la commande.
      </p>

      <form onSubmit={submit} className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 space-y-3">
        <input
          className="w-full bg-white border border-sabren-gray rounded-xl px-4 py-3 text-sm outline-none focus:border-sabren-gold uppercase placeholder:normal-case placeholder:text-sabren-black/30"
          placeholder="Numéro de commande (SAB-2026-…) *"
          required
          value={form.orderNumber}
          onChange={(e) => setForm({ ...form, orderNumber: e.target.value })}
        />
        <input
          className="w-full bg-white border border-sabren-gray rounded-xl px-4 py-3 text-sm outline-none focus:border-sabren-gold placeholder:text-sabren-black/30"
          placeholder="Téléphone (ex : 90909090) *"
          required
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
        />
        <button type="submit" disabled={busy} className="w-full inline-flex items-center justify-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full py-3 text-sm hover:bg-sabren-gold-hover transition shadow-gold disabled:opacity-60">
          {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />} Suivre ma commande
        </button>
        {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
      </form>

      {order && (
        <div className="mt-5 animate-fade-up">
          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
              <div>
                <p className="font-black">{order.orderNumber}</p>
                <p className="text-xs text-sabren-black/55">
                  {new Date(order.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {order.customerName}
                </p>
              </div>
              <span className="inline-flex items-center gap-1.5 text-[11px] font-bold rounded-full px-3 py-1 bg-sabren-gold/15 text-sabren-gold">
                <span className="w-1.5 h-1.5 rounded-full bg-sabren-gold animate-pulse" /> {STEP_LABEL[order.status] ?? order.status}
              </span>
            </div>

            <div className="flex items-center justify-between gap-1 mb-6">
              {STEPS.map((s, i) => (
                <div key={s} className="flex items-center flex-1 last:flex-none">
                  <div className="flex flex-col items-center">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm transition ${i <= idx ? "bg-sabren-gold text-sabren-black" : "bg-sabren-gray text-sabren-black/40"}`}>
                      {STEP_ICON[s]}
                    </span>
                    <span className={`text-[10px] font-bold mt-1 ${i <= idx ? "text-sabren-black" : "text-sabren-black/40"}`}>{STEP_LABEL[s]}</span>
                  </div>
                  {i < STEPS.length - 1 && <span className={`flex-1 h-0.5 -mt-5 mx-1 ${i < idx ? "bg-sabren-gold" : "bg-sabren-gray"}`} />}
                </div>
              ))}
            </div>

            <div className="text-sm space-y-1.5 mb-4">
              {order.items.map((it: any, i: number) => (
                <div key={i} className="flex justify-between gap-2 text-sabren-black/70">
                  <span>{it.name} <b className="text-sabren-black">×{it.quantity}</b></span>
                  <span className="font-semibold whitespace-nowrap">{formatPrice(it.price * it.quantity)}</span>
                </div>
              ))}
              <div className="flex justify-between pt-2 border-t border-sabren-gray text-sabren-black/60">
                <span>Frais de livraison</span>
                <span>{order.isPickup ? "0 FCFA (retrait boutique)" : formatPrice(order.deliveryFee)}</span>
              </div>
              <div className="flex justify-between font-black text-base pt-1">
                <span>Total</span><span>{formatPrice(order.total)}</span>
              </div>
            </div>

            {order.isPickup ? (
              <p className="flex items-start gap-2 text-xs text-sabren-black/60 bg-sabren-cream rounded-xl p-3">
                <Store className="w-4 h-4 shrink-0 mt-0.5 text-sabren-gold" /> Retrait en boutique — Niamey. Présentez simplement votre numéro de commande.
              </p>
            ) : (
              <p className="flex items-start gap-2 text-xs text-sabren-black/60 bg-sabren-cream rounded-xl p-3">
                <Truck className="w-4 h-4 shrink-0 mt-0.5 text-sabren-gold" /> Livraison : {order.quartier ? `${order.quartier}, ` : ""}{order.ville || "partout au Niger"}{order.address ? ` — ${order.address}` : ""}
              </p>
            )}

            <a
              href={`https://wa.me/22789148454?text=${encodeURIComponent(`Bonjour Sabreen'Shop, je souhaite des informations sur ma commande ${order.orderNumber}.`)}`}
              target="_blank"
              className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-whatsapp text-white font-bold rounded-full py-2.5 text-xs hover:bg-whatsapp-dark transition"
            >
              <MessageCircle className="w-3.5 h-3.5" /> Contacter sur WhatsApp
            </a>
          </div>
        </div>
      )}
    </div>
  );
}