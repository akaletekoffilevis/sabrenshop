import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Badge, PageHeader } from "@/components/admin/ui";
import { Users, ShieldCheck, UserRound, ChevronLeft, ChevronRight } from "lucide-react";
import { DeleteUserButton } from "./DeleteUserButton";

export const dynamic = "force-dynamic";

const PER_PAGE = 15;

export default async function AdminComptesPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const session = await auth();
  if ((session?.user as { role?: string } | undefined)?.role !== "ADMIN") redirect("/connexion");

  const sp = await searchParams;
  const page = Math.max(1, Number(sp.page) || 1);

  const [users, total, admins] = await Promise.all([
    prisma.user.findMany({
      include: { _count: { select: { reviews: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PER_PAGE,
      take: PER_PAGE,
    }),
    prisma.user.count(),
    prisma.user.count({ where: { role: "ADMIN" } }),
  ]);

  const customers = total - admins;
  const pages = Math.max(1, Math.ceil(total / PER_PAGE));
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
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? <Badge tone="gold">Admin</Badge> : <Badge tone="gray">Client</Badge>}
                  </td>
                  <td className="px-4 py-3 text-sabren-black/70">{dateFmt.format(u.createdAt)}</td>
                  <td className="px-4 py-3 font-semibold">{u._count.reviews}</td>
                  <td className="px-4 py-3">
                    {u.role === "ADMIN" ? (
                      <span className="text-xs text-sabren-black/35">Protégé</span>
                    ) : (
                      <DeleteUserButton id={u.id} name={u.name} email={u.email} />
                    )}
                  </td>
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

      {pages > 1 && (
        <div className="flex flex-wrap items-center justify-between gap-3 mt-5">
          <p className="text-xs text-sabren-black/45 font-semibold">Page {page} sur {pages} — {total} compte{total > 1 ? "s" : ""}</p>
          <div className="flex items-center gap-1.5">
            {page > 1 && (
              <Link href={`/admin/comptes?page=${page - 1}`} className="inline-flex items-center gap-1 rounded-full border border-sabren-gray bg-white px-4 py-2 text-sm font-bold hover:border-sabren-gold transition">
                <ChevronLeft className="w-4 h-4" /> Précédent
              </Link>
            )}
            {page < pages && (
              <Link href={`/admin/comptes?page=${page + 1}`} className="inline-flex items-center gap-1 rounded-full bg-sabren-black text-white px-4 py-2 text-sm font-bold hover:bg-sabren-gold hover:text-sabren-black transition">
                Suivant <ChevronRight className="w-4 h-4" />
              </Link>
            )}
          </div>
        </div>
      )}
    </div>
  );
}