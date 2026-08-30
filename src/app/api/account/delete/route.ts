import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return Response.json({ error: "Non connecté" }, { status: 401 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (user.role === "ADMIN") return Response.json({ error: "Impossible de supprimer un compte administrateur via ce formulaire." }, { status: 400 });

  await prisma.user.delete({ where: { id: user.id } });
  return Response.json({ ok: true });
}