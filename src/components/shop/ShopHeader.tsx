"use client";
import Link from "next/link";
import { useCart } from "@/hooks/useCart";
import { useWishlist } from "@/hooks/useWishlist";
import { ShoppingBag, Search, UserRound, Menu, X, Phone, ChevronDown, LayoutGrid, Flame, Sparkles, Tags, Truck as TruckMini, Store as StoreIcon, LayoutDashboard, Heart, Loader2, PackageX } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { CategoryIcon } from "@/components/ui/category-icon";

type Cat = { label: string; href: string; icon: string };
type SearchResult = { slug: string; name: string; price: number; stock: number; image?: string | null };

function HeaderSearch({ placeholder, className = "" }: { placeholder: string; className?: string }) {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const boxRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, []);

  useEffect(() => {
    const term = q.trim();
    if (term.length < 2) {
      setResults([]);
      setLoading(false);
      setOpen(false);
      return;
    }
    setLoading(true);
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(term)}`);
        const data = await res.json();
        setResults((data.results as SearchResult[]) ?? []);
        setOpen(true);
      } catch {
        setResults([]);
      }
      setLoading(false);
    }, 300);
    return () => clearTimeout(t);
  }, [q]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (q.trim()) {
      setOpen(false);
      window.location.href = `/boutique?q=${encodeURIComponent(q.trim())}`;
    }
  };

  return (
    <form ref={boxRef} onSubmit={submit} className={`relative ${className}`}>
      <div className="flex items-center bg-sabren-gray rounded-full pl-4 border border-transparent focus-within:border-sabren-gold focus-within:bg-white transition">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          onFocus={() => q.trim().length >= 2 && setOpen(true)}
          placeholder={placeholder}
          className="flex-1 bg-transparent outline-none text-sm py-2.5"
          aria-label="Rechercher"
        />
        {loading && <Loader2 className="w-4 h-4 text-sabren-black/40 animate-spin mr-2 shrink-0" />}
        <button type="submit" className="bg-sabren-gold hover:bg-sabren-gold-hover text-sabren-black rounded-full p-2 m-1 transition shadow-gold" aria-label="Rechercher">
          <Search className="w-4 h-4" />
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-sabren-gray shadow-card-hover z-50 overflow-hidden animate-fade-up">
          {results.length === 0 ? (
            <p className="px-4 py-5 text-sm text-sabren-black/45 flex items-center gap-2">
              <PackageX className="w-4 h-4 text-sabren-black/30" /> Aucun produit trouvé pour {`"${q}"`}
            </p>
          ) : (
            <ul>
              {results.map((r) => (
                <li key={r.slug}>
                  <Link href={`/produit/${r.slug}`} onClick={() => setOpen(false)} className="flex items-center gap-3 px-3.5 py-2.5 hover:bg-sabren-cream transition">
                    {r.image ? (
                      <img src={r.image} alt={r.name} className="w-10 h-10 rounded-lg object-cover border border-sabren-gray shrink-0" loading="lazy" decoding="async" />
                    ) : (
                      <span className="w-10 h-10 rounded-lg bg-sabren-gray flex items-center justify-center text-sabren-black/30 shrink-0"><ShoppingBag className="w-4 h-4" /></span>
                    )}
                    <span className="flex-1 min-w-0">
                      <span className="block text-sm font-semibold truncate">{r.name}</span>
                      <span className="text-xs text-sabren-black/45">{r.price.toLocaleString("fr-FR")} FCFA{r.stock === 0 ? " · Épuisé" : ""}</span>
                    </span>
                    <span className="text-[10px] font-bold text-sabren-gold-ink uppercase">Voir →</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </form>
  );
}

const staticLinks = [
  { label: "Accueil", href: "/" },
  { label: "Boutique", href: "/boutique", icon: "shop" },
];

const smartLinks = [
  { label: "Nouveautés", href: "/boutique?nouveau=1", icon: "sparkles" },
  { label: "Meilleures ventes", href: "/boutique?best=1", icon: "flame" },
  { label: "Promotions", href: "/boutique?promo=1", icon: "tags" },
];

function NavItemIcon({ label, icon }: { label: string; icon?: string }) {
  if (label === "Accueil") return null;
  if (icon === "sparkles") return <Sparkles className="w-4 h-4 text-sabren-gold shrink-0" />;
  if (icon === "flame") return <Flame className="w-4 h-4 text-sabren-pink shrink-0" />;
  if (icon === "tags") return <Tags className="w-4 h-4 text-sabren-gold shrink-0" />;
  return null;
}

export function ShopHeader({ categories, isAdmin = false, loggedIn = false }: { categories: Cat[]; isAdmin?: boolean; loggedIn?: boolean }) {
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const wishCount = useWishlist((s) => s.ids.length);
  const [open, setOpen] = useState(false);
  const [catsOpen, setCatsOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 border-b border-sabren-gray shadow-[0_2px_12px_-8px_rgba(17,17,17,0.12)]">
        {/* Barre utilitaire */}
        <div className="hidden md:flex items-center justify-between text-xs py-1.5 px-6 bg-sabren-black text-white/80">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><Phone className="w-3 h-3 text-sabren-gold" /> {WHATSAPP_DISPLAY}</span>
            <span className="flex items-center gap-1.5"><TruckMini className="w-3.5 h-3.5 text-sabren-gold" /> Livraison partout au Niger</span>
            <span className="flex items-center gap-1.5"><StoreIcon className="w-3.5 h-3.5 text-sabren-gold" /> Retrait boutique disponible</span>
          </div>
          <div className="flex items-center gap-5">
            <span className="text-sabren-gold font-semibold">Paiement à la livraison</span>
            <Link href="/boutique?nouveau=1" className="opacity-70 hover:opacity-100 transition">Nouveautés</Link>
            <Link href="/boutique?promo=1" className="opacity-70 hover:opacity-100 transition">Promotions</Link>
          </div>
        </div>

        {/* Ligne principale */}
        <div className="max-w-7xl mx-auto px-4 lg:px-8 flex items-center gap-3 lg:gap-6 py-3">
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 -ml-2 hover:bg-sabren-gray rounded-xl" aria-label="Menu">
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>

          <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
            <img src="/logosabrenshop.jpeg" alt="Sabreen'Shop" className="w-11 h-11 rounded-xl object-cover group-hover:scale-105 transition shadow-card" loading="lazy" decoding="async" />
            <div className="leading-none">
              <span className="font-display font-black tracking-tight text-lg md:text-xl">SABREEN<span className="text-sabren-gold">’</span>SHOP</span>
              <span className="hidden sm:block text-[10px] uppercase tracking-[0.2em] text-sabren-gold-ink font-semibold">Votre style · Votre choix</span>
            </div>
          </Link>

          {/* Recherche */}
          <HeaderSearch placeholder="Rechercher Stanley, nounours, vêtements..." className="hidden md:block flex-1 max-w-xl" />

          {/* Actions */}
          <div className="flex items-center gap-1.5 ml-auto lg:ml-0">
            {isAdmin && (
              <Link href="/admin" className="flex flex-col items-center px-3 py-1 rounded-xl hover:bg-sabren-gray transition" aria-label="Administration">
                <LayoutDashboard className="w-5 h-5 text-sabren-gold" />
                <span className="hidden sm:block text-[10px] font-semibold mt-0.5">Admin</span>
              </Link>
            )}
            <Link href={loggedIn ? "/compte" : "/connexion"} className="hidden sm:flex flex-col items-center px-3 py-1 rounded-xl hover:bg-sabren-gray transition">
              <UserRound className="w-5 h-5" />
              <span className="text-[10px] font-semibold mt-0.5">{loggedIn ? "Compte" : "Connexion"}</span>
            </Link>
            <Link href="/favoris" className="hidden sm:flex flex-col items-center px-3 py-1 rounded-xl hover:bg-sabren-gray transition">
              <span className="relative">
                <Heart className="w-5 h-5" />
                {wishCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sabren-pink text-sabren-black text-[10px] font-bold h-4 min-w-4 rounded-full flex items-center justify-center px-1">
                    {wishCount}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold mt-0.5">Favoris</span>
            </Link>
            <Link href="/panier" className="relative flex flex-col items-center px-3 py-1 rounded-xl hover:bg-sabren-gray transition">
              <span className="relative">
                <ShoppingBag className="w-5 h-5" />
                {count > 0 && (
                  <span className="absolute -top-2 -right-2 bg-sabren-gold text-sabren-black text-[10px] font-bold h-4 min-w-4 rounded-full flex items-center justify-center px-1">
                    {count}
                  </span>
                )}
              </span>
              <span className="text-[10px] font-semibold mt-0.5">Panier</span>
            </Link>
          </div>
        </div>

        {/* Navigation desktop */}
        <nav className="hidden lg:block border-t border-sabren-gray">
          <div className="max-w-7xl mx-auto px-8 flex items-center gap-1 overflow-x-auto no-scrollbar">
            <div className="relative">
              <button
                onClick={() => setCatsOpen(!catsOpen)}
                className={`inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wide py-3 px-3.5 transition ${catsOpen ? "text-sabren-black" : "text-sabren-gold-ink hover:text-sabren-black"}`}
              >
                <LayoutGrid className="w-4 h-4" /> Catégories <ChevronDown className={`w-3 h-3 transition ${catsOpen ? "rotate-180" : ""}`} />
              </button>
              {catsOpen && (
                <div className="absolute top-full left-0 mt-1 w-64 bg-white rounded-2xl border border-sabren-gray shadow-card-hover p-2 z-50 animate-fade-up">
                  {categories.map((c) => (
                    <Link
                      key={c.href}
                      href={c.href}
                      onClick={() => setCatsOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-sabren-cream transition"
                    >
                      <span className="w-8 h-8 rounded-lg bg-sabren-gold/15 text-sabren-gold flex items-center justify-center">
                        <CategoryIcon icon={c.icon} className="w-4 h-4" />
                      </span>
                      <span className="text-sm font-semibold">{c.label}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {staticLinks.map((n) => (
              <Link key={n.href} href={n.href} className="px-3.5 py-3 text-sm whitespace-nowrap text-sabren-black/80 hover:text-sabren-black hover:after:absolute hover:after:left-3 hover:after:right-3 hover:after:bottom-1 hover:after:h-0.5 hover:after:bg-sabren-gold hover:after:rounded-full relative transition-colors">
                {n.label}
              </Link>
            ))}

            {/* Catégories inline (desktop) */}
            {categories.slice(0, 5).map((c) => (
              <Link key={c.href} href={c.href} className="px-3.5 py-3 text-sm whitespace-nowrap text-sabren-black/80 hover:text-sabren-gold relative transition-colors">
                {c.label}
              </Link>
            ))}

            {smartLinks.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className={`inline-flex items-center gap-1.5 px-3.5 py-3 text-sm whitespace-nowrap relative ${
                  n.label === "Promotions" ? "text-sabren-gold-ink font-bold" : "text-sabren-black/80"
                } hover:text-sabren-gold transition-colors`}
              >
                <NavItemIcon label={n.label} icon={n.icon} /> {n.label}
              </Link>
            ))}
          </div>
        </nav>

        {/* Recherche mobile */}
        <div className="md:hidden px-4 pb-3">
          <HeaderSearch placeholder="Rechercher un produit..." />
        </div>
      </header>

      {/* Drawer mobile — HORS du <header> pour que `fixed` vise la fenêtre */}
      <div className={`lg:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-sabren-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu de navigation"
          className={`absolute left-0 top-0 bottom-0 w-[300px] max-w-[85vw] bg-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-sabren-gray">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-2.5">
              <img src="/logosabrenshop.jpeg" alt="Sabreen'Shop" className="w-9 h-9 rounded-xl object-cover" loading="lazy" decoding="async" />
              <span className="font-display font-black tracking-tight text-lg">SABREEN<span className="text-sabren-gold">’</span>SHOP</span>
            </Link>
            <button onClick={() => setOpen(false)} className="p-2 hover:bg-sabren-gray rounded-xl" aria-label="Fermer le menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <span className="block px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sabren-gold-ink">Menu</span>
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-bold">
              Accueil
            </Link>
            <Link href="/boutique" onClick={() => setOpen(false)} className="flex items-center justify-between py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-bold">
              Boutique
            </Link>

            <span className="block mt-3 mb-1 px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sabren-gold-ink">Catégories</span>
            {categories.map((c) => (
              <Link key={c.href} href={c.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-medium">
                <CategoryIcon icon={c.icon} className="w-4 h-4 text-sabren-gold" /> {c.label}
              </Link>
            ))}

            <div className="my-3 border-t border-sabren-gray" />
            {smartLinks.map((n) => (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-semibold">
                <NavItemIcon label={n.label} icon={n.icon} /> {n.label}
              </Link>
            ))}
            <Link href="/favoris" onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-semibold">
              <Heart className="w-4 h-4 text-sabren-gold" /> Mes favoris{wishCount > 0 ? ` (${wishCount})` : ""}
            </Link>
            <Link href="/suivi" onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-semibold">
              <TruckMini className="w-4 h-4 text-sabren-gold" /> Suivre ma commande
            </Link>
            <Link href={loggedIn ? "/compte" : "/connexion"} onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-semibold">
              <UserRound className="w-4 h-4 text-sabren-gold" /> {loggedIn ? "Mon compte" : "Se connecter"}
            </Link>
            {isAdmin && (
              <Link href="/admin" onClick={() => setOpen(false)} className="flex items-center gap-3 py-2.5 px-3 rounded-xl hover:bg-sabren-cream text-sm font-semibold">
                <LayoutDashboard className="w-4 h-4 text-sabren-gold" /> Administration
              </Link>
            )}
          </div>

          <div className="border-t border-sabren-gray px-4 py-3 text-xs text-sabren-black/60 space-y-2">
            <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-sabren-gold" /> {WHATSAPP_DISPLAY}</span>
            <span className="flex items-center gap-1.5"><TruckMini className="w-3.5 h-3.5 text-sabren-gold" /> Livraison partout au Niger · Paiement à la livraison</span>
          </div>
        </div>
      </div>
    </>
  );
}