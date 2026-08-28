import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { getSettings } from "@/lib/data";

export async function Hero() {
  const s = await getSettings();
  const title = s.heroTitle;
  const subtitle = s.heroSubtitle;
  const image = s.heroImage;
  const cta1 = s.heroCta1Text;
  const cta2 = s.heroCta2Text;

  return (
    <section className="max-w-7xl mx-auto container-px lg:px-8 pt-4">
      <div className="relative rounded-[2rem] overflow-hidden bg-sabren-black isolate min-h-[420px] md:min-h-[520px] flex items-center">
        <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-55 scale-105" decoding="async" />
        <div className="absolute inset-0 bg-gradient-to-r from-sabren-black/90 via-sabren-black/55 to-transparent" />
        <div className="absolute -right-24 -top-24 w-72 h-72 rounded-full bg-sabren-pink/25 blur-3xl" />
        <div className="absolute -bottom-28 right-32 w-64 h-64 rounded-full bg-sabren-gold/20 blur-3xl" />

        <div className="relative max-w-2xl px-6 md:px-12 py-14 md:py-16 text-white animate-fade-up">
          <span className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/20 rounded-full px-3.5 py-1.5 text-xs font-semibold tracking-wide mb-5">
            <Sparkles className="w-3.5 h-3.5 text-sabren-gold" />
            Nouveautés & Meilleures ventes du moment
          </span>
          <h1 className="font-display font-black text-[34px] sm:text-5xl md:text-6xl leading-[1.05] tracking-tight">
            {title.toUpperCase().includes("SABREEN") ? (
              <>
                SABREEN<span className="text-sabren-gold">’</span>SHOP
              </>
            ) : (
              title
            )}
          </h1>
          <p className="mt-4 text-base md:text-lg text-white/85 max-w-lg font-light tracking-wide">{subtitle}</p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/boutique"
              className="group inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-7 py-3.5 text-sm md:text-base hover:bg-sabren-gold-hover transition shadow-gold"
            >
              {cta1}
              <ArrowRight className="w-4 h-4 transition group-hover:translate-x-1" />
            </Link>
            <Link
              href="/boutique?promo=1"
              className="inline-flex items-center gap-2 bg-white/10 backdrop-blur border border-white/30 text-white font-bold rounded-full px-7 py-3.5 text-sm md:text-base hover:bg-white hover:text-sabren-black transition"
            >
              {cta2}
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-6 gap-y-2 text-xs text-white/75">
            <span className="flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-sabren-gold" /> Paiement à la livraison
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-sabren-gold" /> Livraison partout au Niger
            </span>
            <span className="flex items-center gap-1.5">
              <CheckIcon className="w-3.5 h-3.5 text-sabren-gold" /> Retour facile & échange
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <path fillRule="evenodd" d="M16.7 5.3a1 1 0 010 1.4l-7.5 7.5a1 1 0 01-1.4 0l-3.5-3.5a1 1 0 011.4-1.4l2.8 2.8 6.8-6.8a1 1 0 011.4 0z" clipRule="evenodd" />
    </svg>
  );
}