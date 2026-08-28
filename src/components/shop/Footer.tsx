import Link from "next/link";
import { WHATSAPP_DISPLAY } from "@/lib/whatsapp";
import { Send, ShieldCheck, Truck, RotateCcw, MessageCircle, Phone, MapPin, Clock, Heart, Globe, Camera } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sabren-black text-white mt-14">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto container-px py-5 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="flex items-center gap-2.5">
            <Truck className="w-5 h-5 text-sabren-gold shrink-0" />
            <span className="text-white/80 text-xs">Livraison 1-3 jours<br /><b className="text-white">partout au Niger</b></span>
          </div>
          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-5 h-5 text-sabren-gold shrink-0" />
            <span className="text-white/80 text-xs">Paiement<br /><b className="text-white">à la livraison</b></span>
          </div>
          <div className="flex items-center gap-2.5">
            <MessageCircle className="w-5 h-5 text-sabren-gold shrink-0" />
            <span className="text-white/80 text-xs">Commande<br /><b className="text-white">WhatsApp rapide</b></span>
          </div>
          <div className="flex items-center gap-2.5">
            <RotateCcw className="w-5 h-5 text-sabren-gold shrink-0" />
            <span className="text-white/80 text-xs">Retrait<br /><b className="text-white">en boutique</b></span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto container-px py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div className="col-span-2 md:col-span-1">
          <div className="flex items-center gap-2.5">
            <img src="/logosabrenshop.jpeg" alt="Sabren'Shop" className="w-10 h-10 rounded-xl object-cover" loading="lazy" decoding="async" />
            <span className="font-display font-black text-lg">SABREN<span className="text-sabren-gold">’</span>SHOP</span>
          </div>
          <p className="text-sm text-white/60 mt-4 leading-relaxed">
            Les produits tendance qui correspondent à votre style. Stanley, nounours, vêtements et accessoires de mode — livrés partout au Niger.
          </p>
          <div className="flex gap-3 mt-5">
            <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabren-gold hover:text-sabren-black transition"><Globe className="w-4 h-4" /></a>
            <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabren-gold hover:text-sabren-black transition"><Camera className="w-4 h-4" /></a>
            <a href="#" aria-label="TikTok" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabren-gold hover:text-sabren-black transition"><Send className="w-4 h-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="text-sabren-gold font-bold text-sm uppercase tracking-wide mb-4">La Boutique</h4>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li><Link href="/boutique" className="hover:text-sabren-gold transition">Tous les produits</Link></li>
            <li><Link href="/boutique?nouveau=1" className="hover:text-sabren-gold transition">Nouveautés</Link></li>
            <li><Link href="/boutique?promo=1" className="hover:text-sabren-gold transition">Promotions</Link></li>
            <li><Link href="/boutique?best=1" className="hover:text-sabren-gold transition">Meilleures ventes</Link></li>
            <li><Link href="/panier" className="hover:text-sabren-gold transition">Mon panier</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sabren-gold font-bold text-sm uppercase tracking-wide mb-4">Aide & Services</h4>
          <ul className="space-y-2.5 text-sm text-white/65">
            <li><Link href="/#comment-commander" className="hover:text-sabren-gold transition">Comment commander ?</Link></li>
            <li className="hover:text-sabren-gold transition cursor-pointer">Livraison & retrait</li>
            <li className="hover:text-sabren-gold transition cursor-pointer">Politique de retour</li>
            <li className="hover:text-sabren-gold transition cursor-pointer">Paiement à la livraison</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sabren-gold font-bold text-sm uppercase tracking-wide mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/65">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-sabren-gold shrink-0" /> {WHATSAPP_DISPLAY}</li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sabren-gold shrink-0" /> Niamey, Niger</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-sabren-gold shrink-0" /> Lun–Sam : 8h – 20h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto container-px py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/45">
          <span>© {new Date().getFullYear()} SABREN’SHOP — Votre boutique, votre style, votre choix.</span>
          <span className="flex items-center gap-1.5">
            Fait avec <Heart className="w-3 h-3 text-sabren-pink fill-sabren-pink" /> au Niger
          </span>
        </div>
      </div>
    </footer>
  );
}