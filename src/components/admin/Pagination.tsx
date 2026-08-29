"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

function pageItems(page: number, pages: number): (number | "…")[] {
  const items: (number | "…")[] = [];
  const push = (n: number) => {
    if (items[items.length - 1] !== n) items.push(n);
  };
  push(1);
  if (pages <= 7) {
    for (let i = 2; i <= pages - 1; i++) push(i);
  } else {
    if (page > 3) items.push("…");
    for (let i = Math.max(2, page - 1); i <= Math.min(pages - 1, page + 1); i++) push(i);
    if (page < pages - 2) items.push("…");
  }
  push(pages);
  return items;
}

export function Pagination({ page, pages, total, onChange }: { page: number; pages: number; total: number; onChange: (p: number) => void }) {
  if (pages <= 1) return null;

  const btnCls = "w-9 h-9 rounded-lg inline-flex items-center justify-center text-sm font-bold transition disabled:opacity-30";

  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 mt-5" aria-label="Pagination">
      <p className="text-xs text-sabren-black/45 font-semibold">Page {page} sur {pages} — {total} élément{total > 1 ? "s" : ""}</p>
      <div className="flex items-center gap-1">
        <button type="button" className={cn(btnCls, "bg-white border border-sabren-gray hover:border-sabren-gold")} disabled={page <= 1} onClick={() => onChange(page - 1)} aria-label="Page précédente">
          <ChevronLeft className="w-4 h-4" />
        </button>
        {pageItems(page, pages).map((it, i) =>
          it === "…" ? (
            <span key={`gap-${i}`} className="w-9 h-9 inline-flex items-center justify-center text-sabren-black/40 text-sm">…</span>
          ) : (
            <button
              key={it}
              type="button"
              className={cn(btnCls, it === page ? "bg-sabren-black text-white" : "bg-white border border-sabren-gray hover:border-sabren-gold")}
              onClick={() => onChange(it)}
              aria-current={it === page ? "page" : undefined}
            >
              {it}
            </button>
          )
        )}
        <button type="button" className={cn(btnCls, "bg-white border border-sabren-gray hover:border-sabren-gold")} disabled={page >= pages} onClick={() => onChange(page + 1)} aria-label="Page suivante">
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}