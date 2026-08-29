"use client";
import { useEffect, useState } from "react";
import { WHATSAPP_NUMBER } from "@/lib/whatsapp";

export type ShopConfig = {
  shopName: string | null;
  phone: string | null;
  whatsapp: string;
  email: string | null;
  address: string | null;
  deliveryFee: number | undefined;
  freeDeliveryThreshold: number | null | undefined;
  promoBarText: string;
  promoBarActive: boolean;
};

const FALLBACK: ShopConfig = {
  shopName: null,
  phone: null,
  whatsapp: WHATSAPP_NUMBER,
  email: null,
  address: null,
  deliveryFee: undefined,
  freeDeliveryThreshold: null,
  promoBarText: "",
  promoBarActive: true,
};

let cache: ShopConfig | null = null;
let inflight: Promise<ShopConfig> | null = null;

async function loadConfig(): Promise<ShopConfig> {
  if (cache) return cache;
  inflight ??= fetch("/api/config")
    .then((r) => (r.ok ? r.json() : null))
    .catch(() => null)
    .then((data: Partial<ShopConfig> | null): ShopConfig => {
      const merged: ShopConfig = { ...FALLBACK, ...(data ?? {}) };
      if (!merged.whatsapp) merged.whatsapp = FALLBACK.whatsapp;
      return merged;
    })
    .finally(() => {
      inflight = null;
    });
  return inflight;
}

export function useShopConfig(): ShopConfig {
  const [cfg, setCfg] = useState<ShopConfig>(cache ?? FALLBACK);
  useEffect(() => {
    if (!cache) {
      loadConfig().then((c) => {
        cache = c;
        setCfg(c);
      });
    }
  }, []);
  return cfg;
}