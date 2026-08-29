"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Field, inputCls, Btn, Badge, Card } from "./ui";
import { Pencil, Trash2, Plus, X, Loader2, ChevronDown } from "lucide-react";

type Faq = { id: string; question: string; answer: string; position: number; isActive: boolean };

const blank = { question: "", answer: "", position: 0, isActive: true };

export function FaqManager({ initial }: { initial: Faq[] }) {
  const router = useRouter();
  const [editing, setEditing] = useState<Faq | null>(null);
  const [creating, setCreating] = useState(false);
  const [busy, setBusy] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);
  const [form, setForm] = useState(blank);

  const save = async () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    setBusy(true);
    const url = editing ? `/api/admin/faqs/${editing.id}` : "/api/admin/faqs";
    try {
      const res = await fetch(url, {
        method: editing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, position: Number(form.position) }),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) { alert(data?.error || "Erreur d'enregistrement"); return; }
      setForm(blank); setEditing(null); setCreating(false);
      router.refresh();
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  const del = async (f: Faq) => {
    if (!confirm(`Supprimer cette question ?`)) return;
    try {
      const res = await fetch(`/api/admin/faqs/${f.id}`, { method: "DELETE" });
      if (!res.ok) { const d = await res.json().catch(() => null); alert(d?.error || "Suppression impossible"); return; }
      router.refresh();
    } catch {
      alert("Erreur réseau. Réessayez.");
    }
  };

  const formPanel = (
    <Card className="p-5 mb-6 border-sabren-gold/40 animate-fade-up">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-bold">{editing ? "Modifier la question" : "Nouvelle question"}</h2>
        <button onClick={() => { setEditing(null); setCreating(false); setForm(blank); }} className="p-1.5 text-sabren-black/40 hover:text-sabren-black"><X className="w-4 h-4" /></button>
      </div>
      <div className="space-y-4">
        <Field label="Question">
          <input className={inputCls} value={form.question} onChange={(e) => setForm({ ...form, question: e.target.value })} placeholder="Ex : Comment passer commande ?" required />
        </Field>
        <Field label="Réponse">
          <textarea className={inputCls} rows={3} value={form.answer} onChange={(e) => setForm({ ...form, answer: e.target.value })} placeholder="Réponse claire et courte..." required />
        </Field>
        <Field label="Position" hint="Ordre d'affichage (1 = en premier)">
          <input className={inputCls} type="number" min={0} value={form.position} onChange={(e) => setForm({ ...form, position: Number(e.target.value) })} />
        </Field>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <label className="flex items-center gap-2 text-sm font-medium">
          <input type="checkbox" checked={form.isActive} onChange={(e) => setForm({ ...form, isActive: e.target.checked })} className="accent-sabren-gold w-4 h-4" />
          Visible sur la page FAQ
        </label>
        <Btn type="button" variant="gold" onClick={save} disabled={busy || !form.question.trim() || !form.answer.trim()}>
          {busy && <Loader2 className="w-4 h-4 animate-spin" />}
          {editing ? "Enregistrer" : "Ajouter la question"}
        </Btn>
      </div>
    </Card>
  );

  return (
    <div>
      {!creating && !editing && (
        <div className="mb-6">
          <Btn type="button" variant="gold" onClick={() => { setCreating(true); setForm((f) => ({ ...f, position: initial.length + 1 })); }}>
            <Plus className="w-4 h-4" /> Nouvelle question
          </Btn>
        </div>
      )}
      {creating && formPanel}

      <div className="space-y-2">
        {initial.length === 0 && (
          <Card className="p-10 text-center">
            <p className="font-bold">Aucune question pour l’instant</p>
            <p className="text-sm text-sabren-black/50 mt-1">Ajoutez la première question de la FAQ.</p>
          </Card>
        )}
        {initial.map((f) => (
          <Card key={f.id} className="overflow-hidden">
            <button onClick={() => setOpenId(openId === f.id ? null : f.id)} className="w-full flex items-center gap-3 p-4 text-left">
              <span className="flex-1 font-bold text-sm">{f.question}</span>
              <Badge tone={f.isActive ? "green" : "gray"}>{f.isActive ? "Visible" : "Masquée"}</Badge>
              <ChevronDown className={`w-4 h-4 text-sabren-black/40 transition-transform ${openId === f.id ? "rotate-180" : ""}`} />
            </button>
            {openId === f.id && (
              <div className="px-4 pb-4 space-y-3">
                <p className="text-sm text-sabren-black/65 bg-sabren-cream rounded-xl px-4 py-3">{f.answer}</p>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-sabren-black/40">Position : {f.position}</span>
                  <div className="flex items-center gap-1">
                    <button onClick={() => { setEditing(f); setCreating(false); setForm({ question: f.question, answer: f.answer, position: f.position, isActive: f.isActive }); }} className="p-2 rounded-lg text-sabren-black/40 hover:text-sabren-gold hover:bg-sabren-cream transition" aria-label="Modifier">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => del(f)} className="p-2 rounded-lg text-sabren-black/40 hover:text-red-500 hover:bg-red-50 transition" aria-label="Supprimer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>

      {editing && formPanel}
    </div>
  );
}