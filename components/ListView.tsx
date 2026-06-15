"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import styles from "./ListView.module.css";

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const [tilt, setTilt] = useState(0);
  const previewRef = useRef<HTMLDivElement>(null);

  // Lean the preview to a random side, 10–35° either way — but only re-roll
  // when we actually land on a new row, so it leans once per card (not on
  // every pointer move within the same row).
  function show(i: number) {
    if (active === i) return;
    const mag = 10 + Math.random() * 25;
    setTilt(Math.random() < 0.5 ? -mag : mag);
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
            background: active !== null ? projects[active].gradient : undefined,
            "--tilt": `${tilt}deg`,
          } as React.CSSProperties
        }
        aria-hidden="true"
      />
    </section>
  );
}
