# SABREN'SHOP — Boutique en ligne

Boutique e-commerce au Niger : Stanley, gourdes, nounours, vêtements, accessoires. Commande via WhatsApp ou paiement à la livraison.

## Stack

- **Next.js 16** (App Router, React 19, TypeScript)
- **Tailwind CSS 4** (palette Sabren : or `#D4AF37`, noir `#111111`)
- **Prisma** — SQLite en local, PostgreSQL en production (Vercel)
- **NextAuth (Auth.js v5)** — connexion email/mot de passe, rôles ADMIN / CUSTOMER
- **Zustand** — panier & favoris (persistés côté client)
- **Vercel Blob** — images produits en production (fallback dossier `/public/uploads` en local)

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

## Arborescence clé

```
src/
├── app/
│   ├── page.tsx            # Accueil (héro, catégories, nouveautés, ventes, promos)
│   ├── boutique/           # Catalogue (filtres catégorie, nouveautés, promos, tri)
│   ├── produit/[slug]/     # Fiche produit (galerie, avis, similaires)
│   ├── panier/ commande/   # Panier & tunnel de commande
│   ├── compte/ favoris/    # Espace client, liste de souhaits
│   ├── connexion/ inscription/
│   └── admin/              # Dashboard (produits, commandes, avis, réglages)
│       └── api/            # Routes API (admin, commandes, avis, upload, produits)
├── components/
│   ├── shop/               # UI publique (header, cartes, sections…)
│   └── admin/              # UI dashboard
├── hooks/                  # useCart, useWishlist (zustand + persist)
└── lib/                    # prisma, auth, data, storage, whatsapp, utils
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
| `AUTH_URL` | `https://<votre-projet>.vercel.app` |
| `NEXT_PUBLIC_BASE_URL` | idem `AUTH_URL` |
| `BLOB_READ_WRITE_TOKEN` | Vercel → **Storage** → **Create → Blob** → copier le token |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | Votre numéro WhatsApp (ex. `22789148454`) |

### 3. Import du dépôt

Vercel → **Add New → Project** → importez le repo GitHub → le framework `Next.js` et la
commande de build (`vercel-build`) sont détectés automatiquement → **Deploy**.

### 4. Après le déploiement

- Connexion admin : email/mot de passe du seed (ou inscrivez-vous puis passez votre rôle en ADMIN dans la base).
- Les images uploadées en admin partent sur **Vercel Blob** (grâce à `BLOB_READ_WRITE_TOKEN`).

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
- en passant `role = ADMIN` sur votre compte dans la base (SQLIte local : `sqlite3 prisma/dev.db "update User set role='ADMIN' where email='…'"`).

Le lien « Admin » n'apparaît dans le header que pour les comptes ADMIN.