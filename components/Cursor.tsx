"use client";

import { useEffect, useRef } from "react";
import styles from "./Cursor.module.css";

// A single small solid square that replaces the native pointer: snappy, with a
// light velocity squeeze and a press dip. Rotation is coupled to the squeeze so
// the square sits axis-aligned with the background grid at rest and only tilts
// while it's being stretched by motion.
//
// Performance: no React state in the hot path. One rAF loop reads the mouse from
// a ref and writes `transform` straight to the node, so the component never
// re-renders while the cursor moves.
const DOT = 8; // small solid square (px)
const DOT_SPEED = 0.14; // follow smoothing (higher = snappier, less delay)
const SQUEEZE = 0.5; // max stretch at top velocity
const VEL_CAP = 150; // velocity clamp (matches the reference effect)

export default function Cursor() {
  const rootRef = useRef<HTMLDivElement>(null);
  const dotRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const dot = dotRef.current;
    if (!root || !dot) return;

    // Only a precise pointer that can hover gets the custom cursor. Touch keeps
    // native behaviour; reduced-motion keeps the native cursor (no follow anim).
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (!fine || reduced) return;

    document.documentElement.classList.add("has-cursor");

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const prev = { x: mouse.x, y: mouse.y };
    const d = { x: mouse.x, y: mouse.y }; // dot position
    let scale = 0; // eased squeeze amount (0..SQUEEZE)
    let press = 0; // 0..1 eased pointer-down amount
    let pressed = false;
    let ready = false;

    const onMove = (e: PointerEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!ready) {
        ready = true;
        root.dataset.ready = "true";
      }
    };
    const onLeave = () => {
      ready = false;
      root.dataset.ready = "false";
    };
    const onDown = () => {
      pressed = true;
    };
    const onUp = () => {
      pressed = false;
    };

    let raf = 0;
    const tick = () => {
      // Velocity → squeeze. The square stays axis-aligned (no rotation), it only
      // stretches/compresses with speed.
      const dx = mouse.x - prev.x;
      const dy = mouse.y - prev.y;
      prev.x = mouse.x;
      prev.y = mouse.y;
      const vel = Math.min(Math.hypot(dx, dy) * 4, VEL_CAP);
      scale += ((vel / VEL_CAP) * SQUEEZE - scale) * DOT_SPEED;

      press += ((pressed ? 1 : 0) - press) * 0.25;

      d.x += (mouse.x - d.x) * DOT_SPEED;
      d.y += (mouse.y - d.y) * DOT_SPEED;
      // Dips a little on press. transform-origin is centre, so scaling keeps the
      // square pinned to the cursor.
      const dP = 1 - press * 0.4;
      dot.style.transform =
        `translate(${d.x - DOT / 2}px, ${d.y - DOT / 2}px) ` +
        `scale(${(1 + scale) * dP}, ${(1 - scale) * dP})`;

      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    window.addEventListener("blur", onLeave);
    window.addEventListener("pointerdown", onDown, { passive: true });
    window.addEventListener("pointerup", onUp, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      document.documentElement.classList.remove("has-cursor");
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("blur", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={rootRef} className={styles.root} aria-hidden="true">
      <div ref={dotRef} className={styles.dot} />
    </div>
  );
}
