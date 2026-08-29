import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, Badge } from "@/components/admin/ui";
import { Package, Tags, ShoppingCart, Users, Plus, AlertTriangle, Star } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, orders, accounts, lowStock, recentOrders, recentReviews] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.findMany({ where: { stock: { lt: 5 } }, select: { id: true, name: true, stock: true }, orderBy: { stock: "asc" }, take: 5 }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 4, include: { product: { select: { name: true } } } }),
  ]);

  const revenueAgg = await prisma.order.aggregate({ where: { status: { not: "CANCELLED" } }, _sum: { total: true } });
  const revenue = revenueAgg._sum.total || 0;

  const statusTone: Record<string, "gold" | "green" | "purple" | "blue" | "red" | "gray"> = {
    NEW: "gold", CONFIRMED: "blue", PREPARING: "purple", SHIPPED: "blue", DELIVERED: "green", CANCELLED: "red",
  };

  const stats = [
    { label: "Chiffre d’affaires", value: formatPrice(revenue), icon: ShoppingCart },
    { label: "Commandes", value: String(orders), icon: Package },
    { label: "Produits", value: String(products), icon: Tags, href: "/admin/produits" },
    { label: "Comptes", value: String(accounts), icon: Users, href: "/admin/comptes" },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">Tableau de bord</h1>
          <p className="text-sm text-sabren-black/50 mt-0.5">Vue d’ensemble de la boutique</p>
        </div>
        <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          const inner = (
            <Card className={`p-5 h-full ${s.href ? "hover:border-sabren-gold transition" : ""}`}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">{s.label}</p>
                <span className="w-9 h-9 rounded-xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center">
                  <Icon className="w-4 h-4 text-sabren-gold" />
                </span>
              </div>
              <p className="font-black text-xl mt-2">{s.value}</p>
            </Card>
          );
          return s.href ? <Link key={s.label} href={s.href} className="block">{inner}</Link> : <div key={s.label}>{inner}</div>;
        })}
      </div>

      {lowStock.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mt-5 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3">
          <AlertTriangle className="w-4 h-4 text-orange-500 shrink-0" />
          <span className="text-sm font-bold text-orange-700">Stock faible ({lowStock.length}) :</span>
          <span className="flex flex-wrap gap-1.5">
            {lowStock.map((p) => (
              <Link key={p.id} href={`/admin/produits/${p.id}`} className="inline-flex items-center gap-1.5 bg-white border border-orange-300 rounded-full pl-3 pr-1 py-0.5 text-xs font-semibold text-sabren-black hover:border-orange-500 transition">
                {p.name} <Badge tone={p.stock === 0 ? "red" : "gold"}>{p.stock}</Badge>
              </Link>
            ))}
          </span>
          <Link href="/admin/produits" className="ml-auto text-xs font-bold text-orange-700 hover:underline whitespace-nowrap">Voir tout</Link>
        </div>
      )}

      {orders === 0 && (
        <p className="mt-5 bg-sabren-cream border border-sabren-gold/30 rounded-xl px-4 py-3 text-sm text-sabren-black/60">
          <b className="text-sabren-black">Aucune commande pour l’instant.</b> Les clients commandent via WhatsApp depuis la fiche produit et le panier.
        </p>
      )}

      <div className="grid lg:grid-cols-2 gap-5 mt-5 items-start">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold">Dernières commandes</h2>
            <span className="text-xs font-bold text-sabren-black/40">Gérées via WhatsApp</span>
          </div>
          {recentOrders.length === 0 ? (
            <p className="p-5 text-sm text-sabren-black/45">Aucune commande pour le moment.</p>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-sabren-gray/60 text-left text-xs uppercase text-sabren-black/45">
                <tr><th className="px-5 py-2">N°</th><th className="py-2">Client</th><th className="py-2">Total</th><th className="py-2">Statut</th></tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id} className="border-t border-sabren-gray">
                    <td className="px-5 py-2.5 font-semibold">{o.orderNumber}</td>
                    <td className="py-2.5">{o.customerName}</td>
                    <td className="py-2.5 font-semibold">{formatPrice(o.total)}</td>
                    <td className="py-2.5"><Badge tone={statusTone[o.status]}>{o.status}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-sabren-gold" />
              <h2 className="font-bold">Derniers avis</h2>
            </div>
            {recentReviews.length > 0 && (
              <Link href="/admin/avis" className="text-xs font-bold text-sabren-gold hover:underline">Gérer</Link>
            )}
          </div>
          {recentReviews.length === 0 ? (
            <p className="text-sm text-sabren-black/45">Aucun avis publié pour le moment.</p>
          ) : (
            <div className="divide-y divide-sabren-gray/60">
              {recentReviews.map((r) => (
                <div key={r.id} className="py-2.5 flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold truncate">{r.name ?? "Invité"} <span className="text-sabren-gold">{"★".repeat(r.rating)}</span></p>
                    <p className="text-xs text-sabren-black/50 truncate">{r.comment || "—"}</p>
                  </div>
                  <span className="text-[10px] text-sabren-black/40 shrink-0">{r.product?.name}</span>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}