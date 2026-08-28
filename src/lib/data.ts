import { prisma } from "@/lib/prisma";

export type SiteSettings = {
  heroTitle: string;
  heroSubtitle: string;
  heroImage: string;
  heroCta1Text: string;
  heroCta2Text: string;
  promoBarText: string;
  promoBarActive: boolean;
  deliveryFee: number | null;
  freeDeliveryThreshold?: number | null;
  socialLinks?: Array<{ label: string; url: string }>;
  shopName?: string | null;
  phone?: string | null;
  whatsapp?: string | null;
  email?: string | null;
  address?: string | null;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  heroTitle: "SABREEN'SHOP",
  heroSubtitle: "Les produits tendance qui correspondent à votre style.",
  heroImage: "https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=1600",
  heroCta1Text: "DÉCOUVRIR LA BOUTIQUE",
  heroCta2Text: "VOIR LES PROMOTIONS",
  promoBarText: "BIENVENUE CHEZ SABREEN'SHOP — DÉCOUVREZ NOS NOUVEAUTÉS !",
  promoBarActive: true,
  deliveryFee: null,
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const s = await prisma.settings.findFirst();
    if (!s) return DEFAULT_SETTINGS;
    let socialLinks: Array<{ label: string; url: string }> = [];
    try {
      const raw = JSON.parse(s.socialLinks || "[]");
      socialLinks = Array.isArray(raw)
        ? raw.filter((x: { label?: string; url?: string }) => x && typeof x.url === "string" && x.url.trim())
        : [];
    } catch {
      socialLinks = [];
    }
    return {
      heroTitle: s.heroTitle || DEFAULT_SETTINGS.heroTitle,
      heroSubtitle: s.heroSubtitle || DEFAULT_SETTINGS.heroSubtitle,
      heroImage: s.heroImage || DEFAULT_SETTINGS.heroImage,
      heroCta1Text: s.heroCta1Text || DEFAULT_SETTINGS.heroCta1Text,
      heroCta2Text: s.heroCta2Text || DEFAULT_SETTINGS.heroCta2Text,
      promoBarText: s.promoBarText || DEFAULT_SETTINGS.promoBarText,
      promoBarActive: s.promoBarActive ?? true,
      deliveryFee: s.deliveryFee ?? null,
      freeDeliveryThreshold: s.freeDeliveryThreshold ?? null,
      socialLinks,
      shopName: s.shopName ?? null,
      phone: s.phone ?? null,
      whatsapp: s.whatsapp ?? null,
      email: s.email ?? null,
      address: s.address ?? null,
    };
  } catch (err) {
    console.error("[data] settings load failed:", err);
    return DEFAULT_SETTINGS;
  }
}

export async function getActiveCategories() {
  try {
    return await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      select: { id: true, name: true, slug: true, icon: true, image: true, description: true },
    });
  } catch (err) {
    console.error("[data] categories load failed:", err);
    return [];
  }
}

export async function getActiveCategoryNav() {
  try {
    const cats = await prisma.category.findMany({
      where: { isActive: true },
      orderBy: { position: "asc" },
      select: { name: true, slug: true, icon: true },
    });
    return cats.map((c) => ({ label: c.name, href: `/boutique?cat=${c.slug}`, icon: c.icon ?? "package" }));
  } catch (err) {
    console.error("[data] category nav failed:", err);
    return [];
  }
}

export async function getHomeProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isFeatured: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[data] home products failed:", err);
    return [];
  }
}

export async function getNewProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, isNew: true },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[data] new products failed:", err);
    return [];
  }
}

export async function getDealProducts() {
  try {
    return await prisma.product.findMany({
      where: { isActive: true, compareAtPrice: { gt: 0 } },
      take: 8,
      orderBy: { createdAt: "desc" },
    });
  } catch (err) {
    console.error("[data] deal products failed:", err);
    return [];
  }
}