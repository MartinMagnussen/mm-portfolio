"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/lib/projects";
import styles from "./CanvasView.module.css";

const TWO_PI = Math.PI * 2;
const AUTO = 0.00004; // very slow idle drift (loops/frame)
const SWAY_DEG = 2.6; // gentle side-to-side rock amplitude
const SWAY_SPEED = 0.0011; // rock speed (per ms)
const PATH_X_DEG = 3.2; // idle pitch of the whole path
const PATH_Z_DEG = 3.6; // idle roll of the whole path
const PATH_SPEED = 0.00012; // path drift speed (per ms) — slow, scroll-independent
const SCROLL_SPIN = 90; // scroll velocity → a touch of extra path roll
const SWINGS = 1.25; // horizontal swings per vertical pass (as before)
const BACK_DEPTH = 520; // px the return lane sits behind the front lane
const BACK_SHIFT = 0.17; // return lane offset to the right (× viewport width)
const BACK_BLUR = 5; // px blur on the receding return lane
const BACK_FADE = 0.55; // opacity of the return lane
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
      const ampX = Math.min(vw * 0.27, 360); // horizontal swing of the front lane
      const yExtent = vh * 0.82; // cards travel well past the top/bottom edges
      const fadeStart = vh * 0.32; // fully visible within here…
      const fadeEnd = vh * 0.6; // …gone by here (so lane swaps hide off-screen)
      const backX = vw * BACK_SHIFT; // how far right the return lane sits

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

      let frontI = 0;
      let frontBest = -Infinity;

      for (let i = 0; i < n; i++) {
        const u = wrap(i / n + current);

        // A conveyor loop seen edge-on. First half of the cycle is the FRONT
        // lane — exactly as before: cards rise up the middle, swinging side to
        // side, off the top. Second half is the RETURN lane: they come back
        // DOWN set further back and to the right. The hand-offs between lanes
        // happen past the top/bottom edges, where cards have faded out.
        const front = u < 0.5;
        const lp = front ? u / 0.5 : (u - 0.5) / 0.5; // 0→1 along the lane
        const swing = Math.sin(lp * TWO_PI * SWINGS);

        // Front rises bottom→top; return falls top→bottom.
        const y = front
          ? lerp(yExtent, -yExtent, lp)
          : lerp(-yExtent, yExtent, lp);
        const x = front ? swing * ampX : backX + swing * ampX * 0.7;
        const z = front ? 0 : -BACK_DEPTH;

        // Fade by vertical position so cards melt away before the screen edge
        // (which also hides the off-screen lane swap).
        const ay = Math.abs(y);
        const vis = Math.max(
          0,
          Math.min(1, 1 - (ay - fadeStart) / (fadeEnd - fadeStart)),
        );
        // Biggest through the middle height, just like before.
        const midV = Math.max(0, 1 - ay / (vh * 0.5));

        // Pick the most prominent front card to drive the backdrop image.
        if (front && vis * midV > frontBest) {
          frontBest = vis * midV;
          frontI = i;
        }

        const r = reveal[i].v;
        const scale =
          lerp(0.55, 1.06, midV) * (front ? 1 : 0.82) * lerp(0.86, 1, r);
        const ry = -swing * 24;
        const sway = reduced ? 0 : Math.sin(swayT * SWAY_SPEED + i * 1.7) * SWAY_DEG;
        const rz = swing * 4 + sway;
        const opacity = vis * (front ? 1 : BACK_FADE) * r;
        opacities[i] = opacity;

        const isEng = i === engaged;
        const blur = isEng || front ? 0 : BACK_BLUR;

        const el = cards[i];
        el.style.transform = `translate(-50%, -50%) translate3d(${x + mag[i].x}px, ${y + mag[i].y}px, ${z}px) rotateY(${ry}deg) rotateZ(${rz}deg) scale(${scale})`;
        el.style.opacity = `${Math.max(opacity, 0)}`;
        el.style.filter = blur > 0.05 ? `blur(${blur.toFixed(2)}px)` : "none";
        // Front lane sits over the return lane; engaged card clears everything.
        el.style.zIndex = isEng ? "9999" : front ? "1000" : "400";
        el.dataset.engaged = isEng ? "true" : "false";
        // Only near-invisible cards drop out so they can't steal hovers/clicks.
        el.style.pointerEvents = opacity > 0.12 ? "auto" : "none";
      }

      // Blurred backdrop follows the front-most (nearest) card, or the engaged one.
      const showI = engaged !== -1 ? engaged : frontI;
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
