"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls, Btn, Badge, Card } from "./ui";
import { CategoryIcon, CATEGORY_ICON_KEYS } from "@/components/ui/category-icon";
import { Pencil, Trash2, Plus, X, Loader2, Check } from "lucide-react";

type Cat = { id: string; name: string; slug: string; description?: string | null; icon: string; isActive: boolean; position: number; _count?: { products: number } };

const iconKeys = CATEGORY_ICON_KEYS;

export function CategoryManager({ initial }: { initial: Cat[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Cat | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);

  const blank = { name: "", description: "", icon: "package", isActive: true, position: initial.length };
  const [form, setForm] = useState(blank);

  const save = async () => {
    setBusy(true);
    const url = editing ? `/api/admin/categories/${editing.id}` : "/api/admin/categories";
    const res = await fetch(url, { method: editing ? "PUT" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { alert(data.error || "Erreur d'enregistrement"); return; }
    setForm(blank); setEditing(null); setCreating(false);
    router.refresh();
  };

  const del = async (c: Cat) => {
    if (!confirm(`Supprimer la catégorie « ${c.name} » ?`)) return;
    const res = await fetch(`/api/admin/categories/${c.id}`, { method: "DELETE" });
    if (!res.ok) { const d = await res.json(); alert(d.error || "Suppression impossible"); return; }
    router.refresh();
  };

  const formPanel = (
    <Card className="p-5 mb-6 border-sabren-gold/40 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">{editing ? `Modifier « ${editing.name} »` : "Nouvelle catégorie"}</h2>
        <button onClick={() => { setEditing(null); setCreating(false); setForm(blank); }} className="p-1.5 text-sabren-black/40 hover:text-sabren-black"><X className="w-4 h-4" /></button>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        <Field label="Nom">
          <input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
        </Field>
        <Field label="Position (ordre d'affichage)">
          <input className={inputCls} type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
        </Field>
        <Field label="Icône">
          <div className="flex flex-wrap gap-1.5 bg-sabren-gray rounded-xl p-2">
            {iconKeys.map((k) => (
              <button key={k} type="button" onClick={() => setForm({ ...form, icon: k })} className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${form.icon === k ? "bg-sabren-gold text-sabren-black" : "bg-white text-sabren-black/50 hover:text-sabren-gold"}`} aria-label={k}>
                <CategoryIcon icon={k} className="w-4 h-4" />
              </button>
            ))}
          </div>
        </Field>
        <Field label="Description" hint="Affichée sous le nom si remplie">
          <input className={inputCls} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} />
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-sabren-gold w-4 h-4" />
          Active (visible sur la boutique)
        </label>
        <Btn type="button" variant="gold" onClick={save} disabled={busy || !form.name.trim() || form.position === undefined}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {editing ? "Enregistrer" : "Ajouter la catégorie"}
        </Btn>
      </div>
    </Card>
  );

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">Catégories</h1>
          <p className="text-sm text-sabren-black/50 mt-0.5">Gérées en base, elles apparaissent dans le header, la boutique et l'accueil.</p>
        </div>
        {!creating && (
          <Btn type="button" variant="gold" onClick={() => { setCreating(true); setForm(blank); }}>
            <Plus className="w-4 h-4" /> Ajouter une catégorie
          </Btn>
        )}
      </div>

      {creating && formPanel}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {initial.map((c) => (
          <Card key={c.id} className="p-4 flex items-center gap-3">
            <span className="w-11 h-11 rounded-xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center shrink-0">
              <CategoryIcon icon={c.icon} className="w-5 h-5 text-sabren-gold" />
            </span>
            <div className="flex-1 min-w-0">
              <p className="font-bold text-sm truncate">{c.name}</p>
              <p className="text-[11px] text-sabren-black/40">
                {c._count?.products ?? 0} produit{(c._count?.products ?? 0) > 1 ? "s" : ""} · /{c.slug}
              </p>
              <div className="mt-1">
                <Badge tone={c.isActive ? "green" : "gray"}>{c.isActive ? "Active" : "Masquée"}</Badge>
              </div>
            </div>
            <div className="flex items-center gap-0.5 shrink-0">
              <button onClick={() => { setEditing(c); setCreating(false); setForm({ name: c.name, description: c.description ?? "", icon: c.icon, isActive: c.isActive, position: c.position }); }} className="p-2 rounded-lg text-sabren-black/40 hover:text-sabren-gold hover:bg-sabren-cream transition" aria-label="Modifier">
                <Pencil className="w-4 h-4" />
              </button>
              <button onClick={() => del(c)} className="p-2 rounded-lg text-sabren-black/40 hover:text-red-500 hover:bg-red-50 transition" aria-label="Supprimer">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>

      {editing && (
        <div className="mt-4">
          <Card className="p-5 border-sabren-gold/40 animate-fade-up">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold flex items-center gap-2"><Check className="w-4 h-4 text-sabren-gold" /> Modifier « {editing.name} »</h2>
              <button onClick={() => setEditing(null)} className="p-1.5 text-sabren-black/40 hover:text-sabren-black"><X className="w-4 h-4" /></button>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <Field label="Nom"><input className={inputCls} value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Position"><input className={inputCls} type="number" value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} /></Field>
              <Field label="Icône">
                <div className="flex flex-wrap gap-1.5 bg-sabren-gray rounded-xl p-2">
                  {iconKeys.map((k) => (
                    <button key={k} type="button" onClick={() => setForm({ ...form, icon: k })} className={`w-9 h-9 rounded-lg flex items-center justify-center transition ${form.icon === k ? "bg-sabren-gold text-sabren-black" : "bg-white text-sabren-black/50 hover:text-sabren-gold"}`} aria-label={k}>
                      <CategoryIcon icon={k} className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </Field>
              <Field label="Description"><input className={inputCls} value={form.description ?? ""} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-sabren-gold w-4 h-4" />
                Active
              </label>
              <Btn type="button" variant="gold" onClick={save} disabled={busy || !form.name.trim()}>
                {busy && <Loader2 className="w-4 h-4 animate-spin" />} Enregistrer
              </Btn>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}