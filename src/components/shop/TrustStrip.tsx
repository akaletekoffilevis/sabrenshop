import { Truck, Wallet, MessageCircle, RotateCcw } from "lucide-react";

const items = [
  { icon: Truck, title: "Livraison partout au Niger", desc: "Niamey & régions" },
  { icon: Wallet, title: "Paiement à la livraison", desc: "C'est vous qui voyez" },
  { icon: MessageCircle, title: "Commande WhatsApp", desc: "+227 89 14 84 54" },
  { icon: RotateCcw, title: "Retrait en boutique", desc: "Satisfait ou remplacé" },
];

export function TrustStrip() {
  return (
    <section className="max-w-7xl mx-auto container-px lg:px-8 pt-6">
      <div className="bg-white rounded-2xl border border-sabren-gray shadow-card grid grid-cols-2 md:grid-cols-4 divide-x divide-sabren-gray divide-y md:divide-y-0 overflow-hidden">
        {items.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex items-center gap-3 px-4 py-4">
            <div className="w-11 h-11 rounded-xl bg-sabren-cream border border-sabren-gold/30 flex items-center justify-center shrink-0">
              <Icon className="w-5 h-5 text-sabren-gold" />
            </div>
            <div>
              <p className="text-[13px] font-bold leading-tight">{title}</p>
              <p className="text-[11px] text-sabren-black/50 mt-0.5">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}