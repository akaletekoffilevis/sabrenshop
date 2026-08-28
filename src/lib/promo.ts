import { prisma } from "@/lib/prisma";

export type PromoType = "PERCENT" | "FIXED";

export type PromoResult =
  | { valid: true; code: string; type: PromoType; value: number; discount: number }
  | { valid: false; message: string };

export function computePromoDiscount(type: PromoType, value: number, subTotal: number) {
  if (type === "FIXED") return Math.max(0, Math.min(value, subTotal));
  return Math.max(0, Math.min(subTotal, Math.round((subTotal * value) / 100)));
}

export async function validatePromo(code: string, subTotal: number): Promise<PromoResult> {
  const c = await prisma.promoCode.findUnique({ where: { code: code.toUpperCase().trim() } });
  if (!c || !c.isActive) return { valid: false, message: "Code promo invalide." };
  if (c.expiresAt && c.expiresAt.getTime() < Date.now()) return { valid: false, message: "Ce code a expiré." };
  if (c.maxUses && c.usedCount >= c.maxUses) return { valid: false, message: "Ce code a atteint sa limite d'utilisations." };
  if (c.minSubtotal && subTotal < c.minSubtotal) return { valid: false, message: `Minimum de ${new Intl.NumberFormat("fr-FR").format(c.minSubtotal)} FCFA pour ce code.` };
  if (subTotal <= 0) return { valid: false, message: "Ajoutez des articles pour utiliser un code promo." };

  const type = (c.type === "FIXED" ? "FIXED" : "PERCENT") as PromoType;
  return { valid: true, code: c.code, type, value: c.value, discount: computePromoDiscount(type, c.value, subTotal) };
}