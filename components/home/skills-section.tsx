"use client";

import { PhysicsPile } from "@/components/home/physics-pile";
import { t } from "@/content/copy";

export function SkillsSection() {
  return (
    <section className="px-6 md:px-12 section-pad border-t border-line bg-canvas overflow-hidden">
      <div className="mx-auto max-w-[var(--container-max)]">
        <div className="section-header mb-10">
          <p className="type-eyebrow">{t.home.skills.eyebrow}</p>
          <h2 className="type-h2">{t.home.skills.heading}</h2>
          <p className="text-ink-soft text-sm md:text-base">{t.home.skills.body}</p>
        </div>

        <PhysicsPile count={24} gravity={1} />
      </div>
    </section>
  );
}
