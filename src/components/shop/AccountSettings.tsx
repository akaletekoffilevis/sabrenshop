"use client";
import { useState } from "react";
import { Loader2, CheckCircle2, Mail, Trash2, AlertTriangle } from "lucide-react";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

const inputCls = "w-full bg-white border border-sabren-gray rounded-xl px-4 py-2.5 text-sm outline-none focus:border-sabren-gold transition";

export function AccountSettings({ email }: { email: string }) {
  const [newEmail, setNewEmail] = useState(email);
  const [emailPw, setEmailPw] = useState("");
  const [busyEmail, setBusyEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [confirmText, setConfirmText] = useState("");
  const [busyDel, setBusyDel] = useState(false);
  const [delMsg, setDelMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const router = useRouter();

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);
    setBusyEmail(true);
    try {
      const res = await fetch("/api/account/email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: newEmail, password: emailPw }),
      });
      const data = await res.json();
      setBusyEmail(false);
      if (!res.ok) { setEmailMsg({ ok: false, text: data.error || "Erreur lors du changement." }); return; }
      setEmailPw("");
      setEmailMsg({ ok: true, text: "Email mis à jour. Reconnectez-vous avec votre nouvel email." });
      router.refresh();
    } catch {
      setBusyEmail(false);
      setEmailMsg({ ok: false, text: "Erreur serveur, réessayez." });
    }
  };

  const submitDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (confirmText !== "SUPPRIMER") { setDelMsg({ ok: false, text: "Tapez SUPPRIMER pour confirmer la suppression." }); return; }
    setDelMsg(null);
    setBusyDel(true);
    try {
      const res = await fetch("/api/account/delete", { method: "POST" });
      const data = await res.json();
      if (!res.ok) { setBusyDel(false); setDelMsg({ ok: false, text: data.error || "Suppression impossible." }); return; }
      await signOut({ redirect: false });
      router.push("/");
      router.refresh();
    } catch {
      setBusyDel(false);
      setDelMsg({ ok: false, text: "Erreur serveur, réessayez." });
    }
  };

  const msgCls = (m: { ok: boolean; text: string } | null) => `text-xs font-semibold flex items-center gap-1.5 ${m?.ok ? "text-green-600" : "text-red-500"}`;

  return (
    <div>
      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 mt-4">
        <h2 className="flex items-center gap-2 font-bold text-sm mb-4"><Mail className="w-4 h-4 text-sabren-gold" /> Mon adresse email</h2>
        <form onSubmit={submitEmail} className="grid sm:grid-cols-3 gap-3">
          <input className={inputCls} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required placeholder="Nouvel email *" />
          <input className={inputCls} type="password" value={emailPw} onChange={(e) => setEmailPw(e.target.value)} required placeholder="Mot de passe actuel *" />
          <button type="submit" disabled={busyEmail} className="inline-flex items-center justify-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition disabled:opacity-60">
            {busyEmail ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4" />} Changer l’email
          </button>
          {emailMsg && <p className={msgCls(emailMsg)}>{emailMsg.ok && <CheckCircle2 className="w-3.5 h-3.5" />} {emailMsg.text}</p>}
        </form>
      </div>

      <div className="bg-white rounded-2xl border border-red-200 shadow-card p-5 mt-4">
        <h2 className="flex items-center gap-2 font-bold text-sm text-red-600 mb-1"><AlertTriangle className="w-4 h-4" /> Supprimer mon compte</h2>
        <p className="text-xs text-sabren-black/50 mb-4">La suppression est définitive et ne peut pas être annulée : votre compte et vos données seront fermés.</p>
        <form onSubmit={submitDelete} className="grid sm:grid-cols-2 gap-3">
          <span className="flex sm:col-span-2 items-center gap-2 text-xs text-sabren-black/50"><CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-green-600" /> Confirmation suffisante, aucun mot de passe requis. Tapez « SUPPRIMER » pour valider.</span>
          <input className={inputCls} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} required placeholder="Tapez « SUPPRIMER »" />
          <button type="submit" disabled={busyDel} className="inline-flex items-center justify-center gap-2 bg-red-600 text-white font-bold rounded-full px-5 py-2.5 text-sm hover:bg-red-700 transition disabled:opacity-60">
            {busyDel ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />} Supprimer mon compte
          </button>
          {delMsg && <p className={`sm:col-span-2 text-xs font-semibold flex items-center gap-1.5 ${delMsg.ok ? "text-green-600" : "text-red-500"}`}>{delMsg.text}</p>}
        </form>
      </div>
    </div>
  );
}