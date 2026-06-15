"use client";

import { useRef, useState } from "react";
import type { Project } from "@/lib/projects";
import styles from "./ListView.module.css";

export default function ListView({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const previewRef = useRef<HTMLDivElement>(null);

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
            onMouseEnter={() => setActive(i)}
            onMouseLeave={() => setActive(null)}
          >
            <a
              href={`/prosjekt/${p.slug}`}
              className={styles.link}
              onFocus={() => setActive(i)}
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
        style={{
          background: active !== null ? projects[active].gradient : undefined,
        }}
        aria-hidden="true"
      />
    </section>
  );
}
