import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum"),
});

export async function POST(req: Request) {
  try {
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }
    const existing = await prisma.user.findUnique({ where: { email: parsed.data.email } });
    if (existing) return Response.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });

    const hashed = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: { name: parsed.data.name, email: parsed.data.email, password: hashed, role: "CUSTOMER" },
    });
    return Response.json({ ok: true, user: { id: user.id, email: user.email, name: user.name } });
  } catch (e) {
    return Response.json({ error: "Erreur serveur, réessayez." }, { status: 500 });
  }
}