import { prisma } from "@/lib/prisma";
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
});

async function guard() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return false;
  return true;
}

type Ctx = { params: Promise<{ id: string }> };

async function ensureUniqueSlug(base: string, excludeId: string): Promise<string> {
  let slug = base;
  let i = 2;
  for (;;) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === excludeId) return slug;
    slug = `${base}-${i++}`;
  }
}

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const parsed = productSchema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: "Données invalides" }, { status: 400 });
  try {
    const data = parsed.data;
    const slug = data.slug?.trim() || "";
    const product = await prisma.product.update({
      where: { id },
      data: { ...data, slug: await ensureUniqueSlug(slug, id), description: data.description || null, categoryId: data.categoryId || null },
    });
    return Response.json({ ok: true, product });
  } catch (e: any) {
    if (String(e?.message).includes("Unique")) return Response.json({ error: "Un produit avec ce slug existe déjà." }, { status: 409 });
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.product.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Impossible de supprimer" }, { status: 500 });
  }
}