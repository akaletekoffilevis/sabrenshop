import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { NewsletterAdmin } from "@/components/admin/NewsletterAdmin";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const [subscribers, digest] = await Promise.all([
    prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.newsletterDigest.findUnique({ where: { id: "singleton" } }),
  ]);
  return (
    <div>
      <PageHeader
        title="Newsletter"
        subtitle="Les abonnés reçoivent un email récapitulatif une fois par jour (nouveaux produits + codes promo). Configurez RESEND_API_KEY en production."
      />
      <NewsletterAdmin initial={subscribers} lastDigestAt={digest?.lastRunAt ?? null} />
    </div>
  );
}