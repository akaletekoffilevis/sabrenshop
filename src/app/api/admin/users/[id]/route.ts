import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  const { id } = await params;

  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) return Response.json({ error: "Compte introuvable." }, { status: 404 });
  if (user.role === "ADMIN") {
    return Response.json({ error: "Impossible de supprimer un compte administrateur." }, { status: 400 });
  }

  await prisma.user.delete({ where: { id } });
  return Response.json({ ok: true });
}