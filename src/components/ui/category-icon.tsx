import {
  Package,
  CupSoda,
  PawPrint,
  Shirt,
  ShoppingBag,
  Gift,
  Tags,
  Sparkles,
  Watch,
  Footprints,
  Heart,
  Baby,
  Home,
  Star,
  LucideIcon,
} from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  package: Package,
  cup: CupSoda,
  toys: PawPrint,
  shirt: Shirt,
  bag: ShoppingBag,
  gift: Gift,
  tags: Tags,
  sparkles: Sparkles,
  watch: Watch,
  shoe: Footprints,
  heart: Heart,
  baby: Baby,
  home: Home,
  star: Star,
};

export function CategoryIcon({ icon, className }: { icon?: string | null; className?: string }) {
  const Icon = CATEGORY_ICONS[icon ?? ""] ?? Package;
  return <Icon className={className ?? "w-4 h-4"} />;
}