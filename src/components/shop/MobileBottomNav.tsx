"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { useWishlist } from "@/hooks/useWishlist";
import { Home, LayoutGrid, Heart, UserRound } from "lucide-react";

export function MobileBottomNav() {
  const wishCount = useWishlist((s) => s.ids.length);
  const pathname = usePathname();
  const { data: session } = useSession();

  const tabs = [
    { label: "Accueil", href: "/", icon: Home },
    { label: "Boutique", href: "/boutique", icon: LayoutGrid },
    { label: "Favoris", href: "/favoris", icon: Heart, badge: wishCount },
    { label: session ? "Compte" : "Connexion", href: session ? "/compte" : "/connexion", icon: UserRound },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur border-t border-sabren-gray grid grid-cols-4 shadow-[0_-4px_16px_-10px_rgba(17,17,17,0.15)]">
      {tabs.map(({ label, href, icon: Icon, badge }) => {
        const active = pathname === href || (href === "/boutique" && pathname.startsWith("/produit"));
        return (
          <Link
            key={href}
            href={href}
            className={`flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-semibold relative transition ${active ? "text-sabren-black" : "text-sabren-black/55"}`}
          >
            <span className="relative">
              <Icon className={`w-5 h-5 ${active ? "text-sabren-gold" : ""}`} />
              {badge !== undefined && badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-sabren-gold text-sabren-black text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">{badge}</span>
              )}
            </span>
            {label}
            {active && <span className="absolute top-0 inset-x-6 h-0.5 bg-sabren-gold rounded-full" />}
          </Link>
        );
      })}
    </nav>
  );
}