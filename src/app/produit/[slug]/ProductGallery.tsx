"use client";
import { useState } from "react";
import { Image as ImageIcon, ZoomIn } from "lucide-react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [zoom, setZoom] = useState(false);
  const list = images.length ? images : [null];

  return (
    <div className="lg:sticky lg:top-28 self-start w-full">
      <div
        className={`relative aspect-square rounded-[1.5rem] overflow-hidden bg-sabren-cream border border-sabren-gray shadow-card ${zoom ? "cursor-zoom-out" : "cursor-zoom-in"}`}
        onClick={() => setZoom(!zoom)}
      >
        {list[active] ? (
          <img
            src={list[active]}
            alt={name}
            className={`w-full h-full object-cover transition-transform duration-500 ${zoom ? "scale-150" : "scale-100"}`}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-sabren-black/25">
            <ImageIcon className="w-16 h-16" />
            <p className="text-xs mt-2">Image à venir</p>
          </div>
        )}
        <span className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-card">
          <ZoomIn className="w-4 h-4 text-sabren-black" />
        </span>
      </div>

      {list.length > 1 && (
        <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-sabren-cream transition ${active === i ? "border-sabren-gold shadow-gold" : "border-transparent opacity-70 hover:opacity-100"}`}
            >
              {img ? <img src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" /> : <span className="flex items-center justify-center h-full text-sabren-black/20"><ImageIcon className="w-5 h-5" /></span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}