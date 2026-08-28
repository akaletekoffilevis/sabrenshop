import Link from "next/link";
import { ArrowRight, PackageOpen } from "lucide-react";
import type { ReactNode } from "react";
import { ProductCard } from "./ProductCard";

export function ProductSection({
  id,
  kicker,
  kickerIcon,
  title,
  subtitle,
  products,
  linkHref,
  linkLabel = "Voir tout",
}: {
  id?: string;
  kicker: ReactNode;
  kickerIcon?: ReactNode;
  title: string;
  subtitle?: string;
  products: any[];
  linkHref: string;
  linkLabel?: string;
}) {
  return (
    <section id={id} className="max-w-7xl mx-auto container-px lg:px-8 pt-14 scroll-mt-24">
      <div className="flex items-end justify-between mb-6">
        <div>
          <span className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.18em] text-sabren-gold-ink">
            {kickerIcon} {kicker}
          </span>
          <h2 className="font-display font-black text-2xl md:text-3xl mt-1">{title}</h2>
          {subtitle && <p className="text-sm text-sabren-black/55 mt-1.5">{subtitle}</p>}
        </div>
        {products.length > 0 && (
          <Link href={linkHref} className="hidden md:inline-flex items-center gap-1.5 text-sm font-semibold text-sabren-black/70 hover:text-sabren-gold transition">
            {linkLabel} <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-10 text-center">
          <PackageOpen className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
          <p className="font-bold">Rien à afficher pour le moment</p>
          <p className="text-sm text-sabren-black/50 mt-1">Cette sélection se remplit petit à petit.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {products.map((p) => (
            <ProductCard key={p.slug} product={p} />
          ))}
        </div>
      )}
    </section>
  );
}