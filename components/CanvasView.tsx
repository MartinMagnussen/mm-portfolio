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
const SCROLL_SPIN = 90; // scroll velocity → a touch of extra path roll
const RING_DEPTH = 0.85; // ring depth (z) as a fraction of horizontal amplitude
const BACK_BLUR = 5; // px blur on the far (back) side of the ring
const BACK_FADE = 0.4; // opacity floor as a card rounds to the back
const MAG_REACH = 1.25; // magnetic radius as a multiple of the card half-size
const MAG_PULL = 0.18; // how far an engaged card drifts toward the cursor (subtle)
const MAG_EASE = 0.06; // how quickly it eases toward that offset (lower = slower)

export default function CanvasView({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
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
    let swayT = 0; // sway clock (ms), frozen while a card is engaged
    let pathT = 0; // idle path-rotation clock (ms), frozen while engaged
    let hovering = false; // pause idle motion while inspecting a card
    let engaged = -1; // index of the card the cursor is locked onto
    let bgIndex = -1; // which image the blurred backdrop currently shows

    const field = fieldRef.current;
    const bg = bgRef.current;
    const ptr = { x: 0, y: 0, inside: false };
    const mag = cards.map(() => ({ x: 0, y: 0 })); // eased magnetic offset
    const opacities = cards.map(() => 0); // last frame's opacity per card
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

      // Rects reflect last frame's transforms — close enough for proximity, and
      // reading them all up front avoids interleaved read/write layout thrash.
      const rects = cards.map((c) => c.getBoundingClientRect());

      // Engage the card whose *centre* the cursor is nearest, within a magnetic
      // radius. Centre-based (not pixel-based) so a partly-covered card still
      // responds — and the engaged card is lifted to the front below.
      engaged = -1;
      let engagedND = Infinity;
      let engDx = 0;
      let engDy = 0;
      if (ptr.inside) {
        for (let i = 0; i < n; i++) {
          if (opacities[i] <= 0.12) continue;
          const rc = rects[i];
          const dx = ptr.x - (rc.left + rc.width / 2);
          const dy = ptr.y - (rc.top + rc.height / 2);
          const nd = Math.hypot(
            dx / ((rc.width / 2) * MAG_REACH),
            dy / ((rc.height / 2) * MAG_REACH),
          );
          if (nd < 1 && nd < engagedND) {
            engagedND = nd;
            engaged = i;
            engDx = dx;
            engDy = dy;
          }
        }
      }
      hovering = engaged !== -1;

      // Magnetic pull: strongest near the card centre, zero past the radius.
      for (let i = 0; i < n; i++) {
        let tx = 0;
        let ty = 0;
        if (!reduced && i === engaged) {
          const s = Math.max(0, 1 - engagedND); // 1 centre → 0 edge
          const ease = s * s * (3 - 2 * s);
          tx = engDx * MAG_PULL * ease;
          ty = engDy * MAG_PULL * ease;
        }
        mag[i].x += (tx - mag[i].x) * MAG_EASE;
        mag[i].y += (ty - mag[i].y) * MAG_EASE;
      }

      // Idle motion (drift, sway, path rotation) pauses while inspecting a card.
      // Scrolling is explicit, so the smoothing toward `target` always runs.
      const idle = !hovering && !reduced;
      if (idle) {
        target += AUTO;
        swayT += deltaTime;
        pathT += deltaTime;
      }
      const scrollVel = target - current;
      current += scrollVel * 0.09;

      // The path drifts idly on its own clock; scrolling adds a barely-there roll.
      if (field) {
        const prx = reduced ? 0 : Math.sin(pathT * PATH_SPEED) * PATH_X_DEG;
        const prz = reduced
          ? 0
          : Math.sin(pathT * PATH_SPEED * 0.8 + 1.3) * PATH_Z_DEG;
        field.style.transform = `rotateX(${prx}deg) rotateZ(${prz + scrollVel * SCROLL_SPIN}deg)`;
      }

      let centreI = 0;
      let centreDist = Infinity;

      for (let i = 0; i < n; i++) {
        const u = wrap(i / n + current);
        const angle = u * TWO_PI * WAVES;

        const dist = Math.abs(u - 0.5) * 2; // 0 centre band → 1 edges
        if (dist < centreDist) {
          centreDist = dist;
          centreI = i;
        }
        // The path is now a ring: cards swing left↔right (x) AND front↔back (z),
        // so the spiral wraps around in a loop. The far side rounds away into
        // the distance, where it's dimmed and softly blurred.
        const x = Math.sin(angle) * amp;
        const z = Math.cos(angle) * amp * RING_DEPTH;
        const y = (0.5 - u) * SPREAD * vh;
        const front = (z / (amp * RING_DEPTH) + 1) / 2; // 1 = nearest, 0 = back

        const r = reveal[i].v;
        const scale = lerp(1.04, 0.52, dist) * lerp(0.86, 1, r);
        const ry = -(x / amp) * 26;
        const sway = reduced ? 0 : Math.sin(swayT * SWAY_SPEED + i * 1.7) * SWAY_DEG;
        const rz = (x / amp) * 4 + sway;
        const opacity =
          Math.min(Math.sin(u * Math.PI) * 1.6, 1) * lerp(BACK_FADE, 1, front) * r;
        opacities[i] = opacity;

        const isEng = i === engaged;
        const blur = isEng ? 0 : (1 - front) * BACK_BLUR;

        const el = cards[i];
        el.style.transform = `translate(-50%, -50%) translate3d(${x + mag[i].x}px, ${y + mag[i].y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
        el.style.opacity = `${Math.max(opacity, 0)}`;
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        // Stack by real depth so the ring occludes correctly; the engaged card
        // is lifted clear of everything else.
        el.style.zIndex = isEng ? "9999" : `${Math.round(1000 + z)}`;
        el.dataset.engaged = isEng ? "true" : "false";
        // Any reasonably visible card stays interactive; only near-invisible
        // edge/back cards drop out so they can't steal hovers/clicks.
        el.style.pointerEvents = opacity > 0.12 ? "auto" : "none";
      }

      // Blurred backdrop follows the image nearest the centre of the band.
      const showI = engaged !== -1 ? engaged : centreI;
      if (bg && showI !== bgIndex) {
        bgIndex = showI;
        bg.style.backgroundImage = `url(${projects[showI].image})`;
      }
    }

    gsap.ticker.add(render);

    function onPointerMove(e: PointerEvent) {
      ptr.x = e.clientX;
      ptr.y = e.clientY;
      ptr.inside = true;
    }
    function onPointerLeave() {
      ptr.inside = false;
    }
    viewport.addEventListener("pointermove", onPointerMove);
    viewport.addEventListener("pointerleave", onPointerLeave);

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
      viewport.removeEventListener("pointermove", onPointerMove);
      viewport.removeEventListener("pointerleave", onPointerLeave);
      viewport.removeEventListener("wheel", onWheel);
      viewport.removeEventListener("touchstart", onTouchStart);
      viewport.removeEventListener("touchmove", onTouchMove);
    };
  }, [projects]);

  return (
    <div ref={viewportRef} className={styles.viewport}>
      <div ref={bgRef} className={styles.bg} aria-hidden="true" />
      <div className={styles.grid} aria-hidden="true" />

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
