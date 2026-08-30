import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/admin/ui";
import { Users, ShieldCheck, UserRound, ChevronLeft, ChevronRight } from "lucide-react";
import { AccountsView, type AccountRow } from "./AccountsView";

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

  const rows: AccountRow[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: u.createdAt.toISOString(),
    reviews: u._count.reviews,
    phone: u.phone,
    city: u.city,
    quartier: u.quartier,
    address: u.address,
    deliveryPreference: u.deliveryPreference,
  }));

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

      <AccountsView users={rows} />

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