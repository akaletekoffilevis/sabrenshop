"use client";
import { useState } from "react";
import { Badge } from "@/components/admin/ui";
import { ViewToggle } from "@/components/admin/ViewToggle";
import { Mail, CalendarDays, Star, ShieldCheck, UserRound, Phone, MapPin } from "lucide-react";
import { DeleteUserButton } from "./DeleteUserButton";

export type AccountRow = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
  reviews: number;
  phone: string | null;
  city: string | null;
  quartier: string | null;
  address: string | null;
  deliveryPreference: string | null;
};

const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

const PREF_LABEL: Record<string, string> = {
  delivery: "Livraison à domicile",
  pickup: "Retrait boutique",
  transport: "Transport",
};

export function AccountsView({ users }: { users: AccountRow[] }) {
  const [view, setView] = useState<"cards" | "list">("list");

  if (users.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card px-4 py-10 text-center text-sabren-black/40 text-sm">
        Aucun compte pour l’instant.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-sabren-gray shadow-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-4 sm:px-5 py-3 border-b border-sabren-gray">
        <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/50">
          {users.length} compte{users.length > 1 ? "s" : ""} affiché{users.length > 1 ? "s" : ""} sur cette page
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "list" ? (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sabren-gray/60 text-left text-xs uppercase tracking-wide text-sabren-black/50">
                <th className="px-4 py-3 font-bold">Utilisateur</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Téléphone</th>
                <th className="px-4 py-3 font-bold">Livraison</th>
                <th className="px-4 py-3 font-bold">Rôle</th>
                <th className="px-4 py-3 font-bold">Inscrit le</th>
                <th className="px-4 py-3 font-bold">Avis</th>
                <th className="px-4 py-3 font-bold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u.id} className="border-t border-sabren-gray hover:bg-sabren-gray/40 transition">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-full bg-sabren-gold/20 text-sabren-gold font-black text-sm flex items-center justify-center shrink-0 uppercase">
                        {(u.name || u.email || "?").slice(0, 1)}
                      </span>
                      <span className="font-semibold">{u.name || "—"}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-sabren-black/70">{u.email}</td>
                  <td className="px-4 py-3 text-sabren-black/70">{u.phone || "—"}</td>
                  <td className="px-4 py-3 text-sabren-black/70">
                    {u.city ? (
                      <span title={u.address || undefined}>
                        {u.city}
                        {u.quartier ? ` · ${u.quartier}` : ""}
                        {u.deliveryPreference && <span className="text-sabren-gold font-bold"> · {PREF_LABEL[u.deliveryPreference]}</span>}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? <Badge tone="gold">Admin</Badge> : <Badge tone="gray">Client</Badge>}
                  </td>
                  <td className="px-4 py-3 text-sabren-black/70">{dateFmt.format(new Date(u.createdAt))}</td>
                  <td className="px-4 py-3 font-semibold">{u.reviews}</td>
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? <span className="text-xs text-sabren-black/35">Protégé</span> : <DeleteUserButton id={u.id} name={u.name} email={u.email} />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4 p-4 sm:p-5">
          {users.map((u) => (
            <div key={u.id} className="rounded-2xl border border-sabren-gray hover:border-sabren-gold transition p-4 flex flex-col gap-3 bg-white">
              <div className="flex items-center gap-3">
                <span className="w-11 h-11 rounded-full bg-sabren-gold/20 text-sabren-gold font-black text-lg flex items-center justify-center shrink-0 uppercase">
                  {(u.name || u.email || "?").slice(0, 1)}
                </span>
                <div className="min-w-0">
                  <p className="font-bold truncate">{u.name || "—"}</p>
                  <p className="text-xs text-sabren-black/55 truncate">{u.role === "ADMIN" ? "Administrateur" : "Client"}</p>
                </div>
              </div>
              <div className="space-y-1.5 text-xs text-sabren-black/60">
                <p className="flex items-center gap-2 truncate"><Mail className="w-3.5 h-3.5 shrink-0" /> {u.email}</p>
                {u.phone && <p className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 shrink-0" /> {u.phone}</p>}
                {(u.city || u.quartier) && (
                  <p className="flex items-center gap-2 truncate"><MapPin className="w-3.5 h-3.5 shrink-0" /> {u.city || ""}{u.city && u.quartier ? " · " : ""}{u.quartier || ""}{u.address ? ` — ${u.address}` : ""}</p>
                )}
                <p className="flex items-center gap-2"><CalendarDays className="w-3.5 h-3.5 shrink-0" /> Inscrit le {dateFmt.format(new Date(u.createdAt))}</p>
                <p className="flex items-center gap-2"><Star className="w-3.5 h-3.5 shrink-0" /> {u.reviews} avis</p>
              </div>
              {u.deliveryPreference && (
                <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-sabren-gold/15 text-sabren-gold text-[11px] font-bold px-3 py-1">{PREF_LABEL[u.deliveryPreference]}</span>
              )}
              <div className="mt-auto flex items-center justify-between gap-2 border-t border-sabren-gray pt-3">
                {u.role === "ADMIN" ? (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sabren-black/35"><ShieldCheck className="w-3.5 h-3.5" /> Compte protégé</span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-sabren-black/45"><UserRound className="w-3.5 h-3.5" /> Client</span>
                )}
                {u.role !== "ADMIN" && <DeleteUserButton id={u.id} name={u.name} email={u.email} />}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}