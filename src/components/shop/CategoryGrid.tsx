import Link from "next/link";
import { ArrowUpRight, Image as ImageIcon } from "lucide-react";
import { CategoryIcon } from "@/components/ui/category-icon";
import { getActiveCategories } from "@/lib/data";

export async function CategoryGrid() {
  const categories = await getActiveCategories();
  if (!categories.length) return null;

  return (
    <section className="max-w-7xl mx-auto container-px lg:px-8 pt-12">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-[0.18em] text-sabren-gold-ink">Explorez la boutique</span>
          <h2 className="font-display font-black text-2xl md:text-3xl mt-1">NOS CATÉGORIES</h2>
        </div>
        <Link href="/boutique" className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-sabren-black/70 hover:text-sabren-gold transition">
          Tout voir <ArrowUpRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="md:grid md:grid-cols-4 lg:grid-cols-7 gap-3 md:gap-4 flex gap-3 overflow-x-auto snap-x snap-mandatory no-scrollbar -mx-4 px-4 md:mx-0 md:px-0">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/boutique?cat=${c.slug}`}
            className="group relative rounded-2xl overflow-hidden bg-white border border-sabren-gray shadow-card hover:shadow-card-hover transition aspect-[4/5] block shrink-0 w-36 sm:w-40 snap-start md:w-auto md:aspect-[4/5]"
          >
            <div className="absolute inset-0 overflow-hidden">
              {c.image ? (
                <img src={c.image} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition duration-500" loading="lazy" decoding="async" />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-sabren-cream">
                  <span className="w-12 h-12 rounded-2xl bg-sabren-gold/15 text-sabren-gold flex items-center justify-center">
                    <CategoryIcon icon={c.icon} className="w-6 h-6" />
                  </span>
                  <ImageIcon className="w-4 h-4 text-sabren-black/20" />
                </div>
              )}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-sabren-black/85 via-sabren-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-3">
              <h3 className="font-display font-bold text-white text-sm line-clamp-2 group-hover:text-sabren-gold transition">{c.name}</h3>
              <span className="inline-flex items-center gap-1 mt-1.5 text-[11px] font-bold text-sabren-gold opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0 transition">
                Découvrir
              </span>
            </div>
            <span className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
              <ArrowUpRight className="w-4 h-4 text-sabren-black" />
            </span>
          </Link>
        ))}
      </div>

      <Link href="/boutique" className="mt-4 md:hidden inline-flex items-center gap-1.5 text-xs font-bold text-sabren-gold-ink">
        Tout voir les catégories <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </section>
  );
}