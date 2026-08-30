"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserRound, Mail, Lock, Eye, EyeOff, Check } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de la création du compte.");
        setLoading(false);
        return;
      }
      await signIn("credentials", { email, password, redirect: false });
      router.push("/");
      router.refresh();
    } catch {
      setError("Erreur serveur, réessayez.");
      setLoading(false);
    }
  };

  const inputCls = "w-full bg-sabren-gray rounded-full pl-11 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-sabren-gold/40 transition";

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-sabren-gray shadow-card-hover p-7 md:p-9 animate-fade-up">
      <div className="text-center mb-7">
        <img src="/logosabrenshop.jpeg" alt="SABREEN'SHOP" className="w-14 h-14 mx-auto rounded-2xl object-cover mb-4" loading="lazy" decoding="async" />
        <h1 className="font-display font-black text-2xl">Créer un compte</h1>
        <p className="text-sm text-sabren-black/55 mt-1">Commandez plus vite, suivez vos achats.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="relative">
          <UserRound className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Votre nom complet" required className={inputCls} />
        </div>
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" required className={inputCls} />
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe (6 caractères min)" required minLength={6} className={inputCls} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sabren-black/35 hover:text-sabren-gold transition" aria-label="Afficher le mot de passe">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-full px-4 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-sabren-gold text-sabren-black font-bold rounded-full py-3.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold disabled:opacity-60">
          {loading ? "Création..." : "Créer mon compte"}
        </button>
      </form>

      <div className="mt-6 space-y-2 text-xs text-sabren-black/55">
        <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Commande en 1 clic avec vos informations</p>
        <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Suivi simple de vos commandes</p>
        <p className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-green-600" /> Accès rapide à vos favoris</p>
      </div>

      <p className="text-sm text-center mt-6 text-sabren-black/55">
        Déjà inscrit ?{" "}
        <Link href="/connexion" className="font-bold text-sabren-gold hover:underline">Se connecter</Link>
      </p>
    </div>
  );
}