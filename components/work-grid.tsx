"use client";

/**
 * WorkGrid — featured flagships + a filterable grid.
 *
 * Structure follows a few deliberate UX constraints:
 *  · Serial position — the three flagships lead the page (primacy), so the
 *    strongest work is seen first rather than buried in an 11-item grid.
 *  · Hick's law — filters are capped at ~7 targets. Categories carrying only
 *    a single project make poor filters, so only those with MIN_FOR_FILTER+
 *    projects earn a chip; the rest stay reachable under "All" and still show
 *    as chips on the cards themselves.
 *  · Fitts's law — chips are 44px min height with generous padding.
 *  · Filtering swaps the whole grid (keyed re-mount) rather than animating
 *    individual cards between positions, which stays smooth at this count.
 */

import { useMemo, useState } from "react";
import { motion, useReducedMotion } from "motion/react";
import { riseInCard } from "@/lib/motion";
import { ProjectCard } from "@/components/project-card";
import type { Project } from "@/content/types";

interface WorkGridProps {
  projects: Project[];
}

const ALL = "All";
/** A category needs at least this many projects to be worth its own filter. */
const MIN_FOR_FILTER = 2;
/** Hick's law — keep total targets (including "All") at seven or fewer. */
const MAX_FILTERS = 6;

export function WorkGrid({ projects }: WorkGridProps) {
  const [active, setActive] = useState<string>(ALL);
  const prefersReducedMotion = useReducedMotion();

  const flagships = useMemo(() => projects.filter((p) => p.isFlagship), [projects]);
  const others = useMemo(() => projects.filter((p) => !p.isFlagship), [projects]);

  // Categories ranked by how much work sits behind them.
  const filters = useMemo(() => {
    const counts = new Map<string, number>();
    for (const p of projects) {
      for (const c of p.categories) counts.set(c, (counts.get(c) ?? 0) + 1);
    }
    return [...counts.entries()]
      .filter(([, n]) => n >= MIN_FOR_FILTER)
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, MAX_FILTERS - 1)
      .map(([name, count]) => ({ name, count }));
  }, [projects]);

  const isAll = active === ALL;
  // "All" keeps the featured/rest split; a filter collapses to one flat grid
  // of every match (flagships included) so nothing is duplicated or hidden.
  const gridItems = useMemo(
    () => (isAll ? others : projects.filter((p) => p.categories.includes(active))),
    [isAll, others, projects, active],
  );

  const container = {
    hidden: {},
    visible: { transition: { staggerChildren: prefersReducedMotion ? 0 : 0.05 } },
  };
  const item = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.15 } } }
    : riseInCard;

  return (
    <div>
      {/* ── Featured flagships ───────────────────────────────────────────── */}
      {isAll && flagships.length > 0 && (
        <motion.div
          variants={container}
          initial="hidden"
          animate="visible"
          className="mb-16 md:mb-24 grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-10 md:gap-y-14"
        >
          {flagships.map((project, i) => (
            <motion.div
              key={project.slug}
              variants={item}
              className={i === 0 ? "md:col-span-12" : "md:col-span-6"}
            >
              <ProjectCard
                project={project}
                size="L"
                priority={i === 0}
                aspect={i === 0 ? "wide" : "standard"}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* ── Filters ──────────────────────────────────────────────────────── */}
      <div
        role="group"
        aria-label="Filter projects by category"
        className="mb-10 md:mb-14 flex flex-wrap gap-2 md:gap-3"
      >
        {[{ name: ALL, count: projects.length }, ...filters].map((f) => {
          const selected = active === f.name;
          return (
            <button
              key={f.name}
              type="button"
              aria-pressed={selected}
              onClick={() => setActive(f.name)}
              className={`work-filter focus-accent ${selected ? "is-active" : ""}`}
            >
              {f.name}
              <span className="work-filter-count">{f.count}</span>
            </button>
          );
        })}
      </div>

      {/* Announce result count to assistive tech without a visual duplicate. */}
      <p className="sr-only" aria-live="polite">
        {gridItems.length + (isAll ? flagships.length : 0)} projects shown
        {isAll ? "" : ` in ${active}`}
      </p>

      {/* ── Grid ─────────────────────────────────────────────────────────── */}
      <motion.div
        key={active} /* re-mount per filter so the stagger replays cleanly */
        variants={container}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-x-10 md:gap-y-16"
      >
        {gridItems.map((project, i) => (
          <motion.div
            key={project.slug}
            variants={item}
            className={`md:col-span-6 ${i % 3 === 0 ? "md:mt-10" : ""}`}
          >
            <ProjectCard project={project} size="M" priority={!isAll && i < 2} />
          </motion.div>
        ))}
      </motion.div>

      {gridItems.length === 0 && (
        <p className="type-body-sm text-ink-soft py-16 text-center">
          Nothing here yet — try another category.
        </p>
      )}
    </div>
  );
}
