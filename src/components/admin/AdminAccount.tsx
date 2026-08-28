"use client";
import { useState } from "react";
import { Mail, KeyRound, Loader2, CheckCircle2 } from "lucide-react";
import { Card, inputCls, Btn } from "./ui";

export function AdminAccount({ email, name }: { email: string; name: string }) {
  const [newEmail, setNewEmail] = useState(email);
  const [confirmPw, setConfirmPw] = useState("");
  const [busyEmail, setBusyEmail] = useState(false);
  const [emailMsg, setEmailMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const [pw, setPw] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [busyPw, setBusyPw] = useState(false);
  const [pwMsg, setPwMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const submitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailMsg(null);
    setBusyEmail(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "email", email: newEmail, password: confirmPw }),
      });
      const data = await res.json();
      setBusyEmail(false);
      if (!res.ok) {
        setEmailMsg({ ok: false, text: data.error || "Erreur lors du changement." });
        return;
      }
      setConfirmPw("");
      setEmailMsg({ ok: true, text: "Email mis à jour. Déconnectez-vous puis reconnectez-vous avec le nouvel email." });
    } catch {
      setBusyEmail(false);
      setEmailMsg({ ok: false, text: "Erreur serveur, réessayez." });
    }
  };

  const submitPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwMsg(null);
    if (pw.newPassword.length < 6) { setPwMsg({ ok: false, text: "Le nouveau mot de passe doit contenir au moins 6 caractères." }); return; }
    if (pw.newPassword !== pw.confirm) { setPwMsg({ ok: false, text: "Les deux nouveaux mots de passe ne correspondent pas." }); return; }
    setBusyPw(true);
    try {
      const res = await fetch("/api/admin/account", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "password", currentPassword: pw.currentPassword, newPassword: pw.newPassword }),
      });
      const data = await res.json();
      setBusyPw(false);
      if (!res.ok) { setPwMsg({ ok: false, text: data.error || "Erreur lors du changement." }); return; }
      setPw({ currentPassword: "", newPassword: "", confirm: "" });
      setPwMsg({ ok: true, text: "Mot de passe changé avec succès." });
    } catch {
      setBusyPw(false);
      setPwMsg({ ok: false, text: "Erreur serveur, réessayez." });
    }
  };

  const msgCls = (m: { ok: boolean; text: string } | null) => `text-xs font-semibold flex items-center gap-1.5 ${m?.ok ? "text-green-600" : "text-red-500"}`;

  return (
    <div className="grid lg:grid-cols-2 gap-6 items-start">
      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-bold mb-1"><Mail className="w-4 h-4 text-sabren-gold" /> Adresse email</h2>
        <p className="text-sm text-sabren-black/50 mb-4">Compte actuel : <b>{email}</b> {name && `( ${name} )`}</p>
        <form onSubmit={submitEmail} className="space-y-3">
          <input className={inputCls} type="email" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required placeholder="Nouvel email" />
          <input className={inputCls} type="password" value={confirmPw} onChange={(e) => setConfirmPw(e.target.value)} required placeholder="Mot de passe actuel (confirmation)" />
          <Btn type="submit" variant="gold" disabled={busyEmail}>
            {busyEmail && <Loader2 className="w-4 h-4 animate-spin" />} Changer l’email
          </Btn>
          {emailMsg && <p className={msgCls(emailMsg)}>{emailMsg.ok && <CheckCircle2 className="w-3.5 h-3.5" />} {emailMsg.text}</p>}
        </form>
      </Card>

      <Card className="p-6">
        <h2 className="flex items-center gap-2 font-bold mb-4"><KeyRound className="w-4 h-4 text-sabren-gold" /> Mot de passe</h2>
        <form onSubmit={submitPassword} className="space-y-3">
          <input className={inputCls} type="password" value={pw.currentPassword} onChange={(e) => setPw({ ...pw, currentPassword: e.target.value })} required placeholder="Mot de passe actuel *" />
          <input className={inputCls} type="password" value={pw.newPassword} onChange={(e) => setPw({ ...pw, newPassword: e.target.value })} required placeholder="Nouveau mot de passe *" />
          <input className={inputCls} type="password" value={pw.confirm} onChange={(e) => setPw({ ...pw, confirm: e.target.value })} required placeholder="Confirmer le nouveau *" />
          <Btn type="submit" variant="gold" disabled={busyPw}>
            {busyPw && <Loader2 className="w-4 h-4 animate-spin" />} Changer le mot de passe
          </Btn>
          {pwMsg && <p className={msgCls(pwMsg)}>{pwMsg.ok && <CheckCircle2 className="w-3.5 h-3.5" />} {pwMsg.text}</p>}
        </form>
      </Card>
    </div>
  );
}