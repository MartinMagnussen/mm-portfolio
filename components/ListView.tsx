"use client";

import { useRef, useState } from "react";
import { projectHref, type Project } from "@/lib/projects";
import styles from "./ListView.module.css";

// How strongly the card drifts toward the cursor from the row it's anchored
// on. Small, so it stays a magnet hugging the line rather than chasing far off.
const PULL = 0.2;

// The lean the card lands with the moment you hover a row — a small base tilt
// to one side, re-rolled per row. Kept under the ~5–10° ceiling.
const BASE_MIN = 3; // degrees
const BASE_MAX = 7; // degrees
// On top of the base, the card leans further the more the cursor sits to one
// side of the row centre. At RANGE px off-centre it has swung the full SWING;
// the total is clamped to MAX_TILT so it never tips too far.
const RANGE = 460; // px off-centre that maps to a full swing
const SWING = 8; // degrees added at the edge of RANGE
const MAX_TILT = 12; // degrees, hard cap on the combined lean

// A fresh base lean to one (random) side, magnitude within [BASE_MIN, BASE_MAX].
function rollBase() {
  const mag = BASE_MIN + Math.random() * (BASE_MAX - BASE_MIN);
  return Math.random() < 0.5 ? -mag : mag;
}

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  // Centre of the hovered row — the preview is anchored here and nudges toward
  // the cursor from this point.
  const anchor = useRef({ x: 0, y: 0 });
  // Base lean for the current row; horizontal cursor position adds to it.
  const base = useRef(0);

  // Lean = base + a share of SWING proportional to how far (as a %) the cursor
  // sits from the row centre toward RANGE. Purely positional, so the card holds
  // its angle while the cursor rests instead of springing back to flat.
  function applyTilt(clientX: number) {
    const el = previewRef.current;
    if (!el) return;
    const frac = Math.max(-1, Math.min(1, (clientX - anchor.current.x) / RANGE));
    const tilt = Math.max(
      -MAX_TILT,
      Math.min(MAX_TILT, base.current + frac * SWING),
    );
    el.style.setProperty("--tilt", `${tilt.toFixed(2)}deg`);
  }

  function show(i: number, el: HTMLElement) {
    const r = el.getBoundingClientRect();
    anchor.current = { x: r.left + r.width / 2, y: r.top + r.height / 2 };
    if (active === i) return;
    // New row → roll a fresh base lean, then show it immediately so the card
    // arrives already tilted.
    base.current = rollBase();
    previewRef.current?.style.setProperty(
      "--tilt",
      `${base.current.toFixed(2)}deg`,
    );
    setActive(i);
  }

  // Pin the card to the active row, then offset it toward the cursor: pointer
  // up-right of the text → card sits up-right; down-left → down-left. The
  // horizontal cursor position also sets the lean.
  function move(e: React.MouseEvent) {
    const el = previewRef.current;
    if (!el) return;
    const a = anchor.current;
    el.style.left = `${a.x}px`;
    el.style.top = `${a.y}px`;
    el.style.setProperty("--px", `${(e.clientX - a.x) * PULL}px`);
    el.style.setProperty("--py", `${(e.clientY - a.y) * PULL}px`);
    applyTilt(e.clientX);
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
