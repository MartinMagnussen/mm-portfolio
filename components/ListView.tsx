"use client";

import { useEffect, useRef, useState } from "react";
import { projectHref, type Project } from "@/lib/projects";
import styles from "./ListView.module.css";

// How strongly the card drifts toward the cursor from the row it's anchored
// on. Small, so it stays a magnet hugging the line rather than chasing far off.
const PULL = 0.2;

// Horizontal cursor velocity leans the preview: each pixel of sideways travel
// adds this many degrees, capped low so the lean stays a subtle suggestion.
const TILT_PER_PX = 0.45;
const MAX_TILT = 7; // degrees
const TILT_DECAY = 0.86; // per frame: how quickly the lean rights itself

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // Centre of the hovered row — the preview is anchored here and nudges toward
  // the cursor from this point.
  const anchor = useRef({ x: 0, y: 0 });

  // Velocity-driven lean. Horizontal cursor movement feeds `tilt`, and a rAF
  // eases it back toward flat so the card rights itself once the cursor rests.
  const tilt = useRef(0);
  const lastX = useRef<number | null>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    function frame() {
      tilt.current *= TILT_DECAY;
      if (Math.abs(tilt.current) < 0.01) tilt.current = 0;
      const el = previewRef.current;
      if (el) el.style.setProperty("--tilt", `${tilt.current.toFixed(2)}deg`);
      raf = requestAnimationFrame(frame);
    }
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, []);

  function show(i: number, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    anchor.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    setActive(i);
  }

  // Pin the card to the active row, then offset it toward the cursor: pointer
  // up-right of the text → card sits up-right; down-left → down-left. The
  // horizontal delta since the last move also feeds the velocity-driven lean.
  function move(e: React.MouseEvent) {
    const el = previewRef.current;
    if (!el) return;
    const a = anchor.current;
    el.style.left = `${a.x}px`;
    el.style.top = `${a.y}px`;
    el.style.setProperty("--px", `${(e.clientX - a.x) * PULL}px`);
    el.style.setProperty("--py", `${(e.clientY - a.y) * PULL}px`);

    if (lastX.current !== null) {
      const dx = e.clientX - lastX.current;
      tilt.current = Math.max(
        -MAX_TILT,
        Math.min(MAX_TILT, tilt.current + dx * TILT_PER_PX),
      );
    }
    lastX.current = e.clientX;
  }

  return (
    <section className={styles.wrap} id="arbeid" onMouseMove={move}>
      <h1 className="visually-hidden">Arbeid</h1>

      {/* Preview sits behind the titles and follows the cursor, anchored on the
          hovered row; titles invert over it via mix-blend-mode for legibility. */}
      <div
        ref={previewRef}
        className={styles.preview}
        data-show={active !== null}
        style={
          {
            backgroundColor: "#0a0a0b",
            backgroundImage:
              active !== null ? `url(${projects[active].image})` : undefined,
          } as React.CSSProperties
        }
        aria-hidden="true"
      />

      <ul className={styles.list}>
        {projects.map((p, i) => (
          <li
            key={p.slug}
            className={styles.item}
            data-active={active === i}
            onMouseEnter={(e) => show(i, e.currentTarget)}
            onMouseLeave={() => setActive(null)}
          >
            <a
              href={projectHref(p.slug)}
              className={styles.link}
              onFocus={(e) => show(i, e.currentTarget)}
              onBlur={() => setActive(null)}
            >
              {p.title}
              <span className={styles.year}>{p.year}</span>
            </a>
          </li>
        ))}
      </ul>
    </section>
  );
}
