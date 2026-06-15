"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import styles from "./ListView.module.css";

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [tilt, setTilt] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Lean the preview a little, re-rolled only when we land on a new row. Each
  // step moves at most 15° from the current lean and stays within ±20°, so it
  // wanders gently and never snaps from one extreme to the other.
  function show(i: number) {
    if (active === i) return;
    setTilt((prev) => {
      const step = (Math.random() * 2 - 1) * 15;
      return Math.max(-20, Math.min(20, prev + step));
    });
    setActive(i);
  }

  function move(e: React.MouseEvent) {
    const el = previewRef.current;
    if (!el) return;
    el.style.left = `${e.clientX + 150}px`;
    el.style.top = `${e.clientY}px`;
  }

  return (
    <section className={styles.wrap} id="arbeid" onMouseMove={move}>
      <h1 className="visually-hidden">Arbeid</h1>
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
    </section>
  );
}
