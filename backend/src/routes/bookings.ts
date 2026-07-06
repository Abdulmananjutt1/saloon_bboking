import { Router, Request, Response } from "express";
import prisma from "../db";
import { validateBooking, hasErrors } from "../validations";
import { BookingStatus } from "@prisma/client";
import { notifyAdmins, notifyClient } from "../lib/push";
import {
  buildBookingDetails,
  sendBookingReceivedEmail,
  sendBookingStatusEmail,
  sendAdminNewBookingEmail,
} from "../lib/email";
import { requireAdmin, AuthRequest } from "../middleware/auth";

const router = Router();

// Helper to map DB Booking to frontend structure
function formatBooking(b: any) {
  return {
    ...b,
    date: b.date.toISOString().split("T")[0],
    status: b.status.toLowerCase(), // frontend expects lowercase (pending, confirmed, etc.)
  };
}

// GET /bookings
router.get("/", async (req: Request, res: Response) => {
  try {
    const { status, email, date } = req.query as Record<string, string>;
    
    const where: any = {};
    if (status) {
      where.status = status.toUpperCase() as BookingStatus;
    }
    if (email) {
      where.customerEmail = { equals: email.toLowerCase(), mode: "insensitive" };
    }
    if (date) {
      where.date = new Date(date);
    }

    const bookings = await prisma.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    res.json({
      success: true,
      data: bookings.map(formatBooking),
      total: bookings.length,
    });
  } catch (err) {
    console.error("[GET /bookings]", err);
    res.status(500).json({ success: false, error: "Failed to fetch bookings" });
  }
});

// GET /bookings/:id
router.get("/:id", async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
    });
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });
    res.json({ success: true, data: formatBooking(booking) });
  } catch (err) {
    res.status(500).json({ success: false, error: "Failed to fetch booking" });
  }
});

// POST /bookings
router.post("/", async (req: Request, res: Response) => {
  try {
    const body = req.body;

    // Validate
    const errors = validateBooking(body);
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

    const isCustomPackage = body.serviceId === null || body.serviceId === "custom" || Array.isArray(body.customServices);

    let serviceId: string;
    let price: number;
    let duration: number;
    let serviceName: string;

    if (isCustomPackage) {
      // Use or create a "Custom Package" service entry
      let customService = await prisma.service.findFirst({ where: { slug: "custom-package" } });
      if (!customService) {
        customService = await prisma.service.create({
          data: {
            name: "Custom Package",
            slug: "custom-package",
            category: "HAIRCUT", // placeholder category
            description: "Custom service package",
            duration: body.customPackageDuration ?? 60,
            price: body.customPackageTotal ?? 0,
            image: "",
            popular: false,
            forGender: "UNISEX",
            isActive: true,
          }
        });
      }
      serviceId = customService.id;
      price = body.customPackageTotal ?? 0;
      duration = body.customPackageDuration ?? 60;
      serviceName = "Custom Package";
    } else {
      // Verify service
      const service = await prisma.service.findUnique({ where: { id: body.serviceId } });
      if (!service) return res.status(422).json({ success: false, errors: { serviceId: "Invalid service" } });
      serviceId = service.id;
      price = service.price;
      duration = service.duration;
      serviceName = service.name;
    }

    // Verify stylist
    const stylist = await prisma.stylist.findUnique({ where: { id: body.stylistId } });
    if (!stylist) return res.status(422).json({ success: false, errors: { stylistId: "Invalid stylist" } });
    if (!stylist.available) return res.status(422).json({ success: false, errors: { stylistId: "This stylist is currently unavailable" } });

    // Time conflict check
    const bookingDate = new Date(body.date);
    const conflict = await prisma.booking.findFirst({
      where: {
        stylistId: body.stylistId,
        date: bookingDate,
        time: body.time,
        status: { not: BookingStatus.CANCELLED }
      }
    });

    if (conflict) {
      return res.status(409).json({
        success: false,
        errors: { time: "This time slot is already booked. Please choose another." },
      });
    }

    // Attempt to match associated user account by email (to link booking)
    const associatedUser = await prisma.user.findUnique({
      where: { email: body.email.trim().toLowerCase() }
    });

    // Upsert client
    let client = await prisma.client.findUnique({
      where: { email: body.email.trim().toLowerCase() }
    });

    if (client) {
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: body.name.trim(),
          phone: body.phone.trim(),
          totalVisits: client.totalVisits + 1,
          totalSpent: client.totalSpent + price,
          lastVisit: bookingDate
        }
      });
    } else {
      client = await prisma.client.create({
        data: {
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          phone: body.phone.trim(),
          totalVisits: 1,
          totalSpent: price,
          lastVisit: bookingDate
        }
      });
    }

    // Generate unique short booking ID (e.g. GS-123456)
    let bookingId = "";
    let isUnique = false;
    while (!isUnique) {
      const num = Math.floor(100000 + Math.random() * 900000);
      bookingId = `GS-${num}`;
      const existing = await prisma.booking.findUnique({ where: { id: bookingId } });
      if (!existing) {
        isUnique = true;
      }
    }

    // Build notes — append custom package details if present
    let notes = body.notes?.trim() || null;
    if (isCustomPackage) {
      const customDetails = [
        ...(body.customServices || []).length > 0 ? [`Services: ${body.customServices.join(", ")}`] : [],
        ...(body.customItems || []).length > 0 ? [`Custom items: ${(body.customItems as any[]).map((i: any) => i.name).join(", ")}`] : [],
      ].join(" | ");
      notes = notes ? `${notes} | ${customDetails}` : customDetails || null;
    }

    // Create Booking
    const booking = await prisma.booking.create({
      data: {
        id: bookingId,
        customerName: body.name.trim(),
        customerEmail: body.email.trim().toLowerCase(),
        customerPhone: body.phone.trim(),
        serviceId,
        stylistId: stylist.id,
        clientId: client.id,
        userId: associatedUser?.id || null,
        date: bookingDate,
        time: body.time,
        duration,
        price,
        notes,
        status: BookingStatus.PENDING
      }
    });

    res.status(201).json({ success: true, data: formatBooking(booking) });

    // ── Push notification to admin ──────────────────────────
    notifyAdmins({
      title: "📅 New Booking!",
      body:  `${body.name.trim()} booked ${serviceName} on ${body.date} at ${body.time}`,
      tag:   `booking-${booking.id}`,
      url:   "/admin/bookings",
      data:  { bookingId: booking.id },
    }).catch(() => {});

    const emailDetails = buildBookingDetails({
      bookingId:    booking.id,
      customerName: body.name.trim(),
      serviceName,
      stylistName:  stylist.name,
      date:         bookingDate,
      time:         body.time,
      price,
    });
    sendBookingReceivedEmail(booking.customerEmail, emailDetails);
    sendAdminNewBookingEmail(emailDetails);

  } catch (err) {
    console.error("[POST /bookings]", err);
    res.status(500).json({ success: false, error: "Failed to create booking" });
  }
});

// PATCH /bookings/:id — update status
router.patch("/:id", async (req: Request, res: Response) => {
  try {
    const { status } = req.body as { status: string };
    const valid = ["pending", "confirmed", "completed", "cancelled"];
    if (!status || !valid.includes(status)) {
      return res.status(422).json({ success: false, error: `Status must be one of: ${valid.join(", ")}` });
    }

    const booking = await prisma.booking.findUnique({
      where: { id: req.params.id },
      include: { service: true, stylist: true },
    });
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

    const updated = await prisma.booking.update({
      where: { id: req.params.id },
      data: { status: status.toUpperCase() as BookingStatus },
    });

    res.json({ success: true, data: formatBooking(updated) });

    // ── Push notification to client on status change ────────
    const statusMessages: Record<string, string> = {
      confirmed:  "✅ Your booking has been confirmed!",
      completed:  "🎉 Your visit is complete. Thank you!",
      cancelled:  "❌ Your booking has been cancelled.",
      pending:    "⏳ Your booking is pending confirmation.",
    };
    const msg = statusMessages[status];
    if (msg && booking.customerEmail) {
      notifyClient(booking.customerEmail, {
        title: "Glamour Studio — Booking Update",
        body:  `${msg} (${updated.id})`,
        tag:   `booking-status-${updated.id}`,
        url:   "/dashboard",
        data:  { bookingId: updated.id, status },
      }).catch(() => {});

      const emailDetails = buildBookingDetails({
        bookingId:    updated.id,
        customerName: booking.customerName,
        serviceName:  booking.service.name,
        stylistName:  booking.stylist.name,
        date:         booking.date,
        time:         booking.time,
        price:        booking.price,
      });
      sendBookingStatusEmail(
        booking.customerEmail,
        emailDetails,
        status as "confirmed" | "completed" | "cancelled" | "pending"
      );
    }
  } catch (err) {
    console.error("[PATCH /bookings/:id]", err);
    res.status(500).json({ success: false, error: "Failed to update booking" });
  }
});

// DELETE /bookings/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const booking = await prisma.booking.findUnique({ where: { id: req.params.id } });
    if (!booking) return res.status(404).json({ success: false, error: "Booking not found" });

    await prisma.booking.delete({ where: { id: req.params.id } });
    res.json({ success: true, message: "Booking deleted" });
  } catch (err) {
    console.error("[DELETE /bookings/:id]", err);
    res.status(500).json({ success: false, error: "Failed to delete booking" });
  }
});

// POST /bookings/admin — admin creates a booking on behalf of a specific user
router.post("/admin", requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const body = req.body;

    // userId is required for admin bookings
    if (!body.userId || typeof body.userId !== "string") {
      return res.status(422).json({ success: false, errors: { userId: "User is required for admin bookings" } });
    }

    // Look up the target user
    const targetUser = await prisma.user.findUnique({ where: { id: body.userId } });
    if (!targetUser) {
      return res.status(422).json({ success: false, errors: { userId: "User not found" } });
    }

    // Override name/email/phone from the target user
    const bodyWithUser = {
      ...body,
      name:  body.name  || targetUser.name,
      email: body.email || targetUser.email,
      phone: body.phone || targetUser.phone,
    };

    const errors = validateBooking(bodyWithUser);
    if (hasErrors(errors)) return res.status(422).json({ success: false, errors });

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
            name: "Custom Package",
            slug: "custom-package",
            category: "HAIRCUT",
            description: "Custom service package",
            duration: bodyWithUser.customPackageDuration ?? 60,
            price: bodyWithUser.customPackageTotal ?? 0,
            image: "",
            popular: false,
            forGender: "UNISEX",
            isActive: true,
          }
        });
      }
      serviceId = customService.id;
      price = bodyWithUser.customPackageTotal ?? 0;
      duration = bodyWithUser.customPackageDuration ?? 60;
      serviceName = "Custom Package";
    } else {
      const service = await prisma.service.findUnique({ where: { id: bodyWithUser.serviceId } });
      if (!service) return res.status(422).json({ success: false, errors: { serviceId: "Invalid service" } });
      serviceId = service.id;
      price = service.price;
      duration = service.duration;
      serviceName = service.name;
    }

    const stylist = await prisma.stylist.findUnique({ where: { id: bodyWithUser.stylistId } });
    if (!stylist) return res.status(422).json({ success: false, errors: { stylistId: "Invalid stylist" } });
    if (!stylist.available) return res.status(422).json({ success: false, errors: { stylistId: "This stylist is currently unavailable" } });

    const bookingDate = new Date(bodyWithUser.date);
    const conflict = await prisma.booking.findFirst({
      where: {
        stylistId: bodyWithUser.stylistId,
        date: bookingDate,
        time: bodyWithUser.time,
        status: { not: BookingStatus.CANCELLED }
      }
    });
    if (conflict) {
      return res.status(409).json({
        success: false,
        errors: { time: "This time slot is already booked. Please choose another." },
      });
    }

    // Upsert client record
    let client = await prisma.client.findUnique({
      where: { email: targetUser.email }
    });
    if (client) {
      client = await prisma.client.update({
        where: { id: client.id },
        data: {
          name: targetUser.name,
          phone: targetUser.phone,
          totalVisits: client.totalVisits + 1,
          totalSpent: client.totalSpent + price,
          lastVisit: bookingDate
        }
      });
    } else {
      client = await prisma.client.create({
        data: {
          name: targetUser.name,
          email: targetUser.email,
          phone: targetUser.phone,
          totalVisits: 1,
          totalSpent: price,
          lastVisit: bookingDate
        }
      });
    }

    // Generate unique booking ID
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
        customerName:  targetUser.name,
        customerEmail: targetUser.email,
        customerPhone: targetUser.phone,
        serviceId,
        stylistId: stylist.id,
        clientId: client.id,
        userId: targetUser.id,
        date: bookingDate,
        time: bodyWithUser.time,
        duration,
        price,
        notes,
        status: BookingStatus.CONFIRMED, // admin bookings start as confirmed
      }
    });

    res.status(201).json({ success: true, data: formatBooking(booking) });

    notifyClient(targetUser.email, {
      title: "📅 Booking Created by Admin",
      body:  `Your appointment for ${serviceName} on ${bodyWithUser.date} at ${bodyWithUser.time} has been confirmed.`,
      tag:   `booking-${booking.id}`,
      url:   "/dashboard",
      data:  { bookingId: booking.id },
    }).catch(() => {});

    const emailDetails = buildBookingDetails({
      bookingId:    booking.id,
      customerName: targetUser.name,
      serviceName,
      stylistName:  stylist.name,
      date:         bookingDate,
      time:         bodyWithUser.time,
      price,
    });
    sendBookingStatusEmail(targetUser.email, emailDetails, "confirmed");

  } catch (err) {
    console.error("[POST /bookings/admin]", err);
    res.status(500).json({ success: false, error: "Failed to create booking" });
  }
});

export default router;
