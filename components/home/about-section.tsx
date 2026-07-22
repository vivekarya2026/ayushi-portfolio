"use client";

import { useEffect, useRef, useState } from "react";
import type { MotionValue } from "motion/react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";

/**
 * About — scroll-driven "alarm snooze" sequence with a reading hold.
 *
 * A tall scroll container (~420vh) pins a 100vh dark stage.
 * Three phases share the same CSS grid cell (gridArea 1/1) — no absolute
 * stacking — so sticky is never broken by position context.
 *
 * useScroll targets the OUTER tall container with offset ["start start",
 * "end end"] so progress runs 0→1 across the full scroll distance, not
 * just the visible viewport slice.
 *
 * Phase timeline:
 *   A  0.00–0.09  alarm entry
 *   A  0.09–0.22  alarm ringing (class toggle)
 *   AB 0.20–0.24  crossfade alarm→slider (alarm stops ringing at 0.20)
 *   B  0.24–0.42  snooze scrub (thumb, fill, shimmer)
 *   B  0.42–0.46  completion pop + slider collapse
 *   C  0.46–0.72  intro paragraph word-stagger
 *   —  0.72–0.96  HOLD (finished paragraph at rest)
 *   —  0.96–1.00  gentle release
 */

type Token = string | { icon: string };

const STATEMENT: Token[] = [
  "I", "craft", { icon: "✷" }, "packaging", "you", "pick", "up", "off",
  "shelves,", "gear", "you", "take", "to", "the", { icon: "🏸" }, "court,",
  "and", "stickers", "you", "peel", "and", "slap", "on", { icon: "◑" },
  "everything.", "My", "work", "lives", "where", "design", "meets",
  { icon: "▦" }, "physical", "space,", "brand", "identity,",
  "environmental", "graphics,", "and", { icon: "✎" }, "illustration.",
];

/* Values mirror the design tokens (JS-interpolated, so literals required):
   PAGE_BG = --color-canvas, DARK = --ref-bg-dark, GLOW/SNOOZE = --color-accent */
const PAGE_BG = "#f8f5ef";
const DARK = "#0b0c0f";
const FOLD_MID = "#2a1206";
const FOLD_GLOW = "oklch(0.55 0.19 35)";

const TRACK_BG = "rgb(59, 59, 62)";
const LABEL_COLOR = "#999";
const SNOOZE_DONE = "rgba(200, 52, 6, 1)";
const SNOOZE_UNDO_TINT = "rgba(200, 52, 6, 0.25)";
const THUMB_SHADOW = "0 24px 60px -20px rgba(0,0,0,0.7)";

// Phase boundaries
const A_ENTRY = 0.09;
const A_END = 0.22;
const B_START = 0.22;
const B_THUMB_START = 0.24;
const B_THUMB_END = 0.42;
const B_END = 0.46;
const C_START = 0.46;
const C_END = 0.72;
const HOLD_END = 0.96;

// Snooze track geometry (px)
const TRACK_W = 340;
const THUMB_W = 52;
const THUMB_TRAVEL = TRACK_W - THUMB_W - 12;

/* ------------------------------------------------------------------ */
/* Phase A — iPhone-style alarm card                                   */
/* ------------------------------------------------------------------ */
function AlarmCard({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const [ringing, setRinging] = useState(false);

  // Entry [0→0.09], hold, crossfade out [0.20→0.24].
  const opacity = useTransform(progress, [0, A_ENTRY, 0.20, 0.24], [0, 1, 1, 0]);
  const scale = useTransform(progress, [0, A_ENTRY], [0.92, 1]);
  const blur = useTransform(progress, [0, A_ENTRY], [8, 0]);
  const filter = useTransform(blur, (b) => `blur(${b}px)`);
  const y = useTransform(progress, [0.20, 0.24], [0, -30]);

  // Ringing only while in the [A_ENTRY, 0.20] window — stops before crossfade.
  useMotionValueEvent(progress, "change", (p) => {
    const active = p > A_ENTRY && p < 0.20;
    if (active !== ringing) setRinging(active);
  });

  const isVisible = useTransform(progress, (p) => p < 0.26);

  return (
    <motion.div
      aria-hidden={undefined}
      style={{
        gridArea: "1/1",
        display: "grid",
        placeItems: "center",
        opacity,
        y: reduced ? 0 : y,
        willChange: "opacity, transform",
        pointerEvents: "none",
      }}
    >
      <motion.div
        className={
          "alarm-card flex flex-col items-center px-10 py-8 rounded-[28px]" +
          (ringing && !reduced ? " alarm-ringing" : "")
        }
        style={{
          scale: reduced ? 1 : scale,
          filter: reduced ? "none" : filter,
          willChange: "transform, filter",
        }}
      >
        <span
          className="text-[11px] uppercase font-medium"
          style={{ letterSpacing: "0.2em", color: "oklch(0.65 0.15 35)" }}
        >
          Alarm
        </span>
        <span
          className="text-white leading-none my-2"
          style={{
            fontWeight: 250,
            fontSize: "clamp(4rem, 12vw, 8rem)",
            letterSpacing: "-0.02em",
          }}
        >
          5:30 PM
        </span>
        <span className="text-[16px]" style={{ color: "oklch(0.72 0.12 35)" }}>
          Shaam ki Chai ☕
        </span>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Phase B — slide-to-snooze                                           */
/* ------------------------------------------------------------------ */
function SnoozeSlider({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const [snoozed, setSnoozed] = useState(false);
  const [reversing, setReversing] = useState(false);

  // Fade in [0.22→0.28], hold, collapse [0.42→0.46].
  const opacity = useTransform(
    progress,
    [B_START, 0.28, B_THUMB_END, B_END],
    [0, 1, 1, 0],
  );
  const collapseScale = useTransform(progress, [B_THUMB_END, B_END], [1, 0.9]);
  const collapseY = useTransform(progress, [B_THUMB_END, B_END], [0, -40]);
  const collapseBlurPx = useTransform(progress, [B_THUMB_END, B_END], [0, 6]);
  const collapseFilter = useTransform(collapseBlurPx, (b) => `blur(${b}px)`);

  // Thumb scroll-scrub [0.24→0.42].
  const thumbX = useTransform(progress, [B_THUMB_START, B_THUMB_END], [0, THUMB_TRAVEL]);
  const fillWidth = useTransform(thumbX, [0, THUMB_TRAVEL], [THUMB_W, TRACK_W]);
  const fillColor = useTransform(
    thumbX,
    [0, THUMB_TRAVEL],
    ["rgba(200, 52, 6, 0.25)", "rgba(200, 52, 6, 0.45)"],
  );
  const labelOpacity = useTransform(
    progress,
    [B_THUMB_START, B_THUMB_START + (B_THUMB_END - B_THUMB_START) * 0.4],
    [1, 0],
  );

  const prev = useRef(0);
  useMotionValueEvent(progress, "change", (p) => {
    if (!snoozed && p >= B_THUMB_END - 0.005) setSnoozed(true);
    else if (snoozed && p < B_THUMB_END - 0.03) setSnoozed(false);

    const goingBack = p < prev.current;
    const withinTravel = p > B_THUMB_START && p < B_THUMB_END - 0.03;
    const past20 = (p - B_THUMB_START) / (B_THUMB_END - B_THUMB_START) < 0.8;
    if (goingBack && withinTravel && past20 && !reversing) {
      setReversing(true);
      window.setTimeout(() => setReversing(false), 200);
    }
    prev.current = p;
  });

  if (reduced) {
    return (
      <motion.div
        style={{
          gridArea: "1/1",
          display: "grid",
          placeItems: "center",
          opacity,
          pointerEvents: "none",
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{ width: "min(340px, 80vw)", height: 64, background: TRACK_BG }}
        >
          <span
            className="text-[14px] font-medium"
            style={{ color: LABEL_COLOR, letterSpacing: "-0.03em" }}
          >
            slide to snooze
          </span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      style={{
        gridArea: "1/1",
        display: "grid",
        placeItems: "center",
        opacity,
        pointerEvents: "none",
      }}
    >
      <motion.div
        className="relative flex items-center rounded-full overflow-hidden"
        style={{
          width: "min(340px, 80vw)",
          maxWidth: TRACK_W,
          height: 64,
          background: TRACK_BG,
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          scale: collapseScale,
          y: collapseY,
          filter: collapseFilter,
          willChange: "transform, filter",
        }}
      >
        {/* Green fill behind the thumb */}
        <motion.div
          className="absolute left-0 top-0 h-full"
          style={{
            width: fillWidth,
            background: reversing ? SNOOZE_UNDO_TINT : fillColor,
            transition: "background 200ms ease",
          }}
          aria-hidden
        />

        {/* Shimmer label */}
        <motion.span
          className="snooze-shimmer absolute inset-0 flex items-center justify-center text-[14px] font-medium select-none"
          style={{ opacity: labelOpacity, letterSpacing: "-0.03em" }}
        >
          slide to snooze
        </motion.span>

        {/* Thumb — bg crossfades white→green on completion */}
        <motion.div
          className="absolute left-[6px] flex items-center justify-center rounded-full"
          style={{
            width: THUMB_W,
            height: THUMB_W,
            x: thumbX,
            boxShadow: THUMB_SHADOW,
          }}
          animate={
            snoozed
              ? { scale: [1, 1.15, 1], backgroundColor: SNOOZE_DONE }
              : { scale: 1, backgroundColor: "#ffffff" }
          }
          transition={
            snoozed
              ? { duration: 0.45, times: [0, 0.4, 1], ease: [0.16, 1, 0.3, 1] }
              : { type: "spring", stiffness: 400, damping: 12 }
          }
        >
          {/* Chevron (visible when not snoozed — dark stroke on white bg) */}
          <motion.svg
            className="absolute"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ opacity: snoozed ? 0 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M9 6l6 6-6 6"
              stroke={DARK}
              strokeWidth="2.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
          {/* Checkmark (visible when snoozed — white stroke on green bg) */}
          <motion.svg
            className="absolute"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            animate={{ opacity: snoozed ? 1 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <path
              d="M5 13l4 4L19 7"
              stroke="#ffffff"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/* ------------------------------------------------------------------ */
/* Phase C — intro reveal                                              */
/* ------------------------------------------------------------------ */
function IntroReveal({
  progress,
  reduced,
}: {
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const opacity = useTransform(
    progress,
    [C_START - 0.02, C_START + 0.03, HOLD_END, 1],
    [0, 1, 1, 0.9],
  );
  const y = useTransform(progress, [HOLD_END, 1], [0, -12]);

  return (
    <motion.div
      style={{
        gridArea: "1/1",
        display: "grid",
        placeItems: "center",
        width: "100%",
        padding: "0 1.5rem",
        opacity,
        y: reduced ? 0 : y,
        willChange: "opacity, transform",
        pointerEvents: "none",
      }}
    >
      <div className="mx-auto max-w-[var(--container-max)] flex flex-col items-center">
        <p className="max-w-[900px] text-center font-sans text-[clamp(1.6rem,4.2vw,2.75rem)] font-medium leading-[1.35] tracking-[-0.02em] flex flex-wrap justify-center gap-x-[0.28em] gap-y-1">
          {STATEMENT.map((tok, i) => (
            <Word
              key={i}
              tok={tok}
              index={i}
              total={STATEMENT.length}
              progress={progress}
              reduced={reduced}
            />
          ))}
        </p>
      </div>
    </motion.div>
  );
}

function Word({
  tok,
  index,
  total,
  progress,
  reduced,
}: {
  tok: Token;
  index: number;
  total: number;
  progress: MotionValue<number>;
  reduced: boolean | null;
}) {
  const span = C_END - C_START;
  const step = span / total;
  const wordStart = C_START + index * step;
  const wordEnd = Math.min(wordStart + step * 2.5, C_END);

  const opacity = useTransform(progress, [wordStart, wordEnd], [0, 1]);
  const yEm = useTransform(progress, [wordStart, wordEnd], [12, 0]);
  const y = useTransform(yEm, (v) => `${v}px`);
  const blurPx = useTransform(progress, [wordStart, wordEnd], [6, 0]);
  const filter = useTransform(blurPx, (b) => `blur(${b}px)`);
  const chipScale = useTransform(
    progress,
    [wordStart, (wordStart + wordEnd) / 2, wordEnd],
    [0.6, 1.08, 1],
  );

  if (typeof tok === "string") {
    return (
      <motion.span
        className="about-gradient-text-dark inline-block"
        style={
          reduced
            ? { opacity }
            : { opacity, y, filter, willChange: "opacity, transform, filter" }
        }
      >
        {tok}
      </motion.span>
    );
  }

  return (
    <motion.span
      className="inline-flex items-center justify-center align-middle w-[1.55em] h-[1.55em] rounded-[0.35em] text-[0.9em] translate-y-[-0.05em] font-mono"
      style={
        reduced
          ? { opacity, background: "#ffffff", color: "oklch(0.55 0.19 35)", boxShadow: "0 2px 8px oklch(0.55 0.19 35 / 0.25)" }
          : { opacity, scale: chipScale, background: "#ffffff", color: "oklch(0.55 0.19 35)", boxShadow: "0 2px 8px oklch(0.55 0.19 35 / 0.25)" }
      }
    >
      {tok.icon}
    </motion.span>
  );
}

/* ------------------------------------------------------------------ */
/* Section shell                                                       */
/* ------------------------------------------------------------------ */
export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const [tall, setTall] = useState("420vh");

  useEffect(() => {
    const update = () => setTall(window.innerWidth < 768 ? "380vh" : "420vh");
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  // Target the OUTER tall wrapper; offset start→start / end→end so progress
  // runs 0→1 over the full scroll distance (not just the viewport slice).
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // After-fold: no 3-D rotation — a plain opacity fade avoids sub-pixel
  // seam artifacts where the sibling panels meet.
  const afterOpacity = useTransform(scrollYProgress, [0.88, 1], [0, 1]);

  return (
    <>
      {/* ── Transition before (sibling, above the tall container) ── */}
      <div
        aria-hidden
        className="relative w-full h-[35vh] md:h-[60vh] pointer-events-none z-10"
        style={{ perspective: "40vh" }}
      >
        <div
          className="w-full h-full"
          style={{
            transformOrigin: "50% 0%",
            willChange: "transform, opacity",
            background: `linear-gradient(to bottom, ${PAGE_BG} 0%, ${FOLD_GLOW} 42%, ${FOLD_MID} 68%, ${DARK} 100%)`,
            opacity: 1,
            transform: "none",
          }}
        />
      </div>

      {/* ── Tall scroll container — the useScroll target ── */}
      <div
        ref={containerRef}
        id="about"
        style={{ height: tall, backgroundColor: DARK }}
      >
        {/* Sticky stage — three phases share one grid cell */}
        <div
          className="sticky top-0 h-screen overflow-hidden grid place-items-center"
          style={{ backgroundColor: DARK }}
        >
          <AlarmCard progress={scrollYProgress} reduced={reduced} />
          <SnoozeSlider progress={scrollYProgress} reduced={reduced} />
          <IntroReveal progress={scrollYProgress} reduced={reduced} />
        </div>
      </div>

      {/* ── Transition after (sibling, overlaps bottom of tall container) ── */}
      {/* Negative margin-top pulls it up so the gradient bleeds into the dark
          section — eliminates the hard seam between the two sibling divs. */}
      <div
        aria-hidden
        className="relative w-full h-[50vh] md:h-[70vh] pointer-events-none z-10"
        style={{ marginTop: "calc(-35vh)" }}
      >
        <motion.div
          className="w-full h-full"
          style={{
            background: `linear-gradient(to bottom, transparent 0%, ${FOLD_MID} 40%, ${FOLD_GLOW} 65%, ${PAGE_BG} 100%)`,
            opacity: reduced ? 1 : afterOpacity,
            willChange: "opacity",
          }}
        />
      </div>

      {/* Spacer so the sticky release feels natural before the next section */}
      <div aria-hidden className="h-[10vh] bg-canvas" />
    </>
  );
}
