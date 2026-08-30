import { getActiveCategoryNav } from "@/lib/data";
import { auth } from "@/lib/auth";
import { ShopHeader } from "./ShopHeader";

export async function Header() {
  const categoryNav = await getActiveCategoryNav();
  let isAdmin = false;
  let loggedIn = false;
  try {
    const session = await auth();
    loggedIn = !!session?.user;
    isAdmin = (session?.user as { role?: string } | undefined)?.role === "ADMIN";
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (!/dynamic server usage|using `headers`|DYNAMIC_SERVER_USAGE/i.test(msg)) {
      console.error("[header] session load failed:", err);
    }
  }
  return <ShopHeader categories={categoryNav} isAdmin={isAdmin} loggedIn={loggedIn} />;
}