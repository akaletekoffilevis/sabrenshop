import Link from "next/link";
import { getSettings } from "@/lib/data";
import { ShieldCheck, Truck, RotateCcw, MessageCircle, Phone, MapPin, Clock, Heart, Mail } from "lucide-react";
import { BrandSocialIcon } from "@/components/ui/social-icons";
import { NewsletterForm } from "./NewsletterForm";

export async function Footer() {
  const settings = await getSettings();
  const socials = settings.socialLinks ?? [];
  const shopName = settings.shopName || "SABREEN’SHOP";
  const phone = settings.whatsapp ? settings.whatsapp.replace(/^\+?/g, "") : "22789148454";
  const phoneDisplay = settings.phone || "+227 89 14 84 54";
  const email = settings.email || "soumanabaaminata@gmail.com";
  const address = settings.address || "Niamey, Niger";

  return (
    <footer className="bg-sabren-black text-white mt-14">
      <NewsletterForm />
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
            <img src="/logosabrenshop.jpeg" alt={shopName} className="w-10 h-10 rounded-xl object-cover" loading="lazy" decoding="async" />
            <span className="font-display font-black text-lg">{shopName}</span>
          </div>
          <p className="text-sm text-white/75 mt-4 leading-relaxed">
            Les produits tendance qui correspondent à votre style. Stanley, nounours, vêtements, téléphones et accessoires de mode — livrés partout au Niger (frais de livraison à la charge du client).
          </p>
          <div className="flex gap-3 mt-5">
            {socials.length === 0 ? (
              <>
                <a href="#" aria-label="Facebook" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabren-gold hover:text-sabren-black transition"><BrandSocialIcon label="Facebook" className="w-4 h-4" /></a>
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabren-gold hover:text-sabren-black transition"><BrandSocialIcon label="Instagram" className="w-4 h-4" /></a>
              </>
            ) : (
              socials.map((s) => (
                <a key={s.url} href={s.url} target="_blank" rel="noopener noreferrer" aria-label={s.label} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-sabren-gold hover:text-sabren-black transition">
                  <BrandSocialIcon label={s.label} className="w-4 h-4" />
                </a>
              ))
            )}
          </div>
        </div>

        <div>
          <h4 className="text-sabren-gold font-bold text-sm uppercase tracking-wide mb-4">La Boutique</h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link href="/boutique" className="hover:text-sabren-gold transition">Tous les produits</Link></li>
            <li><Link href="/boutique?nouveau=1" className="hover:text-sabren-gold transition">Nouveautés</Link></li>
            <li><Link href="/boutique?promo=1" className="hover:text-sabren-gold transition">Promotions</Link></li>
            <li><Link href="/boutique?best=1" className="hover:text-sabren-gold transition">Meilleures ventes</Link></li>
            <li><Link href="/panier" className="hover:text-sabren-gold transition">Mon panier</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-sabren-gold font-bold text-sm uppercase tracking-wide mb-4">Aide & Services</h4>
          <ul className="space-y-2.5 text-sm text-white/75">
            <li><Link href="/#comment-commander" className="hover:text-sabren-gold transition">Comment commander ?</Link></li>
            <li><Link href="/faq" className="hover:text-sabren-gold transition">Questions fréquentes (FAQ)</Link></li>
            <li className="hover:text-sabren-gold transition cursor-pointer">Livraison & retrait (frais à la charge du client)</li>
            <li className="hover:text-sabren-gold transition cursor-pointer">Politique de retour</li>
            <li className="hover:text-sabren-gold transition cursor-pointer">Paiement à la livraison</li>
          </ul>
        </div>

        <div>
          <h4 className="text-sabren-gold font-bold text-sm uppercase tracking-wide mb-4">Contact</h4>
          <ul className="space-y-3 text-sm text-white/75">
            <li className="flex items-center gap-2"><Phone className="w-4 h-4 text-sabren-gold shrink-0" /> {phoneDisplay}</li>
            <li>
              <a href={`mailto:${email}`} className="flex items-center gap-2 hover:text-sabren-gold transition">
                <Mail className="w-4 h-4 text-sabren-gold shrink-0" /> <span className="break-all">{email}</span>
              </a>
            </li>
            <li className="flex items-center gap-2"><MapPin className="w-4 h-4 text-sabren-gold shrink-0" /> {address}</li>
            <li className="flex items-center gap-2"><Clock className="w-4 h-4 text-sabren-gold shrink-0" /> Lun–Sam : 8h – 20h</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto container-px py-5 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-white/55">
          <span>© {new Date().getFullYear()} {shopName} — Votre boutique, votre style, votre choix.</span>
          <span className="flex items-center gap-1.5">
            Fait avec <Heart className="w-3 h-3 text-sabren-pink fill-sabren-pink" /> au Niger
          </span>
        </div>
      </div>
    </footer>
  );
}