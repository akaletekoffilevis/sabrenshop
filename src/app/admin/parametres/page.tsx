import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminParametres() {
  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Bandeau promo, hero, livraison, WhatsApp, réseaux sociaux." />
      <SettingsForm
        settings={settings ?? {
          shopName: "SABREN'SHOP", phone: "+227 89 14 84 54", whatsapp: "22789148454",
          email: "", address: "", promoBarText: "", promoBarActive: true, deliveryFee: 100, freeDeliveryThreshold: null,
          heroTitle: "", heroSubtitle: "", heroImage: "", heroCta1Text: "", heroCta2Text: "",
          facebook: "", instagram: "", tiktok: "",
        }}
      />
    </div>
  );
}