import { getSettings } from "@/lib/data";

export async function PromoBar() {
  const settings = await getSettings();
  if (settings && !settings.promoBarActive) return null;
  const text = settings.promoBarText;

  return (
    <div className="bg-sabren-black text-white text-xs md:text-sm font-medium overflow-hidden">
      <div className="relative flex items-center py-1.5 whitespace-nowrap animate-marquee">
        <span className="inline-flex items-center">
          {[0, 1].map((i) => (
            <span key={i} className="inline-flex items-center gap-8 pr-8">
              <span className="max-w-[100vw] overflow-hidden text-ellipsis px-4">{text}</span>
              <span className="w-1.5 h-1.5 rotate-45 bg-sabren-gold shrink-0" />
            </span>
          ))}
        </span>
      </div>
    </div>
  );
}