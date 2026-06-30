import { cn } from "@/lib/utils";
import { InputHTMLAttributes, forwardRef } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, icon, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-xs font-semibold text-dark-300 uppercase tracking-wider">{label}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-400">{icon}</div>}
        <input
          ref={ref}
          className={cn(
            "w-full rounded-lg bg-dark-800 border border-dark-600 px-4 py-3 text-sm text-dark-100",
            "placeholder:text-dark-500",
            "focus:outline-none focus:border-gold-500 focus:ring-1 focus:ring-gold-500/50",
            "disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200",
            icon && "pl-10",
            error && "border-red-500 focus:border-red-500 focus:ring-red-500/50",
            className
          )}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = "Input";
export default Input;
