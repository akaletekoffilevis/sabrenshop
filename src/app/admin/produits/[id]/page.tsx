import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { ProductForm } from "@/components/admin/ProductForm";
import { PageHeader } from "@/components/admin/ui";

export default async function EditProduit({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { position: "asc" } }),
  ]);
  if (!product) notFound();

  return (
    <div>
      <PageHeader title="Modifier le produit" subtitle={product.name} />
      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card p-5 md:p-7">
        <ProductForm
          product={{
            ...product,
            images: product.images as string[],
            colors: product.colors as string[],
            sizes: product.sizes as string[],
          }}
          categories={categories}
        />
      </div>
    </div>
  );
}