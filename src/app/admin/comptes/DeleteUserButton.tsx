"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";

export function DeleteUserButton({ id, name, email }: { id: string; name: string | null; email: string }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  const remove = async () => {
    const label = name || email;
    if (!window.confirm(`Supprimer définitivement le compte de « ${label} » ?`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/users/${id}`, { method: "DELETE" });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        window.alert(data.error || "Suppression impossible.");
        return;
      }
      router.refresh();
    } catch {
      window.alert("Erreur réseau. Réessayez.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      onClick={remove}
      disabled={busy}
      className="inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-bold text-red-600 hover:bg-red-50 transition disabled:opacity-50"
      title="Supprimer ce compte"
    >
      <Trash2 className="w-3.5 h-3.5" /> {busy ? "..." : "Supprimer"}
    </button>
  );
}