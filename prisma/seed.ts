import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();

const IMG = {
  stanley: ["https://images.unsplash.com/photo-1523369364227-24934b335841?w=600", "https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=600", "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600"],
  teddy: ["https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=600", "https://images.unsplash.com/photo-1559454403-b8fb5fd7056e?w=600", "https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?w=600"],
  shirt: ["https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=600", "https://images.unsplash.com/photo-1608234807905-4466023792f4?w=600"],
  dress: ["https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600", "https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=600", "https://images.unsplash.com/photo-1591369822096-ffd140ec948f?w=600"],
  jeans: ["https://images.unsplash.com/photo-1542272604-787c3835535d?w=600", "https://images.unsplash.com/photo-1604176354204-9268737828e4?w=600", "https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=600"],
  bag: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"],
  backpack: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600", "https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=600", "https://images.unsplash.com/photo-1577733966973-d680b86d2c80?w=600"],
  phone: ["https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=600", "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600", "https://images.unsplash.com/photo-1567581935884-3349723552ca?w=600"],
  tablet: ["https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=600", "https://images.unsplash.com/photo-1561154464-82e9adf32764?w=600", "https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=600"],
  earphones: ["https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600", "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600", "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600"],
  headset: ["https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600", "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=600", "https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=600"],
  watch: ["https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600", "https://images.unsplash.com/photo-1524592094714-0f0654e20314?w=600", "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?w=600"],
  smartwatch: ["https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=600", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600", "https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=600"],
  sneakers: ["https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600", "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=600", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600"],
  jewel: ["https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=600", "https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=600", "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=600"],
  lamp: ["https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=600", "https://images.unsplash.com/photo-1534073828943-f801091bb18c?w=600", "https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=600"],
  blanket: ["https://images.unsplash.com/photo-1580301762395-83d5e0e6c7e5?w=600", "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600", "https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=600"],
  yoga: ["https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=600", "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600", "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600"],
  dumbbell: ["https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600", "https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=600", "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=600"],
  perfume: ["https://images.unsplash.com/photo-1541643600914-78b084683601?w=600", "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=600", "https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=600"],
  cosmetic: ["https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600", "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600", "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600"],
  wallet: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600", "https://images.unsplash.com/photo-1627123424574-724758594e93?w=600"],
};

type PC = { name: string; slug: string; description?: string | null; icon: string; image?: string | null; position: number };
const CATEGORIES: PC[] = [
  { name: "Stanley", slug: "stanley", description: "Gourdes et tasses tendance, isothermes", position: 1, icon: "cup", image: IMG.stanley[0] },
  { name: "Nounours & Peluches", slug: "nounours", description: "Nounours et peluches douces pour tous les âges", position: 2, icon: "toys", image: IMG.teddy[0] },
  { name: "Vêtements", slug: "vetements", description: "Vêtements modernes femme & homme", position: 3, icon: "shirt", image: IMG.shirt[0] },
  { name: "Téléphones", slug: "telephones", description: "Smartphones Android et iPhone reconditionnés", position: 4, icon: "smartphone", image: IMG.phone[0] },
  { name: "Tablettes & Écrans", slug: "tablettes", description: "Tablettes, écouteurs et casques", position: 5, icon: "tablet", image: IMG.tablet[0] },
  { name: "Audio", slug: "audio", description: "Écouteurs sans fil et casques Bluetooth", position: 6, icon: "headphones", image: IMG.earphones[0] },
  { name: "Montres", slug: "montres", description: "Montres connectées et classiques", position: 7, icon: "watch", image: IMG.watch[0] },
  { name: "Sacs & Accessoires", slug: "accessoires", description: "Sacs à main, sacs à dos, portefeuilles", position: 8, icon: "bag", image: IMG.bag[0] },
  { name: "Chaussures", slug: "chaussures", description: "Baskets et chaussures tendance", position: 9, icon: "shoe", image: IMG.sneakers[0] },
  { name: "Bijoux", slug: "bijoux", description: "Chaînes, bagues et accessoires dorés", position: 10, icon: "gem", image: IMG.jewel[0] },
  { name: "Sport & Fitness", slug: "sport", description: "Tapis de yoga, haltères, gourdes", position: 11, icon: "dumbbell", image: IMG.dumbbell[0] },
  { name: "Beauté & Parfums", slug: "beaute", description: "Parfums et soins de beauté", position: 12, icon: "spray", image: IMG.perfume[0] },
  { name: "Maison", slug: "maison", description: "Lampes, couvertures et décoration", position: 13, icon: "home", image: IMG.lamp[0] },
  { name: "Cadeaux", slug: "cadeaux", description: "Idées cadeaux pour tous", position: 14, icon: "gift", image: IMG.teddy[1] },
  { name: "Promotions", slug: "promotions", description: "Produits en promotion", position: 15, icon: "tags", image: IMG.phone[1] },
  { name: "Nouveautés", slug: "nouveautes", description: "Dernières nouveautés", position: 16, icon: "sparkles", image: IMG.watch[1] },
];

type PD = {
  name: string; slug: string; price: number; compareAtPrice?: number; stock: number; images: string[];
  colors?: string[]; sizes?: string[]; categoryId?: string | null; isFeatured?: boolean; isNew?: boolean;
  description?: string;
};
const PRODUCTS: PD[] = [
  // Stanley & boissons
  { name: "Stanley Gourde Rose 1.2L", slug: "stanley-rose-1-2l", price: 18500, compareAtPrice: 25000, stock: 20, images: IMG.stanley, colors: ["Rose", "Noir", "Vert"], sizes: ["1.2L"], categoryId: "stanley", isFeatured: true, isNew: true, description: "Gourde Stanley isotherme premium. Garde au chaud 12h, au froid 24h." },
  { name: "Gourde Stanley 946ml Noir Mat", slug: "stanley-946ml-noir", price: 15000, compareAtPrice: 19000, stock: 25, images: IMG.stanley, colors: ["Noir", "Bleu", "Crème"], sizes: ["946ml"], categoryId: "stanley", isFeatured: true, description: "Le célèbre format 946ml, indestructible et isotherme." },
  { name: "Tasse Stanley à Mains Noire", slug: "stanley-tasse-quencher-noire", price: 22000, stock: 12, images: IMG.stanley, colors: ["Noir", "Rose", "Rouge"], sizes: ["887ml"], categoryId: "stanley", isNew: true, description: "Tasse Quencher avec paille, tendance sur les réseaux." },
  // Nounours & peluches
  { name: "Nounours Géant Crème 80cm", slug: "nounours-geant-creme-80cm", price: 22000, compareAtPrice: 28000, stock: 15, images: IMG.teddy, colors: ["Crème", "Marron"], sizes: ["80cm"], categoryId: "nounours", isFeatured: true, description: "Nounours géant ultra doux, parfait cadeau." },
  { name: "Nounours 40cm Marron", slug: "nounours-40cm-marron", price: 9000, stock: 30, images: IMG.teddy, colors: ["Marron", "Blanc"], sizes: ["40cm"], categoryId: "nounours", description: "Nounours tout doux en peluche premium." },
  { name: "Peluche Kawaii Lapin", slug: "peluche-kawaii-lapin", price: 6000, stock: 40, images: IMG.teddy, colors: ["Blanc", "Rose"], sizes: ["30cm"], categoryId: "nounours", isNew: true, description: "Peluche kawaii irrésistible, idéale en cadeau." },
  // Vêtements
  { name: "T-Shirt Premium Noir", slug: "tshirt-sabreen-noir", price: 8500, stock: 30, images: IMG.shirt, colors: ["Noir", "Blanc", "Gris"], sizes: ["S", "M", "L", "XL"], categoryId: "vetements", isFeatured: true, description: "T-shirt coton premium, coupe moderne." },
  { name: "Robe d'été Fleurie", slug: "robe-ete-fleurie", price: 22000, stock: 18, images: IMG.dress, colors: ["Fleuri", "Pétale"], sizes: ["S", "M", "L"], categoryId: "vetements", isNew: true, description: "Robe légère et élégante pour toutes les occasions." },
  { name: "Jeans Homme Slim", slug: "jeans-homme-slim", price: 18000, compareAtPrice: 23000, stock: 22, images: IMG.jeans, colors: ["Bleu foncé", "Noir"], sizes: ["30", "32", "34", "36"], categoryId: "vetements", description: "Jean slim stretch, confortable au quotidien." },
  // Téléphones
  { name: "Redmi Note 13 128Go", slug: "redmi-note-13-128go", price: 185000, compareAtPrice: 200000, stock: 10, images: IMG.phone, colors: ["Noir minuit", "Bleu", "Blanc"], categoryId: "telephones", isFeatured: true, description: "Smartphone 6.67'' AMOLED 120Hz, caméra 108MP, batterie 5000mAh. Garantie 1 an." },
  { name: "Samsung Galaxy A55 128Go", slug: "samsung-galaxy-a55", price: 245000, stock: 8, images: IMG.phone, colors: ["Noir", "Violet", "Vert"], categoryId: "telephones", description: "Galaxy A55, écran Super AMOLED, 5G. Garantie 1 an." },
  { name: "iPhone 12 128Go Reconditionné", slug: "iphone-12-128go-reco", price: 210000, compareAtPrice: 260000, stock: 6, images: IMG.phone, colors: ["Noir", "Bleu"], categoryId: "telephones", isNew: true, description: "iPhone 12 reconditionné état comme neuf, batterie 100%. Garantie 6 mois." },
  { name: "Téléphone Téléphone M11 64Go", slug: "xiaomi-redmi-a3-64go", price: 95000, stock: 14, images: IMG.phone, colors: ["Vert", "Noir"], categoryId: "telephones", description: "Téléphone simple et fiable, idéal premier smartphone." },
  // Tablettes & écrans
  { name: "Samsung Galaxy Tab A9+", slug: "samsung-tab-a9-plus", price: 145000, stock: 7, images: IMG.tablet, colors: ["Graphite", "Argent"], sizes: ["11''"], categoryId: "tablettes", isFeatured: true, description: "Tablette 11'' avec stylet en option, parfaite pour l'étude." },
  { name: "Tablette Lenovo M10", slug: "lenovo-tab-m10", price: 110000, stock: 9, images: IMG.tablet, colors: ["Gris"], sizes: ["10.1''"], categoryId: "tablettes", description: "Tablette performante à petit prix, idéale famille." },
  // Audio
  { name: "Écouteurs Sans Fil Pro", slug: "ecouteurs-sans-fil-pro", price: 25000, compareAtPrice: 35000, stock: 30, images: IMG.earphones, colors: ["Blanc", "Noir"], categoryId: "audio", isFeatured: true, isNew: true, description: "Écouteurs Bluetooth réduction de bruit, étui de charge." },
  { name: "Écouteurs Bluetooth X5", slug: "ecouteurs-bluetooth-x5", price: 15000, compareAtPrice: 20000, stock: 35, images: IMG.earphones, colors: ["Noir", "Bleu", "Rouge"], categoryId: "audio", description: "Écouteurs sans fil avec micro, 4h d'autonomie." },
  { name: "Casque Bluetooth Basses", slug: "casque-bluetooth-basses", price: 22000, stock: 20, images: IMG.headset, colors: ["Noir", "Blanc"], categoryId: "audio", description: "Casque sans fil confortable, basses puissantes." },
  // Montres
  { name: "Montre Connectée Sport S8", slug: "montre-connectee-s8", price: 175000, compareAtPrice: 220000, stock: 6, images: IMG.smartwatch, colors: ["Noir", "Starlight"], categoryId: "montres", isFeatured: true, description: "Montre connectée, santé, appels, sport. Garantie 6 mois." },
  { name: "Montre Connectée Fitness", slug: "montre-connectee-fitness", price: 18000, stock: 25, images: IMG.smartwatch, colors: ["Noir", "Rose", "Bleu"], categoryId: "montres", isNew: true, description: "Suivi cardio, pas, sommeil. Compatible Android & iOS." },
  { name: "Montre Classique Élégante", slug: "montre-classique-elegante", price: 12000, stock: 15, images: IMG.watch, colors: ["Argent", "Or"], categoryId: "montres", description: "Montre automatique élégante pour tous les jours." },
  // Sacs & portefeuilles
  { name: "Sac à Main Cuir Femme", slug: "sac-main-cuir-femme", price: 25000, stock: 12, images: IMG.bag, colors: ["Noir", "Camel", "Rouge"], categoryId: "accessoires", isFeatured: true, description: "Sac à main en cuir PU, style intemporel." },
  { name: "Sac à Dos Urbain", slug: "sac-a-dos-urbain", price: 18000, compareAtPrice: 24000, stock: 20, images: IMG.backpack, colors: ["Noir", "Gris"], categoryId: "accessoires", description: "Sac à dos résistant, compartiment ordinateur 15''." },
  { name: "Portefeuille Homme Cuir", slug: "portefeuille-homme-cuir", price: 8000, stock: 25, images: IMG.wallet, colors: ["Noir", "Marron", "Bleu"], categoryId: "accessoires", description: "Portefeuille cuir compact avec porte-cartes." },
  // Chaussures
  { name: "Baskets Chunky Blanches", slug: "baskets-chunky-blanches", price: 28000, compareAtPrice: 35000, stock: 16, images: IMG.sneakers, colors: ["Blanc", "Rose", "Vert"], sizes: ["38", "39", "40", "41", "42", "44"], categoryId: "chaussures", isFeatured: true, description: "Baskets tendance semelle épaisse." },
  { name: "Sneakers Course Légères", slug: "sneakers-course-legeres", price: 22000, stock: 14, images: IMG.sneakers, colors: ["Noir", "Blanc", "Bleu"], sizes: ["38", "39", "40", "41", "42", "43"], categoryId: "chaussures", description: "Sneakers sport légères et respirantes." },
  // Bijoux
  { name: "Chaîne Dorée Homme", slug: "chaine-doree-homme", price: 15000, stock: 18, images: IMG.jewel, colors: ["Doré"], categoryId: "bijoux", isNew: true, description: "Chaîne finition dorée, look premium." },
  { name: "Bague Duo Adjustable", slug: "bague-duo-adjustable", price: 8000, stock: 30, images: IMG.jewel, colors: ["Doré", "Argent"], categoryId: "bijoux", description: "Bague duo réglable, élégante au quotidien." },
  // Sport
  { name: "Tapis de Yoga 183cm", slug: "tapis-yoga-183cm", price: 18000, stock: 15, images: IMG.yoga, colors: ["Violet", "Bleu", "Noir"], categoryId: "sport", description: "Tapis antidérapant, épais et confortable." },
  { name: "Haltères Réglables 2x5kg", slug: "halteres-reglables-2x5kg", price: 25000, stock: 10, images: IMG.dumbbell, colors: ["Noir", "Rouge"], categoryId: "sport", isNew: true, description: "Paire d'haltères réglables pour la musculation à la maison." },
  // Beauté
  { name: "Parfum Homme 100ml", slug: "parfum-homme-100ml", price: 35000, compareAtPrice: 45000, stock: 12, images: IMG.perfume, colors: ["100ml"], categoryId: "beaute", isFeatured: true, description: "Parfum longue tenue, notes boisées et fraîches." },
  { name: "Coffret Beauté Femme", slug: "coffret-beaute-femme", price: 28000, stock: 8, images: IMG.cosmetic, colors: ["Set"], categoryId: "beaute", description: "Coffret soins et maquillage, joli cadeau." },
  // Maison
  { name: "Lampe LED Moderne", slug: "lampe-led-moderne", price: 15000, stock: 12, images: IMG.lamp, colors: ["Argent", "Doré"], categoryId: "maison", description: "Lampe de chevet LED 3 tons, design moderne." },
  { name: "Couverture Polaire Géante", slug: "couverture-polaire-geante", price: 12000, stock: 20, images: IMG.blanket, colors: ["Gris", "Bleu", "Rose"], sizes: ["180x220"], categoryId: "maison", description: "Couverture polaire ultra douce et légère." },
];

async function main() {
  const categoryIds: Record<string, string> = {};
  for (const c of CATEGORIES) {
    const saved = await prisma.category.upsert({ where: { slug: c.slug }, update: c, create: c });
    categoryIds[c.slug] = saved.id;
  }

  for (const p of PRODUCTS) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: { ...p, categoryId: p.categoryId ? categoryIds[p.categoryId] : null } as any,
      create: { ...p, categoryId: p.categoryId ? categoryIds[p.categoryId] : null } as any,
    });
  }

  const hashed = await bcrypt.hash("admin123", 10);
  await prisma.user.upsert({ where: { email: "admin@sabrenshop.ne" }, update: {}, create: { email: "admin@sabrenshop.ne", name: "Admin SABREEN", password: hashed, role: "ADMIN" } });

  const settings = { id: "default", shopName: "SABREEN'SHOP", whatsapp: "22789148454", phone: "+227 89 14 84 54", email: "soumanabaaminata@gmail.com", deliveryFee: 100, promoBarText: "BIENVENUE CHEZ SABREEN'SHOP — DÉCOUVREZ NOS NOUVEAUTÉS" };
  await prisma.settings.upsert({ where: { id: "default" }, update: settings, create: settings as any });

  if ((await prisma.faq.count()) === 0) {
    const faqs = [
      { question: "Comment passer commande ?", answer: "Ajoutez vos articles au panier puis validez la commande. Vous pouvez aussi commander directement via WhatsApp : nous confirmons et livrons rapidement.", position: 1 },
      { question: "Quels sont les moyens de paiement ?", answer: "Paiement à la livraison en espèces ou paiement par avance via WhatsApp (Mobile Money). Le retrait en boutique reste possible.", position: 2 },
      { question: "Quels sont les frais de livraison ?", answer: "Les frais de livraison sont à la charge du client, partout au Niger. Le retrait en boutique est gratuit.", position: 3 },
      { question: "Puis-je échanger ou retourner un article ?", answer: "Oui, vous pouvez échanger ou retourner un article sous 7 jours s'il est en bon état et dans son emballage d'origine.", position: 4 },
      { question: "Comment utiliser un code promo ?", answer: "Ajoutez vos articles au panier, collez le code dans le champ « Code promo » et cliquez sur Appliquer : la réduction s'applique immédiatement.", position: 5 },
    ];
    for (const f of faqs) await prisma.faq.create({ data: f });
  }

  if ((await prisma.promoCode.count()) === 0) {
    await prisma.promoCode.create({
      data: { code: "BIENVENUE10", description: "-10% sur votre première commande (panier minimum 10 000 FCFA)", type: "PERCENT", value: 10, minSubtotal: 10000 },
    });
  }

  console.log(`Seed done — ${CATEGORIES.length} catégories, ${PRODUCTS.length} produits`);
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(async () => await prisma.$disconnect());