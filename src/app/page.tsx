import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { MobileBottomNav } from "@/components/shop/MobileBottomNav";
import { Hero } from "@/components/shop/Hero";
import { TrustStrip } from "@/components/shop/TrustStrip";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { ProductCard } from "@/components/shop/ProductCard";
import { prisma } from "@/lib/prisma";
import { whatsappLink } from "@/lib/whatsapp";
import { ArrowRight, Flame, Gift, MessageCircle } from "lucide-react";

async function getBestSellers() {
  try {
    return await prisma.product.findMany({ where: { isActive: true, isFeatured: true }, take: 8, orderBy: { createdAt: "desc" } });
  } catch {
    return [
      { id: "f1", slug: "stanley-rose-1-2l", name: "Stanley Gourde Rose 1.2L", price: 18500, compareAtPrice: 25000, images: ["https://images.unsplash.com/photo-1523369364227-24934b335841?w=600"], rating: 4.8, isNew: true, stock: 20 },
      { id: "f2", slug: "nounours-geant-creme-80cm", name: "Nounours Géant Crème 80cm", price: 22000, compareAtPrice: 28000, images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600"], rating: 5, isFeatured: true, stock: 12 },
      { id: "f3", slug: "tshirt-sabren-noir", name: "T-Shirt Sabren Noir Premium", price: 8500, compareAtPrice: null, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"], rating: 4.6, stock: 30 },
      { id: "f4", slug: "sac-tote-creme-or", name: "Sac Tote Crème & Or", price: 12000, compareAtPrice: 15000, images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"], rating: 4.9, isNew: true, stock: 8 },
      { id: "f5", slug: "stanley-noir-mate-750ml", name: "Stanley Noir Mat 750ml", price: 16500, compareAtPrice: 22000, images: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600"], rating: 4.7, stock: 15 },
      { id: "f6", slug: "nounours-petit-rose-40cm", name: "Nounours Petit Rose 40cm", price: 9500, compareAtPrice: 12000, images: ["https://images.unsplash.com/photo-1544808204-32b1b0d40ac0?w=600"], rating: 4.9, isNew: true, stock: 25 },
      { id: "f7", slug: "casquette-urbaine-noir", name: "Casquette Urbaine Noir", price: 6500, compareAtPrice: null, images: ["https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600"], rating: 4.4, stock: 18 },
      { id: "f8", slug: "montre-minimaliste-or", name: "Montre Minimaliste Or", price: 18500, compareAtPrice: 24000, images: ["https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600"], rating: 4.8, isFeatured: true, stock: 10 },
    ] as any[];
  }
}

const steps = [
  { n: "1", title: "Choisissez vos produits", desc: "Parcourez la boutique, ajoutez au panier ou commandez en 1 clic." },
  { n: "2", title: "Commandez facilement", desc: "WhatsApp ou paiement à la livraison — on confirme votre commande directement." },
  { n: "3", title: "Recevez chez vous", desc: "Livraison rapide partout au Niger ou retrait en boutique." },
];

export default async function HomePage() {
  const best = await getBestSellers();

  return (
    <div className="min-h-screen flex flex-col pb-14 lg:pb-0">
      <PromoBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />

        <CategoryGrid />

        {/* NOS MEILLEURES VENTES */}
        <section className="max-w-7xl mx-auto container-px lg:px-8 pt-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-sabren-gold">
                <Flame className="w-4 h-4" /> Les favoris de nos clients
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl mt-1">Nos Meilleures Ventes</h2>
            </div>
            <a href="/boutique" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-sabren-black/70 hover:text-sabren-gold transition">
              Voir tout <ArrowRight className="w-4 h-4" />
            </a>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {best.map((p: any) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        </section>

        {/* Bandeau promo */}
        <section className="max-w-7xl mx-auto container-px lg:px-8 pt-12">
          <div className="relative rounded-[2rem] overflow-hidden bg-gradient-to-br from-sabren-gold via-[#e2c565] to-sabren-gold-hover px-6 py-10 md:px-12 md:py-12 text-sabren-black">
            <div className="absolute -right-10 -top-10 w-48 h-48 rounded-full bg-white/20 blur-2xl" />
            <div className="relative flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-sabren-black flex items-center justify-center animate-float">
                  <Gift className="w-7 h-7 text-sabren-gold" />
                </div>
                <div>
                  <span className="text-xs font-black uppercase tracking-widest inline-flex items-center gap-1.5"><Flame className="w-4 h-4" /> Offres limitées</span>
                  <h2 className="font-display font-black text-2xl md:text-3xl leading-tight">Des promotions interressantes<br className="hidden md:block" /> vous attendent !</h2>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <a href="/boutique?promo=1" className="inline-flex items-center justify-center gap-2 bg-sabren-black text-sabren-gold font-bold rounded-full px-7 py-3.5 text-sm transition hover:bg-black">
                  Voir les promos <ArrowRight className="w-4 h-4" />
                </a>
                <a href={whatsappLink("Bonjour Sabren'Shop, j'aimerais profiter des promotions.")} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-full bg-white/95 hover:bg-white font-bold px-7 py-3.5 text-sm transition shadow-card">
                  <MessageCircle className="w-4 h-4 text-whatsapp-dark" /> Demander sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Comment commander */}
        <section id="comment-commander" className="max-w-7xl mx-auto container-px lg:px-8 pt-14 scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sabren-gold">Simple & rapide</span>
            <h2 className="font-display font-black text-2xl md:text-3xl mt-1">Comment commander ?</h2>
            <p className="text-sm text-sabren-black/55 mt-2 max-w-md mx-auto">
              Trois étapes, zéro complication. Passez commande en quelques minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-2xl border border-sabren-gray shadow-card p-6">
                <span className="absolute top-5 right-5 w-9 h-9 rounded-full bg-sabren-cream border border-sabren-gold/40 flex items-center justify-center font-display font-black text-sabren-gold">
                  {s.n}
                </span>
                <h3 className="font-bold text-base mt-2 pr-10">{s.title}</h3>
                <p className="text-sm text-sabren-black/55 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href={whatsappLink("Bonjour Sabren'Shop, je souhaite passer ma commande.")} target="_blank" className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-full px-8 py-3.5 text-sm transition shadow-card">
              <MessageCircle className="w-4 h-4" /> Passer ma commande — +227 89 14 84 54
            </a>
            <p className="text-xs text-sabren-black/45 mt-2">Réponse rapide • Lun–Sam 8h–20h</p>
          </div>
        </section>
      </main>
      <Footer />
      <WhatsappFloat />
      <MobileBottomNav />
    </div>
  );
}