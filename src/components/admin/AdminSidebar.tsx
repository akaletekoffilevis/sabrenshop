"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tags, ShoppingCart, Settings2, LogOut, ExternalLink, Menu, X, MessageSquareQuote } from "lucide-react";
import { useState } from "react";

export const adminLinks = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/produits", icon: Package },
  { label: "Catégories", href: "/admin/categories", icon: Tags },
  { label: "Commandes", href: "/admin/commandes", icon: ShoppingCart },
  { label: "Avis", href: "/admin/avis", icon: MessageSquareQuote },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings2 },
];

export function AdminSidebar({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const nav = (
    <nav className="space-y-1">
      {adminLinks.map((l) => {
        const Icon = l.icon;
        const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href + "/"));
        return (
          <Link
            key={l.href}
            href={l.href}
            onClick={onNavigate}
            className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${active ? "bg-sabren-gold text-sabren-black font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"}`}
          >
            <Icon className="w-4 h-4 shrink-0" />
            {l.label}
          </Link>
        );
      })}
    </nav>
  );

  const bottom = (
    <div className="space-y-1 pt-4 border-t border-white/10">
      <Link href="/" className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 transition" onClick={onNavigate}>
        <ExternalLink className="w-4 h-4" /> Voir la boutique
      </Link>
      <button
        onClick={async () => { await signOut({ redirect: false }); router.push("/connexion"); router.refresh(); }}
        className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition w-full"
      >
        <LogOut className="w-4 h-4" /> Se déconnecter
      </button>
    </div>
  );

  return (
    <aside className="hidden md:flex flex-col w-64 bg-sabren-black text-white p-4 fixed inset-y-0 left-0 z-40">
      <div className="flex items-center gap-2 px-2 mb-6">
        <span className="w-9 h-9 rounded-xl bg-sabren-gold text-sabren-black font-display font-black flex items-center justify-center">S</span>
        <div className="leading-tight">
          <p className="font-display font-bold text-sabren-gold">SABREN’SHOP</p>
          <p className="text-[10px] text-white/50 uppercase tracking-wide">Administration</p>
        </div>
      </div>
      {nav}
      {bottom}
    </aside>
  );
}

export function AdminMobileTop() {
  const [open, setOpen] = useState(false);
  return (
    <div className="md:hidden sticky top-0 z-50 bg-sabren-black text-white px-4 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-sabren-gold text-sabren-black font-display font-black flex items-center justify-center">S</span>
        <span className="font-display font-bold text-sabren-gold text-sm">ADMIN</span>
      </div>
      <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/10" aria-label="Menu">
        {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      {open && (
        <div className="fixed inset-0 top-[52px] bg-sabren-black text-white p-4 space-y-1 z-50 overflow-y-auto">
          <AdminSidebar onNavigate={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}