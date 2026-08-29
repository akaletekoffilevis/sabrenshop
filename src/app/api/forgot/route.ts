import { prisma } from "@/lib/prisma";
import { createHash, randomBytes } from "crypto";
import { z } from "zod";
import { sendMail, passwordResetHtml, appUrl } from "@/lib/email";
import { getSettings } from "@/lib/data";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email().max(120) });

export async function POST(req: Request) {
  const limited = await rateLimit(req, { key: "forgot", limit: 5, seconds: 600 });
  if (limited) return limited;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Adresse email invalide." }, { status: 400 });
  const email = parsed.data.email.toLowerCase();

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.password) {
    return Response.json({ ok: true });
  }

  const token = randomBytes(32).toString("hex");
  const tokenHash = createHash("sha256").update(token).digest("hex");
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await prisma.passwordResetToken.create({ data: { tokenHash, userEmail: email, expiresAt } });

  const settings = await getSettings();
  const link = `${appUrl()}/reinitialisation?token=${token}&email=${encodeURIComponent(email)}`;
  const sent = await sendMail({
    to: email,
    subject: "Réinitialisation de votre mot de passe",
    html: passwordResetHtml({ link, shopName: settings.shopName || "SABREEN’SHOP" }),
  });

  if (!sent && process.env.NODE_ENV !== "production") {
    console.warn("[forgot] livraison impossible (RESEND_API_KEY ?) — lien:", link);
  }

  return Response.json({ ok: true });
}