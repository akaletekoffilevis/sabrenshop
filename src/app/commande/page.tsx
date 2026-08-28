import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { getSettings } from "@/lib/data";
import { CheckoutClient } from "./CheckoutClient";

export default async function CommandePage() {
  const settings = await getSettings();
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-4xl mx-auto container-px lg:px-8 py-6 w-full">
        <CheckoutClient deliveryFee={settings.deliveryFee ?? 100} freeDeliveryThreshold={settings.freeDeliveryThreshold ?? null} />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}