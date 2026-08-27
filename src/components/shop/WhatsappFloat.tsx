"use client";
import { whatsappLink } from "@/lib/whatsapp";
import { MessageCircle, X } from "lucide-react";
import { useState } from "react";

export function WhatsappFloat() {
  const [open, setOpen] = useState(false);

  return (
    <>
      {open && (
        <div className="fixed bottom-24 right-4 z-50 w-72 bg-white rounded-2xl shadow-2xl border border-sabren-gray overflow-hidden animate-fade-up">
          <div className="bg-whatsapp text-white px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold">Sabren’Shop</p>
                <p className="text-[11px] text-green-100">En ligne — répond en quelques min</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer"><X className="w-4 h-4" /></button>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-sabren-black/70 bg-sabren-gray rounded-xl rounded-tl-none px-3 py-2.5 inline-block">
              Bonjour ! Une question ? Besoin de commander ?<br />Écrivez-nous, on vous répond vite !
            </p>
          </div>
          <div className="px-4 pb-4">
            <a
              href={whatsappLink("Bonjour Sabren'Shop ! Une question ? Besoin de commander ?")}
              target="_blank"
              className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white text-sm font-bold rounded-full py-2.5 transition"
            >
              <MessageCircle className="w-4 h-4" /> Démarrer la conversation
            </a>
            <p className="text-center text-[10px] text-sabren-black/40 mt-2">+227 89 14 84 54</p>
          </div>
        </div>
      )}

      <a
        href={open ? undefined : whatsappLink("Bonjour Sabren'Shop ! Une question ? Besoin de commander ?")}
        target={open ? undefined : "_blank"}
        onClick={() => {
          if (open) setOpen(false);
        }}
        className="fixed bottom-4 right-4 z-50 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full shadow-2xl p-3.5 flex items-center gap-2 transition hover:scale-105"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-6 h-6" />
        <span className="hidden sm:block text-sm font-bold pr-1">Commander sur WhatsApp</span>
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </a>
    </>
  );
}