import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { auth } from "@/lib/auth";
import { z } from "zod";

const productSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  price: z.coerce.number().int().min(0),
  compareAtPrice: z.coerce.number().int().min(0).optional().nullable(),
  stock: z.coerce.number().int().min(0).optional().default(0),
  images: z.array(z.string()).optional().default([]),
  colors: z.array(z.string()).optional().default([]),
  sizes: z.array(z.string()).optional().default([]),
  categoryId: z.string().optional().nullable(),
  isFeatured: z.boolean().optional().default(false),
  isNew: z.boolean().optional().default(false),
  isActive: z.boolean().optional().default(true),
  rating: z.coerce.number().min(0).max(5).optional().default(0),
});

async function guard() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return false;
  return true;
}

function parse(data: unknown) {
  const parsed = productSchema.safeParse(data);
  if (!parsed.success) return null;
  const d = parsed.data;
  return {
    ...d,
    slug: d.slug?.trim() || slugify(d.name),
    description: d.description || null,
    categoryId: d.categoryId || null,
  };
}

async function ensureUniqueSlug(base: string): Promise<string> {
  let slug = base;
  let i = 2;
  for (;;) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function POST(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const input = parse(await req.json());
  if (!input) return Response.json({ error: "Données invalides" }, { status: 400 });
  try {
    input.slug = await ensureUniqueSlug(input.slug);
    const product = await prisma.product.create({ data: input });
    return Response.json({ ok: true, product });
  } catch (e: any) {
    if (String(e?.message).includes("Unique")) return Response.json({ error: "Un produit avec ce slug existe déjà." }, { status: 409 });
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET() {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const products = await prisma.product.findMany({ include: { category: true }, orderBy: { createdAt: "desc" } });
  return Response.json({ products });
}