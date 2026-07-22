"use client";

import Image from "next/image";
import { motion, useReducedMotion, useInView } from "motion/react";
import { useRef } from "react";
import { EASE_OUT_EXPO } from "@/lib/motion";
import type { ImageBlock } from "@/content/types";

interface ImageFlowProps {
  images: ImageBlock[];
  projectTitle: string;
}

export function ImageFlow({ images, projectTitle }: ImageFlowProps) {
  return (
    <section className="space-y-4 md:space-y-6">
      {images.map((image, i) => (
        <ImageBlockItem
          key={`${projectTitle}-${i}`}
          image={image}
          index={i}
        />
      ))}
    </section>
  );
}

function ImageBlockItem({ image, index }: { image: ImageBlock; index: number }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const prefersReducedMotion = useReducedMotion();

  const layoutClasses: Record<string, string> = {
    single: "mx-auto max-w-[1100px] px-6 md:px-12",
    diptych: "mx-auto max-w-[var(--container-max)] px-6 md:px-12",
    "full-bleed": "w-full",
  };

  return (
    <motion.div
      ref={ref}
      initial={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, ease: EASE_OUT_EXPO, delay: index * 0.05 }}
      className={layoutClasses[image.layout]}
    >
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={image.src}
          alt={image.alt}
          width={1920}
          height={1080}
          className="w-full h-auto"
          sizes={
            image.layout === "full-bleed"
              ? "100vw"
              : image.layout === "single"
              ? "(max-width: 768px) 100vw, 1100px"
              : "(max-width: 768px) 100vw, 1400px"
          }
        />
      </div>
      {image.caption && (
        <p className="mt-2 font-mono text-[11px] text-ink-soft text-center">
          {image.caption}
        </p>
      )}
    </motion.div>
  );
}
