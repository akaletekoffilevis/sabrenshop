"use client";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MessageCircle, Lock, Mail, Eye, EyeOff } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setError("Email ou mot de passe incorrect.");
      return;
    }
    router.push("/");
    router.refresh();
  };

  const inputCls = "w-full bg-sabren-gray rounded-full pl-11 pr-11 py-3 text-sm outline-none focus:ring-2 focus:ring-sabren-gold/40 transition";

  return (
    <div className="w-full max-w-md bg-white rounded-3xl border border-sabren-gray shadow-card-hover p-7 md:p-9 animate-fade-up">
      <div className="text-center mb-7">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-sabren-black flex items-center justify-center text-sabren-gold font-display font-black text-2xl mb-4">S</div>
        <h1 className="font-display font-black text-2xl">Bon retour !</h1>
        <p className="text-sm text-sabren-black/55 mt-1">Connectez-vous pour commander plus vite.</p>
      </div>

      <form onSubmit={submit} className="space-y-4">
        <div className="relative">
          <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Votre email" required className={inputCls} />
        </div>
        <div className="relative">
          <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-sabren-black/35" />
          <input type={show ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Votre mot de passe" required className={inputCls} />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-sabren-black/35 hover:text-sabren-gold transition" aria-label="Afficher le mot de passe">
            {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-full px-4 py-2">{error}</p>}

        <button type="submit" disabled={loading} className="w-full bg-sabren-black text-white font-bold rounded-full py-3.5 text-sm hover:bg-black transition shadow-card disabled:opacity-60">
          {loading ? "Connexion..." : "Se connecter"}
        </button>
      </form>

      <div className="relative my-6 text-center">
        <span className="absolute inset-x-0 top-1/2 border-t border-sabren-gray" />
        <span className="relative bg-white px-3 text-xs text-sabren-black/40">ou</span>
      </div>

      <a href={whatsappLink("Bonjour Sabren'Shop, je souhaite commander sans compte.")} target="_blank" className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-full py-3 text-sm transition">
        <MessageCircle className="w-4 h-4" /> Commander via WhatsApp sans compte
      </a>

      <p className="text-sm text-center mt-6 text-sabren-black/55">
        Pas encore de compte ?{" "}
        <Link href="/inscription" className="font-bold text-sabren-gold hover:underline">Créer un compte</Link>
      </p>
    </div>
  );
}