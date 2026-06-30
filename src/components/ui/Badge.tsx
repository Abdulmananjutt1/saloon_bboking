import { cn } from "@/lib/utils";

interface BadgeProps {
  label: string;
  variant?: "gold" | "success" | "warning" | "danger" | "info" | "dark";
  className?: string;
}

export default function Badge({ label, variant = "dark", className }: BadgeProps) {
  const variants = {
    gold:    "bg-gold-500/15 text-gold-400 border border-gold-500/30",
    success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
    warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
    danger:  "bg-red-500/15 text-red-400 border border-red-500/30",
    info:    "bg-blue-500/15 text-blue-400 border border-blue-500/30",
    dark:    "bg-dark-700/60 text-dark-200 border border-dark-600",
  };

  return (
    <span className={cn(
      "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium uppercase tracking-wider",
      variants[variant],
      className
    )}>
      {label}
    </span>
  );
}
