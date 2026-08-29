import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { NewsletterAdmin } from "@/components/admin/NewsletterAdmin";
import { MailWarning } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const [subscribers, digest] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.newsletterDigest.findUnique({ where: { id: "singleton" } }),
  ]);
  const hasResend = Boolean(process.env.RESEND_API_KEY);
  return (
    <div>
      <PageHeader
        title="Newsletter"
        subtitle="Les abonnés reçoivent un email récapitulatif une fois par jour (nouveaux produits + codes promo)."
      />
      {!hasResend && (
        <div className="mb-5 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl px-4 py-3 text-sm">
          <p className="flex items-center gap-2 font-bold"><MailWarning className="w-4 h-4 shrink-0" /> Emails désactivés en production</p>
          <p className="mt-1 text-xs leading-relaxed">
            Aucun email ne part tant que <code className="font-mono bg-orange-100 px-1 rounded">RESEND_API_KEY</code> (et idéalement{" "}
            <code className="font-mono bg-orange-100 px-1 rounded">RESEND_FROM</code>) ne sont pas renseignés dans les variables d’environnement Vercel
            (Settings → Environment Variables) puis re-déployés. La newsletter quotidienne, l’email de bienvenue et la réinitialisation de mot de passe attendent ces clés.
          </p>
        </div>
      )}
      <NewsletterAdmin initial={subscribers} lastDigestAt={digest?.lastRunAt ?? null} />
    </div>
  );
}