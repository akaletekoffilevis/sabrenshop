import { prisma } from "@/lib/prisma";
import { PageHeader } from "@/components/admin/ui";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { MailWarning } from "lucide-react";

export default async function AdminParametres() {
  const settings = await prisma.settings.findUnique({ where: { id: "default" } });
  let socialLinks: Array<{ label: string; url: string }> = [];
  try {
    socialLinks = JSON.parse(settings?.socialLinks || "[]");
    if (!Array.isArray(socialLinks)) socialLinks = [];
  } catch {
    socialLinks = [];
  }
  const warning = !process.env.RESEND_API_KEY
    ? "Email (newsletter, bienvenue, mot de passe oublié) : ajoutez RESEND_API_KEY dans les variables Vercel."
    : null;
  return (
    <div>
      <PageHeader title="Paramètres" subtitle="Bandeau promo, hero, livraison, WhatsApp, réseaux sociaux." />
      {warning && (
        <div className="mb-5 bg-orange-50 border border-orange-200 text-orange-800 rounded-2xl px-4 py-3 text-sm">
          <p className="flex items-center gap-2 font-bold"><MailWarning className="w-4 h-4 shrink-0" /> Emails désactivés</p>
          <p className="mt-1 text-xs leading-relaxed">{warning} Les commandes passées sur la boutique sont stockées mais rien n’est envoyé par email tant que cette clé est absente.</p>
        </div>
      )}
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