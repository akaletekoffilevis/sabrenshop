import Link from "next/link";
import { whatsappLink } from "@/lib/whatsapp";
import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";

export default async function CommandeSucces({ searchParams }: { searchParams: Promise<{ num?: string }> }) {
  const { num } = await searchParams;
  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md text-center bg-white rounded-3xl border border-sabren-gray shadow-card-hover p-8 animate-fade-up">
          <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-5">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h1 className="font-display font-black text-2xl">Commande confirmée !</h1>
          <p className="text-sm text-sabren-black/55 mt-2">
            Merci pour votre commande. Votre numéro de suivi :{" "}
            <span className="font-black text-sabren-black">{num ?? "—"}</span>
          </p>
          <p className="text-sm text-sabren-black/55 mt-3">Nous vous contactons rapidement sur WhatsApp pour confirmer la livraison.</p>
          <div className="grid gap-2.5 mt-7">
            <a href={whatsappLink(`Bonjour Sabreen Shop, je viens de passer la commande ${num ?? ""} et je souhaite confirmer.`)} target="_blank" className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-full py-3.5 text-sm transition">
              <MessageCircle className="w-4 h-4" /> Confirmer sur WhatsApp
            </a>
            <Link href="/boutique" className="inline-flex items-center justify-center gap-2 border border-sabren-gray font-bold rounded-full py-3 text-sm hover:border-sabren-gold transition">
              <ShoppingBag className="w-4 h-4" /> Continuer mes achats
            </Link>
          </div>
        </div>
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}