"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollBar.module.css";

// Custom overlay scrollbar. The native scrollbar is hidden globally in
// globals.css — hiding it (rather than restyling ::-webkit-scrollbar) means it
// never reserves layout width, so page content is never pushed. This draws a
// slim lime-on-dim thumb in the same visual language as the scroll-progress
// rail, and works the same in Chrome, Safari, Firefox and Edge because it's a
// plain DOM element rather than browser scrollbar chrome.
//
// Mounted once in the root layout, so it persists across route changes. It is
// driven by document scroll: the thumb height is the viewport/content ratio and
// its offset tracks scrollY. Dragging the thumb (or clicking the track) jumps
// the page; on the smooth-scrolled subpages it routes through the live Lenis
// instance so the two never fight. Auto-hides whenever the page can't scroll,
// and is suppressed on touch (coarse) pointers where the OS handles this.
export default function ScrollBar() {
  const railRef = useRef<HTMLDivElement>(null);
  const thumbRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    const thumb = thumbRef.current;
    if (!rail || !thumb) return;

    const doc = document.documentElement;
    let raf = 0;
    let dragging = false;
    let grabOffset = 0; // pointer offset within the thumb at grab time

    const scrollable = () => doc.scrollHeight - window.innerHeight;

    // Position the thumb for the current scrollY. rAF-throttled via onScroll.
    const position = () => {
      raf = 0;
      const max = scrollable();
      if (max <= 1) return;
      const prog = Math.min(1, Math.max(0, window.scrollY / max));
      const travel = rail.clientHeight - thumb.offsetHeight;
      thumb.style.transform = `translateY(${prog * travel}px)`;
    };

    // Size the thumb (proportional to how much of the page is visible) and
    // toggle the whole rail off when there's nothing to scroll.
    const layout = () => {
      const max = scrollable();
      if (max <= 1) {
        rail.dataset.show = "false";
        return;
      }
      rail.dataset.show = "true";
      const ratio = window.innerHeight / doc.scrollHeight;
      const thumbH = Math.max(40, ratio * rail.clientHeight);
      thumb.style.height = `${thumbH}px`;
      position();
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(position);
    };

    // Map a pointer Y to a scroll target. Prefer the live Lenis instance (set by
    // SmoothScroll on the subpages) so drag-to-scroll uses the same engine as
    // the wheel; fall back to the plain window elsewhere (home list view).
    const scrollToY = (top: number) => {
      const lenis = (
        window as unknown as {
          __lenis?: { scrollTo: (t: number, o?: { immediate?: boolean }) => void };
        }
      ).__lenis;
      if (lenis) lenis.scrollTo(top, { immediate: true });
      else window.scrollTo(0, top);
    };

    const pointerToScroll = (clientY: number) => {
      const box = rail.getBoundingClientRect();
      const travel = rail.clientHeight - thumb.offsetHeight;
      if (travel <= 0) return;
      const prog = Math.min(
        1,
        Math.max(0, (clientY - box.top - grabOffset) / travel),
      );
      scrollToY(prog * scrollable());
    };

    const onDragMove = (e: PointerEvent) => {
      if (dragging) pointerToScroll(e.clientY);
    };
    const onDragUp = () => {
      dragging = false;
      rail.dataset.drag = "false";
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragUp);
    };
    const onThumbDown = (e: PointerEvent) => {
      e.preventDefault();
      dragging = true;
      rail.dataset.drag = "true";
      grabOffset = e.clientY - thumb.getBoundingClientRect().top;
      window.addEventListener("pointermove", onDragMove);
      window.addEventListener("pointerup", onDragUp);
    };
    // Clicking the empty track jumps so the thumb centres on the click.
    const onRailDown = (e: PointerEvent) => {
      if (e.target === thumb) return;
      grabOffset = thumb.offsetHeight / 2;
      pointerToScroll(e.clientY);
    };

    // Content height changes (route change, images loading) without a window
    // resize, so watch the body box too.
    const ro = new ResizeObserver(layout);
    ro.observe(document.body);

    layout();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", layout);
    thumb.addEventListener("pointerdown", onThumbDown);
    rail.addEventListener("pointerdown", onRailDown);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", layout);
      thumb.removeEventListener("pointerdown", onThumbDown);
      rail.removeEventListener("pointerdown", onRailDown);
      window.removeEventListener("pointermove", onDragMove);
      window.removeEventListener("pointerup", onDragUp);
    };
  }, []);

  return (
    <div ref={railRef} className={styles.rail} data-show="false" aria-hidden="true">
      <div ref={thumbRef} className={styles.thumb} />
    </div>
  );
}
