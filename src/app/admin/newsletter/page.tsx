import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { NewsletterAdmin } from "@/components/admin/NewsletterAdmin";

export const dynamic = "force-dynamic";

export default async function AdminNewsletterPage() {
  const subscribers = await prisma.newsletterSubscriber.findMany({ orderBy: { createdAt: "desc" } });
  return (
    <div>
      <PageHeader
        title="Newsletter"
        subtitle="Les abonnés reçoivent un email à chaque nouveau produit. Configurez RESEND_API_KEY en production pour l’envoi."
      />
      <NewsletterAdmin initial={subscribers} />
    </div>
  );
}