import { auth } from "@/lib/auth";
import { runNewsletterDigest } from "@/lib/newsletter";

export const maxDuration = 60;
export const dynamic = "force-dynamic";

export async function POST() {
  const session = await auth();
  if (!session?.user || (session.user as { role?: string }).role !== "ADMIN") {
    return Response.json({ error: "Non autorisé" }, { status: 401 });
  }
  try {
    const res = await runNewsletterDigest();
    return Response.json({ ok: true, ...res });
  } catch (e) {
    console.error("[newsletter] digest admin échoué:", e);
    return Response.json({ error: "Erreur lors de l’envoi du récap" }, { status: 500 });
  }
}