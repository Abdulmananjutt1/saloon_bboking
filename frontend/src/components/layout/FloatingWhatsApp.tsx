"use client";

import { usePathname } from "next/navigation";
import { APP_NAME, APP_PHONE } from "@/constants";

const hiddenPrefixes = ["/admin", "/auth", "/dashboard"];

function whatsappPhoneNumber(phone: string) {
  return phone.replace(/\D/g, "");
}

export default function FloatingWhatsApp() {
  const pathname = usePathname();
  const shouldHide = hiddenPrefixes.some((prefix) => pathname?.startsWith(prefix));

  if (shouldHide) return null;

  const phone = whatsappPhoneNumber(APP_PHONE);
  const message = encodeURIComponent(`Hi ${APP_NAME}, I want to book an appointment.`);

  return (
    <a
      className="whatsapp-float"
      href={`https://wa.me/${phone}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      title="Chat on WhatsApp"
    >
      <span className="whatsapp-float-label">Chat on WhatsApp</span>
      <span className="whatsapp-float-button" aria-hidden="true">
        <svg viewBox="0 0 32 32" className="whatsapp-float-icon" focusable="false">
          <path d="M16 3.2c-7 0-12.7 5.5-12.7 12.4 0 2.2.6 4.4 1.8 6.2L3.5 28.8l7.2-1.7c1.7.8 3.5 1.2 5.4 1.2 7 0 12.7-5.5 12.7-12.4S23 3.2 16 3.2Zm0 22.9c-1.7 0-3.4-.4-4.8-1.2l-.5-.3-4.1 1 1-4-.3-.5c-1.1-1.6-1.7-3.5-1.7-5.5C5.6 10 10.3 5.5 16 5.5S26.4 10 26.4 15.6 21.7 26.1 16 26.1Z" />
          <path d="M21.7 18.6c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2-.2.3-.8 1-.9 1.1-.2.2-.3.2-.6.1-.3-.2-1.2-.4-2.3-1.4-.8-.7-1.4-1.6-1.6-1.9-.2-.3 0-.5.1-.6l.5-.6c.2-.2.2-.3.3-.5.1-.2 0-.4 0-.5-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.4s1.1 2.8 1.2 3c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.1-.3-.2-.6-.3Z" />
        </svg>
      </span>
    </a>
  );
}
