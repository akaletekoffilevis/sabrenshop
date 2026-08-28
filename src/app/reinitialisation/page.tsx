import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { ResetForm } from "./ResetForm";

export default async function ResetPasswordPage({ searchParams }: { searchParams: Promise<{ token?: string; email?: string }> }) {
  const params = await searchParams;
  const token = params.token || "";
  const email = params.email || "";
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-10">
        <ResetForm initialToken={token} initialEmail={email} />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}