import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const catSchema = z.object({
  name: z.string().min(2),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  icon: z.string().optional().default("package"),
  image: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  position: z.coerce.number().int().optional().default(0),
});

async function guard() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return false;
  return true;
}

function parse(data: unknown) {
  const p = catSchema.safeParse(data);
  if (!p.success) return null;
  return { ...p.data, slug: p.data.slug?.trim() || slugify(p.data.name), description: p.data.description || null, image: p.data.image || null };
}

export async function GET() {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const categories = await prisma.category.findMany({ include: { _count: { select: { products: true } } }, orderBy: { position: "asc" } });
  return Response.json({ categories });
}

export async function POST(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const input = parse(await req.json());
  if (!input) return Response.json({ error: "Données invalides" }, { status: 400 });
  try {
    const category = await prisma.category.create({ data: input });
    return Response.json({ ok: true, category });
  } catch (e: any) {
    if (String(e?.message).includes("Unique")) return Response.json({ error: "Une catégorie avec ce slug existe déjà." }, { status: 409 });
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}