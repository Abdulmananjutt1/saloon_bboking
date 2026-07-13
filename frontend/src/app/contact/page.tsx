import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MessageSquare } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/layout/PageHero";
import CtaBanner from "@/components/layout/CtaBanner";
import SectionHeader from "@/components/sections/SectionHeader";
import FaqAccordion from "@/components/FaqAccordion";
import ContactForm from "@/components/ContactForm";
import ContactInfoCards from "@/components/contact/ContactInfoCards";
import SocialLinks from "@/components/contact/SocialLinks";
import { ROUTES, APP_PHONE } from "@/constants";

export const metadata: Metadata = {
  title: "Contact Us — Glamour Studio",
  description: "Get in touch with Islamabad's premier salon. Book appointments, ask questions, or visit us at F-7 Markaz.",
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="site-main" style={{ background: "var(--bg-primary)", width: "100%", maxWidth: "100%", overflowX: "hidden" }}>
        <PageHero
          size="short"
          image="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=1600&q=80"
          imageAlt="Contact Us"
          badge="We're Here to Help"
          badgeIcon={<MessageSquare style={{ width: 14, height: 14, color: "var(--gold)" }} />}
          heading={
            <>
              Get in <span className="text-gold">Touch</span>
              <br />
              With Us
            </>
          }
          subtext="Questions, bookings, or just want to say hello? Reach out through any channel below. Our team responds within 24 hours, often sooner."
          align="left"
        >
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href={`tel:${APP_PHONE}`} className="sal-glass hero-chip" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 12, textDecoration: "none", color: "var(--text-primary)", fontSize: "0.82rem", fontWeight: 600 }}>
              <Phone style={{ width: 16, height: 16, color: "var(--gold)" }} />
              Call Now
            </a>
            <a href="mailto:hello@glamourstudio.pk" className="sal-glass hero-chip" style={{ display: "inline-flex", alignItems: "center", gap: 10, padding: "12px 20px", borderRadius: 12, textDecoration: "none", color: "var(--text-primary)", fontSize: "0.82rem", fontWeight: 600 }}>
              <Mail style={{ width: 16, height: 16, color: "var(--gold)" }} />
              Email Us
            </a>
            <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold" style={{ fontSize: "0.82rem", padding: "12px 24px" }}>
              Book Online
            </Link>
          </div>
        </PageHero>

        <section style={{ background: "var(--bg-secondary)", padding: "100px 0" }}>
          <div className="sal-container">
            <div className="sal-grid-2col" style={{ gap: 40 }}>
              <div className="sal-glass" style={{ padding: 40, borderRadius: 20 }}>
                <ContactForm />
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                <div style={{ marginBottom: 28 }}>
                  <span className="sal-eyebrow">Find Us</span>
                  <h2 className="sal-h2" style={{ marginBottom: 8 }}>
                    Visit Our <span className="text-gold">Salon</span>
                  </h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)" }}>
                    We&apos;d love to see you in person — or reach out any way you prefer.
                  </p>
                </div>
                <ContactInfoCards />
                <SocialLinks />
              </div>
            </div>
          </div>
        </section>

        <section style={{ background: "var(--bg-primary)", padding: "100px 0" }}>
          <div className="sal-container">
            <SectionHeader
              eyebrow="Common Questions"
              title={
                <>
                  Frequently Asked <span className="text-gold">Questions</span>
                </>
              }
              description="Quick answers to questions we often hear from new and returning clients."
              className=""
            />
            <FaqAccordion />
          </div>
        </section>

        <CtaBanner
          heading={
            <>
              Ready to Experience
              <br />
              <span className="text-gold">Premium Salon Care?</span>
            </>
          }
          subtext="Book your appointment today and discover why 8,500+ clients trust us with their beauty needs."
          buttons={[
            { label: "Book Online Now", href: ROUTES.BOOK, variant: "gold" },
            { label: `Call ${APP_PHONE}`, href: `tel:${APP_PHONE}`, variant: "outline", icon: <Phone style={{ width: 16, height: 16 }} />, external: true },
          ]}
          footer={
            <p>
              Response time: <span style={{ color: "var(--gold)" }}>Under 2 hours</span> for calls,{" "}
              <span style={{ color: "var(--gold)" }}>24 hours</span> for emails.
            </p>
          }
        />
      </main>
      <Footer />
    </>
  );
}
