import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { getSettings } from "@/lib/data";
import { PanierClient } from "./PanierClient";

export default async function PanierPage() {
  const settings = await getSettings();
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-6xl mx-auto container-px lg:px-8 py-6 w-full">
        <PanierClient deliveryFee={settings.deliveryFee ?? 100} freeDeliveryThreshold={settings.freeDeliveryThreshold ?? null} />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}