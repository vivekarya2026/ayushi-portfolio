"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useInView } from "motion/react";
import { useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Project } from "@/content/types";
import { ImageFlow } from "./image-flow";
import { t } from "@/content/copy";

interface CaseStudyContentProps {
  project: Project;
  nextProject?: Project;
}

export function CaseStudyContent({ project, nextProject }: CaseStudyContentProps) {
  const prefersReducedMotion = useReducedMotion();
  const overviewRef = useRef(null);
  const overviewInView = useInView(overviewRef, { once: true, margin: "-80px" });

  const stagger = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12, delayChildren: 0.2 } },
  };

  const heroItem = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        hidden: { opacity: 0, y: 60 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 1.0 } },
      };

  const contentItem = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0, duration: 0.8 } },
      };

  return (
    <article>
      {/* Hero with theme-color wash */}
      <section
        className="page-top pb-16 md:pb-24 px-6 md:px-12"
        style={{ backgroundColor: `${project.theme}12` }}
      >
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="visible"
          className="mx-auto max-w-[var(--container-max)]"
        >
          <motion.h1 variants={heroItem} className="type-display-title text-center">
            {project.title}
          </motion.h1>

          {/* Metadata: clean 3-item grid (Vivek pattern) */}
          <motion.dl
            variants={heroItem}
            className="mt-10 grid grid-cols-3 gap-6 md:gap-10 max-w-lg mx-auto text-center border-t border-line/50 pt-6"
          >
            <MetaItem label={t.caseStudy.category} value={project.categories[0]} />
            <MetaItem label={t.caseStudy.year} value={String(project.year)} />
            <MetaItem label={t.caseStudy.role} value={project.role} />
          </motion.dl>
        </motion.div>
      </section>

      {/* Overview block: 2-col ABT structure */}
      <section ref={overviewRef} className="px-6 md:px-12 section-pad-sm">
        <motion.div
          initial="hidden"
          animate={overviewInView ? "visible" : "hidden"}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }}
          className="mx-auto max-w-[var(--container-max)] grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16"
        >
          {/* Left: sticky label */}
          <motion.div
            variants={contentItem}
            className="md:col-span-4 md:sticky md:top-28 md:self-start"
          >
            <p className="type-eyebrow">{t.caseStudy.theBrief}</p>
          </motion.div>

          {/* Right: overview content */}
          <div className="md:col-span-8 space-y-6">
            <motion.div variants={contentItem}>
              <h3 className="type-eyebrow mb-2">{t.caseStudy.challenge}</h3>
              <p className="type-body text-ink">{project.overview.challenge}</p>
            </motion.div>
            <motion.div variants={contentItem}>
              <h3 className="type-eyebrow mb-2">{t.caseStudy.approach}</h3>
              <p className="type-body text-ink">{project.overview.approach}</p>
            </motion.div>
            <motion.div variants={contentItem}>
              <h3 className="type-eyebrow mb-2">{t.caseStudy.outcome}</h3>
              <p className="type-body text-ink">{project.overview.outcome}</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Image flow */}
      <ImageFlow images={project.images} projectTitle={project.title} />

      {/* Next project footer — Peak-End Rule */}
      {nextProject && (
        <section className="border-t border-line">
          <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-12 section-pad-sm">
            <p className="type-eyebrow mb-8">{t.caseStudy.nextProject}</p>
            <Link
              href={`/work/${nextProject.slug}`}
              className="group block"
            >
              <div className="relative overflow-hidden rounded-xl aspect-[21/9]">
                <Image
                  src={nextProject.heroImage}
                  alt={nextProject.title}
                  fill
                  className="object-cover transition-transform duration-[var(--duration-slow)] group-hover:scale-[1.02]"
                  sizes="(max-width: 768px) 100vw, 80vw"
                />
              </div>
              <div className="mt-6 flex items-center justify-between">
                <h3 className="type-title group-hover:text-accent transition-colors duration-[var(--duration-fast)]">
                  {nextProject.title}
                </h3>
                <ArrowRight
                  size={20}
                  className="text-ink-soft group-hover:text-accent group-hover:translate-x-1 transition-all duration-[var(--duration-normal)]"
                />
              </div>
            </Link>
          </div>
        </section>
      )}
    </article>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="type-eyebrow">{label}</dt>
      <dd className="font-sans text-sm text-ink mt-1">{value}</dd>
    </div>
  );
}
