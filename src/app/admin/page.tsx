import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, Badge } from "@/components/admin/ui";
import { Package, Tags, ShoppingCart, Users, AlertTriangle, Plus } from "lucide-react";

export default async function AdminDashboard() {
  const [products, categories, orders, clients, lowStock, recentOrders] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count({ where: { role: "CUSTOMER" } }),
    prisma.product.findMany({ where: { stock: { lt: 5 } }, select: { id: true, name: true, stock: true, slug: true }, orderBy: { stock: "asc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 6 }),
  ]);

  const revenue = (await prisma.order.findMany({ where: { status: { not: "CANCELLED" } }, select: { total: true } })).reduce((a, o) => a + o.total, 0);

  const stats = [
    { label: "Chiffre d'affaires", value: formatPrice(revenue), icon: ShoppingCart, href: "/admin/commandes" },
    { label: "Commandes", value: String(orders), icon: Package, href: "/admin/commandes" },
    { label: "Produits", value: String(products), icon: Tags, href: "/admin/produits" },
    { label: "Clients", value: String(clients), icon: Users, href: "/admin/commandes" },
  ];

  const statusTone: Record<string, "gold" | "green" | "purple" | "blue" | "red" | "gray"> = {
    NEW: "gold", CONFIRMED: "blue", PREPARING: "purple", SHIPPED: "blue", DELIVERED: "green", CANCELLED: "red",
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">Tableau de bord</h1>
          <p className="text-sm text-sabren-black/50 mt-0.5">Vue d'ensemble de la boutique</p>
        </div>
        <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="block">
              <Card className="p-5 hover:border-sabren-gold transition h-full">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">{s.label}</p>
                  <span className="w-9 h-9 rounded-xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center">
                    <Icon className="w-4 h-4 text-sabren-gold" />
                  </span>
                </div>
                <p className="font-black text-xl mt-2">{s.value}</p>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6 items-start">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold">Dernières commandes</h2>
            <Link href="/admin/commandes" className="text-xs font-bold text-sabren-gold hover:underline">Tout voir</Link>
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
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle className="w-4 h-4 text-sabren-gold" />
            <h2 className="font-bold">Stock faible</h2>
          </div>
          {lowStock.length === 0 ? (
            <p className="text-sm text-sabren-black/45">Tous les produits ont un stock suffisant.</p>
          ) : (
            <div className="space-y-2">
              {lowStock.map((p) => (
                <div key={p.id} className="flex items-center justify-between bg-sabren-cream rounded-xl px-4 py-2.5 text-sm">
                  <span className="font-medium">{p.name}</span>
                  <Badge tone={p.stock === 0 ? "red" : "gold"}>{p.stock} restants</Badge>
                </div>
              ))}
            </div>
          )}
          <div className="mt-5 bg-sabren-cream border border-sabren-gold/30 rounded-2xl p-4 text-sm">
            <p className="font-bold">Besoin d'aide ?</p>
            <p className="text-sabren-black/55 mt-1">Gérez produits, catégories, commandes et avis clients depuis ce panneau. Tout s'enregistre en base.</p>
          </div>
        </Card>
      </div>
    </div>
  );
}