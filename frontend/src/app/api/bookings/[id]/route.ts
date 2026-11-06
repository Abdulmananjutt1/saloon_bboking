import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { BookingStatus } from "@prisma/client";
import { notifyClient } from "@/server/lib/push";
import { buildBookingDetails, sendBookingStatusEmail } from "@/server/lib/email";

function formatBooking(b: any) {
  return {
    ...b,
    serviceName: b.serviceName ?? b.service?.name ?? "Appointment",
    stylistName: b.stylistName ?? b.stylist?.name ?? "Glamour Studio",
    date: b.date.toISOString().split("T")[0],
    status: b.status.toLowerCase(),
  };
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: { select: { name: true } },
        stylist: { select: { name: true } },
      },
    });
    if (!booking) return Response.json({ success: false, error: "Booking not found" }, { status: 404 });
    return Response.json({ success: true, data: formatBooking(booking) });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to fetch booking" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { status } = await req.json() as { status: string };
    const valid = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !valid.includes(status)) {
      return Response.json({ success: false, error: `Status must be one of: ${valid.join(", ")}` }, { status: 422 });
    }

    const booking = await prisma.booking.findUnique({
      where: { id },
      include: { service: true, stylist: true },
    });
    if (!booking) return Response.json({ success: false, error: "Booking not found" }, { status: 404 });

    const updated = await prisma.booking.update({
      where: { id },
      data: { status: status.toUpperCase() as BookingStatus },
      include: {
        service: { select: { name: true } },
        stylist: { select: { name: true } },
      },
    });

    const statusMessages: Record<string, string> = {
      confirmed: "✅ Your booking has been confirmed!",
      completed: "🎉 Your visit is complete. Thank you!",
      cancelled:  "❌ Your booking has been cancelled.",
      pending:    "⏳ Your booking is pending confirmation.",
    };
    const msg = statusMessages[status];
    if (msg && booking.customerEmail) {
      notifyClient(booking.customerEmail, {
        title: "Glamour Studio — Booking Update",
        body: `${msg} (${updated.id})`,
        tag: `booking-status-${updated.id}`,
        url: "/dashboard",
        data: { bookingId: updated.id, status },
      }).catch(() => {});

      const emailDetails = buildBookingDetails({
        bookingId: updated.id, customerName: booking.customerName,
        serviceName: booking.service.name, stylistName: booking.stylist.name,
        date: booking.date, time: booking.time, price: booking.price,
      });
      sendBookingStatusEmail(booking.customerEmail, emailDetails, status as any);
    }

    return Response.json({ success: true, data: formatBooking(updated) });
  } catch (err) {
    console.error("[PATCH /api/bookings/:id]", err);
    return Response.json({ success: false, error: "Failed to update booking" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) return Response.json({ success: false, error: "Booking not found" }, { status: 404 });
    await prisma.booking.delete({ where: { id } });
    return Response.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("[DELETE /api/bookings/:id]", err);
    return Response.json({ success: false, error: "Failed to delete booking" }, { status: 500 });
  }
}
