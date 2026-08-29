"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Trash2, Loader2 } from "lucide-react";

export function DeleteProductButton({ id, name }: { id: string; name: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const del = async () => {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        router.refresh();
      } else {
        const d = await res.json().catch(() => null);
        alert(d?.error || "Impossible de supprimer ce produit.");
      }
    } catch {
      alert("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button onClick={del} disabled={busy} className="p-2 rounded-lg text-sabren-black/40 hover:text-red-500 hover:bg-red-50 transition" aria-label="Supprimer">
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
    </button>
  );
}