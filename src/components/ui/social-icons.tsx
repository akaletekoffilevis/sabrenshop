import { FaFacebook, FaInstagram, FaTiktok, FaYoutube, FaXTwitter, FaWhatsapp, FaTelegram, FaSnapchat, FaLink } from "react-icons/fa6";
import type { IconType } from "react-icons";

const BRAND_ICONS: Record<string, IconType> = {
  facebook: FaFacebook,
  instagram: FaInstagram,
  tiktok: FaTiktok,
  youtube: FaYoutube,
  twitter: FaXTwitter,
  whatsapp: FaWhatsapp,
  telegram: FaTelegram,
  snapchat: FaSnapchat,
};

export function BrandSocialIcon({ label, className }: { label: string; className?: string }) {
  const key = label.toLowerCase();
  for (const k of Object.keys(BRAND_ICONS)) {
    if (key.includes(k) || k.includes(key)) {
      const Icon = BRAND_ICONS[k];
      return <Icon className={className} aria-hidden="true" />;
    }
  }
  return <FaLink className={className} aria-hidden="true" />;
}