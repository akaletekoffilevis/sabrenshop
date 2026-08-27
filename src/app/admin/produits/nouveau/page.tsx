import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";

export default async function NouveauProduit() {
  const categories = await prisma.category.findMany({ orderBy: { position: "asc" } });
  return (
    <div>
      <PageHeader title="Nouveau produit" subtitle="Créez un produit : informations, prix, photos, variantes." />
      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 md:p-7">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}