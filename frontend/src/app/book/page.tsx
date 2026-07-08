import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BookingForm from "@/components/booking/BookingForm";

export const metadata: Metadata = {
  title: "Book Appointment — Glamour Studio",
  description: "Book your salon appointment online in minutes.",
};

interface Props {
  searchParams: Promise<{ service?: string; stylist?: string }>;
}

export default async function BookPage({ searchParams }: Props) {
  const { service, stylist } = await searchParams;
  return (
    <>
      <Navbar />
      <main className="site-main booking-page">
        <div className="sal-container booking-page-inner">
          {/* Header */}
          <div className="booking-page-header">
            <span className="sal-eyebrow">Easy Booking</span>
            <h1 className="sal-h2" style={{ marginBottom: 12 }}>
              Book Your <span className="text-gold">Appointment</span>
            </h1>
            <p className="booking-page-subtitle">
              Select your service, choose a stylist, and pick a time. Done in under 2 minutes.
            </p>
          </div>
          <BookingForm preSelectedService={service} preSelectedStylist={stylist} />
        </div>
      </main>
      <Footer />
    </>
  );
}
