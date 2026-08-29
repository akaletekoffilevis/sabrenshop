"use client";
import { useState } from "react";
import { Loader2, Check, Mail } from "lucide-react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error();
      setStatus("done");
      setEmail("");
    } catch {
      setStatus("error");
    }
  };

  return (
    <div className="bg-sabren-black text-white border-b border-white/10">
      <div className="max-w-7xl mx-auto container-px py-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="w-11 h-11 rounded-full bg-sabren-gold/15 border border-sabren-gold/30 flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-sabren-gold" />
          </span>
          <div>
            <p className="font-display font-bold">Recevez nos nouveautés et promos</p>
            <p className="text-xs text-white/60 mt-0.5">1 email par semaine, désabonnement en 1 clic.</p>
          </div>
        </div>
        <form onSubmit={submit} className="flex items-center gap-2 w-full md:w-auto">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Votre adresse email"
            className="flex-1 md:w-72 bg-white/10 border border-white/15 rounded-full px-4 py-2.5 text-sm outline-none focus:border-sabren-gold placeholder:text-white/40"
          />
          <button
            type="submit"
            disabled={status === "loading"}
            className="shrink-0 inline-flex items-center gap-1.5 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition disabled:opacity-60"
          >
            {status === "loading" && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {status === "done" && <Check className="w-3.5 h-3.5" />}
            {status === "done" ? "Inscrit !" : "S’inscrire"}
          </button>
        </form>
        {status === "done" && <p className="w-full text-xs text-green-400">Merci, vous êtes bien inscrit à la newsletter.</p>}
        {status === "error" && <p className="w-full text-xs text-red-400">Erreur, réessayez s’il vous plaît.</p>}
      </div>
    </div>
  );
}