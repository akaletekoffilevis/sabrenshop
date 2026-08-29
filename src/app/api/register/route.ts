import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { sendMail, welcomeEmailHtml, appUrl } from "@/lib/email";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({
  name: z.string().min(2, "Nom trop court"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Mot de passe : 6 caractères minimum"),
});

export async function POST(req: Request) {
  try {
    const limited = await rateLimit(req, { key: "register", limit: 10, seconds: 900 });
    if (limited) return limited;
    const json = await req.json();
    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return Response.json({ error: parsed.error.issues[0]?.message ?? "Données invalides" }, { status: 400 });
    }
    const email = parsed.data.email.trim().toLowerCase();
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return Response.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });

    const hashed = await bcrypt.hash(parsed.data.password, 10);
    const user = await prisma.user.create({
      data: { name: parsed.data.name, email, password: hashed, role: "CUSTOMER" },
    });

    void sendWelcome(email, user.name);

    return Response.json({ ok: true, user: { id: user.id, email, name: user.name } });
  } catch (e) {
    return Response.json({ error: "Erreur serveur, réessayez." }, { status: 500 });
  }
}

async function sendWelcome(email: string, name?: string | null) {
  try {
    const s = await prisma.settings.findUnique({ where: { id: "default" } });
    const ok = await sendMail({
      to: email,
      subject: "Bienvenue chez SABREEN’SHOP 👋",
      html: welcomeEmailHtml({ name, shopName: s?.shopName || "SABREEN’SHOP" }),
    });
    if (ok) console.info(`[email] email de bienvenue envoyé à ${email}`);
  } catch (err) {
    console.error("[email] bienvenue échoué:", err);
  }
}