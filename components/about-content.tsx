"use client";

import { motion, useReducedMotion, useInView } from "motion/react";
import Image from "next/image";
import { useRef } from "react";
import { EASE_OUT_EXPO, lineDraw } from "@/lib/motion";
import { Download, ArrowUpRight } from "lucide-react";
import { t } from "@/content/copy";
import { asset } from "@/lib/base-path";

const CAPABILITIES = [
  {
    title: "Packaging Design",
    description: "From shelf to hand—creating packaging that earns its place on counters and in memories.",
  },
  {
    title: "Brand Identity",
    description: "Visual systems that hold together across every touchpoint, from business card to bar front.",
  },
  {
    title: "Sports & Gear",
    description: "Equipment graphics and collections for badminton, pickleball, and paddle sports.",
  },
  {
    title: "Print & Illustration",
    description: "Stickers, posters, carousels, and hand-drawn work that lives outside screens.",
  },
];

const TOOLS = [
  "Adobe Illustrator",
  "Photoshop",
  "InDesign",
  "Figma",
  "Procreate",
  "After Effects",
]; // [VERIFY]

export function AboutContent() {
  const bioRef = useRef(null);
  const capRef = useRef(null);
  const bioInView = useInView(bioRef, { once: true, margin: "-80px" });
  const capInView = useInView(capRef, { once: true, margin: "-80px" });
  const prefersReducedMotion = useReducedMotion();

  const item = prefersReducedMotion
    ? { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 0.15 } } }
    : {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE_OUT_EXPO } },
      };

  return (
    <div className="page-top pb-24 md:pb-32">
      {/* Page header — same centered structure as every section */}
      <div className="section-header px-6 md:px-12 mb-14 md:mb-20">
        <p className="type-eyebrow">{t.about.eyebrow}</p>
        <h1 className="type-h1">{t.about.heading}</h1>
      </div>

      {/* Bio section */}
      <section ref={bioRef} className="px-6 md:px-12">
        <div className="mx-auto max-w-[var(--container-max)] grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16">
          {/* Portrait placeholder */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={bioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, ease: EASE_OUT_EXPO }}
            className="md:col-span-5"
          >
            {/* aspect-[3/4] ≈ the photo's own 1020×1387 ratio, so object-cover
                barely crops; object-position keeps her face in frame. */}
            <div className="relative aspect-[3/4] rounded-xl overflow-hidden bg-canvas-dark">
              <Image
                src="/images/about/ayushi-portrait.jpg"
                alt={t.about.portraitAlt}
                fill
                sizes="(max-width: 768px) 100vw, 42vw"
                className="object-cover object-[50%_30%]"
                preload
              />
            </div>
          </motion.div>

          {/* Bio text */}
          <motion.div
            initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
            animate={bioInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.15, duration: 0.6, ease: EASE_OUT_EXPO }}
            className="md:col-span-7 flex flex-col justify-center"
          >
            <div className="space-y-4 type-body">
              <p>{t.about.bio1} {/* NIFT per Ayushi's own IG bio (@n.i.f.t Rajghat'22) */}</p>
              <p>{t.about.bio2} {/* [VERIFY] */}</p>
              <p>{t.about.bio3} {/* [VERIFY] */}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities */}
      <section ref={capRef} className="px-6 md:px-12 mt-24 md:mt-28">
        <div className="mx-auto max-w-[var(--container-max)]">
          {/* Line-draw divider */}
          <motion.div
            variants={lineDraw}
            initial="hidden"
            animate={capInView ? "visible" : "hidden"}
            className="h-px bg-line mb-12 md:mb-16"
          />

          <p className="type-eyebrow mb-10">{t.about.whatIDo}</p>

          <motion.div
            initial="hidden"
            animate={capInView ? "visible" : "hidden"}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.08 } } }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12"
          >
            {CAPABILITIES.map((cap) => (
              <motion.div key={cap.title} variants={item}>
                <h3 className="font-sans text-lg font-medium mb-2">{cap.title}</h3>
                <p className="type-body-sm text-ink-soft">{cap.description}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Tools */}
          <div className="mt-16 md:mt-20">
            <p className="type-eyebrow mb-4">{t.about.tools}</p>
            <p className="font-mono text-sm text-ink-soft">
              {TOOLS.join(" · ")}
            </p>
          </div>

          {/* Resume download */}
          <div className="mt-12 md:mt-16">
            <a href={asset("/resume.pdf")} download className="btn-primary">
              <Download size={16} />
              {t.about.downloadResume}
            </a>
          </div>

          {/* Contact strip */}
          <div className="mt-24 md:mt-32">
            <motion.div
              variants={lineDraw}
              initial="hidden"
              animate={capInView ? "visible" : "hidden"}
              className="h-px bg-line mb-10"
            />
            <p className="type-eyebrow mb-4">{t.about.getInTouch}</p>
            <a
              href="mailto:ayushidubey1210@gmail.com"
              className="tap-safe gap-2 text-lg text-ink hover:text-accent transition-colors duration-[var(--duration-fast)] group"
            >
              ayushidubey1210@gmail.com
              <ArrowUpRight
                size={18}
                className="transition-transform duration-[var(--duration-normal)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
