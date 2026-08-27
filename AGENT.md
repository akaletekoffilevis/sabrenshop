# AGENT.md — SABREN’SHOP

> Boutique e-commerce professionnelle, moderne, 100% administrable sans toucher au code.
> `SABREN’SHOP — Votre boutique, votre style, votre choix.`

## 1. STACK TECHNIQUE

- **Framework:** Next.js 16.3.3 (App Router), TypeScript, Tailwind CSS 4
- **DB:** SQLite **en dev** (`DATABASE_URL="file:./prisma/dev.db"`), PostgreSQL hébergé (Neon/Supabase) **en prod** — même schéma Prisma
- **Auth:** NextAuth.js v5 (Auth.js) — Email/Mot de passe, rôles `ADMIN` / `CUSTOMER`, commande invité possible
- **Images:** Abstraction `lib/storage.ts` → **local** en dev (`public/uploads`) puis **Vercel Blob** en prod (switch via env `BLOB_READ_WRITE_TOKEN`)
- **Paiement V1:** WhatsApp + Paiement à la livraison. Architecture prête pour Mobile Money Niger (Airtel/Moov)
- **Hébergement:** Vercel
- **Langue:** Français | **Devise:** FCFA (XOF) — format `12 500 FCFA`
- **WhatsApp officiel:** `+227 89 14 84 54`

## 2. PALETTE OFFICIELLE (issue du logo)

| Nom | Hex | Usage |
|-----|-----|-------|
| Noir profond | `#111111` | Logo, titres, textes |
| Or champagne | `#D4AF37` | CTA, badges premium, hover |
| Crème | `#FFF8EF` | Fond principal |
| Rose poudré | `#E8B7C8` | Accents, promos, décoratif |
| Gris doux | `#F2F2F2` | Fonds sections, cards |

> Ne jamais faire un design full noir. Fond crème dominant, or comme couleur d'action identifiable SABREN’SHOP.

Variables Tailwind définies dans `src/app/globals.css` via `@theme`.

## 3. STRUCTURE PROJET

```
src/
  app/
    (shop)/             # site public (header, footer, layout shop)
      page.tsx          # Accueil (Hero + Categories + Best sellers)
      boutique/page.tsx # Boutique + recherche/filtres/tri
      produit/[slug]/   # Page produit premium
      panier/
      layout.tsx
    (auth)/             # login / register
    admin/              # dashboard protégé ROLE=ADMIN
      layout.tsx
      page.tsx          # stats CA, commandes, produits
      produits/
      categories/
      commandes/
      clients/
      medias/
      parametres/
      promotions/
    api/
      auth/[...nextauth]/
      products/
      categories/
      upload/
      orders/
  components/
    shop/   # Header, Footer, PromoBar, Hero, CategoryGrid, ProductCard, CartDrawer, WhatsappFloat
    admin/  # Sidebar, Stats, Tables, MediaManager, ProductForm
    ui/     # Button, Badge, Input, Card (réutilisables)
  lib/
    prisma.ts
    auth.ts
    whatsapp.ts   # generateProductMessage(), generateCartMessage()
    storage.ts    # saveFile() abstraction
    utils.ts      # cn(), formatPrice()
    validations.ts # zod schemas
  hooks/
    useCart.ts    # Zustand store panier (localStorage)
prisma/
  schema.prisma
  seed.ts
public/
  uploads/        # dev local
  placeholder/    # images placeholder
```

## 4. MODÈLE DE DONNÉES (Prisma)

```prisma
User { id, name, email, password, role ADMIN|CUSTOMER, orders, reviews }
Category { id, name, slug, description, image, isActive, position, products }
Product { id, name, slug, description, price, compareAtPrice, stock, images[], colors[], sizes[], categoryId, isFeatured, isNew, isActive, rating, reviews }
Order { id, number, customerName, phone, whatsapp, address, quartier, ville, items Json, total, deliveryFee, status NEW|CONFIRMED|PREPARING|SHIPPED|DELIVERED|CANCELLED, paymentMethod WHATSAPP|COD, userId? }
Review { id, productId, userId, rating, comment }
Settings { id, shopName, logo, phone, whatsapp, promoBarText, promoBarActive, deliveryFee, freeDeliveryThreshold, socials Json }
```

`images` = relation Media ou Json string[] (Vercel Blob URLs). `colors`/`sizes` = String[].

## 5. FONCTIONNALITÉS PAR PHASE

### PHASE 1 — MVP (en cours)
- [ ] Config Tailwind + palette + fonts (Playfair Display + Inter)
- [ ] Layout global: PromoBar (modifiable admin) + Header (logo, nav, recherche, compte, panier) + Footer + WhatsappFloat + Menu mobile hamburger
- [ ] Page Accueil: Hero (image/titre/sous-titre/2 CTA modifiables), Grille Catégories, Meilleures ventes
- [ ] Page Boutique: grille produits, recherche, filtres (catégorie, prix, taille, couleur, dispo, promo, nouveau, best), tri
- [ ] Page Produit: galerie + zoom, prix barré, variantes, stock, quantité, AJOUTER PANIER / ACHETER MAINTENANT / COMMANDER WHATSAPP, garanties
- [ ] Panier: Zustand + localStorage, +/- quantité, supprimer, code promo (V1 champ visuel), frais livraison, total, COMMANDER VIA WHATSAPP
- [ ] WhatsApp: `lib/whatsapp.ts` génère liens `wa.me/22789148454?text=...` produit & panier
- [ ] Auth: NextAuth credentials, pages login/register, compte client, protection admin
- [ ] Admin CRUD complet: Produits (multi-photos), Catégories, Commandes (changement statut), Clients, Médias (upload/supprimer), Paramètres (logo, couleurs, whatsapp, livraison, promoBar)
- [ ] Seed: 7 catégories + 12 produits placeholder

### PHASE 2
- Promotions (% / FCFA / codes / multi-achats 2→-10% 3→-15% / livraison gratuite / cadeaux)
- Avis clients (CRUD admin, modération)
- Dashboard stats (CA, commandes, best products)
- SEO (metadata dynamiques, sitemap, alt text obligatoire)
- Emails transactionnels

### PHASE 3
- Paiement Mobile Money, multi-vendeurs, etc.

## 6. RÈGLES MÉTIER CRITIQUES

1. **Aucune image hardcodée.** Tout visuel (hero, bannière, catégorie, produit, logo) vient de `Settings` ou `Media` et uploadable depuis `/admin/medias`.
2. **Zéro émoji dans l'UI.** Interdiction stricte d'émojis/native icons : toutes les icônes via `lucide-react` (registre `src/components/ui/category-icon.tsx`).
3. **Catégories 100% dynamiques** depuis la DB (`Category.icon` = clé lucide). Ne jamais hardcoder la liste des catégories dans le front.
4. **WhatsApp partout:** header, produit, panier, footer, flottant. Message produit & panier pré-rempli en français.
5. **Livraison:** `deliveryFee` global (100 FCFA initial) modifiable dans Paramètres. `freeDeliveryThreshold` optionnel. `quartier`/`ville` obligatoires dans commande. Option `retraitBoutique`.
6. **Commande invité:** pas de compte obligatoire. Si connecté, commande liée au `userId`.
7. **Prix:** toujours `formatPrice(price)` → `12 500 FCFA`. `compareAtPrice` affichée barrée si > price.
8. **Mobile First:** boutons CTA sticky bas d'écran sur mobile, images optimisées `next/image`.

## 7. COMMANDES UTILES

```bash
npm run dev          # dev
npx prisma migrate dev --name init
npx prisma db seed
npx prisma studio
npm run build
```

Env requis: `DATABASE_URL`, `AUTH_SECRET`, `BLOB_READ_WRITE_TOKEN` (prod).

## 8. CONVENTIONS CODE

- Composants server par défaut, `"use client"` seulement si nécessaire (panier, formulaires)
- Validation Zod côté client + serveur
- Pas de `any`, types Prisma exportés
- Commit messages en français

## 9. INSPIRATIONS DESIGN

Amazon / Jumia / Alibaba: grille claire, cards aérées, badge promo or, CTA noir+or, navigation mega-menu desktop / drawer mobile.

## 10. CHECKLIST AVANT LIVRAISON PHASE 1

- [ ] Lighthouse mobile >90
- [ ] Responsive test Android/iPhone/Tablet/Desktop
- [ ] Toutes images remplaçables depuis admin
- [ ] WhatsApp liens testés
- [ ] Panier persistant
- [ ] Admin protégé
