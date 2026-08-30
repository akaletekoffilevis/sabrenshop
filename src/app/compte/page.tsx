import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { PromoBar } from "@/components/shop/PromoBar";
import { Header } from "@/components/shop/Header";
import { Footer } from "@/components/shop/Footer";
import { WhatsappFloat } from "@/components/shop/WhatsappFloat";
import { AccountLogout } from "./AccountLogout";
import { PasswordChange } from "./PasswordChange";
import { AccountSettings } from "@/components/shop/AccountSettings";
import { DeliveryInfoForm } from "@/components/shop/DeliveryInfoForm";

export default async function ComptePage() {
  const session = await auth();
  if (!session?.user) redirect("/connexion");
  const userId = (session.user as { id?: string }).id;
  if (!userId) redirect("/connexion");

  const user = await prisma.user.findUnique({ where: { id: userId } });

  return (
    <div className="min-h-screen flex flex-col">
      <PromoBar />
      <Header />
      <main className="flex-1 max-w-3xl mx-auto container-px lg:px-8 py-6 w-full">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-8">
          <div className="flex items-center gap-3">
            <span className="w-12 h-12 rounded-2xl bg-sabren-black text-sabren-gold font-display font-black text-xl flex items-center justify-center">
              {(user?.name || "U").charAt(0).toUpperCase()}
            </span>
            <div>
              <h1 className="font-display font-black text-2xl">Bonjour, {user?.name || "Client"}</h1>
              <p className="text-sm text-sabren-black/50">{user?.email}</p>
            </div>
          </div>
          <AccountLogout />
        </div>

        <DeliveryInfoForm
          initial={{
            name: user?.name ?? null,
            phone: user?.phone ?? null,
            city: user?.city ?? null,
            quartier: user?.quartier ?? null,
            address: user?.address ?? null,
            deliveryPreference: user?.deliveryPreference ?? null,
          }}
        />
        <PasswordChange />
        <AccountSettings email={user?.email || ""} />
      </main>
      <Footer />
      <WhatsappFloat />
    </div>
  );
}