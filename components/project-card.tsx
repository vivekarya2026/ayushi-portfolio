"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { hoverLift, hoverLiftImage, EASE_OUT_EXPO } from "@/lib/motion";
import { TextRollover } from "@/components/text-rollover";
import type { Project } from "@/content/types";

interface ProjectCardProps {
  project: Project;
  size?: "L" | "M";
  priority?: boolean;
  /** Frame ratio. "wide" suits a full-bleed lead card, where 4:3 would run
      taller than the viewport and push the rest of the page out of sight. */
  aspect?: "standard" | "wide";
}

export function ProjectCard({
  project,
  size = "M",
  priority = false,
  aspect = "standard",
}: ProjectCardProps) {
  return (
    <motion.article
      initial="rest"
      whileHover="hover"
      animate="rest"
      variants={hoverLift}
      className="group relative card-glow"
    >
      <Link href={`/work/${project.slug}`} className="block">
        <div
          className={`relative overflow-hidden rounded-xl border border-ink/12 ${
            aspect === "wide" ? "aspect-[21/9]" : "aspect-[4/3]"
          }`}
        >
          <motion.div variants={hoverLiftImage} className="h-full w-full">
            <Image
              src={project.heroImage}
              alt={`${project.title} — ${project.categories[0]}`}
              fill
              className="object-cover"
              sizes={size === "L" ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
              priority={priority}
            />
          </motion.div>

          {/* Secondary image on hover — Variable Reward */}
          {project.secondaryImage && (
            <motion.div
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              variants={{
                rest: { opacity: 0 },
                hover: { opacity: 1, transition: { duration: 0.3, ease: EASE_OUT_EXPO } },
              }}
            >
              <Image
                src={project.secondaryImage}
                alt={`${project.title} — alternate view`}
                fill
                className="object-cover"
                sizes={size === "L" ? "(max-width: 768px) 100vw, 58vw" : "(max-width: 768px) 100vw, 42vw"}
              />
            </motion.div>
          )}
        </div>

        {/* Card metadata — serif project-title role (matches home cards) at grid optical size */}
        <div className="mt-4 flex items-start justify-between gap-4">
          <h3 className="type-title text-[clamp(1.25rem,2vw,1.75rem)] text-ink group-hover:text-accent transition-colors duration-[var(--duration-fast)]">
            <TextRollover>{project.title}</TextRollover>
          </h3>
          <span className="type-eyebrow shrink-0 mt-1.5">{project.year}</span>
        </div>
        <div className="mt-1 flex gap-2 flex-wrap">
          {project.categories.map((cat) => (
            <span key={cat} className="type-eyebrow">
              {cat}
            </span>
          ))}
        </div>
      </Link>
    </motion.article>
  );
}
