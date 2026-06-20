"use client";

import { useEffect } from "react";
import Lenis from "lenis";

// Scroll damping for the document-scrolled pages (project cases, om, cv). The
// front page is NOT wrapped: it runs its own fixed-viewport wheel inertia, so
// Lenis is mounted per-page rather than globally in the root layout.
//
// Lenis scrolls the real window (no transform wrapper), so native `scroll`
// events still fire and getBoundingClientRect stays accurate — the scroll-driven
// ProcessTimeline and ScrollProgress keep working unchanged. Renders nothing.
//
// `lerp` is the damping: each frame the scroll moves this fraction of the way to
// the target, so lower = heavier glide. Touch is left native (finger scrolling
// already has its own momentum and smoothing it tends to feel laggy).
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });

    // Expose the instance so the custom scrollbar (ScrollBar.tsx) can drive
    // drag-to-scroll through Lenis instead of window.scrollTo — otherwise a
    // drag would fight the smooth-scroll engine. Cleared on unmount.
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  return null;
}
