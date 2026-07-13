import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { SERVICES, STYLISTS } from "@/lib/data/salon";
import { formatPrice, formatDuration } from "@/lib/utils";
import { ROUTES, APP_PHONE } from "@/constants";
import StarRating from "@/components/ui/StarRating";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Clock,
  Coffee,
  Gem,
  Phone,
  Scissors,
  ShieldCheck,
  Sparkles,
  Star,
  UserCheck,
  Users,
  Wand2,
  type LucideIcon,
} from "lucide-react";

interface Props {
  params: Promise<{ id: string }>;
}

type IconItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
};

const INCLUDED_ITEMS: IconItem[] = [
  { icon: UserCheck, title: "Professional Consultation", desc: "Personalized advice before the service begins." },
  { icon: Gem, title: "Premium Products", desc: "Loreal, Wella and Kerastase level care." },
  { icon: Wand2, title: "Expert Technique", desc: "Clean sectioning, styling and finishing detail." },
  { icon: BadgeCheck, title: "Aftercare Guidance", desc: "Simple tips to maintain your look at home." },
  { icon: ShieldCheck, title: "Satisfaction Support", desc: "We make sure the final result feels right." },
  { icon: Coffee, title: "Refreshment Included", desc: "Relax with tea, coffee or juice during service." },
];

const BOOKING_BENEFITS: IconItem[] = [
  { icon: CheckCircle2, title: "Flexible cancellation", desc: "Free cancellation up to 2 hours before." },
  { icon: Gem, title: "Premium finish", desc: "Products and styling finish are included." },
  { icon: UserCheck, title: "Certified stylists", desc: "Book with experienced salon professionals." },
  { icon: Clock, title: "Easy scheduling", desc: "Choose a time that fits your day." },
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) return { title: "Not Found" };
  return { title: `${service.name} - Glamour Studio`, description: service.description };
}

export async function generateStaticParams() {
  return SERVICES.map((s) => ({ id: s.id }));
}

export default async function ServiceDetailPage({ params }: Props) {
  const { id } = await params;
  const service = SERVICES.find((s) => s.id === id);
  if (!service) notFound();

  const relatedServices = SERVICES.filter((s) => s.category === service.category && s.id !== service.id).slice(0, 3);
  const availableStylists = STYLISTS.filter((st) => st.available).slice(0, 4);
  const displayPrice = service.discountedPrice ?? service.price;
  const discountPercent = service.discountedPrice
    ? Math.round(((service.price - service.discountedPrice) / service.price) * 100)
    : 0;
  const serviceAudience = service.forGender === "unisex" ? "Everyone" : service.forGender === "male" ? "Men" : "Women";

  return (
    <>
      <Navbar />
      <main className="service-detail-page site-main">
        <style>{`
          .service-detail-page {
            width: 100%;
            max-width: 100%;
            overflow-x: hidden;
            background: var(--bg-primary);
            color: var(--text-primary);
          }

          .service-detail-hero {
            position: relative;
            height: 540px;
            min-height: 540px;
            display: flex;
            align-items: center;
            overflow: hidden;
            background: #0d0c0a;
            color: #fff7e8;
          }

          .service-detail-hero-bg {
            position: absolute;
            inset: 0;
          }

          .service-detail-hero-bg img {
            transform: scale(1.04);
            filter: saturate(0.95) contrast(1.05);
          }

          .service-detail-hero-bg::after {
            content: "";
            position: absolute;
            inset: 0;
            background:
              linear-gradient(90deg, rgba(8,7,6,0.96) 0%, rgba(8,7,6,0.86) 46%, rgba(8,7,6,0.36) 100%),
              linear-gradient(180deg, rgba(8,7,6,0.2) 0%, rgba(8,7,6,0.88) 100%);
            pointer-events: none;
          }

          .service-detail-hero-inner {
            position: relative;
            z-index: 1;
            width: 100%;
            padding-top: 108px;
            padding-bottom: 52px;
          }

          .service-hero-grid {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(300px, 380px);
            gap: 44px;
            align-items: end;
          }

          .service-breadcrumbs {
            display: flex;
            align-items: center;
            gap: 7px;
            flex-wrap: wrap;
            margin-bottom: 18px;
          }

          .service-breadcrumbs a,
          .service-breadcrumbs span {
            color: rgba(255,247,232,0.64);
            font-size: 0.75rem;
            text-decoration: none;
          }

          .service-breadcrumbs span:last-child {
            color: #fff7e8;
            font-weight: 700;
          }

          .service-breadcrumbs svg {
            color: rgba(255,247,232,0.42);
          }

          .service-category-pill,
          .service-hero-meta span,
          .service-offer-pill {
            display: inline-flex;
            align-items: center;
            gap: 8px;
          }

          .service-category-pill {
            min-height: 34px;
            padding: 0 16px;
            border-radius: 999px;
            border: 1px solid rgba(201,151,59,0.32);
            background: rgba(201,151,59,0.12);
            color: #e4bc6b;
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            margin-bottom: 14px;
          }

          .service-hero-title {
            max-width: 780px;
            color: #fff7e8;
            margin: 0 0 12px;
            font-size: clamp(2.05rem, 4.8vw, 3.45rem);
            text-shadow: 0 12px 36px rgba(0,0,0,0.38);
          }

          .service-hero-description {
            max-width: 690px;
            color: rgba(255,247,232,0.72);
            font-size: 0.92rem;
            line-height: 1.65;
            margin: 0 0 20px;
          }

          .service-hero-meta {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            margin-bottom: 26px;
          }

          .service-hero-meta span {
            min-height: 34px;
            padding: 0 13px;
            border-radius: 999px;
            border: 1px solid rgba(255,255,255,0.12);
            background: rgba(255,255,255,0.07);
            color: rgba(255,247,232,0.78);
            font-size: 0.82rem;
            font-weight: 700;
            backdrop-filter: blur(14px);
            -webkit-backdrop-filter: blur(14px);
          }

          .service-hero-meta svg {
            color: #d9ad57;
          }

          .service-hero-actions {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
          }

          .service-hero-actions .sal-btn {
            min-height: 46px;
          }

          .service-hero-price-card {
            border-radius: 20px;
            border: 1px solid rgba(201,151,59,0.24);
            background: rgba(13,12,10,0.76);
            box-shadow: 0 24px 70px rgba(0,0,0,0.38);
            backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
            padding: 22px;
          }

          .service-price-label {
            color: rgba(255,247,232,0.58);
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            margin-bottom: 8px;
          }

          .service-price-row {
            display: flex;
            align-items: baseline;
            gap: 12px;
            flex-wrap: wrap;
            margin-bottom: 14px;
          }

          .service-price-main {
            color: #e0b96a;
            font-size: clamp(2.2rem, 4vw, 3rem);
            font-weight: 900;
            line-height: 1;
            font-family: var(--font-display), Georgia, serif;
          }

          .service-price-old {
            color: rgba(255,247,232,0.46);
            font-size: 1rem;
            text-decoration: line-through;
          }

          .service-offer-pill {
            width: fit-content;
            min-height: 32px;
            padding: 0 11px;
            border-radius: 999px;
            background: var(--grad-gold-btn);
            color: #0d0c0a;
            font-size: 0.7rem;
            font-weight: 900;
            letter-spacing: 0.08em;
            text-transform: uppercase;
          }

          .service-price-note {
            color: rgba(255,247,232,0.64);
            font-size: 0.82rem;
            line-height: 1.6;
            margin: 18px 0 0;
          }

          .service-detail-content {
            padding: 92px 0;
            background:
              linear-gradient(180deg, var(--bg-primary) 0%, var(--bg-secondary) 100%);
          }

          .service-detail-layout {
            display: grid;
            grid-template-columns: minmax(0, 1fr) minmax(300px, 360px);
            gap: 32px;
            align-items: start;
          }

          .service-content-stack {
            display: grid;
            gap: 28px;
          }

          .service-panel {
            border-radius: 18px;
            border: 1px solid var(--border-light);
            background: var(--bg-card);
            box-shadow: var(--shadow-card);
            padding: 30px;
          }

          .service-panel-header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 18px;
            margin-bottom: 22px;
          }

          .service-panel-title {
            color: var(--text-primary);
            font-size: clamp(1.45rem, 2.5vw, 1.85rem);
            line-height: 1.15;
            margin: 0;
            font-family: var(--font-display), Georgia, serif;
          }

          .service-panel-text {
            color: var(--text-secondary);
            font-size: 0.96rem;
            line-height: 1.85;
            margin: 0;
          }

          .service-panel-text + .service-panel-text {
            margin-top: 18px;
          }

          .service-included-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .service-feature-item {
            display: grid;
            grid-template-columns: 44px minmax(0, 1fr);
            gap: 13px;
            align-items: start;
            padding: 16px;
            border-radius: 14px;
            border: 1px solid var(--border-light);
            background: rgba(255,255,255,0.025);
          }

          .service-feature-icon {
            width: 44px;
            height: 44px;
            border-radius: 12px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--gold);
            background: rgba(201,151,59,0.11);
            border: 1px solid rgba(201,151,59,0.2);
          }

          .service-feature-item h3 {
            color: var(--text-primary);
            font-size: 0.92rem;
            line-height: 1.35;
            margin: 0 0 5px;
          }

          .service-feature-item p {
            color: var(--text-muted);
            font-size: 0.78rem;
            line-height: 1.55;
            margin: 0;
          }

          .service-stylist-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
          }

          .service-stylist-card {
            display: grid;
            grid-template-columns: 64px minmax(0, 1fr);
            gap: 14px;
            align-items: center;
            text-decoration: none;
            padding: 16px;
            border-radius: 16px;
            border: 1px solid var(--border-light);
            background: var(--bg-card2);
            transition: transform 0.25s ease, border-color 0.25s ease, box-shadow 0.25s ease;
          }

          .service-stylist-card:hover {
            transform: translateY(-3px);
            border-color: var(--border-hover);
            box-shadow: 0 18px 44px rgba(201,151,59,0.12);
          }

          .service-stylist-avatar {
            position: relative;
            display: block;
            width: 64px;
            height: 64px;
          }

          .service-stylist-avatar img {
            border-radius: 50%;
            object-fit: cover;
            border: 2px solid rgba(201,151,59,0.22);
          }

          .service-available-dot {
            position: absolute;
            right: 2px;
            bottom: 2px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #34d399;
            border: 2px solid var(--bg-card2);
          }

          .service-stylist-card h3 {
            color: var(--text-primary);
            font-size: 0.92rem;
            margin: 0 0 3px;
            line-height: 1.3;
          }

          .service-stylist-role {
            color: var(--gold);
            font-size: 0.72rem;
            font-weight: 800;
            margin-bottom: 6px;
          }

          .service-stylist-meta {
            display: flex;
            align-items: center;
            gap: 6px;
            flex-wrap: wrap;
          }

          .service-stylist-meta span {
            color: var(--text-muted);
            font-size: 0.68rem;
          }

          .service-related-grid {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 18px;
          }

          .service-related-card {
            display: block;
            overflow: hidden;
            text-decoration: none;
            border-radius: 16px;
            border: 1px solid var(--border-light);
            background: var(--bg-card2);
            transition: transform 0.25s ease, border-color 0.25s ease;
          }

          .service-related-card:hover {
            transform: translateY(-3px);
            border-color: var(--border-hover);
          }

          .service-related-image {
            position: relative;
            display: block;
            height: 132px;
            overflow: hidden;
          }

          .service-related-image img {
            object-fit: cover;
          }

          .service-related-image::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.58) 100%);
          }

          .service-related-body {
            display: block;
            padding: 15px;
          }

          .service-related-body h3 {
            color: var(--text-primary);
            font-size: 0.86rem;
            line-height: 1.35;
            margin: 0 0 10px;
          }

          .service-related-price {
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 10px;
            color: var(--gold);
            font-size: 0.78rem;
            font-weight: 900;
          }

          .service-booking-sidebar {
            position: sticky;
            top: 100px;
            border-radius: 18px;
            border: 1px solid var(--border-light);
            background: var(--bg-card);
            box-shadow: var(--shadow-card);
            padding: 26px;
          }

          .service-sidebar-price {
            text-align: center;
            padding-bottom: 24px;
            border-bottom: 1px solid var(--border-light);
            margin-bottom: 22px;
          }

          .service-sidebar-price small {
            color: var(--text-muted);
            display: block;
            font-size: 0.72rem;
            font-weight: 800;
            letter-spacing: 0.14em;
            text-transform: uppercase;
            margin-bottom: 7px;
          }

          .service-sidebar-price strong {
            color: var(--gold);
            display: block;
            font-size: clamp(2.1rem, 4vw, 2.7rem);
            line-height: 1;
            font-family: var(--font-display), Georgia, serif;
          }

          .service-sidebar-old {
            color: var(--text-muted);
            text-decoration: line-through;
            font-size: 0.92rem;
            margin-bottom: 6px;
          }

          .service-sidebar-duration {
            display: inline-flex;
            align-items: center;
            gap: 7px;
            margin-top: 13px;
            color: var(--text-secondary);
            font-size: 0.82rem;
            font-weight: 700;
          }

          .service-booking-sidebar .sal-btn {
            width: 100%;
            min-height: 52px;
            margin-bottom: 22px;
          }

          .service-sidebar-list {
            display: grid;
            gap: 14px;
            padding-top: 2px;
          }

          .service-sidebar-list h3 {
            color: var(--text-primary);
            font-size: 0.92rem;
            margin: 0 0 2px;
          }

          .service-sidebar-benefit {
            display: grid;
            grid-template-columns: 34px minmax(0, 1fr);
            gap: 11px;
            align-items: start;
          }

          .service-sidebar-benefit span {
            width: 34px;
            height: 34px;
            border-radius: 10px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            color: var(--gold);
            background: rgba(201,151,59,0.1);
            border: 1px solid rgba(201,151,59,0.18);
          }

          .service-sidebar-benefit strong {
            display: block;
            color: var(--text-primary);
            font-size: 0.8rem;
            line-height: 1.3;
          }

          .service-sidebar-benefit p {
            color: var(--text-muted);
            font-size: 0.72rem;
            line-height: 1.45;
            margin: 3px 0 0;
          }

          .service-stats-card {
            margin-top: 22px;
            padding: 18px;
            border-radius: 14px;
            border: 1px solid rgba(201,151,59,0.16);
            background: rgba(201,151,59,0.06);
          }

          .service-stats-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
          }

          .service-stat {
            text-align: center;
          }

          .service-stat strong {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            gap: 5px;
            color: var(--gold);
            font-size: 1.35rem;
            line-height: 1;
            font-family: var(--font-display), Georgia, serif;
          }

          .service-stat span {
            display: block;
            color: var(--text-muted);
            font-size: 0.7rem;
            margin-top: 5px;
          }

          .service-final-cta {
            position: relative;
            overflow: hidden;
            padding: 78px 0;
            background: linear-gradient(135deg, #0d0c0a 0%, #1c1508 44%, #0d0c0a 100%);
            color: #fff7e8;
          }

          .service-final-cta::before {
            content: "";
            position: absolute;
            inset: 0;
            background:
              radial-gradient(circle at 50% 50%, rgba(201,151,59,0.14), transparent 42%),
              linear-gradient(90deg, rgba(255,255,255,0.04), transparent 40%, rgba(255,255,255,0.04));
            pointer-events: none;
          }

          .service-final-cta-inner {
            position: relative;
            z-index: 1;
            text-align: center;
            max-width: 820px;
            margin: 0 auto;
          }

          .service-final-cta h2 {
            color: #fff7e8;
            margin-bottom: 16px;
          }

          .service-final-cta p {
            color: rgba(255,247,232,0.7);
            max-width: 560px;
            margin: 0 auto 30px;
            line-height: 1.8;
          }

          .service-final-actions,
          .service-cta-stats {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 14px;
          }

          .service-cta-stats {
            max-width: 620px;
            margin: 34px auto 0;
            padding: 20px;
            border-radius: 16px;
            border: 1px solid rgba(255,255,255,0.1);
            background: rgba(255,255,255,0.04);
          }

          .service-cta-stats div {
            min-width: 120px;
            text-align: center;
          }

          .service-cta-stats strong {
            display: block;
            color: #e0b96a;
            font-size: 1.35rem;
            line-height: 1;
            font-family: var(--font-display), Georgia, serif;
          }

          .service-cta-stats span {
            display: block;
            color: rgba(255,247,232,0.58);
            font-size: 0.76rem;
            margin-top: 6px;
          }

          [data-theme="light"] .service-feature-item,
          [data-theme="light"] .service-stylist-card,
          [data-theme="light"] .service-related-card {
            background: #fbf8f2;
            border-color: rgba(0,0,0,0.08);
          }

          [data-theme="light"] .service-panel,
          [data-theme="light"] .service-booking-sidebar {
            background: #ffffff;
            border-color: rgba(0,0,0,0.08);
            box-shadow: 0 16px 45px rgba(44,31,13,0.08);
          }

          @media (max-width: 1080px) {
            .service-detail-hero {
              height: auto;
              min-height: 540px;
            }

            .service-hero-grid,
            .service-detail-layout {
              grid-template-columns: 1fr;
            }

            .service-hero-price-card,
            .service-booking-sidebar {
              max-width: 520px;
            }

            .service-booking-sidebar {
              position: static;
            }
          }

          @media (max-width: 820px) {
            .service-detail-hero {
              min-height: auto;
            }

            .service-detail-hero-inner {
              padding-top: 118px;
              padding-bottom: 58px;
            }

            .service-detail-content {
              padding: 64px 0;
            }

            .service-panel {
              padding: 24px;
            }

            .service-included-grid,
            .service-stylist-grid,
            .service-related-grid {
              grid-template-columns: 1fr;
            }
          }

          @media (max-width: 520px) {
            .service-detail-hero-inner {
              padding-top: 104px;
            }

            .service-hero-actions .sal-btn,
            .service-final-actions .sal-btn {
              width: 100%;
            }

            .service-hero-price-card,
            .service-booking-sidebar,
            .service-panel {
              padding: 20px;
              border-radius: 16px;
            }
          }
        `}</style>

        <section className="service-detail-hero">
          <div className="service-detail-hero-bg">
            <Image src={service.image} alt={service.name} fill className="object-cover" priority sizes="100vw" />
          </div>

          <div className="sal-container service-detail-hero-inner">
            <div className="service-hero-grid">
              <div>
                <nav className="service-breadcrumbs" aria-label="Breadcrumb">
                  <Link href={ROUTES.HOME}>Home</Link>
                  <ChevronRight size={12} />
                  <Link href={ROUTES.SERVICES}>Services</Link>
                  <ChevronRight size={12} />
                  <span>{service.name}</span>
                </nav>

                <span className="service-category-pill">
                  <Scissors size={14} />
                  {service.category} service
                </span>

                <h1 className="sal-h1 service-hero-title">{service.name}</h1>
                <p className="service-hero-description">{service.description}</p>

                <div className="service-hero-meta">
                  <span>
                    <Clock size={16} />
                    {formatDuration(service.duration)}
                  </span>
                  <span>
                    <Users size={16} />
                    For {serviceAudience}
                  </span>
                  {service.popular && (
                    <span>
                      <Star size={16} />
                      Popular choice
                    </span>
                  )}
                </div>

                <div className="service-hero-actions">
                  <Link href={`${ROUTES.BOOK}?service=${service.id}`} className="sal-btn sal-btn-gold">
                    <CalendarDays size={16} />
                    Book This Service
                  </Link>
                  <Link href={ROUTES.SERVICES} className="sal-btn sal-btn-outline">
                    Browse All Services
                    <ArrowRight size={15} />
                  </Link>
                </div>
              </div>

              <aside className="service-hero-price-card" aria-label="Service price summary">
                <p className="service-price-label">Starting from</p>
                <div className="service-price-row">
                  <strong className="service-price-main">{formatPrice(displayPrice)}</strong>
                  {service.discountedPrice && <span className="service-price-old">{formatPrice(service.price)}</span>}
                </div>
                {service.discountedPrice && (
                  <span className="service-offer-pill">
                    <Sparkles size={13} />
                    Save {discountPercent}%
                  </span>
                )}
                <p className="service-price-note">
                  Includes consultation, premium product finish and service-specific aftercare guidance.
                </p>
              </aside>
            </div>
          </div>
        </section>

        <section className="service-detail-content">
          <div className="sal-container">
            <div className="service-detail-layout">
              <div className="service-content-stack">
                <article className="service-panel">
                  <div className="service-panel-header">
                    <h2 className="service-panel-title">
                      About This <span className="text-gold">Service</span>
                    </h2>
                  </div>
                  <p className="service-panel-text">{service.description}</p>
                  <p className="service-panel-text">
                    Our stylists use a calm consultation process, premium products and precise finishing
                    techniques so the final result feels polished, wearable and personal to you.
                  </p>
                </article>

                <article className="service-panel">
                  <div className="service-panel-header">
                    <h2 className="service-panel-title">
                      What&apos;s <span className="text-gold">Included</span>
                    </h2>
                  </div>
                  <div className="service-included-grid">
                    {INCLUDED_ITEMS.map(({ icon: Icon, title, desc }) => (
                      <div key={title} className="service-feature-item">
                        <span className="service-feature-icon">
                          <Icon size={19} />
                        </span>
                        <div>
                          <h3>{title}</h3>
                          <p>{desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </article>

                <article className="service-panel">
                  <div className="service-panel-header">
                    <h2 className="service-panel-title">
                      Available <span className="text-gold">Stylists</span>
                    </h2>
                    <Link href={ROUTES.STYLISTS} className="sal-btn sal-btn-ghost">
                      View All
                      <ArrowRight size={14} />
                    </Link>
                  </div>

                  <div className="service-stylist-grid">
                    {availableStylists.map((stylist) => (
                      <Link
                        key={stylist.id}
                        href={`${ROUTES.BOOK}?service=${service.id}&stylist=${stylist.id}`}
                        className="service-stylist-card"
                      >
                        <span className="service-stylist-avatar">
                          <Image src={stylist.avatar} alt={stylist.name} fill sizes="64px" />
                          <span className="service-available-dot" />
                        </span>
                        <div>
                          <h3>{stylist.name}</h3>
                          <p className="service-stylist-role">{stylist.role}</p>
                          <span className="service-stylist-meta">
                            <StarRating rating={stylist.rating} size="sm" />
                            <span>{stylist.reviewCount.toLocaleString()} reviews</span>
                            <span>{stylist.experience}y exp.</span>
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </article>

                {relatedServices.length > 0 && (
                  <article className="service-panel">
                    <div className="service-panel-header">
                      <h2 className="service-panel-title">
                        Related <span className="text-gold">Services</span>
                      </h2>
                    </div>
                    <div className="service-related-grid">
                      {relatedServices.map((related) => (
                        <Link key={related.id} href={`${ROUTES.SERVICES}/${related.id}`} className="service-related-card">
                          <span className="service-related-image">
                            <Image src={related.image} alt={related.name} fill sizes="(max-width: 820px) 100vw, 25vw" />
                          </span>
                          <div className="service-related-body">
                            <h3>{related.name}</h3>
                            <span className="service-related-price">
                              {formatPrice(related.discountedPrice ?? related.price)}
                              <ChevronRight size={14} />
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </article>
                )}
              </div>

              <aside className="service-booking-sidebar">
                <div className="service-sidebar-price">
                  <small>Service price</small>
                  {service.discountedPrice && <p className="service-sidebar-old">{formatPrice(service.price)}</p>}
                  <strong>{formatPrice(displayPrice)}</strong>
                  <span className="service-sidebar-duration">
                    <Clock size={14} />
                    {formatDuration(service.duration)}
                  </span>
                </div>

                <Link href={`${ROUTES.BOOK}?service=${service.id}`} className="sal-btn sal-btn-gold">
                  <CalendarDays size={17} />
                  Book This Service Now
                </Link>

                <div className="service-sidebar-list">
                  <h3>Why Book With Us</h3>
                  {BOOKING_BENEFITS.map(({ icon: Icon, title, desc }) => (
                    <div key={title} className="service-sidebar-benefit">
                      <span>
                        <Icon size={16} />
                      </span>
                      <div>
                        <strong>{title}</strong>
                        <p>{desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="service-stats-card">
                  <div className="service-stats-grid">
                    <div className="service-stat">
                      <strong>
                        4.9
                        <Star size={15} fill="currentColor" />
                      </strong>
                      <span>Average rating</span>
                    </div>
                    <div className="service-stat">
                      <strong>500+</strong>
                      <span>Bookings</span>
                    </div>
                  </div>
                </div>
              </aside>
            </div>
          </div>
        </section>

        <section className="service-final-cta">
          <div className="sal-container">
            <div className="service-final-cta-inner">
              <h2 className="sal-h2">
                Ready to book <span className="text-gold">{service.name}</span>?
              </h2>
              <p>Choose your time online or call the studio for quick help with this service.</p>

              <div className="service-final-actions">
                <Link href={`${ROUTES.BOOK}?service=${service.id}`} className="sal-btn sal-btn-gold">
                  <CalendarDays size={17} />
                  Book Now
                </Link>
                <Link href={`tel:${APP_PHONE}`} className="sal-btn sal-btn-outline">
                  <Phone size={17} />
                  Call to Book
                </Link>
              </div>

              <div className="service-cta-stats">
                <div>
                  <strong>24/7</strong>
                  <span>Online booking</span>
                </div>
                <div>
                  <strong>100%</strong>
                  <span>Service care</span>
                </div>
                <div>
                  <strong>15+</strong>
                  <span>Expert stylists</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
