"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/lib/projects";
import styles from "./CanvasView.module.css";

const TWO_PI = Math.PI * 2;
const WAVES = 1.25; // horizontal swings across the visible band
const SPREAD = 1.55; // vertical travel as a multiple of viewport height
const AUTO = 0.00014; // gentle idle drift (loops/frame)

export default function CanvasView({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[];
    const n = cards.length;
    if (!n) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const wrap = (v: number) => ((v % 1) + 1) % 1;
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    let target = 0; // user-driven offset (loops)
    let current = 0; // smoothed offset
    const reveal = cards.map(() => ({ v: reduced ? 1 : 0 }));

    // Intro: cards bloom in with a slight stagger.
    if (!reduced) {
      reveal.forEach((r, i) =>
        gsap.to(r, { v: 1, duration: 1.1, delay: 0.15 + i * 0.07, ease: "power3.out" }),
      );
    }

    function render() {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const amp = Math.min(vw * 0.27, 360);

      if (!reduced) target += AUTO;
      current += (target - current) * 0.09;

      for (let i = 0; i < n; i++) {
        const u = wrap(i / n + current);
        const angle = u * TWO_PI * WAVES;

        const x = Math.sin(angle) * amp;
        const y = (0.5 - u) * SPREAD * vh;
        const z = Math.cos(angle) * 150;

        const dist = Math.abs(u - 0.5) * 2; // 0 centre band → 1 edges
        const r = reveal[i].v;
        const scale = lerp(1.04, 0.52, dist) * lerp(0.86, 1, r);
        const ry = -(x / amp) * 26;
        const rz = (x / amp) * 4;
        const opacity = Math.min(Math.sin(u * Math.PI) * 1.6, 1) * r;

        const el = cards[i];
        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
        el.style.opacity = `${Math.max(opacity, 0)}`;
        el.style.zIndex = `${Math.round((1 - dist) * 100)}`;
      }
    }

    gsap.ticker.add(render);

    const SENS = 0.00058;
    function onWheel(e: WheelEvent) {
      e.preventDefault();
      target += e.deltaY * SENS;
    }

    let lastY = 0;
    function onTouchStart(e: TouchEvent) {
      lastY = e.touches[0].clientY;
    }
    function onTouchMove(e: TouchEvent) {
      const y = e.touches[0].clientY;
      target += (lastY - y) * 0.0016;
      lastY = y;
      e.preventDefault();
    }

    viewport.addEventListener("wheel", onWheel, { passive: false });
    viewport.addEventListener("touchstart", onTouchStart, { passive: true });
    viewport.addEventListener("touchmove", onTouchMove, { passive: false });

    return () => {
      gsap.ticker.remove(render);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
    };
  }, [projects.length]);

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div className={styles.field}>
        {projects.map((p, i) => (
          <div
            key={p.slug}
            ref={(el) => {
              cardsRef.current[i] = el;
            }}
            className={styles.cardPos}
            data-featured={p.featured}
            style={{ opacity: 0 }}
          >
            <a
              href={`/prosjekt/${p.slug}`}
              className={styles.card}
              aria-label={`${p.title} — ${p.tag}, ${p.year}`}
              onDragStart={(e) => e.preventDefault()}
            >
              <span className={styles.thumb} style={{ background: p.gradient }} />
              <span className={styles.label}>
                <span className={styles.title}>{p.title}</span>
                <span className={styles.tag}>
                  {p.tag} · {p.year}
                </span>
              </span>
            </a>
          </div>
        ))}
      </div>

      <span className={`${styles.hint} mono`}>skroll for å utforske</span>
    </div>
  );
}
