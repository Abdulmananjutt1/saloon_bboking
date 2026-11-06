import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { validateBooking, hasErrors } from "@/server/validations";
import { BookingStatus } from "@prisma/client";
import { notifyClient } from "@/server/lib/push";
import { buildBookingDetails, sendBookingStatusEmail } from "@/server/lib/email";
import { isAdmin, forbidden } from "@/server/middleware/auth";

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) return forbidden();

  try {
    const body = await req.json();

    if (!body.userId || typeof body.userId !== "string") {
      return Response.json({ success: false, errors: { userId: "User is required for admin bookings" } }, { status: 422 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!targetUser) {
      return Response.json({ success: false, errors: { userId: "User not found" } }, { status: 422 });
    }

    const bodyWithUser = {
      ...body,
      name:  body.name  || targetUser.name,
      email: body.email || targetUser.email,
      phone: body.phone || targetUser.phone,
    };

    const errors = validateBooking(bodyWithUser);
    if (hasErrors(errors)) return Response.json({ success: false, errors }, { status: 422 });

    const isCustomPackage = bodyWithUser.serviceId === null || bodyWithUser.serviceId === "custom" || Array.isArray(bodyWithUser.customServices);

    let serviceId: string;
    let price: number;
    let duration: number;
    let serviceName: string;

    if (isCustomPackage) {
      let customService = await prisma.service.findFirst({ where: { slug: "custom-package" } });
      if (!customService) {
        customService = await prisma.service.create({
          data: {
            name: "Custom Package", slug: "custom-package", category: "HAIRCUT",
            description: "Custom service package",
            duration: bodyWithUser.customPackageDuration ?? 60,
            price: bodyWithUser.customPackageTotal ?? 0,
            image: "", popular: false, forGender: "UNISEX", isActive: true,
          },
        });
      }
      serviceId = customService.id;
      price = bodyWithUser.customPackageTotal ?? 0;
      duration = bodyWithUser.customPackageDuration ?? 60;
      serviceName = "Custom Package";
    } else {
      const service = await prisma.service.findUnique({ where: { id: bodyWithUser.serviceId } });
      if (!service) return Response.json({ success: false, errors: { serviceId: "Invalid service" } }, { status: 422 });
      serviceId = service.id;
      price = service.price;
      duration = service.duration;
      serviceName = service.name;
    }

    const stylist = await prisma.stylist.findUnique({ where: { id: bodyWithUser.stylistId } });
    if (!stylist) return Response.json({ success: false, errors: { stylistId: "Invalid stylist" } }, { status: 422 });
    if (!stylist.available) return Response.json({ success: false, errors: { stylistId: "This stylist is currently unavailable" } }, { status: 422 });

    const bookingDate = new Date(bodyWithUser.date);
    const conflict = await prisma.booking.findFirst({
      where: { stylistId: bodyWithUser.stylistId, date: bookingDate, time: bodyWithUser.time, status: { not: BookingStatus.CANCELLED } },
    });
    if (conflict) {
      return Response.json({ success: false, errors: { time: "This time slot is already booked. Please choose another." } }, { status: 409 });
    }

    let client = await prisma.client.findUnique({ where: { email: targetUser.email } });
    if (client) {
      client = await prisma.client.update({
        where: { id: client.id },
        data: { name: targetUser.name, phone: targetUser.phone, totalVisits: client.totalVisits + 1, totalSpent: client.totalSpent + price, lastVisit: bookingDate },
      });
    } else {
      client = await prisma.client.create({
        data: { name: targetUser.name, email: targetUser.email, phone: targetUser.phone, totalVisits: 1, totalSpent: price, lastVisit: bookingDate },
      });
    }

    let bookingId = "";
    let isUnique = false;
    while (!isUnique) {
      const num = Math.floor(100000 + Math.random() * 900000);
      bookingId = `GS-${num}`;
      const existing = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!existing) isUnique = true;
    }

    let notes = bodyWithUser.notes?.trim() || null;
    if (isCustomPackage) {
      const customDetails = [
        ...(bodyWithUser.customServices || []).length > 0 ? [`Services: ${bodyWithUser.customServices.join(", ")}`] : [],
        ...(bodyWithUser.customItems || []).length > 0 ? [`Custom items: ${(bodyWithUser.customItems as any[]).map((i: any) => i.name).join(", ")}`] : [],
      ].join(" | ");
      notes = notes ? `${notes} | ${customDetails}` : customDetails || null;
    }

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        customerName: targetUser.name, customerEmail: targetUser.email, customerPhone: targetUser.phone,
        serviceId, stylistId: stylist.id, clientId: client.id, userId: targetUser.id,
        date: bookingDate, time: bodyWithUser.time, duration, price, notes,
        status: BookingStatus.CONFIRMED,
      },
    });

    notifyClient(targetUser.email, {
      title: "📅 Booking Created by Admin",
      body: `Your appointment for ${serviceName} on ${bodyWithUser.date} at ${bodyWithUser.time} has been confirmed.`,
      tag: `booking-${booking.id}`,
      url: "/dashboard",
      data: { bookingId: booking.id },
    }).catch(() => {});

    const emailDetails = buildBookingDetails({
      bookingId: booking.id, customerName: targetUser.name, serviceName,
      stylistName: stylist.name, date: bookingDate, time: bodyWithUser.time, price,
    });
    sendBookingStatusEmail(targetUser.email, emailDetails, "confirmed");

    return Response.json(
      { success: true, data: { ...booking, service: { name: serviceName }, stylist: { name: stylist.name }, date: booking.date.toISOString().split("T")[0], status: "confirmed" } },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/bookings/admin]", err);
    return Response.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }
}
