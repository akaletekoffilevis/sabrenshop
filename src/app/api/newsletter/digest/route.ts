import { runNewsletterDigest } from "@/lib/newsletter";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const secret = process.env.NEWSLETTER_CRON_SECRET || process.env.CRON_SECRET;
  const url = new URL(req.url);
  const authHeader = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") === "1";
  const tokenOk = !secret || url.searchParams.get("token") === secret || authHeader === `Bearer ${secret}`;

  if (!isVercelCron && !tokenOk) {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const res = await runNewsletterDigest();
    return Response.json({ ok: true, ...res });
  } catch (e) {
    console.error("[newsletter] digest échoué:", e);
    return Response.json({ error: "Erreur lors de l’envoi du récap" }, { status: 500 });
  }
}