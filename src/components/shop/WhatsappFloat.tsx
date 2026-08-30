"use client";
import { whatsappLink } from "@/lib/whatsapp";
import { useShopConfig } from "@/lib/useShopConfig";
import { MessageCircle, Send, X } from "lucide-react";
import { useState } from "react";

const DEFAULT_MSG = "Bonjour ! J’aurais une question à vous poser.";

export function WhatsappFloat() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState("");
  const { whatsapp } = useShopConfig();
  const link = whatsappLink(msg.trim() || DEFAULT_MSG, whatsapp);

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
                <p className="text-sm font-bold">SABREEN’SHOP</p>
                <p className="text-[11px] text-green-100">En ligne — répond en quelques min</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Fermer"><X className="w-4 h-4" /></button>
          </div>
          <div className="px-4 py-3">
            <p className="text-xs text-sabren-black/70 bg-sabren-gray rounded-xl rounded-tl-none px-3 py-2.5 inline-block">
              Bonjour ! Comment pouvons-nous vous aider ?
            </p>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Écrivez votre question ou votre commande ici…"
              rows={3}
              className="mt-3 w-full bg-sabren-cream rounded-xl border border-sabren-gray focus:border-whatsapp focus:bg-white outline-none px-3 py-2.5 text-sm resize-none transition"
            />
          </div>
          <div className="px-4 pb-4">
            <a
              href={link}
              target="_blank"
              onClick={() => setOpen(false)}
              className="flex items-center justify-center gap-2 bg-whatsapp hover:bg-whatsapp-dark text-white text-sm font-bold rounded-full py-2.5 transition"
            >
              <Send className="w-4 h-4" /> Envoyer sur WhatsApp
            </a>
          </div>
        </div>
      )}

      <a
        href={open ? undefined : link}
        target={open ? undefined : "_blank"}
        onClick={() => {
          if (open) setOpen(false);
        }}
        className="fixed bottom-4 right-4 z-50 bg-whatsapp hover:bg-whatsapp-dark text-white rounded-full shadow-2xl p-3.5 flex items-center justify-center transition hover:scale-105 w-14 h-14"
        aria-label="WhatsApp"
      >
        <MessageCircle className="w-7 h-7" />
        <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse" />
      </a>
    </>
  );
}