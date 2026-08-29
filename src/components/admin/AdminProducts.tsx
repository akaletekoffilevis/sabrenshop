"use client";
import { useState } from "react";
import Link from "next/link";
import { Pencil, Image as ImageIcon, LayoutGrid, List, Plus } from "lucide-react";
import { Card, Badge } from "./ui";
import { Pagination } from "./Pagination";
import { DeleteProductButton } from "./DeleteProductButton";
import { formatPrice } from "@/lib/utils";

export type AdminProductRow = {
  id: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  stock: number;
  isActive: boolean;
  isFeatured: boolean;
  images: string[];
  categoryName: string | null;
};

export function AdminProducts({ products }: { products: AdminProductRow[] }) {
  const [view, setView] = useState<"cards" | "list">("cards");
  const [page, setPage] = useState(1);

  const PER_PAGE = 12;
  const pages = Math.max(1, Math.ceil(products.length / PER_PAGE));
  const eff = Math.min(page, pages);
  const paged = products.slice((eff - 1) * PER_PAGE, eff * PER_PAGE);

  const stockTone = (stock: number): "red" | "gold" | "green" => (stock === 0 ? "red" : stock < 5 ? "gold" : "green");
  const stockLabel = (stock: number) => (stock === 0 ? "Rupture" : `${stock} en stock`);
  const thumb = (p: AdminProductRow) =>
    p.images[0] ? (
      <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" loading="lazy" decoding="async" />
    ) : (
      <span className="w-full h-full flex items-center justify-center text-sabren-black/20"><ImageIcon className="w-5 h-5" /></span>
    );

  const actions = (p: AdminProductRow, vertical = false) => (
    <div className={vertical ? "flex flex-col gap-1" : "flex items-center gap-1"}>
      <Link href={`/admin/produits/${p.id}`} className="p-2 rounded-lg text-sabren-black/40 hover:text-sabren-gold hover:bg-sabren-cream transition" aria-label="Modifier">
        <Pencil className="w-4 h-4" />
      </Link>
      <DeleteProductButton id={p.id} name={p.name} />
    </div>
  );

  return (
    <div>
      {products.length === 0 ? null : (
        <>
          {/* Bascule Cartes / Liste (mobile) */}
          <div className="md:hidden flex items-center justify-between gap-2 mb-4">
            <div className="inline-flex bg-sabren-gray rounded-full p-1">
              <button
                onClick={() => setView("cards")}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${view === "cards" ? "bg-white text-sabren-black shadow-card" : "text-sabren-black/50"}`}
              >
                <LayoutGrid className="w-3.5 h-3.5" /> Cartes
              </button>
              <button
                onClick={() => setView("list")}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold transition ${view === "list" ? "bg-white text-sabren-black shadow-card" : "text-sabren-black/50"}`}
              >
                <List className="w-3.5 h-3.5" /> Liste
              </button>
            </div>
            <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-1.5 bg-sabren-gold text-sabren-black font-bold rounded-full px-4 py-2 text-xs hover:bg-sabren-gold-hover transition">
              <Plus className="w-3.5 h-3.5" /> Ajouter
            </Link>
          </div>

          {/* Table desktop */}
          <Card className="overflow-x-auto hidden md:block">
            <table className="w-full text-sm">
              <thead className="bg-sabren-gray/60 text-left text-xs uppercase text-sabren-black/45">
                <tr>
                  <th className="px-5 py-3">Produit</th>
                  <th className="py-3">Catégorie</th>
                  <th className="py-3 text-center">Prix</th>
                  <th className="py-3 text-center">Stock</th>
                  <th className="py-3 text-center">Statut</th>
                  <th className="py-3 text-right pr-5">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.id} className="border-t border-sabren-gray hover:bg-sabren-cream/50 transition">
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <span className="w-11 h-11 rounded-xl overflow-hidden bg-sabren-cream border border-sabren-gray shrink-0">{thumb(p)}</span>
                        <div>
                          <p className="font-semibold">{p.name}</p>
                          <p className="text-[11px] text-sabren-black/40">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3">{p.categoryName ?? <span className="text-sabren-black/35">Non classé</span>}</td>
                    <td className="py-3 text-center">
                      <span className="font-bold">{formatPrice(p.price)}</span>
                      {p.compareAtPrice != null && p.compareAtPrice > p.price && (
                        <span className="block text-[11px] line-through text-sabren-black/35">{formatPrice(p.compareAtPrice)}</span>
                      )}
                    </td>
                    <td className="py-3 text-center">
                      {p.stock === 0 ? <Badge tone="red">Rupture</Badge> : p.stock < 5 ? <Badge tone="gold">{p.stock}</Badge> : <span className="text-sabren-black/60">{p.stock}</span>}
                    </td>
                    <td className="py-3 text-center">
                      <Badge tone={p.isActive ? "green" : "gray"}>{p.isActive ? "Visible" : "Masqué"}</Badge>
                      {p.isFeatured && <span className="block mt-1"><Badge tone="gold">Best seller</Badge></span>}
                    </td>
                    <td className="py-3 text-right pr-5">
                      <div className="flex items-center justify-end gap-1">{actions(p)}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          {/* Cartes mobile (grille 2 colonnes pleine largeur) */}
          <div className={`md:hidden grid gap-3 ${view === "cards" ? "grid-cols-2" : "grid-cols-1"}`}>
            {paged.map((p) =>
              view === "cards" ? (
                <Card key={p.id} className="overflow-hidden">
                  <div className="aspect-square bg-sabren-cream overflow-hidden">
                    <Link href={`/admin/produits/${p.id}`} className="block w-full h-full">{thumb(p)}</Link>
                  </div>
                  <div className="p-2.5">
                    <Link href={`/admin/produits/${p.id}`} className="font-bold text-[13px] leading-snug line-clamp-2 min-h-[2.4em] hover:text-sabren-gold transition">
                      {p.name}
                    </Link>
                    <p className="text-[11px] text-sabren-black/40 mt-0.5 truncate">{p.categoryName ?? "Non classé"}</p>
                    <div className="flex items-center justify-between gap-1 mt-1.5">
                      <span className="font-black text-sm">{formatPrice(p.price)}</span>
                      <Badge tone={stockTone(p.stock)}>{stockLabel(p.stock)}</Badge>
                    </div>
                    <div className="flex items-center justify-between border-t border-sabren-gray/60 mt-2 pt-1.5">
                      <button
                        onClick={() => setView("list")}
                        className="text-[10px] font-bold uppercase text-sabren-gold hover:underline"
                      >
                        Voir la liste
                      </button>
                      {actions(p)}
                    </div>
                  </div>
                </Card>
              ) : (
                <Card key={p.id} className="p-3 flex items-center gap-3 w-full">
                  <Link href={`/admin/produits/${p.id}`} className="shrink-0 w-14 h-14 rounded-xl overflow-hidden bg-sabren-cream border border-sabren-gray">
                    {thumb(p)}
                  </Link>
                  <div className="flex-1 min-w-0">
                    <Link href={`/admin/produits/${p.id}`} className="font-bold text-sm line-clamp-1 hover:text-sabren-gold transition">{p.name}</Link>
                    <p className="text-[11px] text-sabren-black/40 mt-0.5">{p.categoryName ?? "Non classé"}</p>
                    <div className="flex items-center flex-wrap gap-x-2 gap-y-1 mt-1.5">
                      <span className="font-black text-sm">{formatPrice(p.price)}</span>
                      <Badge tone={stockTone(p.stock)}>{stockLabel(p.stock)}</Badge>
                      {p.isFeatured && <Badge tone="gold">Best</Badge>}
                    </div>
                  </div>
                  {actions(p, true)}
                </Card>
              )
            )}
          </div>

          <Pagination page={eff} pages={pages} total={products.length} onChange={setPage} />
        </>
      )}
    </div>
  );
}