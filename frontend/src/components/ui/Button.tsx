import { cn } from "@/lib/utils";
import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "dark" | "ghost" | "danger" | "gold";
  size?: "sm" | "md" | "lg" | "xl";
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", loading = false, fullWidth = false, disabled, children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center gap-2 font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-dark-900 disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-gradient-to-r from-rose-gold-500 to-rose-gold-700 text-white hover:from-rose-gold-400 hover:to-rose-gold-600 focus:ring-rose-gold-500 shadow-lg shadow-rose-gold-500/25 hover:shadow-rose-gold-500/40 active:scale-[0.98]",
      outline: "border border-rose-gold-500/50 text-rose-gold-400 hover:bg-rose-gold-500/10 hover:border-rose-gold-400 focus:ring-rose-gold-500",
      dark:    "bg-dark-800 border border-dark-700 text-dark-100 hover:bg-dark-700 focus:ring-dark-600",
      ghost:   "text-dark-400 hover:text-dark-100 hover:bg-dark-800 focus:ring-dark-600",
      danger:  "bg-red-600 text-white hover:bg-red-500 focus:ring-red-500 shadow-lg shadow-red-600/20",
      gold:    "bg-gradient-to-r from-gold-500 to-gold-600 text-dark-900 hover:from-gold-400 hover:to-gold-500 focus:ring-gold-500 shadow-lg shadow-gold-500/25",
    };

    const sizes = {
      sm: "px-3.5 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-7 py-3 text-sm",
      xl: "px-9 py-4 text-base",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], fullWidth && "w-full", className)}
        {...props}
      >
        {loading && (
          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
export default Button;
