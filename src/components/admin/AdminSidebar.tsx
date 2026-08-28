"use client";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LayoutDashboard, Package, Tags, Settings2, LogOut, ExternalLink, Menu, X, MessageSquareQuote, Tag, HelpCircle, Mail, ChevronsLeft, ChevronsRight } from "lucide-react";
import { useState } from "react";

export const adminLinks = [
  { label: "Tableau de bord", href: "/admin", icon: LayoutDashboard },
  { label: "Produits", href: "/admin/produits", icon: Package },
  { label: "Catégories", href: "/admin/categories", icon: Tags },
  { label: "Codes promo", href: "/admin/promos", icon: Tag },
  { label: "Newsletter", href: "/admin/newsletter", icon: Mail },
  { label: "FAQ", href: "/admin/faq", icon: HelpCircle },
  { label: "Avis", href: "/admin/avis", icon: MessageSquareQuote },
  { label: "Paramètres", href: "/admin/parametres", icon: Settings2 },
];

export function AdminSidebar({ collapsed, onToggle }: { collapsed: boolean; onToggle: () => void }) {
  const pathname = usePathname();
  const router = useRouter();

  const labelCls = (hidden: boolean) =>
    `hidden ${hidden ? "md:hidden" : "md:inline"} whitespace-nowrap transition-opacity`;

  const nav = (
    <nav className="flex-1 space-y-1 px-2 py-3 md:px-3 overflow-y-auto">
      {adminLinks.map((l) => {
        const Icon = l.icon;
        const active = pathname === l.href || (l.href !== "/admin" && pathname.startsWith(l.href + "/"));
        return (
          <Link
            key={l.href}
            href={l.href}
            title={l.label}
            className={`flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm font-medium transition justify-center md:justify-start ${
              active ? "bg-sabren-gold text-sabren-black font-bold" : "text-white/70 hover:bg-white/10 hover:text-white"
            }`}
          >
            <Icon className="w-5 h-5 shrink-0" />
            <span className={labelCls(collapsed)}>{l.label}</span>
          </Link>
        );
      })}
    </nav>
  );

  const bottom = (
    <div className="space-y-1 px-2 py-3 md:px-3 border-t border-white/10">
      <Link href="/" title="Voir la boutique" className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 transition justify-center md:justify-start">
        <ExternalLink className="w-5 h-5 shrink-0" />
        <span className={labelCls(collapsed)}>Voir la boutique</span>
      </Link>
      <button
        onClick={async () => { await signOut({ redirect: false }); router.push("/connexion"); router.refresh(); }}
        title="Se déconnecter"
        className="flex items-center gap-3 px-2.5 py-2.5 rounded-xl text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition w-full justify-center md:justify-start"
      >
        <LogOut className="w-5 h-5 shrink-0" />
        <span className={labelCls(collapsed)}>Se déconnecter</span>
      </button>
    </div>
  );

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 bg-sabren-black text-white flex flex-col w-14 transition-[width] duration-300 ease-in-out ${
        collapsed ? "md:w-[68px]" : "md:w-64"
      }`}
    >
      <div className={`flex items-center border-b border-white/10 ${collapsed ? "md:justify-center" : "md:justify-between"} justify-center px-2 py-4`}>
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-9 h-9 rounded-xl bg-sabren-gold text-sabren-black font-display font-black flex items-center justify-center shrink-0">S</span>
          <div className={`leading-tight md:block hidden ${collapsed ? "md:hidden" : ""}`}>
            <p className="font-display font-bold text-sabren-gold">SABREEN’SHOP</p>
            <p className="text-[10px] text-white/50 uppercase tracking-wide">Administration</p>
          </div>
        </div>
        <button
          onClick={onToggle}
          className="hidden md:inline-flex p-2 rounded-lg hover:bg-white/10 transition text-white/60 hover:text-white"
          aria-label={collapsed ? "Déplier la barre latérale" : "Replier la barre latérale"}
        >
          {collapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
        </button>
      </div>
      {nav}
      {bottom}
    </aside>
  );
}

export function AdminMobileTop() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const linkCls = (href: string) =>
    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition ${
      pathname === href || (href !== "/admin" && pathname.startsWith(href + "/"))
        ? "bg-sabren-gold text-sabren-black font-bold"
        : "text-white/70 hover:bg-white/10 hover:text-white"
    }`;

  return (
    <>
      <div className="md:hidden sticky top-0 z-30 bg-sabren-black text-white pl-[56px] pr-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="font-display font-bold text-sabren-gold text-sm">ADMIN</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-white/10" aria-label="Menu">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Drawer coulissant — HORS du top bar pour un backdrop pleine fenêtre */}
      <div className={`md:hidden fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
        <div
          className={`absolute inset-0 bg-sabren-black/60 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Menu d’administration"
          className={`absolute left-0 top-0 bottom-0 w-[290px] max-w-[82vw] bg-sabren-black text-white flex flex-col shadow-2xl transition-transform duration-300 ease-out ${open ? "translate-x-0" : "-translate-x-full"}`}
        >
          <div className="flex items-center justify-between px-4 py-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <span className="w-9 h-9 rounded-xl bg-sabren-gold text-sabren-black font-display font-black flex items-center justify-center">S</span>
              <div className="leading-tight">
                <p className="font-display font-bold text-sabren-gold text-sm">SABREEN’SHOP</p>
                <p className="text-[10px] text-white/50 uppercase tracking-wide">Administration</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/10" aria-label="Fermer le menu">
              <X className="w-5 h-5" />
            </button>
          </div>

          <nav className="flex-1 overflow-y-auto px-3 py-3 space-y-1">
            <span className="block px-3 pb-1 text-[10px] font-bold uppercase tracking-wide text-white/40">Menu</span>
            {adminLinks.map((l) => {
              const Icon = l.icon;
              return (
                <Link key={l.href} href={l.href} onClick={() => setOpen(false)} className={linkCls(l.href)}>
                  <Icon className="w-4 h-4 shrink-0" />
                  {l.label}
                </Link>
              );
            })}
          </nav>

          <div className="border-t border-white/10 px-3 py-3 space-y-1">
            <Link href="/" onClick={() => setOpen(false)} className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:bg-white/10 transition">
              <ExternalLink className="w-4 h-4" /> Voir la boutique
            </Link>
            <button
              onClick={async () => { await signOut({ redirect: false }); router.push("/connexion"); router.refresh(); }}
              className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm text-white/70 hover:bg-red-500/20 hover:text-red-300 transition w-full"
            >
              <LogOut className="w-4 h-4" /> Se déconnecter
            </button>
          </div>
        </div>
      </div>
    </>
  );
}