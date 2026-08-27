import { prisma } from "@/lib/prisma";
import { ShopHeader } from "./ShopHeader";

export async function Header() {
  let dbCats: { name: string; slug: string; icon: string | null }[] = [];
  try {
    dbCats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      select: { name: true, slug: true, icon: true },
    });
  } catch {}

  const categoryNav = dbCats.map((c) => ({
    label: c.name,
    href: `/boutique?cat=${c.slug}`,
    icon: c.icon ?? "package",
  }));

  return <ShopHeader categories={categoryNav} />;
}