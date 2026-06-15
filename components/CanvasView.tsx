"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/lib/projects";
import styles from "./CanvasView.module.css";

const TWO_PI = Math.PI * 2;
const WAVES = 1.25; // horizontal swings across the visible band
const SPREAD = 1.55; // vertical travel as a multiple of viewport height
const AUTO = 0.00004; // very slow idle drift (loops/frame)
const SWAY_DEG = 2.6; // gentle side-to-side rock amplitude
const SWAY_SPEED = 0.0011; // rock speed (per ms)
const PATH_X_DEG = 3.2; // idle pitch of the whole path
const PATH_Z_DEG = 3.6; // idle roll of the whole path
const PATH_SPEED = 0.00012; // path drift speed (per ms) — slow, scroll-independent

export default function CanvasView({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
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

    // Fixed depth layers, woven 1,2,3,2,1,2,3,2… by card index. Stacking is tied
    // to the card itself, never to where it sits on screen — so a card that's
    // behind another stays behind, and neighbours never share a layer.
    const LAYER = [1, 2, 3, 2];
    const LAYER_GAP = 110; // px between adjacent depth layers

    let target = 0; // user-driven offset (loops)
    let current = 0; // smoothed offset
    let swayT = 0; // sway clock (ms), frozen while a card is hovered
    let pathT = 0; // idle path-rotation clock (ms), frozen while hovering
    let hovering = false; // pause all motion while inspecting a card
    const field = fieldRef.current;
    const reveal = cards.map(() => ({ v: reduced ? 1 : 0 }));

    // Intro: cards bloom in with a slight stagger.
    if (!reduced) {
      reveal.forEach((r, i) =>
        gsap.to(r, { v: 1, duration: 1.1, delay: 0.15 + i * 0.07, ease: "power3.out" }),
      );
    }

    function render(_time: number, deltaTime: number) {
      const vh = window.innerHeight;
      const vw = window.innerWidth;
      const amp = Math.min(vw * 0.27, 360);

      // Hovering pauses only the spiral's *own* idle motion (drift, sway, path
      // rotation). Scrolling is an explicit action, so the smoothing toward
      // `target` always runs — you can scroll through the spiral even while the
      // pointer rests on a card.
      const idle = !hovering && !reduced;
      if (idle) {
        target += AUTO;
        swayT += deltaTime;
        pathT += deltaTime;
      }
      current += (target - current) * 0.09;

      // The whole path drifts/rotates idly on its own clock — never from scroll,
      // frozen while a card is hovered so inspection stays perfectly still.
      if (field) {
        const prx = reduced ? 0 : Math.sin(pathT * PATH_SPEED) * PATH_X_DEG;
        const prz = reduced ? 0 : Math.sin(pathT * PATH_SPEED * 0.8 + 1.3) * PATH_Z_DEG;
        field.style.transform = `rotateX(${prx}deg) rotateZ(${prz}deg)`;
      }

      for (let i = 0; i < n; i++) {
        const u = wrap(i / n + current);
        const angle = u * TWO_PI * WAVES;

        const dist = Math.abs(u - 0.5) * 2; // 0 centre band → 1 edges
        const x = Math.sin(angle) * amp;
        const y = (0.5 - u) * SPREAD * vh;
        // Fixed depth + stacking per card (woven 1,2,3,2…), independent of
        // screen position. Both the 3D z and z-index use the same layer so they
        // can never disagree and clip in the wrong order.
        const layer = LAYER[i % LAYER.length];
        const z = (layer - 2) * LAYER_GAP;

        const r = reveal[i].v;
        const scale = lerp(1.04, 0.52, dist) * lerp(0.86, 1, r);
        const ry = -(x / amp) * 26;
        const sway = reduced ? 0 : Math.sin(swayT * SWAY_SPEED + i * 1.7) * SWAY_DEG;
        const rz = (x / amp) * 4 + sway;
        const opacity = Math.min(Math.sin(u * Math.PI) * 1.6, 1) * r;

        const el = cards[i];
        el.style.transform = `translate(-50%, -50%) translate3d(${x}px, ${y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
        el.style.opacity = `${Math.max(opacity, 0)}`;
        el.style.zIndex = `${layer}`;
        // Any reasonably visible card stays interactive; only near-invisible
        // edge cards drop out so they can't steal hovers/clicks.
        el.style.pointerEvents = opacity > 0.12 ? "auto" : "none";
      }
    }

    gsap.ticker.add(render);

    const onEnter = () => (hovering = true);
    const onLeave = () => (hovering = false);
    cards.forEach((el) => {
      el.addEventListener("pointerenter", onEnter);
      el.addEventListener("pointerleave", onLeave);
    });

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
      cards.forEach((el) => {
        el.removeEventListener("pointerenter", onEnter);
        el.removeEventListener("pointerleave", onLeave);
      });
    };
  }, [projects.length]);

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={fieldRef} className={styles.field}>
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
              <span
                className={styles.thumb}
                style={{
                  backgroundColor: "#0a0a0b",
                  backgroundImage: `url(${p.image})`,
                }}
              />
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
