import type { Metadata } from "next";
import Link from "next/link";
import { WorkGrid } from "@/components/work-grid";
import { projects } from "@/content/projects";
import { t } from "@/content/copy";

export const metadata: Metadata = {
  title: t.meta.workTitle,
  description: t.meta.workDescription(projects.length),
};

export default function WorkPage() {
  return (
    <section className="page-top pb-24 md:pb-32 px-6 md:px-12">
      <div className="mx-auto max-w-[var(--container-max)]">
        {/* Header */}
        <div className="section-header mb-12 md:mb-20">
          <p className="type-eyebrow">{t.work.eyebrow}</p>
          <h1 className="type-h1">{t.work.heading}</h1>
          <p className="type-body text-ink-soft mt-4 max-w-[48ch]">
            {t.work.subheading}
          </p>
        </div>

        <WorkGrid projects={projects} />

        {/* Peak-end — the page resolves on an invitation rather than the last
            row of the grid, so the final impression is an open door. */}
        <div className="mt-24 md:mt-32 border-t border-line pt-14 md:pt-20 text-center">
          <h2 className="type-h2 text-ink">{t.contact.heading}</h2>
          <p className="type-body-sm text-ink-soft mt-3 mb-8 mx-auto max-w-[46ch]">
            {t.meta.contactDescription}
          </p>
          <Link href="/contact" className="btn-outline focus-accent">
            {t.about.getInTouch}
          </Link>
        </div>
      </div>
    </section>
  );
}
