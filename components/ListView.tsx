"use client";

import { useRef, useState } from "react";
import { projectHref, type Project } from "@/lib/projects";
import styles from "./ListView.module.css";

// How strongly the card drifts toward the cursor from the row it's anchored
// on. Small, so it stays a magnet hugging the line rather than chasing far off.
const PULL = 0.2;

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [tilt, setTilt] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);
  // Centre of the hovered row — the preview is anchored here and nudges toward
  // the cursor from this point.
  const anchor = useRef({ x: 0, y: 0 });

  // Lean the preview a little, re-rolled only when we land on a new row. Each
  // step moves at most 10° from the current lean and stays within ±10°, so it
  // wanders gently and never snaps from one extreme to the other.
  function show(i: number, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    anchor.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    if (active === i) return;
    setTilt((prev) => {
      const step = (Math.random() * 2 - 1) * 10;
      return Math.max(-10, Math.min(10, prev + step));
    });
    setActive(i);
  }

  // Pin the card to the active row, then offset it toward the cursor: pointer
  // up-right of the text → card sits up-right; down-left → down-left.
  function move(e: React.MouseEvent) {
    const el = previewRef.current;
    if (!el) return;
    const a = anchor.current;
    el.style.left = `${a.x}px`;
    el.style.top = `${a.y}px`;
    el.style.setProperty("--px", `${(e.clientX - a.x) * PULL}px`);
    el.style.setProperty("--py", `${(e.clientY - a.y) * PULL}px`);
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
            "--tilt": `${tilt}deg`,
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
