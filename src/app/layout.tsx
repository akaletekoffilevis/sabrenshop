import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { Providers } from "@/components/providers";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "SABREN’SHOP — Votre boutique, votre style, votre choix",
    template: "%s | SABREN’SHOP",
  },
  description:
    "SABREN’SHOP — Stanley, gourdes, nounours, vêtements, accessoires et cadeaux tendance au Niger. Commande facile via WhatsApp +227 89 14 84 54. Livraison partout au Niger, paiement à la livraison.",
  keywords: [
    "SABREN'SHOP",
    "boutique en ligne Niger",
    "Stanley gourde",
    "nounours",
    "vêtements Niamey",
    "accessoires mode",
    "achat WhatsApp Niger",
  ],
  openGraph: {
    title: "SABREN’SHOP",
    description: "Les produits tendance qui correspondent à votre style. Livraison partout au Niger.",
    type: "website",
    locale: "fr_NE",
    images: ["/logosabrenshop.jpeg"],
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/logosabrenshop.jpeg",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-sabren-cream text-sabren-black">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}