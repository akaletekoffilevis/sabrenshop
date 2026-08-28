import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { MobileBottomNav } from "@/components/shop/MobileBottomNav";
import { Hero } from "@/components/shop/Hero";
import { TrustStrip } from "@/components/shop/TrustStrip";
import { CategoryGrid } from "@/components/shop/CategoryGrid";
import { ProductSection } from "@/components/shop/ProductSection";
import { ProductCard } from "@/components/shop/ProductCard";
import { getHomeProducts, getNewProducts, getDealProducts } from "@/lib/data";
import { whatsappLink } from "@/lib/whatsapp";
import { ArrowRight, Flame, Gift, MessageCircle, PackageOpen, Sparkles, Tags } from "lucide-react";

const steps = [
  { n: "1", title: "Choisissez vos produits", desc: "Parcourez la boutique, ajoutez au panier ou commandez en 1 clic." },
  { n: "2", title: "Commandez facilement", desc: "Paiement à la livraison ou via WhatsApp — on confirme votre commande directement." },
  { n: "3", title: "Recevez chez vous", desc: "Livraison rapide partout au Niger ou retrait en boutique." },
];

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const best = await getHomeProducts();
  const fresh = await getNewProducts();
  const deals = await getDealProducts();

  return (
    <div className="min-h-screen flex flex-col pb-14 lg:pb-0">
      <PromoBar />
      <Header />
      <main className="flex-1">
        <Hero />
        <TrustStrip />

        <CategoryGrid />

        <ProductSection
          id="nouveautes"
          kicker="Fraîchement arrivés"
          kickerIcon={<Sparkles className="w-4 h-4" />}
          title="Nouveautés"
          subtitle="Les derniers produits ajoutés à la boutique."
          products={fresh}
          linkHref="/boutique?nouveau=1"
        />

        {/* NOS MEILLEURES VENTES */}
        <section className="max-w-7xl mx-auto container-px lg:px-8 pt-14">
          <div className="flex items-end justify-between mb-6">
            <div>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-sabren-gold-ink">
                <Flame className="w-4 h-4" /> Les favoris de nos clients
              </span>
              <h2 className="font-display font-black text-2xl md:text-3xl mt-1">Nos Meilleures Ventes</h2>
            </div>
            <a href="/boutique" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-sabren-black/70 hover:text-sabren-gold transition">
              Voir tout <ArrowRight className="w-4 h-4" />
            </a>
          </div>

          {best.length === 0 ? (
            <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-10 text-center">
              <PackageOpen className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
              <p className="font-bold">La boutique se remplit en ce moment</p>
              <p className="text-sm text-sabren-black/50 mt-1">Revenez bientôt, nos meilleures ventes arrivent.</p>
              <a href="/boutique" className="inline-block mt-5 bg-sabren-gold text-sabren-black font-bold rounded-full px-6 py-2.5 text-sm hover:bg-sabren-gold-hover transition">
                Voir la boutique
              </a>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
              {best.map((p) => (
                <ProductCard key={p.slug} product={p} />
              ))}
            </div>
          )}
        </section>

        <ProductSection
          id="promotions"
          kicker="Bonne affaire du moment"
          kickerIcon={<Tags className="w-4 h-4" />}
          title="Promotions"
          subtitle="Des prix doux sur des produits qui valent le détour."
          products={deals}
          linkHref="/boutique?promo=1"
        />

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
                  <h2 className="font-display font-black text-2xl md:text-3xl leading-tight">Des promotions intéressantes<br className="hidden md:block" /> vous attendent !</h2>
                </div>
              </div>
              <a href="/boutique?promo=1" className="inline-flex items-center justify-center gap-2 bg-sabren-black text-sabren-gold font-bold rounded-full px-7 py-3.5 text-sm transition hover:bg-black shadow-card">
                Voir les promos <ArrowRight className="w-4 h-4" />
              </a>
            </div>
          </div>
        </section>

        {/* Comment commander */}
        <section id="comment-commander" className="max-w-7xl mx-auto container-px lg:px-8 pt-14 scroll-mt-24">
          <div className="text-center mb-8">
            <span className="text-xs font-bold uppercase tracking-[0.18em] text-sabren-gold-ink">Simple & rapide</span>
            <h2 className="font-display font-black text-2xl md:text-3xl mt-1">Comment commander ?</h2>
            <p className="text-sm text-sabren-black/55 mt-2 max-w-md mx-auto">
              Trois étapes, zéro complication. Passez commande en quelques minutes.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {steps.map((s) => (
              <div key={s.n} className="relative bg-white rounded-2xl border border-sabren-gray shadow-card p-6">
                <span className="absolute top-5 right-5 w-9 h-9 rounded-full bg-sabren-cream border border-sabren-gold/40 flex items-center justify-center font-display font-black text-sabren-gold-ink">
                  {s.n}
                </span>
                <h3 className="font-bold text-base mt-2 pr-10">{s.title}</h3>
                <p className="text-sm text-sabren-black/55 mt-2 leading-relaxed">{s.desc}</p>
              </div>
            ))}
          </div>
          <div className="mt-6 text-center">
            <a href={whatsappLink("Bonjour Sabren'Shop, je souhaite passer ma commande.")} target="_blank" className="inline-flex items-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-full px-8 py-3.5 text-sm transition shadow-card">
              <MessageCircle className="w-4 h-4" /> Passer ma commande sur WhatsApp
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