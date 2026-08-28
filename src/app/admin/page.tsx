import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { Card, Badge } from "@/components/admin/ui";
import { Package, Tags, ShoppingCart, Users, AlertTriangle, Plus, Star, Percent, HelpCircle, Mail, ArrowRight, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const now = new Date();
  const [
    products,
    categories,
    orders,
    accounts,
    lowStock,
    recentOrders,
    activePromos,
    faqs,
    subscribers,
    recentReviews,
  ] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.product.findMany({ where: { stock: { lt: 5 } }, select: { id: true, name: true, stock: true, slug: true }, orderBy: { stock: "asc" } }),
    prisma.order.findMany({ orderBy: { createdAt: "desc" }, take: 5 }),
    prisma.promoCode.count({ where: { isActive: true, OR: [{ expiresAt: null }, { expiresAt: { gt: now } }] } }),
    prisma.faq.count({ where: { isActive: true } }),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.review.findMany({ orderBy: { createdAt: "desc" }, take: 4, include: { product: { select: { name: true, slug: true } } } }),
  ]);

  const revenueParts = await prisma.order.findMany({ where: { status: { not: "CANCELLED" } }, select: { total: true } });
  const revenue = revenueParts.reduce((a, o) => a + o.total, 0);

  const stats = [
    { label: "Chiffre d’affaires", value: formatPrice(revenue), icon: ShoppingCart },
    { label: "Commandes", value: String(orders), icon: Package },
    { label: "Produits", value: String(products), icon: Tags, href: "/admin/produits" },
    { label: "Comptes", value: String(accounts), icon: Users, href: "/admin/comptes" },
  ];

  const statusTone: Record<string, "gold" | "green" | "purple" | "blue" | "red" | "gray"> = {
    NEW: "gold", CONFIRMED: "blue", PREPARING: "purple", SHIPPED: "blue", DELIVERED: "green", CANCELLED: "red",
  };

  const quickActions = [
    { label: "Nouveau produit", href: "/admin/produits/nouveau", icon: Plus, tone: "gold" as const },
    { label: "Nouvelle catégorie", href: "/admin/categories", icon: Tags, tone: "gold" as const },
    { label: "Créer un code promo", href: "/admin/promos", icon: Percent, tone: "gold" as const },
    { label: "Ajouter une FAQ", href: "/admin/faq", icon: HelpCircle, tone: "gold" as const },
    { label: "Voir les abonnés", href: "/admin/newsletter", icon: Mail, tone: "gold" as const },
    { label: "Voir les comptes", href: "/admin/comptes", icon: Users, tone: "gold" as const },
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

      {/* Alertes rapides */}
      {(lowStock.length > 0 || orders === 0) && (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {lowStock.length > 0 && (
            <Card className="p-5 border-l-4 border-l-orange-400">
              <div className="flex items-center gap-2 mb-3">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <h2 className="font-bold">Stock faible ({lowStock.length})</h2>
              </div>
              <div className="space-y-2">
                {lowStock.slice(0, 4).map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-sabren-cream rounded-xl px-4 py-2 text-sm">
                    <Link href={`/admin/produits/${p.id}`} className="font-medium hover:text-sabren-gold transition">{p.name}</Link>
                    <Badge tone={p.stock === 0 ? "red" : "gold"}>{p.stock} restant{p.stock > 1 ? "s" : ""}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          )}
          {orders === 0 && (
            <Card className="p-5 border-l-4 border-l-sabren-gold">
              <p className="text-sm text-sabren-black/60 leading-relaxed">
                <b className="text-sabren-black">Aucune commande reçue.</b> Les clients commanderont via WhatsApp depuis la page produit et le panier. Activez vos réseaux sociaux et la livraison offerte depuis les paramètres pour booster vos ventes.
              </p>
            </Card>
          )}
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6 mt-6 items-start">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between px-5 pt-5 pb-3">
            <h2 className="font-bold">Dernières commandes</h2>
            <span className="text-xs font-bold text-sabren-black/40">Reçues par WhatsApp</span>
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

        <div className="space-y-6">
          <Card className="p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="w-4 h-4 text-sabren-gold" />
              <h2 className="font-bold">Stock faible</h2>
            </div>
            {lowStock.length === 0 ? (
              <p className="text-sm text-sabren-black/45 flex items-center gap-1.5"><CheckCircle2 className="w-4 h-4 text-green-500" /> Tous les produits ont un stock suffisant.</p>
            ) : (
              <div className="space-y-2">
                {lowStock.map((p) => (
                  <div key={p.id} className="flex items-center justify-between bg-sabren-cream rounded-xl px-4 py-2.5 text-sm">
                    <Link href={`/admin/produits/${p.id}`} className="font-medium hover:text-sabren-gold transition">{p.name}</Link>
                    <Badge tone={p.stock === 0 ? "red" : "gold"}>{p.stock} restant{p.stock > 1 ? "s" : ""}</Badge>
                  </div>
                ))}
              </div>
            )}
          </Card>

          <Card className="p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Star className="w-4 h-4 text-sabren-gold" />
                <h2 className="font-bold">Derniers avis</h2>
              </div>
              <Link href="/admin/avis" className="text-xs font-bold text-sabren-gold hover:underline">Gérer</Link>
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

      {/* Bandeau stats secondaires + actions rapides */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">Promos actives</p>
          <p className="font-black text-xl mt-2">{activePromos}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">Catégories</p>
          <p className="font-black text-xl mt-2">{categories}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">FAQ actives</p>
          <p className="font-black text-xl mt-2">{faqs}</p>
        </Card>
        <Card className="p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-sabren-black/45">Abonnés newsletter</p>
          <p className="font-black text-xl mt-2">{subscribers}</p>
        </Card>
      </div>

      <Card className="p-5 mt-6">
        <div className="flex items-center gap-2 mb-4">
          <ArrowRight className="w-4 h-4 text-sabren-gold" />
          <h2 className="font-bold">Actions rapides</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link key={a.label} href={a.href} className="inline-flex items-center gap-2 bg-sabren-cream border border-sabren-gold/30 hover:border-sabren-gold hover:bg-white transition rounded-full px-4 py-2 text-sm font-semibold">
                <Icon className="w-4 h-4 text-sabren-gold" /> {a.label}
              </Link>
            );
          })}
        </div>
      </Card>

      <div className="mt-6 bg-sabren-cream border border-sabren-gold/30 rounded-2xl p-4 text-sm">
        <p className="font-bold">Besoin d’aide ?</p>
        <p className="text-sabren-black/55 mt-1">Gérez produits, catégories, codes promo, newsletter, FAQ et avis clients depuis ce panneau. Les commandes sont confirmées et traitées directement sur WhatsApp.</p>
      </div>
    </div>
  );
}