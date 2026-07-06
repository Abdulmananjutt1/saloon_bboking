// ─────────────────────────────────────────────────────────
//  HTML Email Templates — Glamour Studio branded
// ─────────────────────────────────────────────────────────

const BRAND = "Glamour Studio";

function layout(content: string, preheader = ""): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background:#0d0c0a;font-family:'Segoe UI',Arial,sans-serif;">
  <span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#0d0c0a;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#1a1814;border-radius:16px;border:1px solid #2a2620;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px;background:linear-gradient(135deg,#1a1814 0%,#252018 100%);border-bottom:1px solid #2a2620;">
              <p style="margin:0;font-size:11px;font-weight:700;letter-spacing:0.2em;text-transform:uppercase;color:#c9973b;">Premium Salon</p>
              <h1 style="margin:6px 0 0;font-size:22px;font-weight:800;color:#f5f0e8;">${BRAND}</h1>
            </td>
          </tr>
          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              ${content}
            </td>
          </tr>
          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background:#141210;border-top:1px solid #2a2620;">
              <p style="margin:0;font-size:12px;color:#6b6560;line-height:1.6;text-align:center;">
                ${BRAND} &bull; Islamabad<br />
                This is an automated message. Please do not reply directly.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function btn(href: string, label: string): string {
  return `<a href="${href}" style="display:inline-block;margin-top:20px;padding:14px 28px;background:linear-gradient(135deg,#d4a84b,#c9973b);color:#0d0c0a;font-size:14px;font-weight:700;text-decoration:none;border-radius:10px;">${label}</a>`;
}

function detailRow(label: string, value: string): string {
  return `<tr>
    <td style="padding:8px 0;font-size:13px;color:#9a948c;width:120px;vertical-align:top;">${label}</td>
    <td style="padding:8px 0;font-size:13px;color:#f5f0e8;font-weight:600;">${value}</td>
  </tr>`;
}

export interface BookingDetails {
  bookingId: string;
  customerName: string;
  serviceName: string;
  stylistName: string;
  date: string;
  time: string;
  price: string;
}

// ── Welcome ──────────────────────────────────────────────

export function welcomeEmail(name: string, dashboardUrl: string): string {
  return layout(
    `<p style="margin:0 0 12px;font-size:16px;color:#f5f0e8;">Hi <strong>${name}</strong>,</p>
     <p style="margin:0 0 16px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       Welcome to ${BRAND}! Your email is verified and your account is ready. You can now book appointments, track your visits, and chat with our team.
     </p>
     ${btn(dashboardUrl, "Go to Dashboard")}`,
    `Welcome to ${BRAND}, ${name}!`
  );
}

// ── Email Verification ───────────────────────────────────

export function verifyEmailTemplate(name: string, verifyUrl: string): string {
  return layout(
    `<p style="margin:0 0 12px;font-size:16px;color:#f5f0e8;">Hi <strong>${name}</strong>,</p>
     <p style="margin:0 0 16px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       Thanks for signing up! Please confirm your email address to activate your account and start booking.
     </p>
     ${btn(verifyUrl, "Verify Email Address")}
     <p style="margin:24px 0 0;font-size:12px;color:#6b6560;line-height:1.6;">
       This link expires in 24 hours. If you didn't create an account, you can ignore this email.
     </p>`,
    "Verify your Glamour Studio account"
  );
}

// ── Password Reset ───────────────────────────────────────

export function passwordResetEmail(name: string, resetUrl: string): string {
  return layout(
    `<p style="margin:0 0 12px;font-size:16px;color:#f5f0e8;">Hi <strong>${name}</strong>,</p>
     <p style="margin:0 0 16px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       We received a request to reset your password. Click the button below to choose a new password. This link expires in 1 hour.
     </p>
     ${btn(resetUrl, "Reset Password")}
     <p style="margin:24px 0 0;font-size:12px;color:#6b6560;line-height:1.6;">
       If you didn't request this, you can safely ignore this email. Your password will remain unchanged.
     </p>`,
    "Reset your Glamour Studio password"
  );
}

// ── Booking Received (pending) ─────────────────────────────

export function bookingReceivedEmail(details: BookingDetails, dashboardUrl: string): string {
  return layout(
    `<p style="margin:0 0 12px;font-size:16px;color:#f5f0e8;">Hi <strong>${details.customerName}</strong>,</p>
     <p style="margin:0 0 20px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       We've received your booking request! Our team will review and confirm it shortly.
     </p>
     <table width="100%" cellpadding="0" cellspacing="0" style="background:#141210;border-radius:12px;padding:16px 20px;border:1px solid #2a2620;">
       ${detailRow("Booking ID", details.bookingId)}
       ${detailRow("Service", details.serviceName)}
       ${detailRow("Stylist", details.stylistName)}
       ${detailRow("Date", details.date)}
       ${detailRow("Time", details.time)}
       ${detailRow("Price", details.price)}
     </table>
     ${btn(dashboardUrl, "View My Bookings")}`,
    `Booking request received — ${details.bookingId}`
  );
}

// ── Booking Status Update ──────────────────────────────────

export function bookingStatusEmail(
  details: BookingDetails,
  status: "confirmed" | "completed" | "cancelled" | "pending",
  dashboardUrl: string
): string {
  const messages: Record<typeof status, { title: string; body: string }> = {
    confirmed: {
      title: "Booking Confirmed!",
      body: "Great news — your appointment has been confirmed. We look forward to seeing you!",
    },
    completed: {
      title: "Visit Complete",
      body: "Thank you for visiting us! We hope you loved your experience. See you again soon!",
    },
    cancelled: {
      title: "Booking Cancelled",
      body: "Your booking has been cancelled. If this was a mistake, please contact us or book again.",
    },
    pending: {
      title: "Booking Pending",
      body: "Your booking is awaiting confirmation. We'll notify you once it's approved.",
    },
  };

  const { title, body } = messages[status];

  return layout(
    `<p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#c9973b;">${title}</p>
     <p style="margin:0 0 12px;font-size:16px;color:#f5f0e8;">Hi <strong>${details.customerName}</strong>,</p>
     <p style="margin:0 0 20px;font-size:14px;color:#b8b0a4;line-height:1.7;">${body}</p>
     <table width="100%" cellpadding="0" cellspacing="0" style="background:#141210;border-radius:12px;padding:16px 20px;border:1px solid #2a2620;">
       ${detailRow("Booking ID", details.bookingId)}
       ${detailRow("Service", details.serviceName)}
       ${detailRow("Stylist", details.stylistName)}
       ${detailRow("Date", details.date)}
       ${detailRow("Time", details.time)}
     </table>
     ${btn(dashboardUrl, "View My Bookings")}`,
    `${title} — ${details.bookingId}`
  );
}

// ── Contact Form ───────────────────────────────────────────

export interface ContactFormDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

const SUBJECT_LABELS: Record<string, string> = {
  booking:  "Booking Inquiry",
  service:  "Service Questions",
  pricing:  "Pricing & Packages",
  feedback: "Feedback & Reviews",
  other:    "Other",
};

function subjectLabel(value: string): string {
  return SUBJECT_LABELS[value] ?? value;
}

export function contactConfirmationEmail(details: ContactFormDetails): string {
  const name = `${details.firstName} ${details.lastName}`.trim();
  return layout(
    `<p style="margin:0 0 12px;font-size:16px;color:#f5f0e8;">Hi <strong>${name}</strong>,</p>
     <p style="margin:0 0 20px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       Thank you for reaching out to ${BRAND}! We've received your message and our team will get back to you within 24 hours.
     </p>
     <table width="100%" cellpadding="0" cellspacing="0" style="background:#141210;border-radius:12px;padding:16px 20px;border:1px solid #2a2620;">
       ${detailRow("Subject", subjectLabel(details.subject))}
       ${detailRow("Message", details.message)}
     </table>
     <p style="margin:24px 0 0;font-size:12px;color:#6b6560;line-height:1.6;">
       If you need urgent assistance, call us at +92 300 1234567.
     </p>`,
    `We received your message — ${BRAND}`
  );
}

export function adminContactFormEmail(details: ContactFormDetails): string {
  const name = `${details.firstName} ${details.lastName}`.trim();
  return layout(
    `<p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#c9973b;">New Contact Message</p>
     <p style="margin:0 0 20px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       A visitor submitted the contact form on the website.
     </p>
     <table width="100%" cellpadding="0" cellspacing="0" style="background:#141210;border-radius:12px;padding:16px 20px;border:1px solid #2a2620;">
       ${detailRow("Name", name)}
       ${detailRow("Email", details.email)}
       ${details.phone ? detailRow("Phone", details.phone) : ""}
       ${detailRow("Subject", subjectLabel(details.subject))}
       ${detailRow("Message", details.message)}
     </table>
     <p style="margin:24px 0 0;font-size:12px;color:#6b6560;line-height:1.6;">
       Reply directly to <a href="mailto:${details.email}" style="color:#c9973b;">${details.email}</a>
     </p>`,
    `New contact from ${name}`
  );
}

// ── Admin: New Booking Alert ───────────────────────────────

export function adminNewBookingEmail(details: BookingDetails, adminUrl: string): string {
  return layout(
    `<p style="margin:0 0 8px;font-size:18px;font-weight:800;color:#c9973b;">New Booking Request</p>
     <p style="margin:0 0 20px;font-size:14px;color:#b8b0a4;line-height:1.7;">
       A new booking has been submitted and is awaiting confirmation.
     </p>
     <table width="100%" cellpadding="0" cellspacing="0" style="background:#141210;border-radius:12px;padding:16px 20px;border:1px solid #2a2620;">
       ${detailRow("Client", details.customerName)}
       ${detailRow("Booking ID", details.bookingId)}
       ${detailRow("Service", details.serviceName)}
       ${detailRow("Stylist", details.stylistName)}
       ${detailRow("Date", details.date)}
       ${detailRow("Time", details.time)}
       ${detailRow("Price", details.price)}
     </table>
     ${btn(adminUrl, "Review in Admin Panel")}`,
    `New booking from ${details.customerName}`
  );
}
