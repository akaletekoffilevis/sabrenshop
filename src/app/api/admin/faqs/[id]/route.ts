import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

async function guard() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") return false;
  return true;
}

const schema = z.object({
  question: z.string().min(3, "Question requise"),
  answer: z.string().min(3, "Réponse requise"),
  position: z.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
  const faq = await prisma.faq.update({ where: { id }, data: parsed.data });
  return Response.json({ ok: true, faq });
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const { id } = await params;
  await prisma.faq.delete({ where: { id } });
  return Response.json({ ok: true });
}