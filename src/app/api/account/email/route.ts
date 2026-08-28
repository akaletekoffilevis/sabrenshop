import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  email: z.string().email("Email invalide").max(120),
  password: z.string().min(1, "Mot de passe actuel requis"),
});

export async function POST(req: Request) {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return Response.json({ error: "Non connecté" }, { status: 401 });

  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  const okPassword = await bcrypt.compare(parsed.data.password, user.password ?? "");
  if (!okPassword) return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

  const newEmail = parsed.data.email.toLowerCase();
  const exists = await prisma.user.findUnique({ where: { email: newEmail } });
  if (exists && exists.id !== user.id) return Response.json({ error: "Cet email est déjà utilisé par un autre compte." }, { status: 409 });

  await prisma.user.update({ where: { id: user.id }, data: { email: newEmail } });
  return Response.json({ ok: true });
}