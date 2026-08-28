import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Badge, PageHeader } from "@/components/admin/ui";
import { Users, ShieldCheck, UserRound } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminComptesPage() {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/connexion");

  const [users, totalOrders] = await Promise.all([
    prisma.user.findMany({
      include: { _count: { select: { orders: true, reviews: true } } },
      orderBy: { createdAt: "desc" },
    }),
    prisma.order.count(),
  ]);

  const total = users.length;
  const admins = users.filter((u) => u.role === "ADMIN").length;
  const customers = total - admins;
  const dateFmt = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" });

  const stats = [
    { label: "Comptes au total", value: total, icon: Users },
    { label: "Clients", value: customers, icon: UserRound },
    { label: "Administrateurs", value: admins, icon: ShieldCheck },
  ];

  return (
    <div>
      <PageHeader title="Comptes utilisateurs" subtitle="Tous les comptes enregistrés sur la boutique." />

      <div className="grid sm:grid-cols-3 gap-4 mb-6">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.label} className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl bg-sabren-gold/15 text-sabren-gold flex items-center justify-center shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-black leading-none">{s.value}</p>
                <p className="text-xs text-sabren-black/50 font-semibold mt-1">{s.label}</p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-sabren-gray/60 text-left text-xs uppercase tracking-wide text-sabren-black/50">
                <th className="px-4 py-3 font-bold">Utilisateur</th>
                <th className="px-4 py-3 font-bold">Email</th>
                <th className="px-4 py-3 font-bold">Rôle</th>
                <th className="px-4 py-3 font-bold">Inscrit le</th>
                <th className="px-4 py-3 font-bold">Commandes</th>
                <th className="px-4 py-3 font-bold">Avis</th>
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
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? <Badge tone="gold">Admin</Badge> : <Badge tone="gray">Client</Badge>}
                  </td>
                  <td className="px-4 py-3 text-sabren-black/70">{dateFmt.format(u.createdAt)}</td>
                  <td className="px-4 py-3 font-semibold">{u._count.orders}</td>
                  <td className="px-4 py-3 font-semibold">{u._count.reviews}</td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-10 text-center text-sabren-black/40 text-sm">Aucun compte pour l’instant.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {totalOrders > 0 && <p className="text-xs text-sabren-black/40 mt-3">Les commandes sont gérées via WhatsApp, sans compte client obligatoire.</p>}
    </div>
  );
}