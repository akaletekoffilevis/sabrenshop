import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
});

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.email) return Response.json({ error: "Non connecté" }, { status: 401 });

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });
  if (!user.password) return Response.json({ error: "Impossible de changer le mot de passe de ce compte" }, { status: 400 });

  const ok = await bcrypt.compare(parsed.data.currentPassword, user.password);
  if (!ok) return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

  const hash = await bcrypt.hash(parsed.data.newPassword, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

  return Response.json({ ok: true });
}