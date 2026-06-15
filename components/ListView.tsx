"use client";

import { useState } from "react";
import type { Project } from "@/lib/projects";
import styles from "./ListView.module.css";

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [tilt, setTilt] = useState(0);

  // Lean the preview a little, re-rolled only when we land on a new row. Each
  // step moves at most 10° from the current lean and stays within ±10°, so it
  // wanders gently and never snaps from one extreme to the other.
  function show(i: number) {
    if (active === i) return;
    setTilt((prev) => {
      const step = (Math.random() * 2 - 1) * 10;
      return Math.max(-10, Math.min(10, prev + step));
    });
    setActive(i);
  }

  return (
    <section className={styles.wrap} id="arbeid">
      <h1 className="visually-hidden">Arbeid</h1>

      {/* Big preview sits centred behind the titles; the list text inverts
          over it via mix-blend-mode so it stays readable on any image. */}
      <div
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
            onMouseEnter={() => show(i)}
            onMouseLeave={() => setActive(null)}
          >
            <a
              href={`/prosjekt/${p.slug}`}
              className={styles.link}
              onFocus={() => show(i)}
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
