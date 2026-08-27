"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";
import { Badge } from "./ui";
import { whatsappLink } from "@/lib/whatsapp";
import { MessageCircle, ChevronDown, MapPin, UserRound, Phone } from "lucide-react";

const STATUSES = ["NEW", "CONFIRMED", "PREPARING", "SHIPPED", "DELIVERED", "CANCELLED"] as const;

const tone: Record<string, "gold" | "green" | "purple" | "blue" | "red" | "gray"> = {
  NEW: "gold", CONFIRMED: "blue", PREPARING: "purple", SHIPPED: "blue", DELIVERED: "green", CANCELLED: "red",
};

type Item = { id: string; name: string; quantity: number; price: number; color?: string | null; size?: string | null };
type Order = {
  id: string; orderNumber: string; customerName: string; phone: string; whatsapp?: string | null;
  email?: string | null; ville?: string | null; quartier?: string | null; address?: string | null;
  status: string; total: number; deliveryFee: number; paymentMethod: string; isPickup: boolean;
  createdAt: string; items: Item[];
};

export function OrdersTable({ orders }: { orders: Order[] }) {
  const router = useRouter();
  const [expanded, setExpanded] = useState<string | null>(null);

  const setStatus = async (id: string, status: string) => {
    const res = await fetch(`/api/admin/orders/${id}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) });
    if (res.ok) router.refresh();
  };

  const rel = (items: Item[]) => items.reduce((a, i) => a + i.quantity * i.price, 0);

  return (
    <div className="space-y-3">
      {orders.map((o) => {
        const open = expanded === o.id;
        return (
          <div key={o.id} className="bg-white rounded-2xl border border-sabren-gray shadow-card overflow-hidden">
            <button onClick={() => setExpanded(open ? null : o.id)} className="w-full flex flex-wrap items-center gap-3 p-4 text-left hover:bg-sabren-cream/50 transition">
              <span className="font-black text-sm min-w-24">{o.orderNumber}</span>
              <span className="font-semibold text-sm flex-1 min-w-32">{o.customerName}</span>
              <span className="text-sm text-sabren-black/55 flex items-center gap-1"><MapPin className="w-3.5 h-3.5" />{o.ville ?? "—"}</span>
              <span className="font-black text-sm">{formatPrice(o.total)}</span>
              <Badge tone={tone[o.status] ?? "gray"}>{o.status}</Badge>
              <ChevronDown className={`w-4 h-4 text-sabren-black/40 transition-transform shrink-0 ${open ? "rotate-180" : ""}`} />
            </button>

            {open && (
              <div className="border-t border-sabren-gray px-4 py-4 grid md:grid-cols-2 gap-5">
                <div>
                  <h3 className="text-xs font-bold uppercase text-sabren-black/45 mb-2">Articles</h3>
                  <div className="space-y-1.5">
                    {o.items.map((i) => (
                      <div key={i.id} className="flex items-center justify-between text-sm">
                        <span className="text-sabren-black/70">
                          {i.name}
                          {[i.color, i.size].filter(Boolean).length > 0 && <span className="text-sabren-black/40"> ({[i.color, i.size].filter(Boolean).join(" · ")})</span>}
                          <span className="text-sabren-black/45"> × {i.quantity}</span>
                        </span>
                        <span className="font-semibold">{formatPrice(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-sabren-gray mt-2 pt-2 space-y-1 text-sm">
                    <div className="flex justify-between text-sabren-black/55"><span>Sous-total</span><span>{formatPrice(rel(o.items))}</span></div>
                    {!o.isPickup && <div className="flex justify-between text-sabren-black/55"><span>Livraison</span><span>{formatPrice(o.deliveryFee)}</span></div>}
                    <div className="flex justify-between font-bold"><span>Total</span><span>{formatPrice(o.total)}</span></div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase text-sabren-black/45 mb-2">Client & livraison</h3>
                  <div className="space-y-1.5 text-sm text-sabren-black/70">
                    <p className="flex items-center gap-2"><UserRound className="w-3.5 h-3.5 text-sabren-gold" /> {o.customerName}</p>
                    <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-sabren-gold" /> {o.phone}</p>
                    {o.quartier && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5 text-sabren-gold" /> {o.quartier}{o.ville ? `, ${o.ville}` : ""}</p>}
                    {o.address && <p className="text-sabren-black/50">{o.address}</p>}
                    <p className="text-xs">Paiement : <Badge tone={o.paymentMethod === "COD" ? "green" : "blue"}>{o.paymentMethod === "COD" ? "Paiement à la livraison" : "WhatsApp"}</Badge></p>
                    <p className="text-xs"><Badge tone={o.isPickup ? "gold" : "gray"}>{o.isPickup ? "Retrait boutique" : "Livraison"}</Badge></p>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {o.whatsapp && (
                      <a href={whatsappLink(`Bonjour ${o.customerName}, concernant votre commande ${o.orderNumber} chez Sabren'Shop.`)} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold bg-whatsapp text-white rounded-full px-3 py-1.5 hover:bg-whatsapp-dark transition">
                        <MessageCircle className="w-3.5 h-3.5" /> Contacter client
                      </a>
                    )}
                    <select value={o.status} onChange={(e) => setStatus(o.id, e.target.value)} className="text-xs font-bold rounded-full border border-sabren-gray px-3 py-1.5 bg-white outline-none focus:border-sabren-gold">
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}