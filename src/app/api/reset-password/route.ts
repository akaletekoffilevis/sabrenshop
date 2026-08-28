import { prisma } from "@/lib/prisma";
import { createHash } from "crypto";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  token: z.string().min(20),
  email: z.string().email().max(120),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères."),
});

export async function POST(req: Request) {
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    const message = parsed.error?.issues?.[0]?.message || "Données invalides.";
    return Response.json({ error: message }, { status: 400 });
  }
  const { token, email, password } = parsed.data;
  const tokenHash = createHash("sha256").update(token).digest("hex");

  const record = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!record || record.userEmail.toLowerCase() !== email.toLowerCase() || record.usedAt || record.expiresAt < new Date()) {
    return Response.json({ error: "Lien invalide ou expiré. Faites une nouvelle demande." }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.$transaction([
    prisma.user.update({ where: { email }, data: { password: passwordHash } }),
    prisma.passwordResetToken.update({ where: { id: record.id }, data: { usedAt: new Date() } }),
  ]);

  return Response.json({ ok: true });
}