"use client";

import { useEffect, useRef } from "react";
import styles from "./GridGlow.module.css";

// Cell size matches the CSS `--grid` token so this lines up with the rest of
// the layout. Everything else is tuned for a subtle, tasteful glow.
const GRID = 32; // cell size in px (keep in sync with --grid)
const RADIUS = 4; // glow reach, in cells (smaller, tighter spotlight)
const MAX_ALPHA = 0.22; // brightest (cursor) cell fill
const LINE_ALPHA = 0.07; // static grid lines (matches --line)
const EASE = 0.07; // glow trails the cursor at half the square's speed (DOT_SPEED 0.14 → 2× slower)
const GLOW_RGB = "186, 255, 24"; // accent (#baff18) tint for the lit cells

// Touch devices have no hovering cursor, so instead of teleporting the glow to
// each tap (which looked broken), it drifts around on its own. A larger reach
// and a slow ease make the wander read as an ambient effect, not a follower.
const WANDER_RADIUS = 7; // bigger spotlight while wandering
const WANDER_EASE = 0.022; // slow, lazy drift toward each destination
const WANDER_PAUSE = 1300; // ms to rest at a destination before moving on

// A pixelated spotlight: each grid cell lights up by how close its *centre* is
// to the cursor, so the falloff is quantised per square instead of smooth.
//
// `asBackground` mode is for the page-wide instance mounted in the root layout:
// it skips its own grid lines (the body already paints them) and only adds the
// cursor glow, so the highlight reaches the list and about pages too.
export default function GridGlow({
  asBackground = false,
}: {
  asBackground?: boolean;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Coarse / hover-less pointers (phones, tablets) get the autonomous wander
    // instead of the pointer-following glow.
    const coarse = window.matchMedia("(hover: none), (pointer: coarse)").matches;

    let vw = 0;
    let vh = 0;
    let dpr = 1;

    function resize() {
      vw = window.innerWidth;
      vh = window.innerHeight;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas!.width = Math.round(vw * dpr);
      canvas!.height = Math.round(vh * dpr);
      canvas!.style.width = `${vw}px`;
      canvas!.style.height = `${vh}px`;
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
    }

    // Pointer target and its eased follower. `a` is the overall glow strength
    // (0 when the cursor is off-screen, easing to 1 when it's over the grid).
    const target = { x: -9999, y: -9999, on: false };
    const glow = { x: -9999, y: -9999, a: 0 };

    // Wander destination + the timestamp at which it's allowed to move again
    // (set when a destination is reached, so the glow rests before drifting on).
    const dest = { x: 0, y: 0 };
    let restUntil = 0;
    function pickDest() {
      // Keep destinations a margin in from the edges so the spotlight stays
      // mostly on screen.
      const m = WANDER_RADIUS * GRID * 0.5;
      dest.x = m + Math.random() * Math.max(1, vw - 2 * m);
      dest.y = m + Math.random() * Math.max(1, vh - 2 * m);
    }

    // The grid is symmetric about the viewport centre (like background-position:
    // center): a cell boundary always sits at vw/2 / vh/2.
    const lineX = (k: number) => vw / 2 + k * GRID;
    const lineY = (k: number) => vh / 2 + k * GRID;

    function draw() {
      ctx!.clearRect(0, 0, vw, vh);

      // Static grid lines, drawn in both modes so every page shows the exact
      // same pixel-snapped grid. +0.5 keeps the 1px strokes crisp (a CSS
      // gradient grid can't pixel-snap and renders as doubled/blurry lines).
      ctx!.strokeStyle = `rgba(255, 255, 255, ${LINE_ALPHA})`;
      ctx!.lineWidth = 1;
      ctx!.beginPath();
      const kxMax = Math.ceil(vw / 2 / GRID);
      const kyMax = Math.ceil(vh / 2 / GRID);
      for (let k = -kxMax; k <= kxMax; k++) {
        const x = Math.round(lineX(k)) + 0.5;
        ctx!.moveTo(x, 0);
        ctx!.lineTo(x, vh);
      }
      for (let k = -kyMax; k <= kyMax; k++) {
        const y = Math.round(lineY(k)) + 0.5;
        ctx!.moveTo(0, y);
        ctx!.lineTo(vw, y);
      }
      ctx!.stroke();

      // Lit cells around the cursor. Only the cells within the glow radius are
      // visited, so this stays cheap regardless of viewport size.
      if (glow.a > 0.001) {
        const R = (coarse ? WANDER_RADIUS : RADIUS) * GRID;
        // Cell column c spans [vw/2 + c*GRID, vw/2 + (c+1)*GRID].
        const cMin = Math.floor((glow.x - R - vw / 2) / GRID);
        const cMax = Math.ceil((glow.x + R - vw / 2) / GRID);
        const rMin = Math.floor((glow.y - R - vh / 2) / GRID);
        const rMax = Math.ceil((glow.y + R - vh / 2) / GRID);
        for (let c = cMin; c <= cMax; c++) {
          const cx = vw / 2 + (c + 0.5) * GRID;
          for (let r = rMin; r <= rMax; r++) {
            const cy = vh / 2 + (r + 0.5) * GRID;
            const d = Math.hypot(cx - glow.x, cy - glow.y);
            let t = 1 - d / R;
            if (t <= 0) continue;
            t = t * t * (3 - 2 * t); // smoothstep for a softer falloff
            const a = t * MAX_ALPHA * glow.a;
            ctx!.fillStyle = `rgba(${GLOW_RGB}, ${a.toFixed(3)})`;
            // Inset by 1px so the brightened cell sits inside its grid lines.
            ctx!.fillRect(
              vw / 2 + c * GRID + 1,
              vh / 2 + r * GRID + 1,
              GRID - 1,
              GRID - 1,
            );
          }
        }
      }
    }

    let running = false;
    let raf = 0;
    function frame(time: number) {
      if (coarse) {
        // Autonomous drift: ease toward the destination, and once we've nearly
        // arrived, rest a moment before picking a new one.
        if (glow.x < -9000) {
          glow.x = dest.x;
          glow.y = dest.y;
        }
        glow.x += (dest.x - glow.x) * WANDER_EASE;
        glow.y += (dest.y - glow.y) * WANDER_EASE;
        glow.a += (1 - glow.a) * WANDER_EASE * 4;
        if (Math.hypot(dest.x - glow.x, dest.y - glow.y) < GRID) {
          if (!restUntil) restUntil = time + WANDER_PAUSE;
          else if (time >= restUntil) {
            restUntil = 0;
            pickDest();
          }
        }
        draw();
        // The wander never idles out — keep the loop alive while mounted.
        raf = requestAnimationFrame(frame);
        return;
      }

      if (target.on) {
        if (glow.x < -9000) {
          glow.x = target.x;
          glow.y = target.y;
        }
        glow.x += (target.x - glow.x) * EASE;
        glow.y += (target.y - glow.y) * EASE;
        glow.a += (1 - glow.a) * EASE;
      } else {
        glow.a += (0 - glow.a) * EASE;
      }

      draw();

      // Idle out: once the glow has settled (cursor resting, or fully faded),
      // stop the loop and leave the last frame. A pointer move restarts it.
      const moving =
        target.on && Math.hypot(target.x - glow.x, target.y - glow.y) > 0.4;
      const fadingIn = target.on && 1 - glow.a > 0.01;
      const fadingOut = !target.on && glow.a > 0.01;
      if (!moving && !fadingIn && !fadingOut) {
        running = false;
        return;
      }
      raf = requestAnimationFrame(frame);
    }
    function start() {
      if (reduced || running) return;
      running = true;
      raf = requestAnimationFrame(frame);
    }

    function onMove(e: PointerEvent) {
      target.x = e.clientX;
      target.y = e.clientY;
      target.on = true;
      start();
    }
    function onLeave() {
      target.on = false;
      start();
    }

    // Resizing the canvas clears it, so redraw the static grid immediately —
    // otherwise the lines vanish until the next pointer move (the loop is idle).
    function onResize() {
      resize();
      draw();
    }

    resize();
    draw();
    window.addEventListener("resize", onResize);

    if (coarse) {
      // No pointer listeners on touch — tapping must not move the glow. Just
      // start the self-running drift (unless reduced-motion: then it stays
      // static with no glow at all).
      if (!reduced) {
        pickDest();
        start();
      }
    } else {
      window.addEventListener("pointermove", onMove, { passive: true });
      document.addEventListener("pointerleave", onLeave);
      window.addEventListener("blur", onLeave);
    }

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, [asBackground]);

  return (
    <canvas
      ref={canvasRef}
      className={asBackground ? styles.bg : styles.grid}
      aria-hidden="true"
    />
  );
}
