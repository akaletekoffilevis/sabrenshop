import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { MobileBottomNav } from "@/components/shop/MobileBottomNav";
import { ProductCard } from "@/components/shop/ProductCard";
import { CategoryIcon } from "@/components/ui/category-icon";
import { prisma } from "@/lib/prisma";
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

export default async function BoutiquePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; best?: string; nouveau?: string; promo?: string; sort?: string }>;
}) {
  const params = await searchParams;
  let products: any[] = [];

  try {
    const where: any = { isActive: true };
    let category: any = null;
    if (params.cat) {
      category = await prisma.category.findUnique({ where: { slug: params.cat } });
      if (category) where.categoryId = category.id;
    }
    if (params.best) where.isFeatured = true;
    if (params.nouveau) where.isNew = true;
    if (params.promo) where.compareAtPrice = { not: null };
    if (params.q) where.name = { contains: params.q, mode: "insensitive" };

    const orderBy =
      params.sort === "price_asc"
        ? { price: "asc" as const }
        : params.sort === "price_desc"
        ? { price: "desc" as const }
        : params.sort === "rating"
        ? { rating: "desc" as const }
        : { createdAt: "desc" as const };

    products = await prisma.product.findMany({ where, orderBy });
  } catch {
    products = [
      { id: "f1", slug: "stanley-rose-1-2l", name: "Stanley Gourde Rose 1.2L", price: 18500, compareAtPrice: 25000, images: ["https://images.unsplash.com/photo-1523369364227-24934b335841?w=600"], rating: 4.8, isNew: true, stock: 20 },
      { id: "f2", slug: "nounours-geant-creme-80cm", name: "Nounours Géant Crème 80cm", price: 22000, compareAtPrice: 28000, images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600"], rating: 5, stock: 12 },
      { id: "f3", slug: "tshirt-sabren-noir", name: "T-Shirt Sabren Noir Premium", price: 8500, compareAtPrice: null, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"], rating: 4.6, stock: 30 },
      { id: "f4", slug: "sac-tote-creme-or", name: "Sac Tote Crème & Or", price: 12000, compareAtPrice: 15000, images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600"], rating: 4.9, isNew: true, stock: 8 },
    ] as any[];
  }

  const sort = params.sort ?? "recent";

  let dbCategories: { name: string; slug: string; icon: string | null }[] = [];
  try {
    dbCategories = await prisma.category.findMany({ where: { isActive: true }, orderBy: { position: "asc" }, select: { name: true, slug: true, icon: true } });
  } catch {}

  const smartActive = Boolean(params.best || params.nouveau || params.promo);

  return (
    <div className="min-h-screen flex flex-col pb-14 lg:pb-0">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-7xl mx-auto container-px lg:px-8 py-6 w-full">
        {/* Fil d'ariane */}
        <nav className="flex items-center gap-1.5 text-xs text-sabren-black/45 mb-4">
          <a href="/" className="hover:text-sabren-gold">Accueil</a>
          <span>/</span>
          <span className="text-sabren-black/70 font-semibold">Boutique</span>
          {params.cat && (
            <>
              <span>/</span>
              <span className="capitalize text-sabren-gold font-semibold">{(params.q ?? params.cat)?.replace(/[-_]/g, " ")}</span>
            </>
          )}
        </nav>

        <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
          <div>
            <h1 className="font-display font-black text-2xl md:text-3xl">La Boutique</h1>
            <p className="text-sm text-sabren-black/55 mt-1 flex items-center gap-1.5">
              {products.length} produit{products.length > 1 ? "s" : ""} disponible{products.length > 1 ? "s" : ""}
              <span className="inline-flex items-center gap-1 text-sabren-black/35">
                <Truck className="w-3.5 h-3.5" /> Livraison partout au Niger
              </span>
            </p>
          </div>
          <form method="get" className="flex items-center gap-2">
            {params.cat && <input type="hidden" name="cat" value={params.cat} />}
            {params.q && <input type="hidden" name="q" value={params.q} />}
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs font-semibold text-sabren-black/50"><SlidersHorizontal className="w-3.5 h-3.5" /> Trier :</span>
            <select name="sort" defaultValue={sort} className="bg-white border border-sabren-gray rounded-full px-4 py-2 text-sm font-semibold outline-none focus:border-sabren-gold">
              {sorts.map((s) => (
                <option key={s.value} value={s.value}>{s.label}</option>
              ))}
            </select>
            <button type="submit" className="bg-sabren-black text-white text-sm font-bold rounded-full px-4 py-2 hover:bg-black transition">Appliquer</button>
          </form>
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
      <MobileBottomNav />
    </div>
  );
}