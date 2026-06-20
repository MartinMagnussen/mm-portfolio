import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/components/ProjectPage";
import FraSofaTilSporty from "@/components/cases/FraSofaTilSporty";
import SportySkjermer from "@/components/cases/SportySkjermer";
import SmoothScroll from "@/components/SmoothScroll";
import ScrollProgress from "@/components/ScrollProgress";
import { projects } from "@/lib/projects";

// Slugs that have a hand-built case component. Everything else falls back to the
// generic ProjectPage placeholder template until its real case is written.
const CASES: Record<
  string,
  (typeof ProjectPage) | typeof FraSofaTilSporty
> = {
  "fra-sofa-til-sporty": FraSofaTilSporty,
  "sporty-skjermer": SportySkjermer,
};

// Pre-render one page per project at build time.
export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projects.find((p) => p.slug === slug);
  if (!project) return {};
  const title = project.title;
  const description = `${project.title} — ${project.tag}, ${project.year}. Et prosjekt av Martin Magnussen.`;
  return {
    title,
    description,
    alternates: { canonical: `/prosjekt/${slug}` },
    openGraph: {
      title: `${title} — Martin Magnussen`,
      description,
      url: `/prosjekt/${slug}`,
      type: "article",
    },
  };
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const index = projects.findIndex((p) => p.slug === slug);
  if (index === -1) notFound();

  const project = projects[index];
  // Next project wraps around to the first once you reach the end.
  const next = projects[(index + 1) % projects.length];

  const Case = CASES[slug] ?? ProjectPage;
  return (
    <>
      <SmoothScroll />
      <ScrollProgress />
      <Case project={project} next={next} />
    </>
  );
}
