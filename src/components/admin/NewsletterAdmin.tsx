"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, Loader2, Send, CalendarClock } from "lucide-react";
import { Badge, Card, Btn } from "./ui";

type Sub = { id: string; email: string; active: boolean; createdAt: string | Date };

export function NewsletterAdmin({ initial, lastDigestAt }: { initial: Sub[]; lastDigestAt?: string | Date | null }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [busyDigest, setBusyDigest] = useState(false);
  const [digestMsg, setDigestMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const remove = async (s: Sub) => {
    if (!confirm(`Retirer ${s.email} de la newsletter ?`)) return;
    setBusyId(s.id);
    try {
      const res = await fetch(`/api/newsletter/${s.id}`, { method: "DELETE" });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        alert(d.error || "Suppression impossible");
        return;
      }
      router.refresh();
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setBusyId(null);
    }
  };

  const sendDigest = async () => {
    if (!confirm("Envoyer le récap quotidien à tous les abonnés actifs maintenant ?")) return;
    setBusyDigest(true);
    setDigestMsg(null);
    try {
      const res = await fetch("/api/admin/newsletter/digest", { method: "POST" });
      const d = await res.json().catch(() => ({}));
      setBusyDigest(false);
      if (!res.ok) { setDigestMsg({ ok: false, text: d.error || "Erreur lors de l’envoi." }); return; }
      if (!d.sent) {
        setDigestMsg({ ok: true, text: "Aucun email envoyé (rien de nouveau, ou SMTP non configuré)." });
      } else {
        setDigestMsg({ ok: true, text: `Récap envoyé à ${d.recipients} abonné(s) — ${d.products} produit(s), ${d.promos} code(s) promo.` });
      }
      router.refresh();
    } catch {
      setBusyDigest(false);
      setDigestMsg({ ok: false, text: "Erreur serveur, réessayez." });
    }
  };

  const list = initial.filter((s) => (filter === "all" ? true : filter === "active" ? s.active : !s.active));
  const activeCount = initial.filter((s) => s.active).length;

  return (
    <div>
      <Card className="p-5 mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-start gap-3 min-w-0">
          <span className="w-10 h-10 rounded-xl bg-sabren-gold/15 text-sabren-gold flex items-center justify-center shrink-0">
            <CalendarClock className="w-5 h-5" />
          </span>
          <div className="min-w-0">
            <p className="font-bold text-sm">Récap quotidien automatisé</p>
            <p className="text-xs text-sabren-black/50 mt-0.5">
              Dernier récap : {lastDigestAt ? new Date(lastDigestAt).toLocaleString("fr-FR") : "jamais"} — un seul email par jour (nouveaux produits + codes promo). Déclenché par le cron Vercel à 9h00 UTC.
            </p>
            {digestMsg && <p className={`text-xs font-semibold mt-1.5 flex items-center gap-1.5 ${digestMsg.ok ? "text-green-600" : "text-red-500"}`}>{digestMsg.text}</p>}
          </div>
        </div>
        <Btn variant="gold" onClick={sendDigest} disabled={busyDigest}>
          {busyDigest ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Envoyer le récap maintenant
        </Btn>
      </Card>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">Abonnés</p>
          <p className="font-black text-xl mt-2">{initial.length}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">Actifs</p>
          <p className="font-black text-xl mt-2 text-green-600">{activeCount}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">Désabonnés</p>
          <p className="font-black text-xl mt-2 text-red-500">{initial.length - activeCount}</p>
        </Card>
      </div>

      <div className="flex items-center gap-2 mb-4">
        {(["all", "active", "inactive"] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold border transition ${filter === f ? "bg-sabren-black text-white border-sabren-black" : "bg-white border-sabren-gray text-sabren-black/60 hover:border-sabren-gold"}`}
          >
            {f === "all" ? "Tous" : f === "active" ? "Actifs" : "Désabonnés"}
          </button>
        ))}
      </div>

      {list.length === 0 ? (
        <Card className="p-10 text-center">
          <Mail className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
          <p className="font-bold">Aucun abonné</p>
          <p className="text-sm text-sabren-black/50 mt-1">Les inscriptions depuis le pied de page apparaîtront ici.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-sabren-gray/60 text-left text-xs uppercase text-sabren-black/45">
              <tr>
                <th className="px-5 py-3">Email</th>
                <th className="py-3">Statut</th>
                <th className="py-3">Inscrit le</th>
                <th className="py-3 text-right pr-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((s) => (
                <tr key={s.id} className="border-t border-sabren-gray hover:bg-sabren-cream/50 transition">
                  <td className="px-5 py-3 font-medium">{s.email}</td>
                  <td className="py-3"><Badge tone={s.active ? "green" : "gray"}>{s.active ? "Actif" : "Désabonné"}</Badge></td>
                  <td className="py-3 text-sabren-black/55">{new Date(s.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</td>
                  <td className="py-3 text-right pr-5">
                    <button
                      onClick={() => remove(s)}
                      disabled={busyId === s.id}
                      className="p-2 rounded-lg text-sabren-black/40 hover:text-red-500 hover:bg-red-50 transition disabled:opacity-50"
                      aria-label="Retirer"
                    >
                      {busyId === s.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}