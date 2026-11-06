import { NextRequest } from "next/server";
import prisma from "@/server/db";
import { ServiceCategory, Gender } from "@prisma/client";

function slugify(str: string): string {
  return str.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
}

async function uniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  let suffix = 0;
  while (true) {
    const candidate = suffix === 0 ? slug : `${slug}-${suffix}`;
    const existing = await prisma.service.findUnique({ where: { slug: candidate } });
    if (!existing || existing.id === excludeId) return candidate;
    suffix++;
  }
}

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      where: { isActive: true },
      orderBy: [{ category: "asc" }, { name: "asc" }],
    });
    return Response.json({ success: true, data: services });
  } catch (err) {
    console.error("[GET /api/services]", err);
    return Response.json({ success: false, error: "Failed to fetch services" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const { name, category, description, duration, price, discountedPrice, image, popular, forGender } = await req.json();

    if (!name || !category || !description || !duration || !price) {
      return Response.json({ success: false, error: "name, category, description, duration, price are required" }, { status: 422 });
    }

    if (!Object.values(ServiceCategory).includes(category)) {
      return Response.json({ success: false, error: `Invalid category: ${category}` }, { status: 422 });
    }

    const slug = await uniqueSlug(name);
    const service = await prisma.service.create({
      data: {
        name: name.trim(), slug, category: category as ServiceCategory,
        description: description.trim(),
        duration: Number(duration), price: Number(price),
        discountedPrice: discountedPrice ? Number(discountedPrice) : null,
        image: image?.trim() || "",
        popular: popular === true || popular === "true",
        forGender: (forGender as Gender) || "UNISEX",
        isActive: true,
      },
    });

    return Response.json({ success: true, data: service }, { status: 201 });
  } catch (err) {
    console.error("[POST /api/services]", err);
    return Response.json({ success: false, error: "Failed to create service" }, { status: 500 });
  }
}
