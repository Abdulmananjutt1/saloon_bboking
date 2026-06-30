"use client";

import { useEffect } from "react";

export default function ScrollReveal() {
  useEffect(() => {
    // ── Scroll-based reveal observer ──────────────────────────────
    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            // Stagger children with reveal-child class
            const children = entry.target.querySelectorAll<HTMLElement>(".reveal-child");
            children.forEach((child, i) => {
              setTimeout(() => child.classList.add("visible"), i * 110);
            });
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -60px 0px" }
    );

    const elements = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-stagger, .reveal-flip, .reveal-zoom, .reveal-bounce"
    );
    elements.forEach((el) => revealObserver.observe(el));

    // ── Hero underline trigger (fires immediately on load) ────────
    const heroWords = document.querySelectorAll(".hero-word");
    heroWords.forEach((el) => {
      setTimeout(() => el.classList.add("line-visible"), 900);
    });

    // ── Counter animation for stat numbers ────────────────────────
    const counterObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const target = parseFloat(el.dataset.count ?? "0");
          const isFloat = String(target).includes(".");
          const suffix = el.dataset.suffix ?? "";
          const duration = 1600;
          const start = performance.now();

          const tick = (now: number) => {
            const progress = Math.min((now - start) / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = target * eased;
            el.textContent = (isFloat ? current.toFixed(1) : Math.floor(current).toString()) + suffix;
            if (progress < 1) requestAnimationFrame(tick);
            else el.textContent = (isFloat ? target.toFixed(1) : target.toString()) + suffix;
          };
          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        });
      },
      { threshold: 0.5 }
    );

    document.querySelectorAll("[data-count]").forEach((el) =>
      counterObserver.observe(el)
    );

    return () => {
      revealObserver.disconnect();
      counterObserver.disconnect();
    };
  }, []);

  return null;
}
