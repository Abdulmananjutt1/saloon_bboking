import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { ServiceCategory, Gender } from "@prisma/client";

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  const slugify = (str: string) =>
    str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.service.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix++;
  }
}

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const service = await prisma.service.findUnique({ where: { id } });
    if (!service) return Response.json({ success: false, error: "Service not found" }, { status: 404 });
    return Response.json({ success: true, data: service });
  } catch (err) {
    return Response.json({ success: false, error: "Failed to fetch service" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { name, category, description, duration, price, discountedPrice, image, popular, forGender, isActive } = await req.json();

    let slug: string | undefined;
    if (name) slug = await uniqueSlug(name, id);

    if (category && !Object.values(ServiceCategory).includes(category)) {
      return Response.json({ success: false, error: `Invalid category: ${category}` }, { status: 422 });
    }

    const service = await prisma.service.update({
      where: { id },
      data: {
        ...(name        !== undefined && { name: name.trim(), slug }),
        ...(category    !== undefined && { category: category as ServiceCategory }),
        ...(description !== undefined && { description: description.trim() }),
        ...(duration    !== undefined && { duration: Number(duration) }),
        ...(price       !== undefined && { price: Number(price) }),
        ...(discountedPrice !== undefined && { discountedPrice: discountedPrice ? Number(discountedPrice) : null }),
        ...(image       !== undefined && { image: image.trim() }),
        ...(popular     !== undefined && { popular: popular === true || popular === "true" }),
        ...(forGender   !== undefined && { forGender: forGender as Gender }),
        ...(isActive    !== undefined && { isActive: Boolean(isActive) }),
      },
    });

    return Response.json({ success: true, data: service });
  } catch (err) {
    console.error("[PATCH /api/services/:id]", err);
    return Response.json({ success: false, error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    await prisma.service.update({ where: { id }, data: { isActive: false } });
    return Response.json({ success: true, message: "Service removed" });
  } catch (err) {
    console.error("[DELETE /api/services/:id]", err);
    return Response.json({ success: false, error: "Failed to delete service" }, { status: 500 });
  }
}
