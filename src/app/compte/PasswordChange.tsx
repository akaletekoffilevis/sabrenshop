"use client";
import { useState } from "react";
import { KeyRound, Loader2, CheckCircle2 } from "lucide-react";

const inputCls = "w-full bg-white border border-sabren-gray rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sabren-gold transition";

export function PasswordChange() {
  const [form, setForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    if (form.newPassword.length < 6) { setMsg({ ok: false, text: "Le nouveau mot de passe doit contenir au moins 6 caractères." }); return; }
    if (form.newPassword !== form.confirm) { setMsg({ ok: false, text: "Les deux nouveaux mots de passe ne correspondent pas." }); return; }
    setBusy(true);
    try {
      const res = await fetch("/api/account/password", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword }) });
      const data = await res.json();
      if (!res.ok) { setMsg({ ok: false, text: data.error || "Erreur lors du changement." }); return; }
      setMsg({ ok: true, text: "Mot de passe changé avec succès." });
      setForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch {
      setMsg({ ok: false, text: "Erreur serveur, réessayez." });
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 mt-4">
      <h2 className="flex items-center gap-2 font-bold text-sm mb-4"><KeyRound className="w-4 h-4 text-sabren-gold" /> Changer mon mot de passe</h2>
      <form onSubmit={submit} className="grid sm:grid-cols-3 gap-3">
        <input className={inputCls} type="password" placeholder="Mot de passe actuel *" required value={form.currentPassword} onChange={(e) => setForm({ ...form, currentPassword: e.target.value })} />
        <input className={inputCls} type="password" placeholder="Nouveau mot de passe *" required value={form.newPassword} onChange={(e) => setForm({ ...form, newPassword: e.target.value })} />
        <input className={inputCls} type="password" placeholder="Confirmer le nouveau *" required value={form.confirm} onChange={(e) => setForm({ ...form, confirm: e.target.value })} />
        <div className="sm:col-span-3 flex items-center gap-3">
          <button type="submit" disabled={busy} className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition disabled:opacity-60">
            {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />} Changer le mot de passe
          </button>
          {msg && (
            <span className={`text-xs font-semibold flex items-center gap-1.5 ${msg.ok ? "text-green-600" : "text-red-500"}`}>
              {msg.ok && <CheckCircle2 className="w-3.5 h-3.5" />} {msg.text}
            </span>
          )}
        </div>
      </form>
    </div>
  );
}