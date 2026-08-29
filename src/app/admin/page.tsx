import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Card, Badge } from "@/components/admin/ui";
import { Package, Tags, Users, Plus, AlertTriangle, Star, Percent, HelpCircle, Mail, MessageSquareQuote, Settings2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  const [products, categories, accounts, reviews, subscribers, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.category.count(),
    prisma.user.count(),
    prisma.review.count(),
    prisma.newsletterSubscriber.count({ where: { active: true } }),
    prisma.product.findMany({ where: { stock: { lt: 5 } }, select: { id: true, name: true, stock: true }, orderBy: { stock: "asc" }, take: 5 }),
  ]);

  const stats = [
    { label: "Produits", value: String(products), icon: Package, href: "/admin/produits" },
    { label: "Catégories", value: String(categories), icon: Tags, href: "/admin/categories" },
    { label: "Comptes", value: String(accounts), icon: Users, href: "/admin/comptes" },
    { label: "Abonnés", value: String(subscribers), icon: Mail, href: "/admin/newsletter" },
  ];

  const quickLinks = [
    { label: "Nouveau produit", href: "/admin/produits/nouveau", icon: Plus, gold: true },
    { label: "Produits", href: "/admin/produits", icon: Package },
    { label: "Catégories", href: "/admin/categories", icon: Tags },
    { label: "Codes promo", href: "/admin/promos", icon: Percent },
    { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
    { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
    { label: "Avis", href: "/admin/avis", icon: MessageSquareQuote },
    { label: "Paramètres", href: "/admin/parametres", icon: Settings2 },
  ];

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">Tableau de bord</h1>
          <p className="text-sm text-sabren-black/50 mt-0.5">Gérez la boutique depuis ce panneau.</p>
        </div>
        <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
          <Plus className="w-4 h-4" /> Nouveau produit
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link key={s.label} href={s.href} className="block group">
              <Card className="p-5 h-full group-hover:border-sabren-gold transition">
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

      <Card className="p-5 mt-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-lg">Accès rapides</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {quickLinks.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className={`flex flex-col items-center justify-center gap-2 rounded-2xl px-4 py-6 text-sm font-bold transition text-center ${
                  a.gold
                    ? "bg-sabren-gold text-sabren-black hover:bg-sabren-gold-hover shadow-gold"
                    : "bg-sabren-cream border border-sabren-gray text-sabren-black hover:border-sabren-gold hover:bg-white"
                }`}
              >
                <Icon className={`w-6 h-6 ${a.gold ? "text-sabren-black" : "text-sabren-gold"}`} />
                {a.label}
              </Link>
            );
          })}
        </div>
      </Card>

      <Card className="p-5 mt-5">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-sabren-gold" />
            <h2 className="font-bold">Derniers avis</h2>
          </div>
          <Link href="/admin/avis" className="text-xs font-bold text-sabren-gold hover:underline">Gérer</Link>
        </div>
        {reviews === 0 ? (
          <p className="text-sm text-sabren-black/45">Aucun avis publié pour le moment.</p>
        ) : (
          <p className="text-sm text-sabren-black/60">Vous avez {reviews} avis — consultez et modérez-les depuis la page Avis.</p>
        )}
      </Card>
    </div>
  );
}