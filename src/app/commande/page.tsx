import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { CheckoutClient } from "./CheckoutClient";

export default function CommandePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-4xl mx-auto container-px lg:px-8 py-6 w-full">
        <CheckoutClient />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}