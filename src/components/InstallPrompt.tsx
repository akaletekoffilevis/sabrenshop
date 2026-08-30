"use client";
import { useEffect, useRef, useState } from "react";
import { Download, X } from "lucide-react";

declare global {
  interface WindowEventMap {
    beforeinstallprompt: BeforeInstallPromptEvent;
  }
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const PROMPT_KEY = "sabren_pwa_prompt";
const MAX_SHOWS = 2;

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  return (
    "standalone" in navigator &&
    typeof (navigator as { standalone?: boolean }).standalone === "boolean" &&
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function getCount(): number {
  try {
    const raw = localStorage.getItem(PROMPT_KEY);
    if (!raw) return 0;
    if (raw === "installed") return MAX_SHOWS;
    return Number(raw) || 0;
  } catch {
    return 0;
  }
}

export function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [isIos, setIsIos] = useState(false);
  const promptRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }

    if (isStandalone() || getCount() >= MAX_SHOWS) return;

    let sessionShown = false;
    try {
      sessionShown = sessionStorage.getItem("sabren_pwa_shown") === "1";
    } catch {
      sessionShown = false;
    }
    if (sessionShown) return;

    const onPrompt = (e: BeforeInstallPromptEvent) => {
      e.preventDefault();
      promptRef.current = e;
      setIsIos(false);
      setShow(true);
    };
    const onAppInstalled = () => {
      setShow(false);
      try {
        localStorage.setItem(PROMPT_KEY, "installed");
      } catch {}
    };

    window.addEventListener("beforeinstallprompt", onPrompt);
    window.addEventListener("appinstalled", onAppInstalled);

    const timer = setTimeout(() => {
      if (
        !promptRef.current &&
        /iphone|ipad|ipod/i.test(navigator.userAgent)
      ) {
        setIsIos(true);
        setShow(true);
      }
    }, 2500);

    try {
      sessionStorage.setItem("sabren_pwa_shown", "1");
    } catch {}

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.removeEventListener("appinstalled", onAppInstalled);
      clearTimeout(timer);
    };
  }, []);

  const dismiss = () => {
    setShow(false);
    if (isIos) {
      try {
        localStorage.setItem(PROMPT_KEY, String(MAX_SHOWS));
      } catch {}
      return;
    }
    try {
      const next = getCount() + 1;
      localStorage.setItem(PROMPT_KEY, String(next));
    } catch {}
  };

  const install = async () => {
    const prompt = promptRef.current;
    if (!prompt) return;
    promptRef.current = null;
    try {
      await prompt.prompt();
      const choice = await prompt.userChoice;
      if (choice.outcome === "accepted") {
        try {
          localStorage.setItem(PROMPT_KEY, "installed");
        } catch {}
        setShow(false);
      } else {
        dismiss();
      }
    } catch {
      dismiss();
    }
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-24 inset-x-4 sm:inset-x-auto sm:left-1/2 sm:-translate-x-1/2 sm:max-w-sm z-[60] animate-fade-up">
      <div className="bg-white rounded-2xl border border-sabren-gold/40 shadow-2xl overflow-hidden">
        <div className="h-1.5 bg-gradient-to-r from-sabren-gold via-[#f2d489] to-sabren-gold" />
        <div className="p-4 flex items-start gap-3">
          <img
            src="/logosabrenshop.jpeg"
            alt="SABREEN'SHOP"
            width={48}
            height={48}
            className="w-12 h-12 rounded-xl object-cover border border-sabren-gray shrink-0"
            loading="lazy"
            decoding="async"
          />
          <div className="min-w-0 flex-1">
            <p className="font-extrabold text-sabren-black text-sm">
              {isIos
                ? "Installateur SABREEN'SHOP sur votre écran d'accueil"
                : "Installer SABREEN'SHOP"}
            </p>
            <p className="text-xs text-sabren-black/55 mt-1 leading-relaxed">
              {isIos
                ? "Astuce : touchez Partager (carré avec ↑) puis « Sur l'écran d'accueil » pour l'installer."
                : "Accédez à la boutique en 1 clic, comme une vraie application."}
            </p>
            <div className="flex items-center gap-3 mt-3">
              {!isIos && (
                <button
                  onClick={install}
                  className="inline-flex items-center gap-1.5 bg-sabren-gold hover:bg-sabren-gold-hover text-sabren-black font-bold text-xs rounded-full px-4 py-2 transition"
                >
                  <Download className="w-3.5 h-3.5" /> Installer l’app
                </button>
              )}
              <button
                onClick={dismiss}
                className="text-xs font-semibold text-sabren-black/45 hover:text-sabren-black transition"
              >
                Plus tard
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Fermer"
            className="text-sabren-black/40 hover:text-sabren-black transition shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}