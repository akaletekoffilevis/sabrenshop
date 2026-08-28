"use client";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";

export function AccountLogout() {
  const router = useRouter();
  return (
    <button
      onClick={async () => { await signOut({ redirect: false }); router.push("/connexion"); router.refresh(); }}
      className="inline-flex items-center gap-2 text-sm font-bold text-sabren-black/50 hover:text-red-500 transition"
    >
      <LogOut className="w-4 h-4" /> Se déconnecter
    </button>
  );
}