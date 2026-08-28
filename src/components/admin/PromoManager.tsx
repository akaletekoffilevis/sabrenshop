"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls, Btn, Badge, Card } from "./ui";
import { Pencil, Trash2, Plus, X, Loader2, Percent, Banknote } from "lucide-react";

type Promo = {
  id: string;
  code: string;
  description: string | null;
  type: string;
  value: number;
  minSubtotal: number | null;
  maxUses: number | null;
  usedCount: number;
  isActive: boolean;
  expiresAt: string | null;
};

const blank = { code: "", description: "", type: "PERCENT", value: 10, minSubtotal: 0, maxUses: 0, isActive: true, expiresAt: "" };

export function PromoManager({ initial }: { initial: Promo[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Promo | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState(blank);

  const save = async () => {
    if (!form.code.trim()) return;
    setBusy(true);
    const url = editing ? `/api/admin/promos/${editing.id}` : "/api/admin/promos";
    const res = await fetch(url, {
      method: editing ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        code: form.code.toUpperCase().trim(),
        value: Number(form.value),
        minSubtotal: form.minSubtotal ? Number(form.minSubtotal) : null,
        maxUses: form.maxUses ? Number(form.maxUses) : null,
        expiresAt: form.expiresAt || null,
      }),
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { alert(data.error || "Erreur d'enregistrement"); return; }
    setForm(blank); setEditing(null); setCreating(false);
    router.refresh();
  };

  const del = async (p: Promo) => {
    if (!confirm(`Supprimer le code « ${p.code} » ?`)) return;
    const res = await fetch(`/api/admin/promos/${p.id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Suppression impossible"); return; }
    router.refresh();
  };

  const expired = (p: Promo) => p.expiresAt && new Date(p.expiresAt + "T23:59") < new Date();
  const maxed = (p: Promo) => !!p.maxUses && p.usedCount >= p.maxUses;

  const formPanel = (
    <Card className="p-5 mb-6 border-sabren-gold/40 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">{editing ? `Modifier ${editing.code}` : "Nouveau code promo"}</h2>
        <button onClick={() => { setEditing(null); setCreating(false); setForm(blank); }} className="p-1.5 text-sabren-black/40 hover:text-sabren-black"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Code" hint="Ex : BIENVENUE10, NIGER50 — lettres automatiquement en majuscules">
          <input className={inputCls} value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })} placeholder="EXEMPLE10" required />
        </Field>
        <Field label="Type de remise">
          <div className="grid grid-cols-2 gap-2">
            <button type="button" onClick={() => setForm({ ...form, type: "PERCENT" })} className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${form.type === "PERCENT" ? "border-sabren-gold bg-sabren-gold/10" : "border-sabren-gray"}`}>
              <Percent className="w-4 h-4" /> Pourcentage
            </button>
            <button type="button" onClick={() => setForm({ ...form, type: "FIXED" })} className={`flex items-center justify-center gap-1.5 rounded-xl border-2 px-3 py-2.5 text-sm font-bold transition ${form.type === "FIXED" ? "border-sabren-gold bg-sabren-gold/10" : "border-sabren-gray"}`}>
              <Banknote className="w-4 h-4" /> Montant FCFA
            </button>
          </div>
        </Field>
        <Field label={form.type === "PERCENT" ? "Valeur (%)" : "Valeur (FCFA)"}>
          <input className={inputCls} type="number" min={1} max={form.type === "PERCENT" ? 100 : undefined} value={form.value} onChange={(e) => setForm({ ...form, value: Number(e.target.value) })} required />
        </Field>
        <Field label="Panier minimum (FCFA)" hint="0 ou vide = aucun minimum">
          <input className={inputCls} type="number" min={0} value={form.minSubtotal} onChange={(e) => setForm({ ...form, minSubtotal: Number(e.target.value) })} />
        </Field>
        <Field label="Limite d'utilisations" hint="0 ou vide = illimité">
          <input className={inputCls} type="number" min={0} value={form.maxUses} onChange={(e) => setForm({ ...form, maxUses: Number(e.target.value) })} />
        </Field>
        <Field label="Expiration" hint="Vide = valable indéfiniment">
          <input className={inputCls} type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
        </Field>
        <Field label="Description (interne)">
          <input className={inputCls} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Ex : -10% première commande" />
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-sabren-gold w-4 h-4" />
          Actif (applicable sur le panier)
        </label>
        <Btn type="button" variant="gold" onClick={save} disabled={busy || !form.code.trim() || !form.value}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {editing ? "Enregistrer" : "Créer le code"}
        </Btn>
      </div>
    </Card>
  );

  return (
    <div>
      {!creating && !editing && (
        <div className="mb-6">
          <Btn type="button" variant="gold" onClick={() => { setCreating(true); setForm({ ...blank, maxUses: 0 }); }}>
            <Plus className="w-4 h-4" /> Nouveau code promo
          </Btn>
        </div>
      )}
      {creating && formPanel}

      <div className="space-y-3">
        {initial.length === 0 && (
          <Card className="p-10 text-center">
            <p className="font-bold">Aucun code promo</p>
            <p className="text-sm text-sabren-black/50 mt-1">Créez votre premier code pour proposer une réduction.</p>
          </Card>
        )}
        {initial.map((p) => {
          const isExpired = expired(p);
          const isMaxed = maxed(p);
          return (
            <Card key={p.id} className="p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="font-black font-display tracking-wider">{p.code}</p>
                  <Badge tone="gold">{p.type === "PERCENT" ? `-${p.value}%` : `-${p.value} FCFA`}</Badge>
                  <Badge tone={p.isActive ? "green" : "gray"}>{p.isActive ? "Actif" : "Inactif"}</Badge>
                  {isExpired && <Badge tone="red">Expiré</Badge>}
                  {isMaxed && <Badge tone="red">Limite atteinte</Badge>}
                </div>
                {p.description && <p className="text-xs text-sabren-black/50 mt-1">{p.description}</p>}
                <p className="text-[11px] text-sabren-black/40 mt-1">
                  {p.minSubtotal ? `Panier min : ${p.minSubtotal.toLocaleString("fr-FR")} FCFA · ` : ""}
                  Utilisé : {p.usedCount?.toLocaleString("fr-FR")}{p.maxUses ? ` / ${p.maxUses.toLocaleString("fr-FR")}` : " (illimité)"}
                  {p.expiresAt ? ` · Expire le ${p.expiresAt}` : ""}
                </p>
              </div>
              <div className="flex items-center gap-0.5 shrink-0">
                <button onClick={() => { setEditing(p); setCreating(false); setForm({ code: p.code, description: p.description ?? "", type: p.type, value: p.value, minSubtotal: p.minSubtotal ?? 0, maxUses: p.maxUses ?? 0, isActive: p.isActive, expiresAt: p.expiresAt ?? "" }); }} className="p-2 rounded-lg text-sabren-black/40 hover:text-sabren-gold hover:bg-sabren-cream transition" aria-label="Modifier">
                  <Pencil className="w-4 h-4" />
                </button>
                <button onClick={() => del(p)} className="p-2 rounded-lg text-sabren-black/40 hover:text-red-500 hover:bg-red-50 transition" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {editing && formPanel}
    </div>
  );
}