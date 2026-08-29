import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { whatsappLink, orderWhatsappMessage } from "@/lib/whatsapp";
import { getSettings } from "@/lib/data";
import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { CheckCircle2, MessageCircle, ShoppingBag } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function CommandeSucces({ searchParams }: { searchParams: Promise<{ num?: string }> }) {
  const { num } = await searchParams;

  const settings = await getSettings();
  const waNumber = settings.whatsapp ?? undefined;

  let recap: string | null = null;
  if (num) {
    try {
      const order = await prisma.order.findUnique({
        where: { orderNumber: num },
        include: { items: true },
      });
      if (order) {
        const subtotal = order.items.reduce((a, i) => a + i.price * i.quantity, 0);
        recap = orderWhatsappMessage({
          orderNumber: order.orderNumber,
          customerName: order.customerName,
          items: order.items.map((i) => ({ name: i.name, price: i.price, quantity: i.quantity, color: i.color, size: i.size })),
          subtotal,
          discount: order.discount,
          deliveryFee: order.deliveryFee,
          total: order.total,
          isPickup: order.isPickup,
          paymentMethod: order.paymentMethod,
          promoCode: order.promoCode,
          ville: order.ville,
          quartier: order.quartier,
        });
      }
    } catch (err) {
      console.error("[succes] récap commande indisponible", err);
    }
  }

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
          {recap && (
            <p className="text-xs text-sabren-black/45 mt-2">Un récapitulatif détaillé de votre commande vous attend sur WhatsApp.</p>
          )}
          <p className="text-sm text-sabren-black/55 mt-3">Nous vous contactons rapidement sur WhatsApp pour confirmer la livraison.</p>
          <div className="grid gap-2.5 mt-7">
            <a
              href={whatsappLink(recap ?? `Bonjour Sabreen Shop, je viens de passer la commande ${num ?? ""} et je souhaite confirmer.`, waNumber)}
              target="_blank"
              className="inline-flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white font-bold rounded-full py-3.5 text-sm transition"
            >
              <MessageCircle className="w-4 h-4" /> Envoyer mon récapitulatif sur WhatsApp
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