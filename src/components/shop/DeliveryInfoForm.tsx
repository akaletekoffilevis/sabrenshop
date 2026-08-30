"use client";
import { useState } from "react";
import { Loader2, MapPin, CheckCircle2, Home, Store, BusFront } from "lucide-react";

const inputCls = "w-full bg-white border border-sabren-gray rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sabren-gold transition";
const labelCls = "block text-xs font-bold uppercase tracking-wide text-sabren-black/55 mb-1.5";

const PREF_OPTIONS = [
  { value: "delivery", label: "Livraison à domicile", icon: Home, desc: "Nous livrons chez vous" },
  { value: "pickup", label: "Retrait en boutique", icon: Store, desc: "0 FCFA — vous passez nous voir" },
  { value: "transport", label: "Envoi via transporteur", icon: BusFront, desc: "Bord de route / gare" },
] as const;

export type DeliveryInfo = {
  name: string | null;
  phone: string | null;
  city: string | null;
  quartier: string | null;
  address: string | null;
  deliveryPreference: string | null;
};

export function DeliveryInfoForm({ initial }: { initial: DeliveryInfo }) {
  const [form, setForm] = useState({
    name: initial.name ?? "",
    phone: initial.phone ?? "",
    city: initial.city ?? "",
    quartier: initial.quartier ?? "",
    address: initial.address ?? "",
    deliveryPreference: initial.deliveryPreference || "delivery",
  });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [k]: e.target.value });

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/account/delivery-info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json().catch(() => ({}));
      setBusy(false);
      if (!res.ok) { setMsg({ ok: false, text: data.error || "Erreur lors de l’enregistrement." }); return; }
      setMsg({ ok: true, text: "Informations de livraison enregistrées. Elles seront jointes à votre commande WhatsApp." });
    } catch {
      setBusy(false);
      setMsg({ ok: false, text: "Erreur serveur, réessayez." });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 mt-4">
      <h2 className="flex items-center gap-2 font-bold text-sm mb-1"><MapPin className="w-4 h-4 text-sabren-gold" /> Mes informations de livraison</h2>
      <p className="text-xs text-sabren-black/50 mb-4">Remplies une fois, elles seront envoyées automatiquement dans votre message WhatsApp à chaque commande — la gérante saura exactement où livrer.</p>

      <form onSubmit={save} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <label className="block">
            <span className={labelCls}>Nom complet</span>
            <input className={inputCls} value={form.name} onChange={set("name")} placeholder="Votre nom" />
          </label>
          <label className="block">
            <span className={labelCls}>Numéro de téléphone</span>
            <input className={inputCls} value={form.phone} onChange={set("phone")} placeholder="07 00 00 00 00" inputMode="tel" />
          </label>
          <label className="block">
            <span className={labelCls}>Ville</span>
            <input className={inputCls} value={form.city} onChange={set("city")} placeholder="Niamey" />
          </label>
          <label className="block">
            <span className={labelCls}>Quartier</span>
            <input className={inputCls} value={form.quartier} onChange={set("quartier")} placeholder="Karadjé, Plateau, Banifandou…" />
          </label>
        </div>
        <label className="block">
          <span className={labelCls}>Adresse / point de repère</span>
          <input className={inputCls} value={form.address} onChange={set("address")} placeholder="N° de maison, rue, gare, bureau ou boutiques connues…" />
        </label>

        <div>
          <span className={labelCls}>Mode de livraison préféré</span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {PREF_OPTIONS.map((o) => {
              const Icon = o.icon;
              const active = form.deliveryPreference === o.value;
              return (
                <button
                  key={o.value}
                  type="button"
                  onClick={() => setForm({ ...form, deliveryPreference: o.value })}
                  className={`rounded-2xl border p-3 text-left transition ${active ? "border-sabren-gold bg-sabren-gold/10 shadow-card" : "border-sabren-gray hover:border-sabren-gold/60"}`}
                >
                  <span className="flex items-center gap-2 font-bold text-sm">
                    <Icon className={`w-4 h-4 ${active ? "text-sabren-gold" : "text-sabren-black/40"}`} /> {o.label}
                  </span>
                  <span className="text-[11px] text-sabren-black/45 mt-1 block">{o.desc}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-6 py-2.5 text-sm hover:bg-sabren-gold-hover transition disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />} Enregistrer mes infos
          </button>
          {msg && <p className={`text-xs font-semibold ${msg.ok ? "text-green-600" : "text-red-500"}`}>{msg.text}</p>}
        </div>
      </form>
    </div>
  );
}