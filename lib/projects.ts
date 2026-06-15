// The project case pages (/prosjekt/[slug]) aren't built yet. Until they are,
// clicking a project sends the visitor back to the homepage instead of a 404.
// Flip this to true once the pages exist and the links light up automatically.
export const PROJECTS_READY = false;

export const projectHref = (slug: string) =>
  PROJECTS_READY ? `/prosjekt/${slug}` : "/";

export type Project = {
  slug: string;
  title: string;
  year: string;
  tag: string;
  /** Web-ready thumbnail in /public/projects. */
  image: string;
  /** CSS background shown behind/while the image loads (and as a fallback). */
  gradient: string;
  featured?: boolean;
};

export const projects: Project[] = [
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
    slug: "eide-bruktbil",
    title: "Auto 8-8 — Eide Bruktbil",
    year: "2024",
    tag: "annonse",
    image: "/projects/eide-bruktbil.webp",
    gradient: "linear-gradient(135deg, #b6ff6b 0%, #21d39a 60%, #06241f 100%)",
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
