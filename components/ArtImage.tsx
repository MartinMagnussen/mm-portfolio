import styles from "./ArtImage.module.css";

type ArtImageProps = {
  /** Base / fallback source — the 16:9 version. Always rendered. */
  src: string;
  alt: string;
  /** 9:16 version, shown on narrow/portrait viewports (≤760px). */
  portrait?: string;
  /** 21:9 / 32:9 version, shown on very wide viewports (≥1600px). */
  ultrawide?: string;
  /** Eager-load + high fetch priority for an above-the-fold hero. */
  priority?: boolean;
  className?: string;
};

// Width-adaptive, art-directed image for the full-bleed hero and "next project"
// bands. Those bands have a fixed height with text laid over them, so the image
// is object-fit:cover — which crops (and visually "zooms") whenever the file's
// aspect ratio differs from the band's. To avoid that, upload up to three
// aspect-matched versions of the same picture and the browser picks the closest:
//
//   • portrait  → 9:16, shown on phones       (max-width: 760px)
//   • ultrawide → 21:9 / 32:9, big monitors   (min-width: 1600px)
//   • src       → 16:9, everything else (and the guaranteed fallback)
//
// Variants are OPTIONAL: a <source> is only emitted when its file is supplied,
// so nothing breaks before the extra versions exist — it simply falls back to
// `src` on every viewport. Recommended file naming next to the base image:
//   /projects/foo.webp · /projects/foo-portrait.webp · /projects/foo-ultrawide.webp
export default function ArtImage({
  src,
  alt,
  portrait,
  ultrawide,
  priority = false,
  className,
}: ArtImageProps) {
  return (
    <picture className={`${styles.picture}${className ? ` ${className}` : ""}`}>
      {portrait && <source media="(max-width: 760px)" srcSet={portrait} />}
      {ultrawide && <source media="(min-width: 1600px)" srcSet={ultrawide} />}
      {/* Raw <img> (not next/image) because next/image can't art-direct between
          differently-shaped sources via media queries; the files are already
          web-sized webp. */}
      <img
        className={styles.img}
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        fetchPriority={priority ? "high" : "auto"}
        decoding="async"
        draggable={false}
      />
    </picture>
  );
}
