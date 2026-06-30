import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: { value: number; label: string };
  variant?: "gold" | "default";
  className?: string;
}

export default function StatCard({ title, value, subtitle, icon, trend, variant = "default", className }: StatCardProps) {
  return (
    <div className={cn(
      "luxury-card rounded-2xl p-6 flex flex-col gap-4",
      variant === "gold" && "border-gold-500/30 bg-gradient-to-br from-gold-900/20 to-dark-900",
      className
    )}>
      <div className="flex items-start justify-between">
        <div className={cn(
          "w-12 h-12 rounded-xl flex items-center justify-center",
          variant === "gold" ? "bg-gold-500/20 text-gold-400" : "bg-dark-700 text-dark-300"
        )}>
          {icon}
        </div>
        {trend && (
          <span className={cn(
            "text-xs font-semibold px-2 py-1 rounded-full",
            trend.value >= 0
              ? "bg-emerald-500/15 text-emerald-400"
              : "bg-red-500/15 text-red-400"
          )}>
            {trend.value >= 0 ? "+" : ""}{trend.value}% {trend.label}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-dark-50">{value}</p>
        <p className="text-sm text-dark-400 mt-0.5">{title}</p>
        {subtitle && <p className="text-xs text-dark-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}
