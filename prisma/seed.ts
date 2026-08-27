import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

async function main() {
  const categories = [
    { name: "Stanley", slug: "stanley", description: "Gourdes et tasses tendance", position: 1, icon: "cup", image: "https://images.unsplash.com/photo-1523369364227-24934b335841?w=600" },
    { name: "Nounours", slug: "nounours", description: "Nounours et peluches douces", position: 2, icon: "toys", image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600" },
    { name: "Vêtements", slug: "vetements", description: "Vêtements modernes", position: 3, icon: "shirt", image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600" },
    { name: "Accessoires", slug: "accessoires", description: "Accessoires de mode", position: 4, icon: "bag", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600" },
    { name: "Cadeaux", slug: "cadeaux", description: "Idées cadeaux", position: 5, icon: "gift" },
    { name: "Promotions", slug: "promotions", description: "Produits en promotion", position: 6, icon: "tags" },
    { name: "Nouveautés", slug: "nouveautes", description: "Dernières nouveautés", position: 7, icon: "sparkles" },
  ];
  for (const c of categories) {
    await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
  }

  const catStanley = await prisma.category.findUnique({ where: { slug: "stanley" } });
  const catNounours = await prisma.category.findUnique({ where: { slug: "nounours" } });
  const catVet = await prisma.category.findUnique({ where: { slug: "vetements" } });

  const products = [
    { name: "Stanley Gourde Rose 1.2L", slug: "stanley-rose-1-2l", price: 18500, compareAtPrice: 25000, stock: 20, images: ["https://images.unsplash.com/photo-1523369364227-24934b335841?w=600"], colors: ["Rose", "Noir"], sizes: ["1.2L"], categoryId: catStanley?.id, isFeatured: true, isNew: true, description: "Gourde Stanley isotherme premium. Garde au chaud 12h, au froid 24h." },
    { name: "Nounours Géant Crème 80cm", slug: "nounours-geant-creme-80cm", price: 22000, compareAtPrice: 28000, stock: 15, images: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600"], colors: ["Crème", "Marron"], sizes: ["80cm"], categoryId: catNounours?.id, isFeatured: true, description: "Nounours géant ultra doux, parfait cadeau." },
    { name: "T-Shirt Sabren Noir Premium", slug: "tshirt-sabren-noir", price: 8500, stock: 30, images: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600"], colors: ["Noir", "Blanc"], sizes: ["S", "M", "L", "XL"], categoryId: catVet?.id, isFeatured: true, description: "T-shirt coton premium, coupe moderne." },
  ];
  for (const p of products) {
    await prisma.product.upsert({ where: { slug: p.slug }, update: p, create: p as any });
  }

  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({ where: { email: "admin@sabrenshop.ne" }, update: {}, create: { email: "admin@sabrenshop.ne", name: "Admin Sabren", password: hashed, role: "ADMIN" } });

  await prisma.settings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", shopName: "SABREN'SHOP", whatsapp: "22789148454", phone: "+227 89 14 84 54", deliveryFee: 100, promoBarText: "BIENVENUE CHEZ SABREN'SHOP — DÉCOUVREZ NOS NOUVEAUTÉS — LIVRAISON 100 FCFA PARTOUT AU NIGER" },
  });

  console.log("Seed done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => await prisma.$disconnect());
