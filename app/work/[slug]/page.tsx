import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { projects, getProjectBySlug, getNextProject } from "@/content/projects";
import { CaseStudyContent } from "@/components/case-study/case-study-content";
import { asset } from "@/lib/base-path";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const project = getProjectBySlug(slug);
  if (!project) return {};

  return {
    title: `${project.title} — Ayushi Dubey`,
    description: project.overview.challenge,
    openGraph: {
      title: `${project.title} — Ayushi Dubey`,
      description: project.overview.approach,
      images: [{ url: asset(project.ogImage), width: 1200, height: 630 }],
    },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { slug } = await params;
  const project = getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const nextProject = getNextProject(slug);

  return <CaseStudyContent project={project} nextProject={nextProject} />;
}
