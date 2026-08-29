import { prisma } from "@/lib/prisma";
import { z } from "zod";
import { rateLimit } from "@/lib/rate-limit";

const schema = z.object({ email: z.string().email().max(120) });

export async function POST(req: Request) {
  const limited = await rateLimit(req, { key: "newsletter", limit: 20, seconds: 3600 });
  if (limited) return limited;
  const parsed = schema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Adresse email invalide." }, { status: 400 });
  const email = parsed.data.email.toLowerCase();
  try {
    await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { active: true },
      create: { email, active: true },
    });
    return Response.json({ ok: true });
  } catch (e) {
    console.error("[newsletter] abonnement échoué:", e);
    return Response.json({ error: "Erreur serveur" }, { status: 500 });
  }
}