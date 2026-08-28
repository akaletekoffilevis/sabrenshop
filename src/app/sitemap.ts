import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const BASE = (process.env.NEXT_PUBLIC_BASE_URL || "https://sabrenshop-test-app.vercel.app").replace(/\/$/, "");

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPage = (path: string, priority: number) => ({
    url: `${BASE}${path}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority,
  });

  const staticRoutes: MetadataRoute.Sitemap = [
    staticPage("", 1),
    staticPage("/boutique", 0.9),
    staticPage("/suivi", 0.5),
    staticPage("/panier", 0.4),
    staticPage("/commande", 0.5),
    staticPage("/connexion", 0.3),
    staticPage("/inscription", 0.3),
  ];

  let categories: { slug: string }[] = [];
  let products: { slug: string; updatedAt: Date }[] = [];
  try {
    [categories, products] = await Promise.all([
      prisma.category.findMany({ where: { isActive: true }, select: { slug: true } }),
      prisma.product.findMany({ where: { isActive: true }, select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    return staticRoutes;
  }

  return [
    ...staticRoutes,
    ...categories.map((c) => ({ url: `${BASE}/boutique?cat=${c.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.6 })),
    ...products.map((p) => ({ url: `${BASE}/produit/${p.slug}`, lastModified: p.updatedAt, changeFrequency: "weekly" as const, priority: 0.8 })),
  ];
}