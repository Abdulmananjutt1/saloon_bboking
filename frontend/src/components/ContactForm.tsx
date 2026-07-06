"use client";

import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";
import { contactApi } from "@/lib/api";

const SUBJECTS = [
  { value: "booking",  label: "Booking Inquiry" },
  { value: "service",  label: "Service Questions" },
  { value: "pricing",  label: "Pricing & Packages" },
  { value: "feedback", label: "Feedback & Reviews" },
  { value: "other",    label: "Other" },
];

export default function ContactForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName]   = useState("");
  const [email, setEmail]         = useState("");
  const [phone, setPhone]         = useState("");
  const [subject, setSubject]     = useState("");
  const [message, setMessage]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState("");
  const [sent, setSent]           = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await contactApi.send({
        firstName,
        lastName,
        email,
        phone: phone || undefined,
        subject,
        message,
      }) as { success: boolean; error?: string };

      if (res.success) {
        setSent(true);
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setSubject("");
        setMessage("");
      } else {
        setError(res.error ?? "Failed to send message. Please try again.");
      }
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div style={{ textAlign: "center", padding: "40px 20px" }}>
        <CheckCircle style={{ width: 48, height: 48, color: "var(--gold)", margin: "0 auto 20px" }} />
        <h3 className="sal-h3" style={{ marginBottom: 12 }}>Message Sent!</h3>
        <p style={{ fontSize: "0.88rem", color: "var(--text-secondary)", lineHeight: 1.7, marginBottom: 24 }}>
          Thank you for reaching out. We&apos;ve sent a confirmation to your email and our team will respond within 24 hours.
        </p>
        <button
          type="button"
          className="sal-btn sal-btn-outline"
          onClick={() => setSent(false)}
          style={{ fontSize: "0.82rem" }}
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <>
      <h2 className="sal-h2" style={{ marginBottom: 8 }}>Send a Message</h2>
      <p style={{ fontSize: "0.85rem", color: "var(--text-secondary)", marginBottom: 32 }}>
        Fill out the form and we&apos;ll get back to you ASAP.
      </p>

      {error && (
        <div style={{
          padding: "12px 16px", borderRadius: 8, marginBottom: 20,
          background: "rgba(248,113,113,0.08)", border: "1px solid rgba(248,113,113,0.25)",
          color: "#f87171", fontSize: "0.82rem",
        }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
          <div>
            <label className="sal-label">First Name</label>
            <input
              type="text"
              className="sal-input"
              placeholder="John"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="sal-label">Last Name</label>
            <input
              type="text"
              className="sal-input"
              placeholder="Doe"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label className="sal-label">Email Address</label>
          <input
            type="email"
            className="sal-input"
            placeholder="you@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="sal-label">Phone Number</label>
          <input
            type="tel"
            className="sal-input"
            placeholder="0300-1234567"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        <div>
          <label className="sal-label">Subject</label>
          <select
            className="sal-input"
            style={{ color: "var(--text-primary)", cursor: "pointer" }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          >
            <option value="">Select a topic</option>
            {SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>{s.label}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="sal-label">Message</label>
          <textarea
            className="sal-input"
            rows={4}
            placeholder="Tell us how we can help..."
            style={{ resize: "vertical" }}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            minLength={10}
          />
        </div>

        <button
          type="submit"
          className="sal-btn sal-btn-gold"
          style={{ marginTop: 10, opacity: loading ? 0.7 : 1 }}
          disabled={loading}
        >
          <Send style={{ width: 16, height: 16 }} />
          {loading ? "Sending..." : "Send Message"}
        </button>
      </form>
    </>
  );
}
