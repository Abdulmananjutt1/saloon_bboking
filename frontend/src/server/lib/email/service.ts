import { sendEmail } from "./client";
import { APP_URL, ADMIN_EMAIL } from "./config";
import {
  welcomeEmail,
  verifyEmailTemplate,
  passwordResetEmail,
  bookingReceivedEmail,
  bookingStatusEmail,
  adminNewBookingEmail,
  contactConfirmationEmail,
  adminContactFormEmail,
  type BookingDetails,
  type ContactFormDetails,
} from "./templates";

function formatPrice(cents: number): string {
  return `PKR ${cents.toLocaleString("en-PK")}`;
}

function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return d.toLocaleDateString("en-PK", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
}

export function buildBookingDetails(data: {
  bookingId: string;
  customerName: string;
  serviceName: string;
  stylistName: string;
  date: Date | string;
  time: string;
  price: number;
}): BookingDetails {
  return {
    bookingId:    data.bookingId,
    customerName: data.customerName,
    serviceName:  data.serviceName,
    stylistName:  data.stylistName,
    date:         formatDate(data.date),
    time:         data.time,
    price:        formatPrice(data.price),
  };
}

export function sendWelcomeEmail(to: string, name: string): void {
  const dashboardUrl = `${APP_URL}/dashboard`;
  sendEmail({
    to,
    subject: `Welcome to Glamour Studio, ${name}!`,
    html: welcomeEmail(name, dashboardUrl),
  }).catch(() => {});
}

export function sendVerificationEmail(to: string, name: string, token: string): void {
  const verifyUrl = `${APP_URL}/auth/verify-email?token=${token}`;
  sendEmail({
    to,
    subject: "Verify your Glamour Studio account",
    html: verifyEmailTemplate(name, verifyUrl),
  }).catch(() => {});
}

export function sendPasswordResetEmail(to: string, name: string, token: string): void {
  const resetUrl = `${APP_URL}/auth/reset-password?token=${token}`;
  sendEmail({
    to,
    subject: "Reset your Glamour Studio password",
    html: passwordResetEmail(name, resetUrl),
  }).catch(() => {});
}

export function sendBookingReceivedEmail(to: string, details: BookingDetails): void {
  const dashboardUrl = `${APP_URL}/dashboard?tab=appointments`;
  sendEmail({
    to,
    subject: `Booking received — ${details.bookingId}`,
    html: bookingReceivedEmail(details, dashboardUrl),
  }).catch(() => {});
}

export function sendBookingStatusEmail(
  to: string,
  details: BookingDetails,
  status: "confirmed" | "completed" | "cancelled" | "pending"
): void {
  const subjects: Record<typeof status, string> = {
    confirmed:  `Booking confirmed — ${details.bookingId}`,
    completed:  `Thank you for visiting — ${details.bookingId}`,
    cancelled:  `Booking cancelled — ${details.bookingId}`,
    pending:    `Booking pending — ${details.bookingId}`,
  };
  const dashboardUrl = `${APP_URL}/dashboard?tab=appointments`;
  sendEmail({
    to,
    subject: subjects[status],
    html: bookingStatusEmail(details, status, dashboardUrl),
  }).catch(() => {});
}

export function sendAdminNewBookingEmail(details: BookingDetails): void {
  if (!ADMIN_EMAIL) return;
  const adminUrl = `${APP_URL}/admin/bookings`;
  sendEmail({
    to: ADMIN_EMAIL,
    subject: `New booking: ${details.customerName} — ${details.bookingId}`,
    html: adminNewBookingEmail(details, adminUrl),
  }).catch(() => {});
}

export function sendContactFormEmails(details: ContactFormDetails): void {
  const name = `${details.firstName} ${details.lastName}`.trim();
  sendEmail({
    to: details.email,
    subject: `We received your message — Glamour Studio`,
    html: contactConfirmationEmail(details),
  }).catch(() => {});

  if (ADMIN_EMAIL) {
    sendEmail({
      to: ADMIN_EMAIL,
      subject: `Contact form: ${name} — ${details.subject}`,
      html: adminContactFormEmail(details),
      replyTo: details.email,
    }).catch(() => {});
  }
}
