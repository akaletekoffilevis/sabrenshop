import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { ForgotForm } from "./ForgotForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <ForgotForm />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}