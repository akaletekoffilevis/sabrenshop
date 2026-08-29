import { cn } from "@/lib/utils";

export function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return <div className={cn("bg-white rounded-2xl border border-sabren-gray shadow-card", className)}>{children}</div>;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
      <div>
        <h1 className="font-display font-black text-2xl">{title}</h1>
        {subtitle && <p className="text-sm text-sabren-black/50 mt-0.5">{subtitle}</p>}
      </div>
      {actions}
    </div>
  );
}

export function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="block text-xs font-bold uppercase tracking-wide text-sabren-black/55 mb-1.5">{label}</span>
      {children}
      {hint && <span className="block text-[11px] text-sabren-black/40 mt-1">{hint}</span>}
    </label>
  );
}

export const inputCls =
  "w-full bg-sabren-gray rounded-xl px-3.5 py-2.5 text-sm outline-none border border-transparent focus:border-sabren-gold focus:bg-white transition";

export function Btn({ variant = "primary", className, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "gold" | "ghost" }) {
  const styles = {
    primary: "bg-sabren-black text-white hover:bg-black",
    gold: "bg-sabren-gold text-sabren-black hover:bg-sabren-gold-hover",
    ghost: "border border-sabren-gray hover:border-sabren-gold",
  }[variant];
  return <button {...props} className={cn("inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold transition disabled:opacity-50", styles, className)} />;
}

export function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label?: string }) {
  return (
    <button type="button" onClick={() => onChange(!checked)} className="flex items-center gap-3" role="switch" aria-checked={checked}>
      <span className={cn("relative w-11 h-6 rounded-full transition", checked ? "bg-sabren-gold" : "bg-sabren-gray")}>
        <span className={cn("absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all", checked ? "left-[22px]" : "left-0.5")} />
      </span>
      {label && <span className="text-sm font-medium">{label}</span>}
    </button>
  );
}

export function Badge({ children, tone = "gray" }: { children: React.ReactNode; tone?: "gray" | "green" | "gold" | "red" | "blue" | "purple" }) {
  const tones = {
    gray: "bg-sabren-gray text-sabren-black/70",
    green: "bg-green-100 text-green-700",
    gold: "bg-sabren-gold/15 text-sabren-gold",
    red: "bg-red-100 text-red-600",
    blue: "bg-blue-100 text-blue-600",
    purple: "bg-purple-100 text-purple-600",
  }[tone];
  return <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-bold", tones)}>{children}</span>;
}