import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { formatPrice } from "@/lib/utils";
import { Card, Badge } from "@/components/admin/ui";
import { DeleteProductButton } from "@/components/admin/DeleteProductButton";
import { Plus, Package, Pencil, Image as ImageIcon } from "lucide-react";

export default async function AdminProduits() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <div>
          <h1 className="font-display font-black text-2xl">Produits</h1>
          <p className="text-sm text-sabren-black/50 mt-0.5">{products.length} produit{products.length > 1 ? "s" : ""} au catalogue</p>
        </div>
        <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
          <Plus className="w-4 h-4" /> Ajouter un produit
        </Link>
      </div>

      {products.length === 0 ? (
        <Card className="p-10 text-center">
          <Package className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
          <p className="font-bold">Aucun produit</p>
          <p className="text-sm text-sabren-black/50 mt-1">Ajoutez votre premier produit ou lancez le seed.</p>
        </Card>
      ) : (
        <Card className="overflow-x-auto">
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
              {products.map((p) => (
                <tr key={p.id} className="border-t border-sabren-gray hover:bg-sabren-cream/50 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <span className="w-11 h-11 rounded-xl overflow-hidden bg-sabren-cream border border-sabren-gray shrink-0">
                        {(p.images as string[])[0] ? (
                          <img src={(p.images as string[])[0]} alt="" className="w-full h-full object-cover" />
                        ) : (
                          <span className="flex items-center justify-center h-full text-sabren-black/20"><ImageIcon className="w-4 h-4" /></span>
                        )}
                      </span>
                      <div>
                        <p className="font-semibold">{p.name}</p>
                        <p className="text-[11px] text-sabren-black/40">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3">{p.category?.name ?? <span className="text-sabren-black/35">Non classé</span>}</td>
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
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/admin/produits/${p.id}`} className="p-2 rounded-lg text-sabren-black/40 hover:text-sabren-gold hover:bg-sabren-cream transition" aria-label="Modifier">
                        <Pencil className="w-4 h-4" />
                      </Link>
                      <DeleteProductButton id={p.id} name={p.name} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </Card>
      )}
    </div>
  );
}