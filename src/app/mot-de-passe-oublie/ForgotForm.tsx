"use client";
import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowLeft, Loader2, Check } from "lucide-react";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/forgot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setError(d.error || "Erreur serveur.");
        setLoading(false);
        return;
      }
      setSent(true);
    } catch {
      setError("Erreur serveur, réessayez.");
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-sabren-gray shadow-card-hover p-7 md:p-9 animate-fade-up">
      {sent ? (
        <div className="text-center">
          <span className="w-12 h-12 mx-auto rounded-full bg-green-50 text-green-600 flex items-center justify-center mb-4"><Check className="w-5 h-5" /></span>
          <h1 className="font-display font-black text-2xl">Email envoyé</h1>
          <p className="text-sm text-sabren-black/55 mt-2 leading-relaxed">
            Si un compte existe pour <strong>{email}</strong>, un lien de réinitialisation valable 1 heure vient d’être envoyé.
          </p>
          <Link href="/connexion" className="mt-6 inline-flex items-center gap-1.5 text-sm font-bold text-sabren-gold hover:underline">
            <ArrowLeft className="w-4 h-4" /> Retour à la connexion
          </Link>
        </div>
      ) : (
        <>
          <div className="text-center mb-7">
            <img src="/logosabrenshop.jpeg" alt="Sabreen'Shop" className="w-14 h-14 mx-auto rounded-2xl object-cover mb-4" loading="lazy" decoding="async" />
            <h1 className="font-display font-black text-2xl">Mot de passe oublié</h1>
            <p className="text-sm text-sabren-black/55 mt-1">Entrez votre email, nous vous enverrons un lien pour le réinitialiser.</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div className="relative">
              <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" required className="w-full bg-sabren-gray rounded-full pl-11 pr-6 py-3 text-sm outline-none focus:ring-2 focus:ring-sabren-gold/40 transition" />
            </div>
            {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-full px-4 py-2">{error}</p>}
            <button type="submit" disabled={loading} className="w-full bg-sabren-black text-white font-bold rounded-full py-3.5 text-sm hover:bg-black transition shadow-card disabled:opacity-60 flex items-center justify-center gap-2">
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Envoyer le lien
            </button>
          </form>

          <p className="text-sm text-center mt-6">
            <Link href="/connexion" className="inline-flex items-center gap-1.5 font-semibold text-sabren-gold hover:underline">
              <ArrowLeft className="w-4 h-4" /> Retour à la connexion
            </Link>
          </p>
        </>
      )}
    </div>
  );
}