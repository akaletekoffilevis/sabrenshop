import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import { InstallPrompt } from "@/components/InstallPrompt";
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
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || "https://sabrenshop-test-app.vercel.app"),
  title: {
    default: "SABREEN’SHOP — Votre boutique, votre style, votre choix",
    template: "%s | SABREEN’SHOP",
  },
  description:
    "SABREEN’SHOP — Stanley, gourdes, nounours, vêtements, accessoires, téléphones et cadeaux tendance au Niger. Commande facile via WhatsApp +227 89 14 84 54. Livraison partout au Niger, frais de livraison à la charge du client, paiement à la livraison.",
  keywords: [
    "SABREEN'SHOP",
    "boutique en ligne Niger",
    "Stanley gourde",
    "nounours",
    "vêtements Niamey",
    "accessoires mode",
    "téléphones Niamey",
    "achat WhatsApp Niger",
  ],
  openGraph: {
    title: "SABREEN’SHOP",
    description: "Les produits tendance qui correspondent à votre style. Livraison partout au Niger.",
    type: "website",
    locale: "fr_NE",
    images: ["/logosabrenshop.jpeg"],
  },
  icons: {
    icon: "/favicon-v2.ico",
    apple: "/icons/apple-touch-icon.png",
  },
  manifest: "/manifest.webmanifest",
  themeColor: "#111111",
  appleWebApp: {
    capable: true,
    title: "SABREEN'SHOP",
    statusBarStyle: "black-translucent",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-sabren-cream text-sabren-black">
        {children}
        <InstallPrompt />
      </body>
    </html>
  );
}