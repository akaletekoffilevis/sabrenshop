import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminParametres() {
  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  let socialLinks: Array<{ label: string; url: string }> = [];
  try {
    socialLinks = JSON.parse(settings?.socialLinks || "[]");
    if (!Array.isArray(socialLinks)) socialLinks = [];
  } catch {
    socialLinks = [];
  }
  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Bandeau promo, hero, livraison, WhatsApp, réseaux sociaux." />
      <SettingsForm
        settings={{
          shopName: settings?.shopName ?? "SABREEN'SHOP",
          phone: settings?.phone ?? "+227 89 14 84 54",
          whatsapp: settings?.whatsapp ?? "22789148454",
          email: settings?.email ?? "",
          address: settings?.address ?? "",
          promoBarText: settings?.promoBarText ?? "",
          promoBarActive: settings?.promoBarActive ?? true,
          deliveryFee: settings?.deliveryFee ?? 100,
          freeDeliveryThreshold: settings?.freeDeliveryThreshold ?? null,
          heroTitle: settings?.heroTitle ?? "",
          heroSubtitle: settings?.heroSubtitle ?? "",
          heroImage: settings?.heroImage ?? "",
          heroCta1Text: settings?.heroCta1Text ?? "",
          heroCta2Text: settings?.heroCta2Text ?? "",
          facebook: settings?.facebook ?? "",
          instagram: settings?.instagram ?? "",
          tiktok: settings?.tiktok ?? "",
          socialLinks,
        }}
      />
    </div>
  );
}