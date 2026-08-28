"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls, Btn, Toggle, Card } from "./ui";
import { Loader2, Save, Megaphone, Truck, Home, Share2 } from "lucide-react";

type Settings = {
  shopName: string; phone: string; whatsapp: string; email?: string | null; address?: string | null;
  promoBarText?: string | null; promoBarActive: boolean; deliveryFee: number; freeDeliveryThreshold?: number | null;
  heroTitle?: string | null; heroSubtitle?: string | null; heroImage?: string | null; heroCta1Text?: string | null; heroCta2Text?: string | null;
  facebook?: string | null; instagram?: string | null; tiktok?: string | null;
};

export function SettingsForm({ settings }: { settings: Settings }) {
  const router = useRouter();
  const [form, setForm] = useState<Settings>({
    shopName: settings.shopName ?? "SABREEN'SHOP",
    phone: settings.phone ?? "+227 89 14 84 54",
    whatsapp: settings.whatsapp ?? "22789148454",
    email: settings.email ?? "",
    address: settings.address ?? "",
    promoBarText: settings.promoBarText ?? "",
    promoBarActive: settings.promoBarActive ?? true,
    deliveryFee: settings.deliveryFee ?? 100,
    freeDeliveryThreshold: settings.freeDeliveryThreshold ?? null,
    heroTitle: settings.heroTitle ?? "",
    heroSubtitle: settings.heroSubtitle ?? "",
    heroImage: settings.heroImage ?? "",
    heroCta1Text: settings.heroCta1Text ?? "",
    heroCta2Text: settings.heroCta2Text ?? "",
    facebook: settings.facebook ?? "",
    instagram: settings.instagram ?? "",
    tiktok: settings.tiktok ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState("");

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    setMsg("");
    const res = await fetch("/api/admin/settings", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setSaving(false);
    if (!res.ok) { setMsg(data.error || "Erreur d'enregistrement"); return; }
    setMsg("Paramètres enregistrés."); 
    router.refresh();
    setTimeout(() => setMsg(""), 3000);
  };

  const section = "flex items-center gap-2 font-bold text-sm mb-4";
  const iconCls = "w-4 h-4 text-sabren-gold";

  return (
    <div className="space-y-5">
      <Card className="p-5 md:p-6">
        <h2 className={section}><Megaphone className={iconCls} /> Bandeau promo & identité</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Nom de la boutique"><input className={inputCls} value={form.shopName} onChange={(e) => set("shopName", e.target.value)} /></Field>
          <Field label="Texte du bandeau promo" hint="Affiché en haut de toutes les pages">
            <input className={inputCls} value={form.promoBarText ?? ""} onChange={(e) => set("promoBarText", e.target.value)} />
          </Field>
          <div className="md:col-span-2">
            <Toggle checked={form.promoBarActive} onChange={(v) => set("promoBarActive", v)} label="Activer le bandeau promo" />
          </div>
          <Field label="Titre du hero" hint="Grand titre de la page d'accueil">
            <input className={inputCls} value={form.heroTitle ?? ""} onChange={(e) => set("heroTitle", e.target.value)} />
          </Field>
          <Field label="Sous-titre du hero">
            <input className={inputCls} value={form.heroSubtitle ?? ""} onChange={(e) => set("heroSubtitle", e.target.value)} />
          </Field>
          <Field label="Image du hero (URL)" hint="URL hébergée (https://...) ou fichier /uploads/...">
            <input className={inputCls} value={form.heroImage ?? ""} onChange={(e) => set("heroImage", e.target.value)} placeholder="/uploads/....jpg ou https://..." />
          </Field>
          <div className="grid grid-cols-2 gap-3 self-end">
            <Field label="CTA 1"><input className={inputCls} value={form.heroCta1Text ?? ""} onChange={(e) => set("heroCta1Text", e.target.value)} /></Field>
            <Field label="CTA 2"><input className={inputCls} value={form.heroCta2Text ?? ""} onChange={(e) => set("heroCta2Text", e.target.value)} /></Field>
          </div>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className={section}><Truck className={iconCls} /> Livraison</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Frais de livraison (FCFA)">
            <input className={inputCls} type="number" min={0} value={form.deliveryFee} onChange={(e) => set("deliveryFee", Number(e.target.value))} />
          </Field>
          <Field label="Seuil de livraison gratuite (FCFA)" hint="Laisser vide pour désactiver">
            <input className={inputCls} type="number" min={0} value={form.freeDeliveryThreshold ?? ""} onChange={(e) => set("freeDeliveryThreshold", e.target.value ? Number(e.target.value) : null)} />
          </Field>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className={section}><Home className={iconCls} /> Contact boutique</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <Field label="Téléphone"><input className={inputCls} value={form.phone} onChange={(e) => set("phone", e.target.value)} /></Field>
          <Field label="Numéro WhatsApp (sans +)" hint="Format : 22789148454"><input className={inputCls} value={form.whatsapp} onChange={(e) => set("whatsapp", e.target.value)} /></Field>
          <Field label="Email"><input className={inputCls} value={form.email ?? ""} onChange={(e) => set("email", e.target.value)} /></Field>
          <Field label="Adresse"><input className={inputCls} value={form.address ?? ""} onChange={(e) => set("address", e.target.value)} /></Field>
        </div>
      </Card>

      <Card className="p-5 md:p-6">
        <h2 className={section}><Share2 className={iconCls} /> Réseaux sociaux</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <Field label="Facebook (URL)"><input className={inputCls} value={form.facebook ?? ""} onChange={(e) => set("facebook", e.target.value)} /></Field>
          <Field label="Instagram (URL)"><input className={inputCls} value={form.instagram ?? ""} onChange={(e) => set("instagram", e.target.value)} /></Field>
          <Field label="TikTok (URL)"><input className={inputCls} value={form.tiktok ?? ""} onChange={(e) => set("tiktok", e.target.value)} /></Field>
        </div>
      </Card>

      {msg && <p className="text-sm font-semibold text-green-600 bg-green-50 rounded-xl px-4 py-2.5">{msg}</p>}

      <Btn type="button" variant="gold" onClick={save} disabled={saving} className="min-w-44">
        {saving && <Loader2 className="w-4 h-4 animate-spin" />}
        {!saving && <Save className="w-4 h-4" />}
        Enregistrer les paramètres
      </Btn>
    </div>
  );
}