import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { z } from "zod";

async function guard() {
  const session = await auth();
  return !!session?.user && (session.user as { role?: string }).role === "ADMIN";
}

const emailSchema = z.object({
  type: z.literal("email"),
  email: z.string().email("Email invalide").max(120),
  password: z.string().min(1, "Mot de passe requis"),
});

const passwordSchema = z.object({
  type: z.literal("password"),
  currentPassword: z.string().min(1, "Mot de passe actuel requis"),
  newPassword: z.string().min(6, "Le nouveau mot de passe doit contenir au moins 6 caractères"),
});

export async function POST(req: Request) {
  if (!(await guard())) return Response.json({ error: "Non autorisé" }, { status: 401 });
  const body = await req.json().catch(() => null);
  if (!body) return Response.json({ error: "Données invalides" }, { status: 400 });

  const session = await auth();
  const user = await prisma.user.findUnique({ where: { email: session?.user?.email ?? "" } });
  if (!user) return Response.json({ error: "Utilisateur introuvable" }, { status: 404 });

  if (body.type === "email") {
    const parsed = emailSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

    const okPassword = await bcrypt.compare(parsed.data.password, user.password ?? "");
    if (!okPassword) return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

    const newEmail = parsed.data.email.toLowerCase();
    const exists = await prisma.user.findUnique({ where: { email: newEmail } });
    if (exists && exists.id !== user.id) return Response.json({ error: "Cet email est déjà utilisé par un autre compte." }, { status: 409 });

    await prisma.user.update({ where: { id: user.id }, data: { email: newEmail } });
    return Response.json({ ok: true });
  }

  if (body.type === "password") {
    const parsed = passwordSchema.safeParse(body);
    if (!parsed.success) return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });

    const okPassword = await bcrypt.compare(parsed.data.currentPassword, user.password ?? "");
    if (!okPassword) return Response.json({ error: "Mot de passe actuel incorrect" }, { status: 400 });

    const hash = await bcrypt.hash(parsed.data.newPassword, 10);
    await prisma.user.update({ where: { id: user.id }, data: { password: hash } });
    return Response.json({ ok: true });
  }

  return Response.json({ error: "Type d’action inconnu" }, { status: 400 });
}