"use client";

import Image from "next/image";
import { useState } from "react";
import styles from "./PortraitDeck.module.css";

// The portrait rendered as a small deck of cards: a few stacked behind the top
// one, square indicator dots at the bottom centre, and a click that deals the
// top card to the back so the next image comes forward. For now the same photo
// is repeated; Martin can swap in distinct images later.
export default function PortraitDeck({
  images,
  alt,
}: {
  images: string[];
  alt: string;
}) {
  const [index, setIndex] = useState(0);
  const n = images.length;

  return (
    <div className={styles.deck}>
      <button
        type="button"
        className={styles.stack}
        onClick={() => setIndex((i) => (i + 1) % n)}
        aria-label="Vis neste bilde"
      >
        {images.map((src, i) => {
          // Relative depth in the stack: 0 = top, growing toward the back.
          const rel = (i - index + n) % n;
          const sign = rel % 2 === 0 ? -1 : 1;
          const tx = rel === 0 ? 0 : sign * (6 + rel * 3);
          const ty = rel * 8;
          const rot = rel === 0 ? -2 : sign * (2 + rel * 1.2);
          const scale = 1 - rel * 0.035;
          return (
            <span
              key={i}
              className={styles.card}
              style={{
                transform: `translate(${tx}px, ${ty}px) rotate(${rot}deg) scale(${scale})`,
                zIndex: n - rel,
              }}
              aria-hidden={rel !== 0}
            >
              <Image
                src={src}
                alt={rel === 0 ? alt : ""}
                fill
                sizes="(max-width: 768px) 70vw, 360px"
                priority={i === 0}
              />
            </span>
          );
        })}
      </button>

      <div className={styles.dots} aria-label="Velg bilde">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            className={styles.dot}
            data-active={i === index ? "" : undefined}
            aria-label={`Vis bilde ${i + 1} av ${n}`}
            aria-current={i === index ? "true" : undefined}
            onClick={() => setIndex(i)}
          />
        ))}
      </div>
    </div>
  );
}
