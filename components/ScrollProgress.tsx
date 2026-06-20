"use client";

import { useEffect, useRef } from "react";
import styles from "./ScrollProgress.module.css";

// A fixed vertical reading-progress rail, built in the same visual language as
// the ProcessTimeline on the case pages: a dim track with a lime "glow" fill
// that grows as you scroll, plus a checkpoint node per section that lights up
// once the fill reaches it. Driven entirely by document scroll — the fill is a
// CSS var (--progress 0..1) and each node toggles a data-attribute, so painting
// stays in CSS. Decorative (aria-hidden); the real headings carry the structure.
//
// `sections` are element ids to anchor the nodes on. Each node sits at the scroll
// fraction where its section reaches the read line (mid-viewport), so the fill
// passes through a node exactly as that section comes into focus.
export default function ScrollProgress({ sections }: { sections: string[] }) {
  const railRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rail = railRef.current;
    if (!rail) return;

    const nodes = Array.from(
      rail.querySelectorAll<HTMLElement>("[data-node]"),
    );
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (reduced) {
      rail.style.setProperty("--progress", "1");
      nodes.forEach((n) => (n.dataset.active = "true"));
      return;
    }

    const clamp = (v: number) => Math.max(0, Math.min(1, v));
    const maxScroll = () =>
      document.documentElement.scrollHeight - window.innerHeight;

    // Each node's threshold = the scroll fraction at which its section crosses
    // the mid-viewport read line. Stored on the node and reused for the fill
    // position (CSS top %) so the node and the moment it lights up always agree.
    const layout = () => {
      const max = maxScroll();
      nodes.forEach((node) => {
        const target = document.getElementById(node.dataset.node!);
        if (!target) return;
        const docTop =
          target.getBoundingClientRect().top + window.scrollY;
        const thr =
          max > 0 ? clamp((docTop - window.innerHeight * 0.5) / max) : 0;
        node.dataset.thr = String(thr);
        node.style.top = `${(thr * 100).toFixed(2)}%`;
      });
    };

    const update = () => {
      raf = 0;
      const max = maxScroll();
      const prog = max > 0 ? clamp(window.scrollY / max) : 0;
      rail.style.setProperty("--progress", String(prog));
      nodes.forEach((node) => {
        const thr = parseFloat(node.dataset.thr ?? "0");
        node.dataset.active = prog >= thr - 0.001 ? "true" : "false";
      });
    };

    let raf = 0;
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onResize = () => {
      layout();
      update();
    };

    layout();
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, [sections]);

  return (
    <div ref={railRef} className={styles.rail} aria-hidden="true">
      <span className={styles.track} />
      <span className={styles.fill} />
      {sections.map((id) => (
        <span
          key={id}
          className={styles.node}
          data-node={id}
          data-active="false"
        />
      ))}
    </div>
  );
}
