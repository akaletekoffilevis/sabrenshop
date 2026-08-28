import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/utils";
import { whatsappLink } from "@/lib/whatsapp";
import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { MobileBottomNav } from "@/components/shop/MobileBottomNav";
import { AccountLogout } from "./AccountLogout";
import { Package, ShoppingCart, MessageCircle, UserRound } from "lucide-react";

const badge: Record<string, { label: string; cls: string }> = {
  NEW: { label: "Nouvelle", cls: "bg-sabren-gold/15 text-sabren-gold" },
  CONFIRMED: { label: "Confirmée", cls: "bg-blue-100 text-blue-600" },
  PREPARING: { label: "En préparation", cls: "bg-purple-100 text-purple-600" },
  SHIPPED: { label: "Expédiée", cls: "bg-blue-100 text-blue-600" },
  DELIVERED: { label: "Livrée", cls: "bg-green-100 text-green-700" },
  CANCELLED: { label: "Annulée", cls: "bg-red-100 text-red-600" },
};

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/connexion");

  const user = await prisma.user.findUnique({ where: { id: userId } });
  const orders = await prisma.order.findMany({ where: { userId }, include: { items: true }, orderBy: { createdAt: "desc" } });

  return (
    <div className="min-h-screen flex flex-col pb-14 lg:pb-0">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-5xl mx-auto container-px lg:px-8 py-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-sabren-black text-sabren-gold font-display font-black text-xl flex items-center justify-center">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="font-display font-black text-2xl">Bonjour, {user?.name || "Client"}</h1>
              <p className="text-sm text-sabren-black/50">{user?.email}</p>
            </div>
          </div>
          <AccountLogout />
        </div>

        <div className="grid sm:grid-cols-2 gap-3 mb-6">
          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center">
              <ShoppingCart className="w-5 h-5 text-sabren-gold" />
            </span>
            <div>
              <p className="font-black text-lg">{orders.length}</p>
              <p className="text-xs text-sabren-black/50">commande{orders.length > 1 ? "s" : ""}</p>
            </div>
          </div>
          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-4 flex items-center gap-3">
            <span className="w-10 h-10 rounded-xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center">
              <Package className="w-5 h-5 text-sabren-gold" />
            </span>
            <div>
              <p className="font-black text-lg">{orders.filter((o) => !["CANCELLED", "DELIVERED"].includes(o.status)).length} en cours</p>
              <p className="text-xs text-sabren-black/50">commandes actives</p>
            </div>
          </div>
        </div>

        <h2 className="font-display font-bold text-xl mb-4">Mes commandes</h2>

        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-10 text-center">
            <UserRound className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
            <p className="font-bold">Aucune commande pour le moment</p>
            <p className="text-sm text-sabren-black/50 mt-1">Passez votre première commande, elle apparaîtra ici.</p>
            <Link href="/boutique" className="inline-flex items-center gap-2 mt-5 bg-sabren-gold text-sabren-black font-bold rounded-full px-6 py-2.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
              Découvrir la boutique
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const b = badge[o.status] ?? badge.NEW;
              const itemLines = o.items.map((i) => `${i.name} x${i.quantity}`);
              return (
                <div key={o.id} className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="font-black">{o.orderNumber}</p>
                      <p className="text-xs text-sabren-black/45">
                        {new Date(o.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })} · {o.items.reduce((a, i) => a + i.quantity, 0)} articles
                      </p>
                    </div>
                    <span className={`text-[11px] font-bold rounded-full px-3 py-1 ${b.cls}`}>{b.label}</span>
                  </div>
                  <div className="mt-3 text-sm text-sabren-black/60 space-y-0.5 line-clamp-2">{itemLines.join(" · ")}</div>
                  <div className="mt-3 pt-3 border-t border-sabren-gray flex flex-wrap items-center justify-between gap-2">
                    <span className="font-black text-base">{formatPrice(o.total)}</span>
                    <div className="flex gap-2">
                      {!["CANCELLED", "DELIVERED"].includes(o.status) && (
                        <a href={whatsappLink(`Bonjour Sabren'Shop, j'ai une question sur ma commande ${o.orderNumber}.`)} target="_blank" className="inline-flex items-center gap-1.5 text-xs font-bold bg-whatsapp text-white rounded-full px-3.5 py-2 hover:bg-whatsapp-dark transition">
                          <MessageCircle className="w-3.5 h-3.5" /> Suivi WhatsApp
                        </a>
                      )}
                      <Link href="/boutique" className="inline-flex items-center text-xs font-bold text-sabren-gold hover:underline">
                        Nouvelle commande
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
      <Footer />
      <WhatsappFloat />
      <MobileBottomNav />
    </div>
  );
}