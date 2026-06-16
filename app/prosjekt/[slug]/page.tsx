import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPage from "@/components/ProjectPage";
import { projects } from "@/lib/projects";

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

  return <ProjectPage project={project} next={next} />;
}
