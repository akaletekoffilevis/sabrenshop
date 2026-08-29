# SABREEN'SHOP — Boutique en ligne

Boutique e-commerce au Niger : Stanley, gourdes, nounours, vêtements, accessoires. Commande 100 % via WhatsApp.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** (palette Sabreen : or `#D4AF37`, noir `#111111`)
- **Prisma** — SQLite en local, PostgreSQL en production (Vercel + Neon)
- **NextAuth (Auth.js v5)** — connexion email/mot de passe, rôles ADMIN / CUSTOMER
- **Zustand** — panier & favoris (persistés côté client)
- **Vercel Blob** — images produits en production (fallback dossier local en dev, data-URL en dernier recours)

## Fonctionnalités

- **Boutique** : accueil (héro, catégories, nouveautés, promotions), catalogue filtrable + recherche, fiches produit (galerie, avis, similaires, **bouton « Partager sur WhatsApp »**), panier & **commande directe via WhatsApp** (message détaillé : produits, remise promo, livraison, total). Le slug d’un produit est **généré automatiquement et n’est plus modifiable** après création.
- **Espace client** : inscription / connexion, mot de passe oublié (email + lien de réinitialisation), changement de mot de passe, **modification de l’adresse email**, **suppression de son compte**.
- **Admin** : **tableau de bord épuré** (KPIs cliquables Produits / Catégories / Comptes / Abonnés, alerte « Stock faible », **bloc d’accès rapides** grands et cliquables, derniers avis), produits (paginer 12/page, upload d’image limité à 3 Mo), catégories, codes promo, FAQ, avis, **comptes utilisateurs** (page `/admin/comptes` paginée, **suppression d’un compte client**), **mon compte admin** (changement d’email/mot de passe, `/admin/compte`), newsletter, paramètres (réseaux sociaux, livraison, héro…). **Produits, catégories et comptes offrent une bascule Vue cartes / Vue liste sur tous les écrans** (table mobile + desktop). **Aucune gestion de commandes / chiffre d’affaires** : tout passe par WhatsApp. Sidebar admin **repliable sur desktop/tablette**, tiroir hamburger sur mobile.
- **Newsletter** : les abonnés reçoivent **un email de bienvenue** à l’inscription (compte) et **un email récapitulatif quotidien** (nouveaux produits + codes promo) — **une seule fois par jour** grâce à un cron Vercel planifié à 9h00 UTC.
- **Sécurité** : rate-limiting sur les routes sensibles (connexion, inscription, upload, avis, newsletter, WhatsApp) — limite mondiale si `UPSTASH_REDIS_REST_URL`/`UPSTASH_REDIS_REST_TOKEN` sont définis, sinon limite par instance ; validation serveur des téléversements (taille/type) ; codes promo et remises recalculés côté serveur.

## Démarrage local

```bash
npm install          # installe + prisma generate (schéma SQLite)
cp .env.example .env # valeurs par défaut valides pour le local
npm run dev          # http://localhost:3000
```

La base SQLite (`prisma/dev.db`) est créée automatiquement. Pour la peupler :

```bash
npm run db:push      # pousse le schéma (SQLite)
npm run db:seed      # catégories + produits de démo + compte admin
```

Compte admin (seed) : **admin@sabrenshop.ne** / `admin123`.

## Emails (gratuits, sans carte bancaire)

Aucune API ne permet d’envoyer des emails sans clé, mais **Resend** propose 100 emails/jour gratuits (plans gratuits de 3 000 emails/mois) — c’est déjà intégré :

1. Créez un compte gratuit sur [resend.com](https://resend.com) → **API Keys** → copiez la clé.
2. Définissez dans Vercel (ou `.env`) :
   ```
   RESEND_API_KEY=re_...
   RESEND_FROM=Sabreen’Shop <onboarding@resend.dev>   # ou votre domaine vérifié
   NEWSLETTER_CRON_SECRET=<clé secrète pour protéger le cron, ex. openssl rand -base64 24>
   ```
3. Emails envoyés : bienvenue à l’inscription, récap newsletter quotidien, mot de passe oublié.

Alternative gratuite compatible : **Brevo** (ex-Sendinblue, 300 emails/jour gratuits) ou **Mailtrap Sending** — à configurer en branchant leur API dans `src/lib/email.ts`.

## Arborescence clé

```
src/
├── app/
│   ├── page.tsx            # Accueil (héro, catégories, nouveautés, promos)
│   ├── boutique/           # Catalogue (filtres, nouveautés, promos, tri, recherche)
│   ├── produit/[slug]/     # Fiche produit (galerie, avis, similaires)
│   ├── panier/            # Panier + bouton « Commander via WhatsApp »
│   ├── compte/             # Espace client, mot de passe, email, suppression
│   ├── connexion/ inscription/ mot-de-passe-oublie/ reinitialisation/
│   ├── favoris/
│   └── admin/              # Dashboard + produits + comptes + mon compte + newsletter…
│       └── api/            # Routes API (admin, newsletter, upload, compte…)
├── components/
│   ├── shop/               # UI publique (header, cartes, newsletter, sections…)
│   └── admin/              # UI dashboard (sidebar repliable desktop, drawer mobile)
├── hooks/                  # useCart, useWishlist (zustand + persist)
└── lib/                    # prisma, auth, data, storage, whatsapp, utils, email, newsletter, rate-limit
prisma/
├── schema.prisma              # Schéma LOCAL (SQLite)
├── schema.postgresql.prisma   # Schéma PRODUCTION (PostgreSQL) — à garder synchronisé
└── seed.ts                    # Données de démo + admin
```

## Déploiement sur Vercel

Vercel exécute automatiquement `vercel-build` (défini dans `package.json` + `vercel.json`) :
génère le client Prisma depuis le schéma PostgreSQL, puis `next build`.

### 1. Base de données (Neon — compte gratuit)

1. Créez un projet sur [neon.tech](https://neon.tech) → **Create project**.
2. Copiez la **connection string** PostgreSQL.
3. Poussez le schéma **une seule fois** depuis votre machine :

```bash
# Unix/macOS
DATABASE_URL="postgresql://user:pass@host/sabrenshop?sslmode=require" npm run db:push:prod
DATABASE_URL="postgresql://user:pass@host/sabrenshop?sslmode=require" npm run db:seed:prod
```

4. Vérifiez la connexion : `DATABASE_URL="<url>" npx prisma validate --schema prisma/schema.postgresql.prisma`

### 2. Variables d'environnement (Vercel → projet → Settings → Environment Variables)

Toutes à définir (Production + Preview) :

| Nom | Valeur |
| --- | --- |
| `DATABASE_URL` | Votre connection string Neon |
| `AUTH_SECRET` | `openssl rand -base64 32` |
| `NEXT_PUBLIC_BASE_URL` | `https://<votre-projet>.vercel.app` (SEO/partage) |
| `SABREN_STORE_ID` | Vercel → **Storage → Blob** → copier |
| `SABREN_READ_WRITE_TOKEN` | Vercel → **Storage → Blob** → copier |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Fallback uniquement — le numéro principal s’édite dans **admin → Paramètres → WhatsApp** (`Settings.whatsapp`), servi partout via `/api/config` |

| `RESEND_API_KEY` + `RESEND_FROM` | Emails (bienvenue, newsletter, mot de passe oublié) |
| `NEWSLETTER_CRON_SECRET` | Facultatif — sécurise le cron du récap quotidien (ou `CRON_SECRET` Vercel) |
| `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` | Facultatif — rate-limiting **mondial** (Upstash Redis) ; sinon repli en limite par instance |

`AUTH_URL` n'est pas obligatoire : `trustHost` fait détecter l'URL automatiquement.

> Sans token Blob, l’upload d’images **fonctionne quand même** par repli en data-URL
> (conseillé : configurer le Blob pour des URLs propres et légères).

### 3. Import du dépôt

Vercel → **Add New → Project** → importez le repo GitHub → framework `Next.js` et
`vercel-build` détectés → **Deploy**. Le cron `/api/newsletter/digest` (9h00 UTC, une fois/jour,
autorisé même sur le plan gratuit Hobby) est enregistré automatiquement.

### 4. Après le déploiement

- Connexion admin : email/mot de passe du seed (ou passez votre rôle en ADMIN dans la base).
- Vérifiez le cron dans Vercel → onglet **Cron Jobs** : il doit apparaître comme actif.
- Pensez à vérifier votre boîte mail (spam) après un premier récap ou un email de bienvenue.

## Commandes utiles

```bash
npm run lint          # ESLint
npx tsc --noEmit      # Vérification de types
npm run build         # Build en local (SQLite)
npm run db:push       # Mettre à jour la base locale (dev)
npm run db:push:prod  # Mettre à jour la base PostgreSQL (Neon)
```

## Rôle / compte admin

Le rôle Admin s'obtient :
- via le seed (`admin@sabrenshop.ne` / `admin123`), ou
- en passant `role = ADMIN` sur votre compte dans la base (SQLite local : `sqlite3 prisma/dev.db "update User set role='ADMIN' where email='…';"`).

Le lien « Admin » n'apparaît dans le header que pour les comptes ADMIN. Le compte admin
peut modifier son email/mot de passe via **Admin → Mon compte**, et gérer tous les comptes
via **Admin → Comptes**.