// ════════════════════════════════════════
//  Database Seed — Glamour Studio
//  Only seeds essential catalog data + admin account
// ════════════════════════════════════════

import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, ServiceCategory, Gender, UserRole } from "../node_modules/.prisma/client";
import { hashPassword } from "../src/server/lib/hash";

const pool    = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma  = new PrismaClient({ adapter } as any);

async function main() {
  console.log("🌱 Seeding database...");

  // ── Cleanup ──────────────────────────────────
  await prisma.chatMessage.deleteMany();
  await prisma.review.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.stylistSlot.deleteMany();
  await prisma.stylistSpecialty.deleteMany();
  await prisma.stylist.deleteMany();
  await prisma.service.deleteMany();
  await prisma.client.deleteMany();
  await prisma.galleryImage.deleteMany();
  await prisma.user.deleteMany();

  // ── Admin User ───────────────────────────────
  await prisma.user.create({
    data: {
      name:         "Admin",
      email:        "admin@glamourstudio.pk",
      phone:        "0300-0000000",
      passwordHash:  hashPassword("admin123A"),
      role:          UserRole.ADMIN,
      emailVerified: true,
      emailVerifiedAt: new Date(),
    },
  });
  console.log("✅ Admin user created");

  // ── Services (catalog) ───────────────────────
  const services = await Promise.all([
    prisma.service.create({ data: { name: "Premium Haircut & Style",    slug: "premium-haircut",      category: ServiceCategory.HAIRCUT, description: "Expert cut tailored to your face shape, lifestyle, and personal style. Includes wash, cut, blow-dry, and finishing.", duration: 60,  price: 2500,  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", popular: true,  forGender: Gender.UNISEX } }),
    prisma.service.create({ data: { name: "Signature Beard Grooming",   slug: "beard-grooming",       category: ServiceCategory.BEARD,   description: "Full beard shaping, trimming, hot towel treatment, and beard oil finish for a sharp, polished look.",                 duration: 45,  price: 1500,  image: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", popular: true,  forGender: Gender.MALE   } }),
    prisma.service.create({ data: { name: "Hair Color & Highlights",    slug: "hair-color",           category: ServiceCategory.COLOR,   description: "Full-color or partial highlights using premium Loreal & Wella products. Consultation included.",                       duration: 120, price: 6500,  discountedPrice: 5500, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", popular: true,  forGender: Gender.UNISEX } }),
    prisma.service.create({ data: { name: "Gold Facial",                slug: "gold-facial",          category: ServiceCategory.FACIAL,  description: "24k gold infused facial treatment that brightens, firms, and rejuvenates your skin for a radiant glow.",               duration: 75,  price: 4500,  image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", popular: true,  forGender: Gender.FEMALE } }),
    prisma.service.create({ data: { name: "Deep Tissue Massage",        slug: "deep-tissue-massage",  category: ServiceCategory.MASSAGE, description: "Relieve muscle tension and stress with our therapeutic deep tissue massage using aromatic oils.",                       duration: 60,  price: 3500,  image: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", popular: false, forGender: Gender.UNISEX } }),
    prisma.service.create({ data: { name: "Nail Art & Manicure",        slug: "nail-art",             category: ServiceCategory.NAILS,   description: "Gel manicure with custom nail art designs. Includes shaping, cuticle care, and gel polish.",                           duration: 60,  price: 2000,  image: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", popular: false, forGender: Gender.FEMALE } }),
    prisma.service.create({ data: { name: "Bridal Package",             slug: "bridal-package",       category: ServiceCategory.BRIDAL,  description: "Complete bridal makeover — hair styling, makeup, facial, and nails. Our most luxurious experience.",                    duration: 240, price: 25000, image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80", popular: true,  forGender: Gender.FEMALE } }),
    prisma.service.create({ data: { name: "Keratin Treatment",          slug: "keratin-treatment",    category: ServiceCategory.KERATIN, description: "Professional keratin smoothing treatment for frizz-free, silky straight hair lasting 3–6 months.",                    duration: 150, price: 9000,  discountedPrice: 7500, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", popular: false, forGender: Gender.UNISEX } }),
    prisma.service.create({ data: { name: "Waxing — Full Body",         slug: "waxing-full-body",     category: ServiceCategory.WAXING,  description: "Smooth, long-lasting hair removal using premium strip and hard wax. Gentle on sensitive skin.",                         duration: 90,  price: 4000,  image: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", popular: false, forGender: Gender.FEMALE } }),
    prisma.service.create({ data: { name: "Kids Haircut",               slug: "kids-haircut",         category: ServiceCategory.HAIRCUT, description: "Fun, gentle haircut for kids under 12. Includes wash, cut, and a little treat at the end!",                           duration: 30,  price: 1000,  image: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", popular: false, forGender: Gender.UNISEX } }),
    prisma.service.create({ data: { name: "Hair Spa Treatment",         slug: "hair-spa",             category: ServiceCategory.HAIRCUT, description: "Deep conditioning hair spa with steam and protein treatment for strong, shiny, healthy hair.",                          duration: 90,  price: 3500,  image: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", popular: true,  forGender: Gender.UNISEX } }),
    prisma.service.create({ data: { name: "Eyebrow Threading & Tint",   slug: "eyebrow-threading",    category: ServiceCategory.FACIAL,  description: "Precise eyebrow shaping via threading followed by tinting for defined, bold brows.",                                   duration: 30,  price: 800,   image: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80", popular: false, forGender: Gender.FEMALE } }),
  ]);
  console.log(`✅ ${services.length} services created`);

  // ── Stylists (catalog) ───────────────────────
  const stylistsData = [
    { name: "Ayesha Khan",  role: "Senior Hair Stylist",        avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&q=80", bio: "With 9 years of expertise, Ayesha transforms hair with precision coloring and creative cuts. Certified by Loreal Paris.",          experience: 9,  rating: 4.9, reviewCount: 842,  available: true,  specialties: ["Hair Color", "Balayage", "Bridal"],               slots: ["10:00 AM", "11:30 AM", "02:00 PM", "04:00 PM", "06:00 PM"] },
    { name: "Bilal Akhtar", role: "Master Barber",               avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&q=80", bio: "Bilal is a master of the blade. Known for flawless fades and razor-sharp beard artistry with 12 years of experience.",               experience: 12, rating: 4.8, reviewCount: 1120, available: true,  specialties: ["Beard Design", "Fades", "Classic Cuts"],           slots: ["09:00 AM", "10:30 AM", "12:00 PM", "03:00 PM", "05:30 PM"] },
    { name: "Sana Mirza",   role: "Beauty & Skin Specialist",    avatar: "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80", bio: "Sana is a certified esthetician specializing in advanced facial treatments and skin rejuvenation techniques.",                        experience: 7,  rating: 4.9, reviewCount: 634,  available: true,  specialties: ["Facials", "Waxing", "Skincare"],                    slots: ["10:00 AM", "11:00 AM", "01:00 PM", "03:30 PM", "05:00 PM"] },
    { name: "Hamza Raza",   role: "Hair Coloring Expert",        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&q=80", bio: "Hamza brings vibrant hair transformations to life. Trained at Wella Professional Academy with expertise in modern coloring.",         experience: 6,  rating: 4.7, reviewCount: 487,  available: false, specialties: ["Global Color", "Highlights", "Keratin"],            slots: ["09:30 AM", "11:00 AM", "02:30 PM", "04:30 PM"] },
    { name: "Zara Hussain", role: "Nail Artist",                 avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&q=80", bio: "Zara turns nails into tiny canvases. Her intricate nail art designs have been featured in multiple fashion publications.",            experience: 5,  rating: 5.0, reviewCount: 329,  available: true,  specialties: ["Nail Art", "Gel Nails", "Manicure & Pedicure"],     slots: ["10:30 AM", "12:00 PM", "02:00 PM", "04:00 PM", "06:30 PM"] },
    { name: "Usman Ali",    role: "Massage Therapist",           avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&q=80", bio: "Usman is a certified massage therapist trained in multiple techniques to relieve stress and restore wellbeing.",                      experience: 8,  rating: 4.8, reviewCount: 276,  available: true,  specialties: ["Deep Tissue", "Swedish", "Head Massage"],          slots: ["09:00 AM", "11:00 AM", "01:00 PM", "03:00 PM", "05:00 PM"] },
  ];

  const stylists = await Promise.all(
    stylistsData.map((s) =>
      prisma.stylist.create({
        data: {
          name: s.name, role: s.role, avatar: s.avatar, bio: s.bio,
          experience: s.experience, rating: s.rating, reviewCount: s.reviewCount,
          available: s.available,
          specialties: { create: s.specialties.map((name) => ({ name })) },
          slots:       { create: s.slots.map((time) => ({ time })) },
        },
      })
    )
  );
  console.log(`✅ ${stylists.length} stylists created`);

  // ── Gallery (catalog) ────────────────────────
  await Promise.all([
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", category: ServiceCategory.HAIRCUT, caption: "Modern Bob Cut",    sortOrder: 1 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&q=80", category: ServiceCategory.BEARD,   caption: "Sharp Beard Fade",  sortOrder: 2 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=80", category: ServiceCategory.COLOR,   caption: "Blonde Balayage",   sortOrder: 3 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80", category: ServiceCategory.FACIAL,  caption: "Gold Facial Glow",  sortOrder: 4 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1604654894610-df63bc536371?w=600&q=80", category: ServiceCategory.NAILS,   caption: "Floral Nail Art",   sortOrder: 5 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1487412912498-0447578fcca8?w=600&q=80", category: ServiceCategory.BRIDAL,  caption: "Bridal Updo",       sortOrder: 6 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1522338242992-e1a54906a8da?w=600&q=80", category: ServiceCategory.HAIRCUT, caption: "Textured Layers",   sortOrder: 7 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80", category: ServiceCategory.FACIAL,  caption: "Spa Treatment",     sortOrder: 8 } }),
    prisma.galleryImage.create({ data: { src: "https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&q=80", category: ServiceCategory.HAIRCUT, caption: "Classic Trim",      sortOrder: 9 } }),
  ]);
  console.log("✅ 9 gallery images created");

  console.log("\n🎉 Database seeded successfully! (admin + catalog only)");
}

main()
  .catch((e) => { console.error("❌ Seed error:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
