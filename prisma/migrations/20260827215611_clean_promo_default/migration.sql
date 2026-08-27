-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Settings" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shopName" TEXT NOT NULL DEFAULT 'SABREN''SHOP',
    "logo" TEXT,
    "phone" TEXT NOT NULL DEFAULT '+227 89 14 84 54',
    "whatsapp" TEXT NOT NULL DEFAULT '22789148454',
    "email" TEXT,
    "address" TEXT,
    "promoBarText" TEXT DEFAULT 'BIENVENUE CHEZ SABREN''SHOP — DÉCOUVREZ NOS NOUVEAUTÉS',
    "promoBarActive" BOOLEAN NOT NULL DEFAULT true,
    "deliveryFee" INTEGER NOT NULL DEFAULT 100,
    "freeDeliveryThreshold" INTEGER,
    "heroTitle" TEXT DEFAULT 'SABREN''SHOP',
    "heroSubtitle" TEXT DEFAULT 'Les produits tendance qui correspondent à votre style.',
    "heroImage" TEXT,
    "heroCta1Text" TEXT DEFAULT 'DÉCOUVRIR LA BOUTIQUE',
    "heroCta2Text" TEXT DEFAULT 'VOIR LES PROMOTIONS',
    "facebook" TEXT,
    "instagram" TEXT,
    "tiktok" TEXT,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Settings" ("address", "deliveryFee", "email", "facebook", "freeDeliveryThreshold", "heroCta1Text", "heroCta2Text", "heroImage", "heroSubtitle", "heroTitle", "id", "instagram", "logo", "phone", "promoBarActive", "promoBarText", "shopName", "tiktok", "updatedAt", "whatsapp") SELECT "address", "deliveryFee", "email", "facebook", "freeDeliveryThreshold", "heroCta1Text", "heroCta2Text", "heroImage", "heroSubtitle", "heroTitle", "id", "instagram", "logo", "phone", "promoBarActive", "promoBarText", "shopName", "tiktok", "updatedAt", "whatsapp" FROM "Settings";
DROP TABLE "Settings";
ALTER TABLE "new_Settings" RENAME TO "Settings";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
