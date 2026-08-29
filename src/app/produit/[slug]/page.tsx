import { prisma } from "@/lib/prisma";
import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { formatPrice, discountPercent, isNewProduct } from "@/lib/utils";
import { getSettings } from "@/lib/data";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductGallery } from "./ProductGallery";
import { ProductActions } from "./ProductActions";
import { ProductReviews } from "@/components/shop/ProductReviews";
import { ShieldCheck, Truck, MessageCircle, RotateCcw, Star, Flower2, Ruler, Layers, Package, Sparkles } from "lucide-react";
import type { Metadata } from "next";
import { ProductSection } from "@/components/shop/ProductSection";

async function getProduct(slug: string) {
  return prisma.product.findUnique({ where: { slug }, include: { category: true } });
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug).catch((err) => {
    console.error("[produit] métadonnées : chargement échoué", err);
    return null;
  });
  if (!product) return { title: "Produit introuvable" };

  const base = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
  const firstImg = Array.isArray(product.images) ? (product.images as string[])[0] : null;
  const desc = (product.description || `Commandez ${product.name} sur SABREEN'SHOP — livraison partout au Niger, paiement à la livraison.`).slice(0, 160);

  return {
    title: product.name,
    description: desc,
    openGraph: {
      title: product.name,
      description: desc,
      type: "website",
      locale: "fr_NE",
      siteName: "SABREEN'SHOP",
      images: firstImg ? [{ url: new URL(firstImg, base).toString(), alt: product.name }] : undefined,
    },
  };
}

export const dynamic = "force-dynamic";

export default async function ProduitPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProduct(slug).catch((err) => {
    console.error("[produit] chargement échoué", err);
    return null;
  });
  if (!product) notFound();

  const reviews = await prisma.review
    .findMany({ where: { productId: product.id, isApproved: true }, orderBy: { createdAt: "desc" } })
    .catch((err) => {
      console.error("[produit] chargement des avis échoué", err);
      return [];
    });

  const [{ whatsapp: waNumber }] = await Promise.all([
    getSettings().then((s) => ({ whatsapp: s.whatsapp || process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22789148454" })),
  ]);

  type SimilarProduct = NonNullable<Awaited<ReturnType<typeof getProduct>>>;

  let similar: SimilarProduct[] = [];
  let similarCrossed = false;
  try {
    if (product.categoryId) {
      similar = (await prisma.product.findMany({
        where: { isActive: true, categoryId: product.categoryId, NOT: { id: product.id } },
        take: 4,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      })) as SimilarProduct[];
    }
    if (similar.length < 4) {
      const taken = similar.map((p) => p.id);
      const fill = (await prisma.product.findMany({
        where: { isActive: true, NOT: { id: { in: [...taken, product.id] } } },
        take: 4 - similar.length,
        orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
      })) as SimilarProduct[];
      if (fill.length > 0) similarCrossed = similar.length > 0;
      similar = [...similar, ...fill];
    }
  } catch (err) {
    console.error("[produit] produits similaires indisponibles", err);
    similar = [];
  }

  product.images = (Array.isArray(product.images) ? product.images : []) as string[];
  product.colors = (Array.isArray(product.colors) ? product.colors : []) as string[];
  product.sizes = (Array.isArray(product.sizes) ? product.sizes : []) as string[];

  const disc = discountPercent(product.price, product.compareAtPrice);
  const inStock = product.stock > 0;
  const catLabel = product.category?.name || "Boutique";

  const trusts = [
    { icon: Truck, title: "Livraison disponible", desc: "Partout au Niger, frais à la charge du client" },
    { icon: ShieldCheck, title: "Paiement sécurisé", desc: "À la livraison ou WhatsApp" },
    { icon: MessageCircle, title: "Service client", desc: "Réponse rapide WhatsApp" },
    { icon: RotateCcw, title: "Retour facile", desc: "Retrait & échange en boutique" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-7xl mx-auto container-px lg:px-8 py-6 w-full">
        {/* Fil d'ariane */}
        <nav className="flex items-center gap-1.5 text-xs text-sabren-black/45 mb-5">
          <Link href="/" className="hover:text-sabren-gold">Accueil</Link>
          <span>/</span>
          <a href="/boutique" className="hover:text-sabren-gold">Boutique</a>
          <span>/</span>
          <span className="text-sabren-black/70 font-semibold line-clamp-1">{product.name}</span>
        </nav>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Galerie */}
          <ProductGallery images={(product.images ?? []) as string[]} name={product.name} />

          {/* Infos */}
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 bg-sabren-gold/15 text-sabren-gold-ink text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full">
                <Layers className="w-3.5 h-3.5" /> {catLabel}
              </span>
              {isNewProduct(product.createdAt, product.isNew) && <span className="bg-sabren-black text-sabren-gold text-[11px] font-bold px-3 py-1 rounded-full">NOUVEAU</span>}
              {product.isFeatured && <span className="bg-sabren-gold text-sabren-black text-[11px] font-bold px-3 py-1 rounded-full">MEILLEUR VENDU</span>}
            </div>

            <h1 className="font-display font-black text-2xl md:text-4xl leading-tight mt-3">{product.name}</h1>

            <div className="flex items-center gap-2 mt-3">
              <span className="flex text-sabren-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 0) ? "fill-sabren-gold text-sabren-gold" : "text-sabren-gray-dark"}`} />
                ))}
              </span>
              <span className="text-sm text-sabren-black/50">({product.rating || 0} / 5)</span>
            </div>

            {/* Prix */}
            <div className="mt-5 flex items-baseline gap-3 flex-wrap">
              <span className="text-3xl font-black text-sabren-black">{formatPrice(product.price)}</span>
              {disc > 0 && (
                <>
                  <span className="text-lg line-through text-sabren-black/35">{formatPrice(product.compareAtPrice ?? 0)}</span>
                  <span className="bg-sabren-pink text-sabren-black text-xs font-black px-2.5 py-1 rounded-full">-{disc}%</span>
                </>
              )}
            </div>

            {/* Stock */}
            <div className="mt-4">
              {inStock ? (
                <span className={`inline-flex items-center gap-2 text-sm font-semibold ${product.stock <= 5 ? "text-orange-600" : "text-green-600"}`}>
                  <span className={`w-2.5 h-2.5 rounded-full ${product.stock <= 5 ? "bg-orange-500 animate-pulse" : "bg-green-500"}`} />
                  {product.stock <= 5 ? `Stock limité — plus que ${product.stock} pièces` : `En stock (${product.stock} pièces)`}
                </span>
              ) : (
                <span className="inline-flex items-center gap-2 text-sm font-semibold text-red-500">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> Rupture de stock
                </span>
              )}
            </div>

            {/* Actions */}
            <ProductActions product={{ ...product, inStock }} />

            {/* Garanties */}
            <div className="grid grid-cols-2 gap-2 mt-6">
              {trusts.map(({ icon: Icon, title, desc }) => (
                <div key={title} className="flex items-start gap-2.5 bg-sabren-cream border border-sabren-gray rounded-xl p-3">
                  <Icon className="w-5 h-5 text-sabren-gold shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs font-bold">{title}</p>
                    <p className="text-[11px] text-sabren-black/50 leading-snug">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Description & caractéristiques */}
        <div className="mt-12 grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-2xl border border-sabren-gray shadow-card p-6 md:p-8">
            <h2 className="font-display font-bold text-xl mb-3">Description</h2>
            <p className="text-sm text-sabren-black/70 leading-relaxed whitespace-pre-line">{product.description || "Aucune description fournie pour le moment."}</p>
            {product.colors?.length > 0 && (
              <div className="mt-5 flex items-center gap-2 text-sm">
                <Flower2 className="w-4 h-4 text-sabren-gold" />
                <span className="font-semibold">Couleurs :</span> {product.colors.join(" · ")}
              </div>
            )}
            {product.sizes?.length > 0 && (
              <div className="mt-2 flex items-center gap-2 text-sm">
                <Ruler className="w-4 h-4 text-sabren-gold" />
                <span className="font-semibold">Tailles :</span> {product.sizes.join(" · ")}
              </div>
            )}
          </div>
          <div className="space-y-4">
            <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-6">
              <div className="inline-flex items-center justify-center gap-2 bg-sabren-gold/15 text-sabren-black text-xs font-bold uppercase tracking-wide px-3 py-1 rounded-full mb-4">
                <Package className="w-3.5 h-3.5" /> Résumé
              </div>
              <ul className="space-y-2.5 text-sm text-sabren-black/70">
                <li className="flex justify-between"><span>Catégorie</span><b className="text-sabren-black">{catLabel}</b></li>
                <li className="flex justify-between"><span>Livraison</span><b className="text-green-600">Disponible</b></li>
                <li className="flex justify-between"><span>Paiement</span><b className="text-sabren-black">À la livraison</b></li>
              </ul>
            </div>
            <a href={`https://wa.me/${waNumber}?text=${encodeURIComponent(`Bonjour Sabreen Shop, des questions sur : ${product.name}`)}`} target="_blank" className="flex items-center justify-center gap-2 bg-sabren-cream border-2 border-dashed border-whatsapp/40 text-whatsapp-dark font-bold rounded-2xl py-4 text-sm hover:bg-whatsapp/5 transition">
              <MessageCircle className="w-4 h-4" /> Une question ? Écrivez-nous
            </a>
          </div>
        </div>

        {/* Avis clients */}
        <ProductReviews
          productId={product.id}
          initial={reviews.map((r) => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, createdAt: r.createdAt.toISOString() }))}
        />

        {/* Vous aimerez aussi */}
        {similar.length > 0 && (
          <ProductSection
            id="similaires"
            kicker={similarCrossed ? "Sélection pour vous" : "Dans la même catégorie"}
            kickerIcon={<Sparkles className="w-4 h-4" />}
            title="Vous aimerez aussi"
            products={similar}
            linkHref={`/boutique?cat=${product.category?.slug ?? ""}`}
          />
        )}
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}