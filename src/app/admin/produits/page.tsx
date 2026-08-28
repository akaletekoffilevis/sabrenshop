import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Card } from "@/components/admin/ui";
import { AdminProducts } from "@/components/admin/AdminProducts";
import { PageHeader } from "@/components/admin/ui";
import { Plus, Package } from "lucide-react";

export default async function AdminProduits() {
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });

  const rows = products.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    price: p.price,
    compareAtPrice: p.compareAtPrice,
    stock: p.stock,
    isActive: p.isActive,
    isFeatured: p.isFeatured,
    images: (p.images as string[]) ?? [],
    categoryName: p.category?.name ?? null,
  }));

  return (
    <div>
      <PageHeader
        title="Produits"
        subtitle={`${products.length} produit${products.length > 1 ? "s" : ""} au catalogue — vue cartes/liste sur mobile, tableau sur ordinateur.`}
        actions={
          <Link href="/admin/produits/nouveau" className="inline-flex items-center gap-2 bg-sabren-gold text-sabren-black font-bold rounded-full px-5 py-2.5 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
            <Plus className="w-4 h-4" /> Ajouter un produit
          </Link>
        }
      />

      {products.length === 0 ? (
        <Card className="p-10 text-center">
          <Package className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
          <p className="font-bold">Aucun produit</p>
          <p className="text-sm text-sabren-black/50 mt-1">Ajoutez votre premier produit ou lancez le seed.</p>
        </Card>
      ) : (
        <AdminProducts products={rows} />
      )}
    </div>
  );
}