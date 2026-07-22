"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { SquiggleArt } from "@/components/home/squiggle-art";
import { t } from "@/content/copy";

export function LottieHeart() {
  const wrapRef    = useRef<HTMLElement>(null);
  const artRef     = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();
  const isInView   = useInView(wrapRef, { once: true, margin: "-120px" });

  // Caption fades in when the squiggle is nearly done (progress ~0.8+)
  const { scrollYProgress } = useScroll({
    target: artRef,
    offset: ["start 0.88", "start 0.08"],
  });
  const captionOpacity = useTransform(scrollYProgress, [0.75, 0.92], [0, 1]);
  const captionY       = useTransform(scrollYProgress, [0.75, 0.92], [20, 0]);

  return (
    <section
      ref={wrapRef}
      className="relative bg-canvas overflow-visible section-pad"
    >
      <div className="relative mx-auto flex max-w-[var(--container-max)] flex-col items-center px-6 text-center">

        {/* Eyebrow */}
        <motion.p
          className="type-eyebrow"
          initial={{ opacity: 0, y: 12 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.home.outro.eyebrow}
        </motion.p>

        {/* Squiggle art + caption overlaid on the right */}
        <div
          ref={artRef}
          className="relative mt-8 md:mt-10 w-full max-w-[min(1100px,92vw)]"
        >
          <SquiggleArt />

          {/* Caption floats over the right-centre of the artwork */}
          {/* Overlaid on the artwork from md up, where the squiggle's right arm
              leaves open space. Below that the art is too narrow to host it, so
              the caption drops into normal flow underneath (see .outro-caption). */}
          <motion.p
            className="outro-caption font-sans font-medium leading-tight text-ink pointer-events-none"
            style={{
              opacity: reduced ? 1 : captionOpacity,
              y:       reduced ? 0 : captionY,
            }}
          >
            {t.home.outro.captionLine1}
            <br />
            <span className="text-accent">{t.home.outro.captionLine2}</span>
          </motion.p>
        </div>

      </div>
    </section>
  );
}
