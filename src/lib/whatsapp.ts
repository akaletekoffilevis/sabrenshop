export const WHATSAPP_NUMBER = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "22789148454";
export const WHATSAPP_DISPLAY = "+227 89 14 84 54";

export function whatsappLink(message: string, number: string = WHATSAPP_NUMBER) {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${number}?text=${encoded}`;
}

export function whatsappLinkTo(number: string, message: string) {
  let digits = (number || "").replace(/\D/g, "");
  if (digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length === 8) digits = `227${digits}`;
  if (digits.length === 9) digits = `227${digits}`;
  const encoded = encodeURIComponent(message);
  return `https://wa.me/${digits}?text=${encoded}`;
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

type OrderItem = { name: string; price: number; quantity: number; color?: string | null; size?: string | null };
export type OrderMessageInfo = {
  orderNumber: string;
  customerName: string;
  items: OrderItem[];
  subtotal: number;
  discount: number;
  deliveryFee: number;
  total: number;
  isPickup: boolean;
  paymentMethod?: string | null;
  promoCode?: string | null;
  ville?: string | null;
  quartier?: string | null;
};

function orderLines(items: OrderItem[]) {
  return items.map((i, idx) => {
    const variant = [i.color, i.size].filter(Boolean).join(" / ");
    return `${idx + 1}. ${i.name}${variant ? ` (${variant})` : ""} x${i.quantity} — ${(i.price * i.quantity).toLocaleString("fr-FR")} FCFA`;
  });
}

function orderTotals(o: OrderMessageInfo) {
  const parts: string[] = [];
  parts.push(`N° commande : ${o.orderNumber}`);
  if (o.items.length) parts.push(``, ...orderLines(o.items), ``);
  parts.push(`Sous-total : ${o.subtotal.toLocaleString("fr-FR")} FCFA`);
  if (o.discount > 0) parts.push(`Remise (${o.promoCode || "code"}) : -${o.discount.toLocaleString("fr-FR")} FCFA`);
  const where = [o.quartier, o.ville].filter(Boolean).join(", ");
  if (o.isPickup) parts.push(`Mode : Retrait boutique`);
  else parts.push(o.deliveryFee > 0 ? `Livraison : ${o.deliveryFee.toLocaleString("fr-FR")} FCFA${where ? ` (${where})` : ""}` : `Livraison : Offerte${where ? ` (${where})` : ""}`);
  parts.push(`Total : ${o.total.toLocaleString("fr-FR")} FCFA`);
  parts.push(`Paiement : ${o.paymentMethod === "COD" ? "à la livraison (espèces)" : "via WhatsApp"}`);
  return parts;
}

export function orderWhatsappMessage(o: OrderMessageInfo) {
  return [`Bonjour Sabreen Shop, je confirme ma commande :`, ...orderTotals(o), `Merci de la traiter.`].join("\n");
}