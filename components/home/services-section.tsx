"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "motion/react";
import { t } from "@/content/copy";
import { asset } from "@/lib/base-path";

/**
 * Services — reference "home-about" work-list interaction:
 *  - A standard section header (eyebrow + type-h2), matching every other section.
 *  - A list of rows; each row has a title, a category label that swaps on
 *    hover, and an image that scales/fades in on hover. A fill line under each
 *    row draws in as the section scrolls into view.
 */

const SERVICES = [
  {
    title: "Packaging Design",
    category: "Structure · Dielines",
    categoryHover: "Shelf presence",
    image: "/images/rasbhari/4ddee317-f58b-4321-81be-7f38d324fea8.png",
  },
  {
    title: "Brand Identity",
    category: "Logo · Type systems",
    categoryHover: "Palettes · Guidelines",
    image: "/images/virasat/5322914d-b835-472d-883d-998b03d7c537.png",
  },
  {
    title: "Sports & Gear Graphics",
    category: "Collections · Line art",
    categoryHover: "Naming · Systems",
    image: "/images/accexx/0b63ecfe-d37a-4c50-94a7-88582df348a2.png",
  },
  {
    title: "Print & Illustration",
    category: "Posters · Stickers",
    categoryHover: "Editorial · Hand-drawn",
    image: "/images/goa-sticker-collective/6dcbd016-0adf-420f-917a-08e21599e41b.png",
  },
];

const TITLE = t.home.services.heading;
const RISE_EASE = [0.22, 1, 0.36, 1] as const;

export function ServicesSection() {
  const listRef = useRef<HTMLDivElement>(null);

  return (
    <section id="services" className="section-pad border-t border-line bg-canvas">
      <div className="mx-auto w-full max-w-[var(--container-max)] px-6 md:px-12">
        {/* Section header \u2014 one structure: eyebrow \u2192 animated title \u2192 subheading */}
        <div className="section-header pb-8 md:pb-12">
          <p className="type-eyebrow">{t.home.services.eyebrow}</p>
          <h2 className="type-h2 text-ink">{TITLE}</h2>
          <p className="text-lg max-w-[40ch] text-ink-soft">
            {t.home.services.subheading}
          </p>
        </div>

        {/* Work list */}
        <div ref={listRef} className="ref-work-list">
          <Line index={0} listRef={listRef} />
          {SERVICES.map((service, i) => (
            <div key={service.title}>
              <Link href="/work" className="ref-work-item group">
                <div className="ref-work-grid">
                  <div className="min-w-0">
                    <h3 className="ref-work-title">{service.title}</h3>
                  </div>
                  <div>
                    <span className="ref-clip-swap">
                      <span className="ref-clip-swap-top">{service.category}</span>
                      <span className="ref-clip-swap-bottom" aria-hidden="true">
                        {service.categoryHover}
                      </span>
                    </span>
                  </div>
                  <div className="ref-work-image-col">
                    <div className="ref-work-image">
                      <div
                        className="ref-work-image-inner"
                        style={{ backgroundImage: `url("${asset(service.image)}")` }}
                      />
                    </div>
                  </div>
                </div>
              </Link>
              <Line index={i + 1} listRef={listRef} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Line({
  index,
  listRef,
}: {
  index: number;
  listRef: React.RefObject<HTMLDivElement | null>;
}) {
  const inView = useInView(listRef, { once: true, margin: "-10% 0px" });
  return (
    <div className="ref-line">
      <motion.div
        className="ref-line-fill"
        initial={{ scaleX: 0 }}
        animate={inView ? { scaleX: 1 } : { scaleX: 0 }}
        transition={{
          duration: 0.9,
          ease: RISE_EASE,
          delay: 0.12 * index,
        }}
      />
    </div>
  );
}
