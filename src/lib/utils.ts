import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number) {
  return new Intl.NumberFormat("fr-FR").format(price) + " FCFA";
}

export function slugify(str: string) {
  return str
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function discountPercent(price: number, compareAt?: number | null) {
  if (!compareAt || compareAt <= price) return 0;
  return Math.round(((compareAt - price) / compareAt) * 100);
}

export function isNewProduct(createdAt: Date | string | null | undefined, isNewFlag = false, days = 7) {
  if (isNewFlag) return true;
  if (!createdAt) return false;
  const created = typeof createdAt === "string" ? new Date(createdAt) : createdAt;
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return created.getTime() > cutoff;
}
