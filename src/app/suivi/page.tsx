import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { SuiviClient } from "./SuiviClient";

export const metadata = {
  title: "Suivre ma commande — SABREEN'SHOP",
  description: "Suivez l'état de votre commande SABREEN'SHOP : reçue, confirmée, préparée, expédiée ou livrée.",
};

export default function SuiviPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-xl mx-auto container-px lg:px-8 py-8 w-full">
        <SuiviClient />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}