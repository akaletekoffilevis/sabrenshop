"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Mail, Loader2 } from "lucide-react";
import { Badge, Card } from "./ui";

type Sub = { id: string; email: string; active: boolean; createdAt: string };

export function NewsletterAdmin({ initial }: { initial: Sub[] }) {
  const router = useRouter();
  const [busyId, setBusyId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const remove = async (s: Sub) => {
    if (!confirm(`Retirer ${s.email} de la newsletter ?`)) return;
    setBusyId(s.id);
    const res = await fetch(`/api/newsletter/${s.id}`, { method: "DELETE" });
    setBusyId(null);
    if (!res.ok) {
      const d = await res.json().catch(() => ({}));
      alert(d.error || "Suppression impossible");
      return;
    }
    router.refresh();
  };

  const list = initial.filter((s) => (filter === "all" ? true : filter === "active" ? s.active : !s.active));
  const activeCount = initial.filter((s) => s.active).length;

  return (
    <div>
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