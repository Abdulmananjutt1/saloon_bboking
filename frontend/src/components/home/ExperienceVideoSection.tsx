import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CalendarDays, CheckCircle2, Clock, Play, Scissors, Sparkles, Wand2 } from "lucide-react";
import { ROUTES } from "@/constants";

const HOME_VIDEO_URL = process.env.NEXT_PUBLIC_HOME_VIDEO_URL?.trim() || "/assets/video.mp4";
const HOME_VIDEO_POSTER =
  process.env.NEXT_PUBLIC_HOME_VIDEO_POSTER ??
  "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=1400&q=85";

const SERVICE_STEPS = [
  {
    icon: Sparkles,
    title: "Consult first",
    text: "We understand your face shape, routine and event before the styling starts.",
  },
  {
    icon: Scissors,
    title: "Style with detail",
    text: "Clean sections, premium products and a finish that looks polished in real life.",
  },
  {
    icon: Wand2,
    title: "Final reveal",
    text: "You leave with a camera-ready look and easy aftercare guidance.",
  },
];

const QUICK_WINS = ["Private styling space", "Premium product finish", "Instant online booking"];

export default function ExperienceVideoSection() {
  return (
    <section className="experience-cinema-section">
      <style>{`
        .experience-cinema-section {
          position: relative;
          overflow: hidden;
          padding: 88px 0;
          background:
            linear-gradient(180deg, #0d0c0a 0%, #15100a 52%, #0d0c0a 100%);
          color: #fff7e8;
        }

        .experience-cinema-section::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(90deg, rgba(201,151,59,0.12), transparent 36%, rgba(255,255,255,0.04)),
            radial-gradient(circle at 16% 12%, rgba(201,151,59,0.18), transparent 30%),
            radial-gradient(circle at 84% 86%, rgba(255,255,255,0.08), transparent 28%);
          pointer-events: none;
        }

        .experience-cinema-inner {
          position: relative;
          z-index: 1;
        }

        .experience-cinema-head {
          display: grid;
          grid-template-columns: minmax(0, 0.95fr) minmax(300px, 0.62fr);
          gap: 34px;
          align-items: end;
          margin-bottom: 28px;
        }

        .experience-cinema-section .sal-eyebrow {
          color: #d9ad57;
        }

        .experience-cinema-title {
          max-width: 760px;
          margin: 0;
          color: #fff7e8;
          line-height: 1.05;
        }

        .experience-cinema-copy {
          max-width: 460px;
          color: rgba(255,247,232,0.72);
          font-size: 0.95rem;
          line-height: 1.7;
          margin: 0;
        }

        .experience-cinema-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(320px, 0.75fr);
          gap: 20px;
          align-items: stretch;
        }

        .experience-video-frame {
          position: relative;
          min-height: 500px;
          border-radius: 24px;
          overflow: hidden;
          background: #050505;
          border: 1px solid rgba(201,151,59,0.22);
          box-shadow: 0 34px 90px rgba(0,0,0,0.48);
          isolation: isolate;
        }

        .experience-video,
        .experience-video-frame img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .experience-video-shade {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(180deg, rgba(7,6,5,0.04) 0%, rgba(7,6,5,0.24) 46%, rgba(7,6,5,0.82) 100%),
            linear-gradient(90deg, rgba(7,6,5,0.46), transparent 48%);
          pointer-events: none;
          z-index: 1;
        }

        .experience-video-topbar,
        .experience-video-caption {
          position: absolute;
          z-index: 2;
          left: 22px;
          right: 22px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .experience-video-topbar {
          top: 22px;
        }

        .experience-video-caption {
          bottom: 22px;
          align-items: flex-end;
        }

        .experience-live-pill,
        .experience-duration-pill,
        .experience-play-chip {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(255,255,255,0.16);
          background: rgba(13,12,10,0.62);
          color: #fff7e8;
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          box-shadow: 0 12px 34px rgba(0,0,0,0.24);
        }

        .experience-live-pill,
        .experience-duration-pill {
          min-height: 38px;
          padding: 0 13px;
          border-radius: 999px;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .experience-live-pill svg {
          color: #d9ad57;
        }

        .experience-play-chip {
          max-width: min(440px, 100%);
          padding: 13px 15px;
          border-radius: 16px;
        }

        .experience-play-chip > span {
          width: 44px;
          height: 44px;
          flex: 0 0 44px;
          border-radius: 50%;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          background: var(--grad-gold-btn);
          color: #0d0c0a;
        }

        .experience-play-chip strong,
        .experience-play-chip small {
          display: block;
          line-height: 1.25;
        }

        .experience-play-chip strong {
          color: #fff7e8;
          font-size: 0.92rem;
        }

        .experience-play-chip small {
          margin-top: 3px;
          color: rgba(255,247,232,0.66);
          font-size: 0.74rem;
        }

        .experience-metric-strip {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 1px;
          width: min(360px, 44%);
          overflow: hidden;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,0.14);
          background: rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
        }

        .experience-metric-strip span {
          display: flex;
          min-height: 56px;
          flex-direction: column;
          justify-content: center;
          padding: 8px 11px;
          background: rgba(13,12,10,0.58);
        }

        .experience-metric-strip strong {
          color: #fff7e8;
          font-size: 1.08rem;
          line-height: 1;
          font-family: var(--font-display), Georgia, serif;
        }

        .experience-metric-strip small {
          margin-top: 5px;
          color: rgba(255,247,232,0.62);
          font-size: 0.64rem;
          text-transform: uppercase;
          letter-spacing: 0.1em;
        }

        .experience-detail-panel {
          display: flex;
          min-height: 500px;
          flex-direction: column;
          justify-content: space-between;
          gap: 20px;
          padding: 24px;
          border-radius: 24px;
          border: 1px solid rgba(201,151,59,0.22);
          background:
            linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.035));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .experience-detail-kicker {
          display: inline-flex;
          width: fit-content;
          align-items: center;
          gap: 8px;
          min-height: 34px;
          padding: 0 12px;
          border-radius: 999px;
          background: rgba(201,151,59,0.13);
          border: 1px solid rgba(201,151,59,0.24);
          color: #e4bc6b;
          font-size: 0.72rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }

        .experience-detail-title {
          margin: 14px 0 10px;
          color: #fff7e8;
          font-size: clamp(1.42rem, 2.6vw, 1.82rem);
          line-height: 1.15;
          font-family: var(--font-display), Georgia, serif;
        }

        .experience-detail-text {
          color: rgba(255,247,232,0.68);
          font-size: 0.9rem;
          line-height: 1.65;
          margin: 0;
        }

        .experience-steps {
          display: grid;
          gap: 12px;
        }

        .experience-step {
          display: grid;
          grid-template-columns: 38px minmax(0, 1fr);
          gap: 12px;
          align-items: start;
        }

        .experience-step-icon {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #171009;
          background: var(--grad-gold-btn);
          box-shadow: 0 10px 24px rgba(201,151,59,0.18);
        }

        .experience-step strong {
          display: block;
          color: #fff7e8;
          font-size: 0.92rem;
          line-height: 1.3;
        }

        .experience-step p {
          margin: 3px 0 0;
          color: rgba(255,247,232,0.62);
          font-size: 0.78rem;
          line-height: 1.48;
        }

        .experience-checks {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 8px;
        }

        .experience-checks span {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 34px;
          padding: 0 11px;
          border-radius: 999px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          color: rgba(255,247,232,0.76);
          font-size: 0.72rem;
          font-weight: 700;
        }

        .experience-checks svg {
          color: #d9ad57;
          flex-shrink: 0;
        }

        .experience-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          padding-top: 4px;
        }

        .experience-actions .sal-btn {
          min-height: 44px;
        }

        @media (max-width: 1080px) {
          .experience-cinema-head,
          .experience-cinema-layout {
            grid-template-columns: 1fr;
          }

          .experience-cinema-copy {
            max-width: 720px;
          }

          .experience-video-frame,
          .experience-detail-panel {
            min-height: auto;
          }

          .experience-video-frame {
            aspect-ratio: 16 / 10;
          }
        }

        @media (max-width: 720px) {
          .experience-cinema-section {
            padding: 62px 0;
          }

          .experience-cinema-head {
            gap: 16px;
            margin-bottom: 22px;
          }

          .experience-video-frame {
            min-height: 360px;
            aspect-ratio: auto;
            border-radius: 18px;
          }

          .experience-detail-panel {
            padding: 20px;
            border-radius: 18px;
          }

          .experience-video-topbar,
          .experience-video-caption {
            left: 16px;
            right: 16px;
          }

          .experience-video-topbar {
            top: 16px;
          }

          .experience-video-caption {
            bottom: 16px;
            flex-direction: column;
            align-items: flex-start;
          }

          .experience-metric-strip {
            width: 100%;
          }

          .experience-actions .sal-btn {
            width: 100%;
          }
        }

        @media (max-width: 480px) {
          .experience-video-frame {
            min-height: 320px;
          }

          .experience-duration-pill {
            display: none;
          }

          .experience-metric-strip {
            grid-template-columns: 1fr;
          }

          .experience-metric-strip span {
            min-height: 48px;
          }
        }
      `}</style>

      <div className="sal-container experience-cinema-inner">
        <div className="experience-cinema-head reveal">
          <div>
            <span className="sal-eyebrow">Studio in Motion</span>
            <h2 className="sal-h2 experience-cinema-title">
              Watch the <span className="text-gold">Glamour Studio</span> experience before you book
            </h2>
          </div>
          <p className="experience-cinema-copy">
            A calm consultation, detailed styling and a polished reveal. This is the kind of salon
            visit your home page should show with confidence.
          </p>
        </div>

        <div className="experience-cinema-layout">
          <div className="experience-video-frame reveal-left">
            {HOME_VIDEO_URL ? (
              <video
                className="experience-video"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                poster={HOME_VIDEO_POSTER}
                aria-label="Glamour Studio salon experience video"
              >
                <source src={HOME_VIDEO_URL} />
              </video>
            ) : (
              <Image
                src={HOME_VIDEO_POSTER}
                alt="Glamour Studio salon experience"
                fill
                sizes="(max-width: 1080px) 100vw, 62vw"
                className="object-cover"
              />
            )}
            <div className="experience-video-shade" />
            <div className="experience-video-topbar">
              <span className="experience-live-pill">
                <Sparkles size={14} />
                Signature reveal
              </span>
              <span className="experience-duration-pill">
                <Clock size={14} />
                45-90 min
              </span>
            </div>
            <div className="experience-video-caption">
              <div className="experience-play-chip">
                <span>
                  <Play size={18} fill="currentColor" />
                </span>
                <div>
                  <strong>Salon experience video</strong>
                  <small>Hair, skin care and styling moments from the studio</small>
                </div>
              </div>
              <div className="experience-metric-strip" aria-label="Glamour Studio highlights">
                <span>
                  <strong>25+</strong>
                  <small>Years</small>
                </span>
                <span>
                  <strong>999+</strong>
                  <small>Clients</small>
                </span>
                <span>
                  <strong>4.9</strong>
                  <small>Rating</small>
                </span>
              </div>
            </div>
          </div>

          <aside className="experience-detail-panel reveal-right">
            <div>
              <span className="experience-detail-kicker">
                <Sparkles size={14} />
                Premium visit
              </span>
              <h3 className="experience-detail-title">Luxury, calm and camera-ready results.</h3>
              <p className="experience-detail-text">
                Show clients the feeling of the studio before they choose a service: soft ambience,
                expert hands and a final look that feels personal.
              </p>
            </div>

            <div className="experience-steps">
              {SERVICE_STEPS.map(({ icon: Icon, title, text }) => (
                <div key={title} className="experience-step">
                  <span className="experience-step-icon">
                    <Icon size={18} />
                  </span>
                  <div>
                    <strong>{title}</strong>
                    <p>{text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div>
              <div className="experience-checks">
                {QUICK_WINS.map((item) => (
                  <span key={item}>
                    <CheckCircle2 size={14} />
                    {item}
                  </span>
                ))}
              </div>

              <div className="experience-actions">
                <Link href={ROUTES.BOOK} className="sal-btn sal-btn-gold">
                  <CalendarDays size={16} />
                  Book Your Visit
                </Link>
                <Link href={ROUTES.GALLERY} className="sal-btn sal-btn-outline">
                  View Gallery
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}
