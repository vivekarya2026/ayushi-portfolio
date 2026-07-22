import type { Variants, Transition } from "motion/react";

// From yaros.me — faster attack, smoother settle than default expo
export const EASE_OUT_EXPO: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const transition: Transition = {
  duration: 0.7,
  ease: EASE_OUT_EXPO,
};

export const staggerChildren = (stagger = 0.05): Transition => ({
  staggerChildren: stagger,
});

// 1. Rise-in: text blocks — y:60 with spring (from abhijitrout + heatbureau blend)
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", bounce: 0, duration: 1.0 },
  },
};

// Rise-in for cards — more dramatic y:80 + subtle scale (from heatbureau)
export const riseInCard: Variants = {
  hidden: { opacity: 0, y: 80, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", bounce: 0, duration: 1.2 },
  },
};

export const riseInContainer: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.05,
    },
  },
};

// From heatbureau — character/word blur reveal
export const letterBlurIn: Variants = {
  hidden: { opacity: 0, filter: "blur(10px)", scale: 1.5 },
  visible: {
    opacity: 1,
    filter: "blur(0px)",
    scale: 1,
    transition: { type: "spring", bounce: 0, duration: 0.8 },
  },
};

export const letterBlurContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.04 },
  },
};

// 2. Line-draw: scaleX 0→1
export const lineDraw: Variants = {
  hidden: { scaleX: 0, originX: 0 },
  visible: {
    scaleX: 1,
    transition: { duration: 0.7, ease: EASE_OUT_EXPO },
  },
};

// 3. Parallax-soft (use with useScroll + useTransform, not variants)
export const PARALLAX_RANGE = 40;
export const PARALLAX_RATIO = 0.9;

// 4. Hover-lift (from handee: scale 1.05 on image)
export const hoverLift = {
  rest: { y: 0, scale: 1 },
  hover: {
    y: -6,
    transition: { duration: 0.25, ease: EASE_OUT_EXPO },
  },
};

export const hoverLiftImage = {
  rest: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: { duration: 0.3, ease: EASE_OUT_EXPO },
  },
};

// 5. Page transition
export const pageEnter: Variants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: EASE_OUT_EXPO },
  },
};

export const pageExit: Variants = {
  visible: { opacity: 1, y: 0 },
  hidden: {
    opacity: 0,
    y: -12,
    transition: { duration: 0.3, ease: EASE_OUT_EXPO },
  },
};

// 6. Pin-chapter: handled via CSS sticky + scroll progress

// Reduced motion fallback variant
export const fadeOnly: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.15 },
  },
};

// Stagger container for reduced motion
export const fadeOnlyContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.03 },
  },
};
