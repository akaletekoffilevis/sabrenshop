"use client";
import { useState } from "react";
import { Image as ImageIcon, ZoomIn, X, ChevronLeft, ChevronRight } from "lucide-react";

export function ProductGallery({ images, name }: { images: string[]; name: string }) {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);
  const [zoom, setZoom] = useState(false);
  const [broken, setBroken] = useState<Record<number, boolean>>({});
  const list = images.length ? images : [""];
  const current = list[active];

  const prev = () => setActive((a) => (a === 0 ? list.length - 1 : a - 1));
  const next = () => setActive((a) => (a === list.length - 1 ? 0 : a + 1));

  const Img = ({ src, alt, className, draggable }: { src: string; alt: string; className?: string; draggable?: boolean }) =>
    src && !broken[active] ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        key={src}
        src={src}
        alt={alt}
        draggable={draggable}
        onError={() => setBroken((b) => ({ ...b, [active]: true }))}
        className={className}
      />
    ) : (
      <div className="w-full h-full flex flex-col items-center justify-center text-sabren-black/25 bg-sabren-cream">
        <ImageIcon className="w-16 h-16" />
        <p className="text-xs mt-2">Image à venir</p>
      </div>
    );

  return (
    <div className="lg:sticky lg:top-28 self-start w-full">
      <div
        className={`relative aspect-square rounded-[1.5rem] overflow-hidden bg-sabren-cream border border-sabren-gray shadow-card ${list.length > 1 ? "cursor-pointer" : ""}`}
        onClick={() => list.length > 1 && setLightbox(true)}
      >
        <Img src={current} alt={name} className="w-full h-full object-cover" />
        <span className="pointer-events-none absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-card">
          <ZoomIn className="w-4 h-4 text-sabren-black" />
        </span>

        {list.length > 1 && (
          <>
            <button
              onClick={(e) => { e.stopPropagation(); prev(); }}
              aria-label="Image précédente"
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-card hover:scale-105 transition"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); next(); }}
              aria-label="Image suivante"
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 backdrop-blur flex items-center justify-center shadow-card hover:scale-105 transition"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
            <span className="absolute bottom-3 left-1/2 -translate-x-1/2 bg-sabren-black/70 backdrop-blur text-white text-[11px] font-bold rounded-full px-3 py-1">
              {active + 1} / {list.length}
            </span>
          </>
        )}
      </div>

      {list.length > 1 && (
        <div className="flex gap-2.5 mt-3 overflow-x-auto no-scrollbar">
          {list.map((img, i) => (
            <button
              key={i}
              onClick={() => { setActive(i); setBroken((b) => ({ ...b, [i]: b[i] })); }}
              className={`relative w-20 h-20 shrink-0 rounded-xl overflow-hidden border-2 bg-sabren-cream transition ${active === i ? "border-sabren-gold shadow-gold" : "border-transparent opacity-70 hover:opacity-100"}`}
              aria-label={`Voir l'image ${i + 1}`}
            >
              {img && !broken[i] ? (
                <img key={img} src={img} alt={`${name} ${i + 1}`} className="w-full h-full object-cover" loading="lazy" decoding="async" onError={() => setBroken((b) => ({ ...b, [i]: true }))} />
              ) : (
                <span className="flex items-center justify-center h-full text-sabren-black/20"><ImageIcon className="w-5 h-5" /></span>
              )}
            </button>
          ))}
        </div>
      )}

      {lightbox && (
        <div className="fixed inset-0 z-[70] bg-sabren-black/95 flex flex-col items-center justify-center" onClick={() => setLightbox(false)}>
          <div className="absolute top-4 left-4 flex items-center gap-2 text-white/90">
            <button onClick={() => setZoom((z) => !z)} aria-label="Zoomer" className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition">
              <ZoomIn className="w-5 h-5" />
            </button>
            <span className="text-sm font-bold">{active + 1} / {list.length}</span>
          </div>
          <button onClick={() => setLightbox(false)} aria-label="Fermer" className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition">
            <X className="w-5 h-5" />
          </button>

          <div
            className={`max-w-[92vw] max-h-[80vh] overflow-auto cursor-zoom-in ${zoom ? "cursor-zoom-out" : ""}`}
            onClick={(e) => { e.stopPropagation(); setZoom((z) => !z); }}
          >
            <Img src={current} alt={name} className={`transition-transform duration-300 ${zoom ? "scale-[2]" : "scale-100"} h-auto w-auto max-w-full max-h-[80vh] object-contain`} />
          </div>

          {list.length > 1 && (
            <>
              <button
                onClick={(e) => { e.stopPropagation(); prev(); }}
                aria-label="Image précédente"
                className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={(e) => { e.stopPropagation(); next(); }}
                aria-label="Image suivante"
                className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}