"use client";

import { useCallback, useEffect, useState, type CSSProperties } from "react";
import Image from "next/image";
import styles from "./PhotoGallery.module.css";

export type PhotoShot = { src: string; w: number; h: number; name: string };
export type PhotoGroup = {
  label: string;
  alt: string;
  shots: PhotoShot[];
  // Row-height preset. "sm" packs more per row (compact), "lg" fewer/larger.
  // Default "md". The exact number per row is dynamic — it depends on each
  // shot's aspect ratio and the viewport width.
  size?: "sm" | "md" | "lg";
  // Optional element id, so the reading-progress rail can anchor a checkpoint
  // on this group.
  id?: string;
};

// Justified rows: every row fills the full content width, all images in a row
// share one height, and each image keeps (close to) its own aspect ratio. This
// avoids the empty gaps and forced crops of fixed-ratio frames — landscape
// shots come out wide and short, portraits narrow, near-square ones grab more
// width so fewer fit per row. Pure CSS (flex-grow / flex-basis ∝ aspect ratio),
// so it's SSR-safe and reflows on resize with no JavaScript layout pass.
function Group({
  group,
  offset,
  onOpen,
}: {
  group: PhotoGroup;
  offset: number;
  onOpen: (index: number) => void;
}) {
  return (
    <section className={styles.group} id={group.id}>
      <div className={styles.groupHead}>
        <p className={`${styles.groupLabel} mono`}>{group.label}</p>
      </div>
      <div className={styles.gallery} data-size={group.size ?? "md"}>
        {group.shots.map((shot, i) => {
          const ar = shot.w / shot.h;
          return (
            <button
              key={shot.src}
              type="button"
              className={styles.cell}
              style={
                {
                  position: "relative",
                  "--ar": ar,
                  flexGrow: ar,
                  flexBasis: `calc(${ar} * var(--row-h))`,
                } as CSSProperties
              }
              onClick={() => onOpen(offset + i)}
              aria-label="Åpne bilde i fullskjerm"
            >
              <Image
                className={styles.cellImg}
                src={shot.src}
                alt={group.alt}
                fill
                sizes="(max-width: 560px) 50vw, (max-width: 900px) 33vw, 25vw"
                loading="lazy"
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

// Grouped justified galleries with a shared fullscreen lightbox. Clicking any
// photo opens it full-screen with keyboard (Esc to close, ←/→ to step) and
// click-outside support. All shots are flattened so the lightbox can page
// across groups.
export default function PhotoGallery({ groups }: { groups: PhotoGroup[] }) {
  const flat = groups.flatMap((g) =>
    g.shots.map((s) => ({ ...s, alt: g.alt })),
  );
  const [open, setOpen] = useState<number | null>(null);
  const isOpen = open !== null;

  const close = useCallback(() => setOpen(null), []);
  const step = useCallback(
    (dir: number) =>
      setOpen((i) =>
        i === null ? i : (i + dir + flat.length) % flat.length,
      ),
    [flat.length],
  );

  // Keyboard controls + scroll lock while the lightbox is open.
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") step(1);
      else if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen, close, step]);

  // Per-group starting index in the flat list (pure prefix-sum).
  const offsets = groups.map((_, gi) =>
    groups.slice(0, gi).reduce((sum, g) => sum + g.shots.length, 0),
  );

  return (
    <>
      {groups.map((group, gi) => (
        <Group
          key={group.label}
          group={group}
          offset={offsets[gi]}
          onOpen={setOpen}
        />
      ))}

      {isOpen ? (
        <div
          className={styles.lightbox}
          role="dialog"
          aria-modal="true"
          aria-label="Bilde i fullskjerm"
          onClick={close}
        >
          <button
            type="button"
            className={`${styles.lbBtn} ${styles.lbClose} mono`}
            onClick={close}
            aria-label="Lukk"
          >
            ✕
          </button>
          <button
            type="button"
            className={`${styles.lbBtn} ${styles.lbPrev}`}
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            aria-label="Forrige bilde"
          >
            <span aria-hidden="true">←</span>
          </button>
          <button
            type="button"
            className={`${styles.lbBtn} ${styles.lbNext}`}
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            aria-label="Neste bilde"
          >
            <span aria-hidden="true">→</span>
          </button>
          <div className={styles.lbStage} onClick={(e) => e.stopPropagation()}>
            <Image
              key={flat[open].src}
              className={styles.lbImg}
              src={flat[open].src}
              alt={flat[open].alt}
              width={flat[open].w}
              height={flat[open].h}
              sizes="92vw"
              priority
            />
          </div>
        </div>
      ) : null}
    </>
  );
}
