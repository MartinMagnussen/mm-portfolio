// The project case pages (/prosjekt/[slug]) exist as a shared placeholder
// template — real per-project content gets filled in later. Links are live.
export const PROJECTS_READY = true;

export const projectHref = (slug: string) =>
  PROJECTS_READY ? `/prosjekt/${slug}` : "/";

export type Project = {
  slug: string;
  title: string;
  year: string;
  tag: string;
  /** Web-ready thumbnail in /public/projects — the 16:9 base used everywhere. */
  image: string;
  /**
   * Optional art-direction variants of `image` for the full-bleed hero / next
   * bands, so they don't crop-zoom on very wide or portrait viewports. Drop the
   * files in /public/projects and point these at them; until then the bands fall
   * back to `image`. Convention: foo-portrait.webp (9:16), foo-ultrawide.webp.
   */
  imagePortrait?: string; // 9:16, shown on phones
  imageUltrawide?: string; // 21:9 / 32:9, shown on big monitors
  /** CSS background shown behind/while the image loads (and as a fallback). */
  gradient: string;
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "placeholder",
    title: "Placeholder",
    year: "2025",
    tag: "placeholder",
    image: "/projects/placeholder.webp",
    gradient: "linear-gradient(135deg, #baff18 0%, #4a6b0a 45%, #0a0a0b 100%)",
    featured: true,
  },
  {
    slug: "fra-sofa-til-sporty",
    title: "Fra sofa til Sporty",
    year: "2025",
    tag: "reklamekonsept",
    image: "/projects/fra-sofa-til-sporty.webp",
    gradient: "linear-gradient(135deg, #ff7a2f 0%, #ffd25e 45%, #2b1a0d 100%)",
    featured: true,
  },
  {
    slug: "sporty-rebrand",
    title: "Sporty Rebrand",
    year: "2025",
    tag: "identitet",
    image: "/projects/sporty-rebrand.webp",
    gradient: "linear-gradient(135deg, #6ee7ff 0%, #4f7bff 50%, #0c1b4d 100%)",
    featured: true,
  },
  {
    slug: "sporty-skjermer",
    title: "Sporty-skjermer",
    year: "2025–2026",
    tag: "skjermreklame",
    image: "/projects/sporty-skjermer-card.webp",
    gradient: "linear-gradient(135deg, #cfe3ff 0%, #5b8def 55%, #0b1733 100%)",
  },
  {
    slug: "sbg-helene",
    title: "SBG — video med Helene",
    year: "2024",
    tag: "film",
    image: "/projects/sbg-helene.webp",
    gradient: "linear-gradient(135deg, #d999ff 0%, #7a3cff 55%, #160a2e 100%)",
  },
  {
    slug: "gt-challenge",
    title: "GT Challenge",
    year: "2023",
    tag: "kampanje",
    image: "/projects/gt-challenge.webp",
    gradient: "linear-gradient(135deg, #ff5e8a 0%, #ff9a3c 60%, #2b0d14 100%)",
  },
];
