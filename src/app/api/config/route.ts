import { getSettings } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const s = await getSettings();
  return Response.json({
    shopName: s.shopName ?? null,
    phone: s.phone ?? null,
    whatsapp: s.whatsapp ?? undefined,
    email: s.email ?? null,
    address: s.address ?? null,
    deliveryFee: s.deliveryFee ?? undefined,
    freeDeliveryThreshold: s.freeDeliveryThreshold ?? undefined,
    promoBarText: s.promoBarText,
    promoBarActive: s.promoBarActive,
    socialLinks: s.socialLinks ?? [],
  });
}