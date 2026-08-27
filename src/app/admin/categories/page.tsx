import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { CategoryManager } from "@/components/admin/CategoryManager";

export default async function AdminCategories() {
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { position: "asc" } });
  return (
    <div>
      <PageHeader title="Catégories" subtitle="Créez, renommez, déplacez vos catégories. Elles alimentent le header et la boutique." />
      <CategoryManager initial={categories} />
    </div>
  );
}