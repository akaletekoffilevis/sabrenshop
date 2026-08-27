export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22789148454";
export const WHATSAPP_DISPLAY = "+227 89 14 84 54";

export function whatsappLink(message: string) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
}

export function productWhatsappMessage(opts: {
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}) {
  const variant = [opts.color, opts.size].filter(Boolean).join(" / ") || "Standard";
  return `Bonjour Sabren'Shop\nJe souhaite commander :\nProduit : ${opts.name}\nPrix : ${opts.price.toLocaleString("fr-FR")} FCFA\nQuantité : ${opts.quantity}\nCouleur/Taille : ${variant}\nMerci de me confirmer la disponibilité et les modalités de livraison.`;
}

export function cartWhatsappMessage(items: Array<{ name: string; price: number; quantity: number; color?: string; size?: string }>, total: number) {
  const lines = items.map((i, idx) => {
    const variant = [i.color, i.size].filter(Boolean).join(" / ");
    return `${idx + 1}. ${i.name}${variant ? ` (${variant})` : ""} x${i.quantity} — ${(i.price * i.quantity).toLocaleString("fr-FR")} FCFA`;
  });
  return `Bonjour Sabren'Shop\nJe souhaite passer commande :\n\n${lines.join("\n")}\n\nTotal : ${total.toLocaleString("fr-FR")} FCFA\n\nMerci de me confirmer la disponibilité et la livraison.`;
}
