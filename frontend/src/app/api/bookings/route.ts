import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { validateBooking, hasErrors } from "@/server/validations";
import { BookingStatus } from "@prisma/client";
import { notifyAdmins } from "@/server/lib/push";
import { buildBookingDetails, sendBookingReceivedEmail, sendAdminNewBookingEmail } from "@/server/lib/email";

function formatBooking(b: any) {
  return {
    ...b,
    serviceName: b.serviceName ?? b.service?.name ?? "Appointment",
    stylistName: b.stylistName ?? b.stylist?.name ?? "Glamour Studio",
    date: b.date.toISOString().split("T")[0],
    status: b.status.toLowerCase(),
  };
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = req.nextUrl;
    const status = searchParams.get("status");
    const email  = searchParams.get("email");
    const date   = searchParams.get("date");

    const where: any = {};
    if (status) where.status = status.toUpperCase() as BookingStatus;
    if (email)  where.customerEmail = { equals: email.toLowerCase(), mode: "insensitive" };
    if (date)   where.date = new Date(date);

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        service: { select: { name: true } },
        stylist: { select: { name: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json({ success: true, data: bookings.map(formatBooking), total: bookings.length });
  } catch (err) {
    console.error("[GET /api/bookings]", err);
    return Response.json({ success: false, error: "Failed to fetch bookings" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const errors = validateBooking(body);
    if (hasErrors(errors)) return Response.json({ success: false, errors }, { status: 422 });

    const isCustomPackage = body.serviceId === null || body.serviceId === "custom" || Array.isArray(body.customServices);

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
            duration: body.customPackageDuration ?? 60,
            price: body.customPackageTotal ?? 0,
            image: "", popular: false, forGender: "UNISEX", isActive: true,
          },
        });
      }
      serviceId = customService.id;
      price = body.customPackageTotal ?? 0;
      duration = body.customPackageDuration ?? 60;
      serviceName = "Custom Package";
    } else {
      const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
      if (!service) return Response.json({ success: false, errors: { serviceId: "Invalid service" } }, { status: 422 });
      serviceId = service.id;
      price = service.price;
      duration = service.duration;
      serviceName = service.name;
    }

    const stylist = await prisma.stylist.findUnique({ where: { id: body.stylistId } });
    if (!stylist) return Response.json({ success: false, errors: { stylistId: "Invalid stylist" } }, { status: 422 });
    if (!stylist.available) return Response.json({ success: false, errors: { stylistId: "This stylist is currently unavailable" } }, { status: 422 });

    const bookingDate = new Date(body.date);
    const conflict = await prisma.booking.findFirst({
      where: { stylistId: body.stylistId, date: bookingDate, time: body.time, status: { not: BookingStatus.CANCELLED } },
    });
    if (conflict) {
      return Response.json({ success: false, errors: { time: "This time slot is already booked. Please choose another." } }, { status: 409 });
    }

    const associatedUser = await prisma.user.findUnique({ where: { email: body.email.trim().toLowerCase() } });

    let client = await prisma.client.findUnique({ where: { email: body.email.trim().toLowerCase() } });
    if (client) {
      client = await prisma.client.update({
        where: { id: client.id },
        data: { name: body.name.trim(), phone: body.phone.trim(), totalVisits: client.totalVisits + 1, totalSpent: client.totalSpent + price, lastVisit: bookingDate },
      });
    } else {
      client = await prisma.client.create({
        data: { name: body.name.trim(), email: body.email.trim().toLowerCase(), phone: body.phone.trim(), totalVisits: 1, totalSpent: price, lastVisit: bookingDate },
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

    let notes = body.notes?.trim() || null;
    if (isCustomPackage) {
      const customDetails = [
        ...(body.customServices || []).length > 0 ? [`Services: ${body.customServices.join(", ")}`] : [],
        ...(body.customItems || []).length > 0 ? [`Custom items: ${(body.customItems as any[]).map((i: any) => i.name).join(", ")}`] : [],
      ].join(" | ");
      notes = notes ? `${notes} | ${customDetails}` : customDetails || null;
    }

    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        customerName: body.name.trim(),
        customerEmail: body.email.trim().toLowerCase(),
        customerPhone: body.phone.trim(),
        serviceId, stylistId: stylist.id, clientId: client.id,
        userId: associatedUser?.id || null,
        date: bookingDate, time: body.time, duration, price, notes,
        status: BookingStatus.PENDING,
      },
    });

    notifyAdmins({
      title: "📅 New Booking!",
      body: `${body.name.trim()} booked ${serviceName} on ${body.date} at ${body.time}`,
      tag: `booking-${booking.id}`,
      url: "/admin/bookings",
      data: { bookingId: booking.id },
    }).catch(() => {});

    const emailDetails = buildBookingDetails({
      bookingId: booking.id, customerName: body.name.trim(), serviceName,
      stylistName: stylist.name, date: bookingDate, time: body.time, price,
    });
    sendBookingReceivedEmail(booking.customerEmail, emailDetails);
    sendAdminNewBookingEmail(emailDetails);

    return Response.json(
      { success: true, data: formatBooking({ ...booking, service: { name: serviceName }, stylist: { name: stylist.name } }) },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/bookings]", err);
    return Response.json({ success: false, error: "Failed to create booking" }, { status: 500 });
  }
}
