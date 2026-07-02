import { type ClassValue, clsx } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    minimumFractionDigits: 0,
  }).format(amount).replace("PKR", "Rs.");
}

export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(dateString));
}

export function formatDateShort(dateString: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(dateString));
}

export function getTodayDate(): string {
  return new Date().toISOString().split("T")[0];
}

export function getTomorrowDate(): string {
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return t.toISOString().split("T")[0];
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function truncateText(text: string, max: number): string {
  return text.length <= max ? text : text.slice(0, max).trimEnd() + "…";
}

export function getStatusColor(status: string): string {
  const map: Record<string, string> = {
    confirmed: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
    pending:   "bg-amber-500/15 text-amber-400 border-amber-500/30",
    completed: "bg-blue-500/15 text-blue-400 border-blue-500/30",
    cancelled: "bg-red-500/15 text-red-400 border-red-500/30",
  };
  return map[status] ?? "bg-dark-700 text-dark-300";
}

