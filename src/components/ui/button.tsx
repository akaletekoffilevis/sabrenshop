import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary" | "secondary" | "ghost" | "outline"; size?: "sm" | "md" | "lg" };

export function Button({ className, variant = "primary", size = "md", ...props }: Props) {
  const base = "inline-flex items-center justify-center rounded-full font-semibold transition-all focus:outline-none focus:ring-2 focus:ring-sabren-gold/50 disabled:opacity-50";
  const variants = {
    primary: "bg-sabren-black text-white hover:bg-black border border-sabren-gold/20 shadow-sm",
    secondary: "bg-sabren-gold text-sabren-black hover:bg-sabren-gold-hover",
    ghost: "bg-transparent hover:bg-sabren-gray",
    outline: "border border-sabren-black hover:bg-sabren-black hover:text-white",
  };
  const sizes = { sm: "px-4 py-1.5 text-sm", md: "px-6 py-2.5 text-sm", lg: "px-8 py-3.5 text-base" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
