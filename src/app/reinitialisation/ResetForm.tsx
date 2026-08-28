"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Lock, Eye, EyeOff, Loader2, Check, ArrowLeft, AlertTriangle } from "lucide-react";

export function ResetForm({ initialToken, initialEmail }: { initialToken: string; initialEmail: string }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const missing = !initialToken || !initialEmail;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: initialToken, email: initialEmail, password }),
      });
      const data = await res.json();
      setLoading(false);
      if (!res.ok) {
        setError(data.error || "Lien invalide ou expiré.");
        return;
      }
      setDone(true);
    } catch {
      setLoading(false);
      setError("Erreur serveur, réessayez.");
    }
  };

  const inputCls = "w-full bg-sabren-gray rounded-full pl-11 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-sabren-gold/40 transition";

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-sabren-gray shadow-card-hover p-7 md:p-9 animate-fade-up">
      {missing ? (
        <div className="text-center">
          <span className="w-12 h-12 mx-auto rounded-full bg-red-50 text-red-500 flex items-center justify-center mb-4"><AlertTriangle className="w-5 h-5" /></span>
          <h1 className="font-display font-black text-2xl">Lien invalide</h1>
          <p className="text-sm text-sabren-black/55 mt-2">Ce lien de réinitialisation est incomplet ou a déjà été utilisé.</p>
          <Link href="/mot-de-passe-oublie" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-sabren-gold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Faire une nouvelle demande
          </Link>
        </div>
      ) : done ? (
        <div className="text-center">
          <span className="w-12 h-12 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4"><Check className="w-5 h-5" /></span>
          <h1 className="font-display font-black text-2xl">Mot de passe réinitialisé</h1>
          <p className="text-sm text-sabren-black/55 mt-2">Vous pouvez maintenant vous connecter avec votre nouveau mot de passe.</p>
          <button onClick={() => router.push("/connexion")} className="mt-6 bg-sabren-black text-white font-bold rounded-full px-6 py-3 text-sm hover:bg-black transition">
            Aller à la connexion
          </button>
        </div>
      ) : (
        <>
          <div className="text-center mb-7">
            <img src="/logosabrenshop.jpeg" alt="Sabreen'Shop" className="w-14 h-14 mx-auto rounded-2xl object-cover mb-4" loading="lazy" decoding="async" />
            <h1 className="font-display font-black text-2xl">Nouveau mot de passe</h1>
            <p className="text-sm text-sabren-black/55 mt-1">Pour le compte <strong>{initialEmail}</strong></p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
              <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Nouveau mot de passe" required className={inputCls} />
              <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sabren-black/35 hover:text-sabren-gold transition" aria-label="Afficher le mot de passe">
                {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
              <input type={show ? "text" : "password"} value={confirm} onChange={(e) => setConfirm(e.target.value)} placeholder="Confirmer le mot de passe" required className={inputCls} />
            </div>
            {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-full px-4 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-sabren-black text-white font-bold rounded-full py-3.5 text-sm hover:bg-black transition shadow-card disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Réinitialiser
            </button>
          </form>
        </>
      )}
    </div>
  );
}