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

export type CartCustomer = {
  name?: string | null;
  phone?: string | null;
  city?: string | null;
  quartier?: string | null;
  address?: string | null;
  deliveryPreference?: string | null;
};

const PREF_LABEL: Record<string, string> = {
  delivery: "Livraison à domicile",
  pickup: "Retrait en boutique",
  transport: "Envoi via transporteur",
};

function customerLines(customer?: CartCustomer | null): string[] {
  if (!customer) return [];
  const pref = customer.deliveryPreference || "delivery";
  const parts: string[] = [``, `— Informations client —`];
  if (customer.name?.trim()) parts.push(`Client : ${customer.name.trim()}`);
  if (customer.phone?.trim()) parts.push(`Téléphone : ${customer.phone.trim()}`);
  if (pref !== "pickup") {
    const where = [customer.quartier, customer.city].filter(Boolean).map((s) => s?.trim()).join(", ");
    if (where) parts.push(`Localisation : ${where}`);
    if (customer.address?.trim()) parts.push(`Point de repère : ${customer.address.trim()}`);
  }
  parts.push(`Mode : ${PREF_LABEL[pref] || pref}`);
  return parts;
}

export function cartWhatsappMessage(
  items: CartItem[],
  opts: { subtotal?: number; discount?: number; deliveryFee?: number; total: number; promoCode?: string | null; isPickup?: boolean; customer?: CartCustomer | null }
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
  if (opts.customer) parts.push(...customerLines(opts.customer));
  parts.push(``, `Merci de me confirmer la disponibilité et la livraison.`);
  return parts.join("\n");
}