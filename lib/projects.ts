export type Project = {
  slug: string;
  title: string;
  year: string;
  tag: string;
  /** CSS background used as a placeholder thumbnail until real imagery lands. */
  gradient: string;
  featured?: boolean;
  /** Canvas placement (percent of field) + slight 3D tilt. */
  canvas: { x: number; y: number; rot: number; depth: number; w: number };
};

export const projects: Project[] = [
  {
    slug: "fra-sofa-til-sporty",
    title: "Fra sofa til Sporty",
    year: "2025",
    tag: "reklamekonsept",
    gradient:
      "linear-gradient(135deg, #ff7a2f 0%, #ffd25e 45%, #2b1a0d 100%)",
    featured: true,
    canvas: { x: 32, y: 30, rot: -5, depth: 60, w: 360 },
  },
  {
    slug: "sporty-rebrand",
    title: "Sporty Rebrand",
    year: "2025",
    tag: "identitet",
    gradient:
      "linear-gradient(135deg, #6ee7ff 0%, #4f7bff 50%, #0c1b4d 100%)",
    featured: true,
    canvas: { x: 66, y: 56, rot: 6, depth: 40, w: 340 },
  },
  {
    slug: "prosjekt-03",
    title: "Konsept 03",
    year: "2024",
    tag: "kampanje",
    gradient: "linear-gradient(135deg, #b6ff6b 0%, #21d39a 60%, #06241f 100%)",
    canvas: { x: 14, y: 62, rot: -9, depth: -30, w: 250 },
  },
  {
    slug: "prosjekt-04",
    title: "Konsept 04",
    year: "2024",
    tag: "art direction",
    gradient: "linear-gradient(135deg, #d999ff 0%, #7a3cff 55%, #160a2e 100%)",
    canvas: { x: 84, y: 24, rot: 8, depth: -50, w: 240 },
  },
  {
    slug: "prosjekt-05",
    title: "Konsept 05",
    year: "2023",
    tag: "bevegelse",
    gradient: "linear-gradient(135deg, #ff5e8a 0%, #ff9a3c 60%, #2b0d14 100%)",
    canvas: { x: 48, y: 74, rot: -3, depth: 10, w: 280 },
  },
  {
    slug: "prosjekt-06",
    title: "Konsept 06",
    year: "2023",
    tag: "innhold",
    gradient: "linear-gradient(135deg, #e9e4dc 0%, #9a93a8 55%, #2a2730 100%)",
    canvas: { x: 78, y: 78, rot: 4, depth: -20, w: 230 },
  },
  {
    slug: "prosjekt-07",
    title: "Konsept 07",
    year: "2023",
    tag: "kampanje",
    gradient: "linear-gradient(135deg, #6ee7ff 0%, #b6ff6b 70%, #07271f 100%)",
    canvas: { x: 22, y: 20, rot: 7, depth: -40, w: 230 },
  },
  {
    slug: "prosjekt-08",
    title: "Konsept 08",
    year: "2022",
    tag: "design",
    gradient: "linear-gradient(135deg, #ffd25e 0%, #ff5e8a 65%, #2b0d1e 100%)",
    canvas: { x: 58, y: 14, rot: -7, depth: 30, w: 250 },
  },
];
