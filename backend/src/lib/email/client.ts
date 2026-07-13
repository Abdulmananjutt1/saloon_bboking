import { Resend } from "resend";
import { EMAIL_ENABLED, EMAIL_FROM, RESEND_API_KEY } from "./config";

let resend: Resend | null = null;

function getClient(): Resend | null {
  if (!EMAIL_ENABLED) return null;
  if (!resend) resend = new Resend(RESEND_API_KEY);
  return resend;
}

export interface SendEmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  replyTo?: string;
}

export async function sendEmail(options: SendEmailOptions): Promise<boolean> {
  const client = getClient();
  if (!client) {
    console.warn("[email] RESEND_API_KEY not set — skipping:", options.subject);
    return false;
  }

  try {
    const { error } = await client.emails.send({
      from: EMAIL_FROM,
      to: Array.isArray(options.to) ? options.to : [options.to],
      subject: options.subject,
      html: options.html,
      replyTo: options.replyTo,
    });

    if (error) {
      console.error("[email] Resend error:", error);
      return false;
    }
    return true;
  } catch (err) {
    console.error("[email] Send failed:", err);
    return false;
  }
}
