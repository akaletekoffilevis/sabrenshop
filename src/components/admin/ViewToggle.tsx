"use client";
import { LayoutGrid, List } from "lucide-react";

export function ViewToggle({ view, onChange }: { view: "cards" | "list"; onChange: (v: "cards" | "list") => void }) {
  return (
    <div className="inline-flex items-center gap-1 rounded-full bg-sabren-gray/70 p-1">
      <button
        type="button"
        onClick={() => onChange("cards")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
          view === "cards" ? "bg-white shadow-sm text-sabren-black" : "text-sabren-black/50 hover:text-sabren-black"
        }`}
      >
        <LayoutGrid className="w-3.5 h-3.5" /> Cartes
      </button>
      <button
        type="button"
        onClick={() => onChange("list")}
        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
          view === "list" ? "bg-white shadow-sm text-sabren-black" : "text-sabren-black/50 hover:text-sabren-black"
        }`}
      >
        <List className="w-3.5 h-3.5" /> Liste
      </button>
    </div>
  );
}