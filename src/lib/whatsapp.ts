export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22789148454";
export const WHATSAPP_DISPLAY = "+227 89 14 84 54";

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function productWhatsappMessage(opts: {
  name: string;
  price: number;
  quantity: number;
  color?: string;
  size?: string;
}) {
  const variant = [opts.color, opts.size].filter(Boolean).join(" / ") || "Standard";
  return `Bonjour Sabreen Shop\nJe souhaite commander :\nProduit : ${opts.name}\nPrix : ${opts.price.toLocaleString("fr-FR")} FCFA\nQuantité : ${opts.quantity}\nCouleur/Taille : ${variant}\nMerci de me confirmer la disponibilité et les modalités de livraison.`;
}

type CartItem = { name: string; price: number; quantity: number; color?: string; size?: string };

export function cartWhatsappMessage(
  items: CartItem[],
  opts: { subtotal?: number; discount?: number; deliveryFee?: number; total: number; promoCode?: string | null; isPickup?: boolean }
) {
  const lines = items.map((i, idx) => {
    const variant = [i.color, i.size].filter(Boolean).join(" / ");
    return `${idx + 1}. ${i.name}${variant ? ` (${variant})` : ""} x${i.quantity} — ${(i.price * i.quantity).toLocaleString("fr-FR")} FCFA`;
  });
  const parts = [`Bonjour Sabreen Shop`, `Je souhaite passer commande :`, ``];
  parts.push(...lines, ``);
  if (typeof opts.subtotal === "number") parts.push(`Sous-total : ${opts.subtotal.toLocaleString("fr-FR")} FCFA`);
  if (opts.discount && opts.discount > 0) parts.push(`Remise (${opts.promoCode || "code"}) : -${opts.discount.toLocaleString("fr-FR")} FCFA`);
  if (opts.isPickup) parts.push(`Mode : Retrait boutique (0 FCFA)`);
  else parts.push(opts.deliveryFee && opts.deliveryFee > 0 ? `Livraison : ${opts.deliveryFee.toLocaleString("fr-FR")} FCFA` : `Livraison : Offerte`);
  parts.push(`Total : ${opts.total.toLocaleString("fr-FR")} FCFA`);
  parts.push(``, `Merci de me confirmer la disponibilité et la livraison.`);
  return parts.join("\n");
}