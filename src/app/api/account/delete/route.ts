import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  password: z.string().min(1, "Mot de passe requis"),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return Response.json({ error: "Non connecté" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (user.role === "ADMIN") return Response.json({ error: "Impossible de supprimer un compte administrateur via ce formulaire." }, { status: 400 });

  if (user.password) {
    const okPassword = await bcrypt.compare(parsed.data.password, user.password);
    if (!okPassword) return Response.json({ error: "Mot de passe incorrect" }, { status: 400 });
  }

  await prisma.user.delete({ where: { id: user.id } });
  return Response.json({ ok: true });
}