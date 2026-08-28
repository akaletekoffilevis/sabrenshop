import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { PromoManager } from "@/components/admin/PromoManager";

export default async function AdminPromos() {
  const promos = await prisma.promoCode.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div>
      <PageHeader title="Codes promo" subtitle="Créez des réductions en %, en FCFA, avec seuils et limites." />
      <div className="rounded-2xl bg-sabren-gold/10 border border-sabren-gold/30 px-4 py-3 text-sm mb-6">
        Les clients saisissent le code dans le panier — la réduction s&apos;applique automatiquement au total.
      </div>
      <PromoManager
        initial={promos.map((p) => ({
          id: p.id,
          code: p.code,
          description: p.description,
          type: p.type,
          value: p.value,
          minSubtotal: p.minSubtotal,
          maxUses: p.maxUses,
          usedCount: p.usedCount,
          isActive: p.isActive,
          expiresAt: p.expiresAt ? p.expiresAt.toISOString().slice(0, 10) : null,
        }))}
      />
    </div>
  );
}