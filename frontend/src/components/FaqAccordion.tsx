"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Do I need to book in advance?",
    a: "Yes, we recommend booking at least 24–48 hours in advance to secure your preferred time and stylist. Walk-ins are welcome based on availability, but appointments are guaranteed."
  },
  {
    q: "What's your cancellation policy?",
    a: "We require 6 hours notice for cancellations or rescheduling. Cancellations within 6 hours may incur a 50% fee. No-shows will be charged full service price."
  },
  {
    q: "Do you use premium products?",
    a: "Absolutely. We exclusively use certified, professional-grade products from Loreal, Wella, Kerastase, and other trusted brands. No cheap alternatives."
  },
  {
    q: "Is parking available?",
    a: "Yes, we have dedicated parking for clients behind the salon building. Valet service is available during peak hours at no extra cost."
  },
  {
    q: "Can I bring my own product?",
    a: "For hygiene and quality assurance, we use only our professional products. If you have specific allergies, please inform us before your appointment."
  },
  {
    q: "Do you offer bridal packages?",
    a: "Yes! Our comprehensive bridal package includes hair, makeup, facial, nails, and pre-wedding consultations. Book at least 2–3 months in advance."
  },
];

export default function FaqAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (i: number) => setOpenIndex(openIndex === i ? null : i);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto" }}>
      {FAQS.map((faq, i) => {
        const isOpen = openIndex === i;
        return (
          <div
            key={i}
            className={`faq-item${isOpen ? " faq-item--open" : ""}`}
            style={{ marginBottom: 12 }}
          >
            {/* Question row — clickable */}
            <button
              onClick={() => toggle(i)}
              className="faq-trigger"
              aria-expanded={isOpen}
            >
              {/* Number badge */}
              <span className="faq-num">
                {String(i + 1).padStart(2, "0")}
              </span>

              {/* Question text */}
              <span className="faq-question">{faq.q}</span>

              {/* Chevron */}
              <span className={`faq-chevron${isOpen ? " faq-chevron--open" : ""}`}>
                <ChevronDown style={{ width: 18, height: 18 }} />
              </span>
            </button>

            {/* Answer — animated open/close */}
            <div className={`faq-body${isOpen ? " faq-body--open" : ""}`}>
              <div className="faq-answer">
                {faq.a}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
