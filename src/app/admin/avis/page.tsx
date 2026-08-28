import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { ReviewsAdmin } from "@/components/admin/ReviewsAdmin";
import { MessageSquareQuote } from "lucide-react";

export default async function AdminAvis() {
  const reviews = await prisma.review.findMany({ include: { product: { select: { name: true } } }, orderBy: { createdAt: "desc" } });
  const pending = reviews.filter((r) => !r.isApproved).length;

  return (
    <div>
      <PageHeader title="Avis clients" subtitle={pending > 0 ? `${pending} avis en attente de modération` : "Tous les avis sont modérés"} />
      {reviews.length === 0 ? (
        <div className="bg-white rounded-2xl border border-sabren-gray p-10 text-center">
          <MessageSquareQuote className="w-10 h-10 mx-auto text-sabren-gold mb-3" />
          <p className="font-bold">Aucun avis pour le moment</p>
          <p className="text-sm text-sabren-black/50 mt-1">Les avis envoyés depuis les pages produits arriveront ici.</p>
        </div>
      ) : (
        <ReviewsAdmin initial={reviews.map((r) => ({ id: r.id, name: r.name, rating: r.rating, comment: r.comment, isApproved: r.isApproved, productName: r.product.name, createdAt: r.createdAt.toISOString() }))} />
      )}
    </div>
  );
}