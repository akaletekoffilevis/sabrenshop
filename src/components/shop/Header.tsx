import { getActiveCategoryNav } from "@/lib/data";
import { ShopHeader } from "./ShopHeader";

export async function Header() {
  const categoryNav = await getActiveCategoryNav();
  return <ShopHeader categories={categoryNav} />;
}