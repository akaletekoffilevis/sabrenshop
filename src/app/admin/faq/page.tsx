import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { FaqManager } from "@/components/admin/FaqManager";

export default async function AdminFaq() {
  const faqs = await prisma.faq.findMany({ orderBy: [{ position: "asc" }, { createdAt: "desc" }] });

  return (
    <div>
      <PageHeader title="FAQ boutique" subtitle="Questions fréquentes affichées sur la page /faq du site public." />
      <FaqManager
        initial={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer, position: f.position, isActive: f.isActive }))}
      />
    </div>
  );
}