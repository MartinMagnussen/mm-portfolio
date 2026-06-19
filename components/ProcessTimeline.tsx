"use client";

import { useEffect, useRef } from "react";
import styles from "./ProcessTimeline.module.css";

export type ProcessStep = { num: string; title: string; body: string };

// A scroll-driven vertical timeline: a dim track runs down the left, and a lime
// "glow" fill grows from the top as the reader scrolls through the section. Each
// step has a checkpoint node that lights up once the fill reaches it, and the
// step text fades from dim to full. Pure layout/measurement — the fill height is
// a CSS var (--progress 0..1) and node state is a data-attribute, so all the
// painting stays in CSS. Reduced-motion shows everything filled and lit.
const MARKER = 13; // vertical offset (px) of a node's centre from its <li> top

export default function ProcessTimeline({ steps }: { steps: ProcessStep[] }) {
  const wrapRef = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    if (!wrap) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const nodes = Array.from(
      wrap.querySelectorAll<HTMLElement>("[data-step]"),
    );

    if (reduced) {
      wrap.style.setProperty("--progress", "1");
      nodes.forEach((n) => (n.dataset.active = "true"));
      return;
    }

    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = wrap.getBoundingClientRect();
      // The "read line" sits at mid-viewport: content above it counts as read.
      const anchor = window.innerHeight * 0.5;
      const prog = Math.max(0, Math.min(1, (anchor - rect.top) / rect.height));
      wrap.style.setProperty("--progress", String(prog));

      const fillPx = prog * rect.height;
      nodes.forEach((n) => {
        n.dataset.active = n.offsetTop + MARKER <= fillPx ? "true" : "false";
      });
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [steps.length]);

  return (
    <ol ref={wrapRef} className={styles.timeline}>
      {steps.map((s) => (
        <li
          key={s.num}
          className={styles.step}
          data-step
          data-active="false"
        >
          <span className={styles.node} aria-hidden="true" />
          <p className={`${styles.stepNum} mono`}>{s.num}</p>
          <h3 className={styles.stepTitle}>{s.title}</h3>
          <p className={styles.stepText}>{s.body}</p>
        </li>
      ))}
    </ol>
  );
}
