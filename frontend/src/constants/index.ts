export const APP_NAME = "Glamour Studio";
export const APP_TAGLINE = "Where Style Meets Perfection";
export const APP_DESCRIPTION =
  "Premium salon & spa services — haircuts, color, beard, facials, and more. Book your appointment in seconds.";
export const APP_PHONE = "+92 300 1234567";
export const APP_EMAIL = "hello@glamourstudio.pk";
export const APP_ADDRESS = "Plot 45, F-7 Markaz, Islamabad";
export const APP_HOURS = "Mon–Sat: 9AM–9PM  |  Sun: 10AM–7PM";

export const SERVICE_CATEGORIES = [
  { label: "Haircut",    value: "haircut",  icon: "Scissors" },
  { label: "Beard",      value: "beard",    icon: "User" },
  { label: "Hair Color", value: "color",    icon: "Palette" },
  { label: "Facial",     value: "facial",   icon: "Sparkles" },
  { label: "Massage",    value: "massage",  icon: "Heart" },
  { label: "Nails",      value: "nails",    icon: "Star" },
  { label: "Bridal",     value: "bridal",   icon: "Crown" },
  { label: "Waxing",     value: "waxing",   icon: "Feather" },
  { label: "Keratin",    value: "keratin",  icon: "Wind" },
];

export const TIME_SLOTS = [
  "09:00 AM", "09:30 AM", "10:00 AM", "10:30 AM",
  "11:00 AM", "11:30 AM", "12:00 PM", "12:30 PM",
  "01:00 PM", "01:30 PM", "02:00 PM", "02:30 PM",
  "03:00 PM", "03:30 PM", "04:00 PM", "04:30 PM",
  "05:00 PM", "05:30 PM", "06:00 PM", "06:30 PM",
  "07:00 PM", "07:30 PM", "08:00 PM",
];

export const ROUTES = {
  HOME: "/",
  SERVICES: "/services",
  SERVICE_DETAIL: (id: string) => `/services/${id}`,
  BOOK: "/book",
  STYLISTS: "/stylists",
  GALLERY: "/gallery",
  ABOUT: "/about",
  CONTACT: "/contact",
  MY_BOOKINGS: "/dashboard?tab=appointments",
  DASHBOARD: "/dashboard",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  FORGOT_PASSWORD: "/auth/forgot-password",
  ADMIN: "/admin",
  ADMIN_BOOKINGS: "/admin/bookings",
  ADMIN_SERVICES: "/admin/services",
  ADMIN_STYLISTS: "/admin/stylists",
  ADMIN_CLIENTS: "/admin/clients",
  ADMIN_ANALYTICS: "/admin/analytics",
  ADMIN_PAYROLL:   "/admin/payroll",
} as const;

export const NAV_LINKS = [
  { label: "Home", href: ROUTES.HOME },
  { label: "Services", href: ROUTES.SERVICES },
  { label: "Gallery", href: ROUTES.GALLERY },
  { label: "About", href: ROUTES.ABOUT },
  { label: "Contact", href: ROUTES.CONTACT },
];

export const STATS = [
  { value: "8,500+", label: "Happy Clients" },
  { value: "15+", label: "Expert Stylists" },
  { value: "50+", label: "Services" },
  { value: "4.9★", label: "Avg. Rating" },
];

export const ADMIN_NAV = [
  { label: "Dashboard", href: ROUTES.ADMIN, icon: "LayoutDashboard" },
  { label: "Bookings", href: ROUTES.ADMIN_BOOKINGS, icon: "CalendarDays" },
  { label: "Services", href: ROUTES.ADMIN_SERVICES, icon: "Scissors" },
  { label: "Stylists", href: ROUTES.ADMIN_STYLISTS, icon: "Users" },
  { label: "Clients", href: ROUTES.ADMIN_CLIENTS, icon: "UserCheck" },
  { label: "Analytics", href: ROUTES.ADMIN_ANALYTICS, icon: "BarChart3" },
];

// ── Booking status ────────────────────────────────────────────────────────────
export const BOOKING_STATUS = {
  PENDING:   "pending",
  CONFIRMED: "confirmed",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
} as const;

export type BookingStatus = typeof BOOKING_STATUS[keyof typeof BOOKING_STATUS];

/**
 * Single source of truth for status badge colours used across admin pages and
 * Toast notifications.  All values reference CSS custom properties so both
 * light and dark themes work automatically.
 */
export const STATUS_META: Record<BookingStatus, {
  color: string;
  bg: string;
  border: string;
  dot: string;
  /** Tailwind class-based alternative — used by Badge / getStatusColor */
  tw: string;
}> = {
  confirmed: {
    color:  "var(--status-confirmed)",
    bg:     "var(--status-confirmed-bg)",
    border: "var(--status-confirmed-border)",
    dot:    "var(--status-confirmed)",
    tw:     "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  },
  pending: {
    color:  "var(--status-pending)",
    bg:     "var(--status-pending-bg)",
    border: "var(--status-pending-border)",
    dot:    "var(--status-pending)",
    tw:     "bg-amber-500/15 text-amber-400 border-amber-500/30",
  },
  completed: {
    color:  "var(--status-completed)",
    bg:     "var(--status-completed-bg)",
    border: "var(--status-completed-border)",
    dot:    "var(--status-completed)",
    tw:     "bg-blue-500/15 text-blue-400 border-blue-500/30",
  },
  cancelled: {
    color:  "var(--status-cancelled)",
    bg:     "var(--status-cancelled-bg)",
    border: "var(--status-cancelled-border)",
    dot:    "var(--status-cancelled)",
    tw:     "bg-red-500/15 text-red-400 border-red-500/30",
  },
};

// ── Avatar accent colours (cycling list for client initials) ─────────────────
export const CLIENT_AVATAR_COLORS = [
  "var(--gold)",
  "var(--status-completed)",   // blue
  "#a78bfa",                   // violet — no status equivalent, kept as-is
  "var(--status-confirmed)",   // emerald
  "var(--status-cancelled)",   // red
  "var(--status-pending)",     // amber
] as const;

// ── API endpoints ─────────────────────────────────────────────────────────────
export const API_ENDPOINTS = {
  STATS:          "/stats",
  STATS_ANALYTICS: "/stats/analytics",
  BOOKINGS:       "/bookings",
  BOOKING:        (id: string) => `/bookings/${id}`,
  SERVICES:       "/services",
  SERVICE:        (id: string) => `/services/${id}`,
  STYLISTS:       "/stylists",
  STYLIST:        (id: string) => `/stylists/${id}`,
  CLIENTS:        "/clients",
  CLIENT:         (id: string) => `/clients/${id}`,
  AUTH_LOGIN:     "/auth/login",
  AUTH_REGISTER:  "/auth/register",
  AUTH_ME:        "/auth/me",
  AUTH_LOGOUT:    "/auth/logout",
} as const;

// ── Pagination ────────────────────────────────────────────────────────────────
export const PAGINATION = {
  ITEMS_PER_PAGE: 10,
  RECENT_PREVIEW: 5,
} as const;

// ── Toast ─────────────────────────────────────────────────────────────────────
export const TOAST_CONFIG = {
  DURATION_MS:   4000,
  ANIMATE_MS:    350,
} as const;
