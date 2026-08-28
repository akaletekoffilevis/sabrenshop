import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryIcon } from "@/components/ui/category-icon";
import { prisma } from "@/lib/prisma";
import { getActiveCategories } from "@/lib/data";
import Link from "next/link";
import { SlidersHorizontal, Sparkles, Flame, Tags, Truck, Search } from "lucide-react";

const smartLinks = [
  { label: "Nouveautés", href: "nouveau=1", icon: "sparkles", key: "nouveau" },
  { label: "Meilleures ventes", href: "best=1", icon: "flame", key: "best" },
  { label: "Promotions", href: "promo=1", icon: "tags", key: "promo" },
] as const;

const sorts = [
  { label: "Plus récent", value: "recent" },
  { label: "Prix croissant", value: "price_asc" },
  { label: "Prix décroissant", value: "price_desc" },
  { label: "Mieux notés", value: "rating" },
];

export const dynamic = "force-dynamic";

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; best?: string; nouveau?: string; promo?: string; sort?: string; min?: string; max?: string; minRating?: string; inStock?: string }>;
}) {
  const params = await searchParams;
  let products: any[] = [];

  try {
    const where: any = { isActive: true };
    if (params.cat) {
      const category = await prisma.category.findUnique({ where: { slug: params.cat } });
      if (category) where.categoryId = category.id;
    }
    if (params.best) where.isFeatured = true;
    if (params.nouveau) where.OR = [{ isNew: true }, { createdAt: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } }];
    if (params.promo) where.compareAtPrice = { not: null };
    if (params.q) where.name = { contains: params.q, mode: "insensitive" };
    const minPrice = params.min ? Number(params.min) : null;
    const maxPrice = params.max ? Number(params.max) : null;
    const minRating = params.minRating ? Number(params.minRating) : null;
    if (minPrice && !Number.isNaN(minPrice)) where.price = { ...(where.price ?? {}), gte: minPrice };
    if (maxPrice && !Number.isNaN(maxPrice)) where.price = { ...(where.price ?? {}), lte: maxPrice };
    if (minRating && !Number.isNaN(minRating)) where.rating = { gte: minRating };
    if (params.inStock) where.stock = { gt: 0 };

    const orderBy =
      params.sort === "price_asc"
        ? { price: "asc" as const }
        : params.sort === "price_desc"
        ? { price: "desc" as const }
        : params.sort === "rating"
        ? { rating: "desc" as const }
        : { createdAt: "desc" as const };

    products = await prisma.product.findMany({ where, orderBy });
  } catch (err) {
    console.error("[boutique] chargement des produits échoué:", err);
    products = [];
  }

  const sort = params.sort ?? "recent";

  const dbCategories = await getActiveCategories();

  const smartActive = Boolean(params.best || params.nouveau || params.promo);

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-7xl mx-auto container-px lg:px-8 py-6 w-full">
        {/* Fil d'ariane */}
        <nav className="flex items-center gap-1.5 text-xs text-sabren-black/45 mb-4">
          <Link href="/" className="hover:text-sabren-gold">Accueil</Link>
          <span>/</span>
          <span className="text-sabren-black/70 font-semibold">Boutique</span>
          {params.cat && (
            <>
              <span>/</span>
              <span className="capitalize text-sabren-gold-ink font-semibold">{(params.q ?? params.cat)?.replace(/[-_]/g, " ")}</span>
            </>
          )}
        </nav>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl">La Boutique</h1>
            <p className="text-sm text-sabren-black/55 mt-1 flex items-center gap-1.5">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
              <span className="inline-flex items-center gap-1 text-sabren-black/55">
                <Truck className="w-3.5 h-3.5" /> Livraison partout au Niger · frais à la charge du client
              </span>
            </p>
          </div>
          <details className="group relative">
            <summary className="inline-flex items-center gap-1.5 text-xs font-semibold text-sabren-black/70 cursor-pointer list-none bg-white border border-sabren-gray rounded-full px-4 py-2 hover:border-sabren-gold transition">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Trier & filtrez
            </summary>
            <form method="get" className="absolute right-0 top-full mt-2 w-[300px] max-w-[85vw] z-20 bg-white border border-sabren-gray rounded-2xl shadow-card-hover p-5 space-y-4 animate-fade-up">
              {params.cat && <input type="hidden" name="cat" value={params.cat} />}
              {params.q && <input type="hidden" name="q" value={params.q} />}
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-sabren-black/50 mb-1.5">Trier par</label>
                <select name="sort" defaultValue={sort} className="w-full bg-white border border-sabren-gray rounded-xl px-3.5 py-2.5 text-sm font-semibold outline-none focus:border-sabren-gold">
                  {sorts.map((s) => (
                    <option key={s.value} value={s.value}>{s.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[11px] font-bold uppercase tracking-wide text-sabren-black/50 mb-1.5">Prix (FCFA)</label>
                <div className="flex items-center gap-2">
                  <input name="min" type="number" min={0} placeholder="Min" defaultValue={params.min} className="w-full bg-white border border-sabren-gray rounded-xl px-3 py-2 text-sm outline-none focus:border-sabren-gold placeholder:text-sabren-black/30" />
                  <span className="text-sabren-black/40">–</span>
                  <input name="max" type="number" min={0} placeholder="Max" defaultValue={params.max} className="w-full bg-white border border-sabren-gray rounded-xl px-3 py-2 text-sm outline-none focus:border-sabren-gold placeholder:text-sabren-black/30" />
                </div>
              </div>
              <div className="flex items-center justify-between gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase tracking-wide text-sabren-black/50 mb-1.5">Note minimale</label>
                  <select name="minRating" defaultValue={params.minRating ?? ""} className="w-full bg-white border border-sabren-gray rounded-xl px-3 py-2 text-sm font-semibold outline-none focus:border-sabren-gold">
                    <option value="">Toutes</option>
                    <option value="4">4+</option>
                    <option value="3">3+</option>
                    <option value="5">5</option>
                  </select>
                </div>
                <label className="flex items-center gap-2 text-sm font-medium text-sabren-black/70 mt-5 cursor-pointer">
                  <input type="checkbox" name="inStock" value="1" defaultChecked={Boolean(params.inStock)} className="accent-sabren-gold w-4 h-4" />
                  En stock
                </label>
              </div>
              <div className="flex gap-2">
                <a href={params.cat ? `/boutique?cat=${params.cat}` : "/boutique"} className="flex-1 text-center border border-sabren-gray rounded-full px-4 py-2 text-sm font-semibold hover:border-sabren-gold transition">Réinitialiser</a>
                <button type="submit" className="flex-1 bg-sabren-black text-white text-sm font-bold rounded-full px-4 py-2 hover:bg-black transition">Appliquer</button>
              </div>
            </form>
          </details>
        </div>

        {/* Chips filtres (dynamiques) */}
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1 mb-6">
          <a href="/boutique" className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${!params.cat && !smartActive ? "bg-sabren-black text-white border-sabren-black" : "bg-white border-sabren-gray text-sabren-black/70 hover:border-sabren-gold"}`}>
            Tout voir
          </a>
          {dbCategories.map((c) => {
            const isActive = params.cat === c.slug;
            return (
              <a key={c.slug} href={`/boutique?cat=${c.slug}`} className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${isActive ? "bg-sabren-black text-white border-sabren-black" : "bg-white border-sabren-gray text-sabren-black/70 hover:border-sabren-gold"}`}>
                <CategoryIcon icon={c.icon} className="w-3.5 h-3.5" /> {c.name}
              </a>
            );
          })}
          {smartLinks.map((n) => {
            const isActive = Boolean(params[n.key as keyof typeof params]);
            return (
              <a key={n.label} href={`/boutique?${n.href}`} className={`shrink-0 inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-semibold border transition ${isActive ? "bg-sabren-gold text-sabren-black border-sabren-gold font-bold" : "bg-white border-sabren-gray text-sabren-black/70 hover:border-sabren-gold"}`}>
                {n.icon === "sparkles" && <Sparkles className="w-3.5 h-3.5" />}
                {n.icon === "flame" && <Flame className="w-3.5 h-3.5" />}
                {n.icon === "tags" && <Tags className="w-3.5 h-3.5" />}
                {n.label}
              </a>
            );
          })}
        </div>

        {products.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl border border-sabren-gray shadow-card">
            <div className="text-5xl mb-4"><Search className="w-12 h-12 text-sabren-black/20 mx-auto" /></div>
            <h2 className="font-display font-bold text-xl">Aucun produit trouvé</h2>
            <p className="text-sm text-sabren-black/55 mt-2">Essayez une autre recherche ou découvrez toute la boutique.</p>
            <a href="/boutique" className="inline-block mt-5 bg-sabren-gold text-sabren-black font-bold rounded-full px-6 py-2.5 text-sm transition hover:bg-sabren-gold-hover">Voir toute la boutique</a>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
            {products.map((p: any) => (
              <ProductCard key={p.slug} product={p} />
            ))}
          </div>
        )}
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}