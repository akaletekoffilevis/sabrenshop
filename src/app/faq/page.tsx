import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { HelpCircle, ChevronDown } from "lucide-react";

export const metadata = {
  title: "Questions fréquentes — SABREEN'SHOP",
  description: "Réponses aux questions fréquentes chez SABREEN'SHOP : commande, livraison, paiement, suivi et retour.",
};

export default async function FaqPage() {
  const faqs = await prisma.faq.findMany({ where: { isActive: true }, orderBy: { position: "asc" } });

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto container-px lg:px-8 py-8">
        <nav className="flex items-center gap-1.5 text-xs text-sabren-black/45 mb-4">
          <Link href="/" className="hover:text-sabren-gold">Accueil</Link>
          <span>/</span>
          <span className="text-sabren-black/70 font-semibold">FAQ</span>
        </nav>

        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center mb-4">
            <HelpCircle className="w-8 h-8 text-sabren-gold" />
          </div>
          <h1 className="font-display font-black text-3xl md:text-4xl">Questions fréquentes</h1>
          <p className="text-sabren-black/55 mt-2 text-sm md:text-base">Tout ce qu’il faut savoir pour commander en toute confiance.</p>
        </div>

        {faqs.length === 0 ? (
          <div className="bg-white rounded-3xl border border-sabren-gray shadow-card p-10 text-center">
            <p className="font-bold">Aucune question pour le moment</p>
            <p className="text-sm text-sabren-black/50 mt-1">Contactez-nous sur WhatsApp pour toute question.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {faqs.map((f) => (
              <details key={f.id} className="group bg-white rounded-2xl border border-sabren-gray shadow-card overflow-hidden">
                <summary className="flex items-center gap-3 cursor-pointer list-none p-5 font-bold text-sm md:text-base hover:bg-sabren-cream/50 transition">
                  <span className="w-7 h-7 rounded-lg bg-sabren-gold/10 text-sabren-gold flex items-center justify-center font-black shrink-0 text-xs">?</span>
                  <span className="flex-1">{f.question}</span>
                  <ChevronDown className="w-4 h-4 text-sabren-black/40 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <div className="px-5 pb-5 pl-[60px] text-sm text-sabren-black/65 leading-relaxed">{f.answer}</div>
              </details>
            ))}
          </div>
        )}

        <div className="mt-10 bg-sabren-gold/10 border border-sabren-gold/30 rounded-2xl p-6 text-center text-sm">
          <p className="font-bold mb-1">Encore une question ?</p>
          <p className="text-sabren-black/60">Écrivez-nous sur WhatsApp, nous répondons vite.</p>
          <a href="https://wa.me/22789148454" target="_blank" className="inline-flex mt-4 bg-sabren-gold text-sabren-black font-bold rounded-full px-7 py-3 text-sm hover:bg-sabren-gold-hover transition shadow-gold">
            Nous contacter sur WhatsApp
          </a>
        </div>
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}