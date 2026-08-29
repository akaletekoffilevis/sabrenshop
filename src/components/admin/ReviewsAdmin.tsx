"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Badge } from "./ui";
import { Pagination } from "./Pagination";
import { Star, Check, Trash2, Loader2 } from "lucide-react";

type Rev = { id: string; name: string | null; rating: number; comment: string | null; isApproved: boolean; productName: string; createdAt: string };

export function ReviewsAdmin({ initial }: { initial: Rev[] }) {
  const router = useRouter();
  const [reviews, setReviews] = useState(initial);
  const [busy, setBusy] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved">("all");
  const [page, setPage] = useState(1);

  const PER_PAGE = 8;
  const act = async (id: string, action: "approve" | "delete") => {
    setBusy(id);
    const url = `/api/admin/reviews/${id}`;
    try {
      const res = await fetch(url, { method: action === "approve" ? "PATCH" : "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ isApproved: true }) });
      if (res.ok) {
        setReviews((r) => (action === "approve" ? r.map((x) => (x.id === id ? { ...x, isApproved: true } : x)) : r.filter((x) => x.id !== id)));
        router.refresh();
      } else {
        const d = await res.json().catch(() => null);
        alert(d?.error || "Action impossible");
      }
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setBusy("");
    }
  };

  const filtered = reviews.filter((r) => (filter === "pending" ? !r.isApproved : filter === "approved" ? r.isApproved : true));
  const pages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  const eff = Math.min(page, pages);
  const paged = filtered.slice((eff - 1) * PER_PAGE, eff * PER_PAGE);

  return (
    <div>
      <div className="flex gap-2 mb-5">
        {(["all", "pending", "approved"] as const).map((f) => (
          <button key={f} onClick={() => { setFilter(f); setPage(1); }} className={`rounded-full px-4 py-1.5 text-xs font-bold transition ${filter === f ? "bg-sabren-black text-white" : "bg-white border border-sabren-gray hover:border-sabren-gold"}`}>
            {f === "all" ? "Tous" : f === "pending" ? "Masqués" : "Publiés"}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sabren-gray p-10 text-center text-sm text-sabren-black/45">Aucun avis.</div>
      ) : (
        <div className="space-y-3">
          {paged.map((r) => (
            <div key={r.id} className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 flex flex-wrap items-start gap-3">
              <div className="flex-1 min-w-52">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-sm">{r.name || "Anonyme"}</span>
                  <span className="flex text-sabren-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? "fill-sabren-gold text-sabren-gold" : "text-black/10"}`} />
                    ))}
                  </span>
                  <Badge tone={r.isApproved ? "green" : "gold"}>{r.isApproved ? "Publié" : "Masqué"}</Badge>
                </div>
                <p className="text-xs text-sabren-black/45">{r.productName} · {new Date(r.createdAt).toLocaleDateString("fr-FR")}</p>
                {r.comment && <p className="text-sm text-sabren-black/70 mt-2">{r.comment}</p>}
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                {!r.isApproved && (
                  <button onClick={() => act(r.id, "approve")} disabled={busy === r.id} className="inline-flex items-center gap-1.5 bg-green-600 text-white rounded-full px-3.5 py-2 text-xs font-bold hover:bg-green-700 transition disabled:opacity-50">
                    {busy === r.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />} Approuver
                  </button>
                )}
                <button onClick={() => { if (confirm("Supprimer cet avis ?")) act(r.id, "delete"); }} disabled={busy === r.id} className="p-2 rounded-lg text-sabren-black/40 hover:text-red-500 hover:bg-red-50 transition" aria-label="Supprimer">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Pagination page={eff} pages={pages} total={filtered.length} onChange={setPage} />
    </div>
  );
}