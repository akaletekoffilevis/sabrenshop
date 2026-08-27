import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const p = catSchema.safeParse(await req.json());
  if (!p.success) return Response.json({ error: "Données invalides" }, { status: 400 });
  try {
    const category = await prisma.category.update({ where: { id }, data: { ...p.data, description: p.data.description || null, image: p.data.image || null } });
    return Response.json({ ok: true, category });
  } catch (e: any) {
    if (String(e?.message).includes("Unique")) return Response.json({ error: "Une catégorie avec ce slug existe déjà." }, { status: 409 });
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(_req: Request, { params }: Ctx) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  try {
    await prisma.category.delete({ where: { id } });
    return Response.json({ ok: true });
  } catch {
    return Response.json({ error: "Impossible de supprimer (produits liés ?)" }, { status: 500 });
  }
}