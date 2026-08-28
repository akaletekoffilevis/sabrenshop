"use client";
import { useState } from "react";
import { Star, Loader2, Check } from "lucide-react";

type Review = { id: string; name: string | null; rating: number; comment: string | null; createdAt: string };

export function ProductReviews({ productId, initial }: { productId: string; initial: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initial);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const avg = reviews.length ? reviews.reduce((a, r) => a + r.rating, 0) / reviews.length : 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSending(true);
    setError("");
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, name, rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Erreur lors de l'envoi.");
        setSending(false);
        return;
      }
      setSent(true);
      setName("");
      setComment("");
      setRating(5);
      setTimeout(() => setSent(false), 4000);
    } catch {
      setError("Erreur serveur, réessayez.");
      setSending(false);
    }
  };

  const starBtn = (i: number) => (
    <button type="button" key={i} onClick={() => setRating(i)} onMouseEnter={() => setHover(i)} onMouseLeave={() => setHover(0)} aria-label={`${i} étoiles`}>
      <Star className={`w-7 h-7 transition ${i <= (hover || rating) ? "fill-sabren-gold text-sabren-gold" : "text-sabren-gray text-black/20"}`} />
    </button>
  );

  return (
    <div className="grid lg:grid-cols-3 gap-6 mt-12 items-start">
      {/* Formulaire */}
      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-6 lg:sticky lg:top-28">
        <h3 className="font-display font-bold text-lg mb-1">Donnez votre avis</h3>
        <p className="text-xs text-sabren-black/50 mb-4">Votre avis paraît après modération. Aucun compte requis.</p>
        <form onSubmit={submit} className="space-y-3">
          <div>
            <span className="block text-xs font-bold uppercase text-sabren-black/55 mb-1">Votre note</span>
            <div className="flex gap-1">{[1, 2, 3, 4, 5].map(starBtn)}</div>
          </div>
          <input className="w-full bg-sabren-gray rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sabren-gold/40 transition" placeholder="Votre nom *" value={name} onChange={(e) => setName(e.target.value)} required maxLength={60} />
          <textarea className="w-full bg-sabren-gray rounded-xl px-3.5 py-2.5 text-sm outline-none focus:ring-2 focus:ring-sabren-gold/40 transition" rows={3} placeholder="Votre avis (optionnel)" value={comment} onChange={(e) => setComment(e.target.value)} maxLength={1000} />
          {error && <p className="text-xs font-semibold text-red-500 bg-red-50 rounded-xl px-3 py-2">{error}</p>}
          {sent && <p className="text-xs font-semibold text-green-600 bg-green-50 rounded-xl px-3 py-2 flex items-center gap-1.5"><Check className="w-3.5 h-3.5" /> Merci ! Votre avis est en attente de modération.</p>}
          <button type="submit" disabled={sending} className="w-full bg-sabren-black text-white font-bold rounded-full py-3 text-sm hover:bg-black transition disabled:opacity-60 flex items-center justify-center gap-2">
            {sending && <Loader2 className="w-4 h-4 animate-spin" />}
            Publier mon avis
          </button>
        </form>
      </div>

      {/* Liste */}
      <div className="lg:col-span-2">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-display font-bold text-lg">Avis clients</h3>
          {reviews.length > 0 && (
            <span className="flex items-center gap-1.5 text-sm font-bold">
              <Star className="w-4 h-4 fill-sabren-gold text-sabren-gold" /> {avg.toFixed(1)} <span className="text-sabren-black/40 font-medium">({reviews.length} avis)</span>
            </span>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="bg-sabren-cream border border-sabren-gray rounded-2xl p-8 text-center text-sm text-sabren-black/50">
            Aucun avis pour le moment. Soyez le premier à donner votre avis !
          </div>
        ) : (
          <div className="space-y-3">
            {reviews.map((r) => (
              <div key={r.id} className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5">
                <div className="flex items-center justify-between gap-3 mb-2">
                  <p className="font-bold text-sm">{r.name}</p>
                  <span className="flex text-sabren-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-sabren-gold text-sabren-gold" : "text-black/10"}`} />
                    ))}
                  </span>
                </div>
                {r.comment && <p className="text-sm text-sabren-black/70 leading-relaxed">{r.comment}</p>}
                <p className="text-[11px] text-sabren-black/35 mt-2">{new Date(r.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}