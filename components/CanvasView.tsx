"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import type { Project } from "@/lib/projects";
import styles from "./CanvasView.module.css";

export default function CanvasView({ projects }: { projects: Project[] }) {
  const viewportRef = useRef<HTMLDivElement>(null);
  const fieldRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const viewport = viewportRef.current;
    const field = fieldRef.current;
    if (!viewport || !field) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const ctx = gsap.context(() => {
      // Idle float per card — skipped when motion is reduced.
      if (!reduced) {
        gsap.utils.toArray<HTMLElement>(`.${styles.cardFloat}`).forEach((el, i) => {
          gsap.to(el, {
            y: gsap.utils.random(-16, 16),
            rotation: gsap.utils.random(-2.5, 2.5),
            duration: gsap.utils.random(3.5, 6),
            delay: i * 0.12,
            ease: "sine.inOut",
            repeat: -1,
            yoyo: true,
          });
        });
      }

      // Drag-to-pan + gentle cursor parallax.
      const offset = { x: 0, y: 0 };
      const MAX = 220;
      const xTo = gsap.quickTo(field, "x", { duration: 0.7, ease: "power3" });
      const yTo = gsap.quickTo(field, "y", { duration: 0.7, ease: "power3" });

      let dragging = false;
      let startX = 0;
      let startY = 0;

      const clamp = (v: number) => Math.max(-MAX, Math.min(MAX, v));

      function onPointerDown(e: PointerEvent) {
        dragging = true;
        viewport!.dataset.dragging = "true";
        startX = e.clientX;
        startY = e.clientY;
        viewport!.setPointerCapture(e.pointerId);
      }

      function onPointerMove(e: PointerEvent) {
        if (dragging) {
          xTo(clamp(offset.x + (e.clientX - startX)));
          yTo(clamp(offset.y + (e.clientY - startY)));
        } else if (!reduced) {
          const px = (e.clientX / window.innerWidth - 0.5) * 36;
          const py = (e.clientY / window.innerHeight - 0.5) * 36;
          xTo(clamp(offset.x + px));
          yTo(clamp(offset.y + py));
        }
      }

      function onPointerUp(e: PointerEvent) {
        if (!dragging) return;
        offset.x = clamp(offset.x + (e.clientX - startX));
        offset.y = clamp(offset.y + (e.clientY - startY));
        dragging = false;
        viewport!.dataset.dragging = "false";
      }

      viewport!.addEventListener("pointerdown", onPointerDown);
      viewport!.addEventListener("pointermove", onPointerMove);
      window.addEventListener("pointerup", onPointerUp);

      return () => {
        viewport!.removeEventListener("pointerdown", onPointerDown);
        viewport!.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerUp);
      };
    }, viewport);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={viewportRef} className={styles.viewport} data-dragging="false">
      <div ref={fieldRef} className={styles.field}>
        {projects.map((p) => (
          <div
            key={p.slug}
            className={styles.cardPos}
            style={
              {
                left: `${p.canvas.x}%`,
                top: `${p.canvas.y}%`,
                "--w": `${p.canvas.w}px`,
                "--z": `${p.canvas.depth}px`,
                "--rot": `${p.canvas.rot}deg`,
              } as React.CSSProperties
            }
          >
            <div className={styles.cardFloat}>
              <a
                href={`/prosjekt/${p.slug}`}
                className={styles.card}
                data-featured={p.featured}
                aria-label={`${p.title} — ${p.tag}, ${p.year}`}
                onDragStart={(e) => e.preventDefault()}
              >
                <span
                  className={styles.thumb}
                  style={{ background: p.gradient }}
                />
                <span className={styles.label}>
                  <span className={styles.title}>{p.title}</span>
                  <span className={styles.tag}>
                    {p.tag} · {p.year}
                  </span>
                </span>
              </a>
            </div>
          </div>
        ))}
      </div>

      <span className={`${styles.hint} mono`}>dra for å utforske</span>
    </div>
  );
}
