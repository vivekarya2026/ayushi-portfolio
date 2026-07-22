"use client";

/**
 * FlipDeck — the 3D card-flip gallery fused with the project deck, one
 * continuous scroll sequence on a single sticky stage (~1000vh):
 *
 *   p 0.00–0.36  the four flip acts (hero image → floating gallery →
 *                180° X-flip → end image expands to FULL SCREEN)
 *   p 0.36–0.42  THE SEAM: brief full-screen hold, then the end frame
 *                shrinks to the deck-card footprint while the real
 *                card #1 crossfades in at the same rect
 *   p 0.42–1.00  the deck: cards 2–6 slide up (110vh→0, ≈100vh scroll
 *                each) and cover the stack; covered cards step down 6%
 *                per covering card (floor 0.75), steps firing in the
 *                second half of each slide — front card always largest.
 *
 * The flip's end image IS deck project #1's hero, so the frame that
 * shrinks becomes the card. All former CardFlipGallery act timings are
 * preserved, remapped by F = 0.36. All former StackedProjects card
 * internals (tilt, glow, chips, CTA) are unchanged.
 */

import { useEffect, useRef, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
  useMotionValue,
  useTransform,
  type MotionValue,
} from "motion/react";
import { ArrowUpRight } from "lucide-react";
import { getStackedCaseStudies } from "@/content/projects";
import { t } from "@/content/copy";

/* ── Timeline constants ─────────────────────────────────────────────────── */

const F = 0.36;                    // flip acts occupy p ∈ [0, F]
const HOLD_END = 0.37;             // full-screen hold ends
const SHRINK_END = 0.42;           // end frame reaches deck-card footprint
const CARD1_FADE: [number, number] = [0.41, 0.45];
const DECK_START = 0.5;            // card 2 starts sliding (card #1 gets read time)
const N = 6;
const WIN = (1 - DECK_START) / (N - 1); // per-card slide window (=0.1 ≈ 100vh)

const slideStart = (k: number) => DECK_START + (k - 1) * WIN;

const SHADOW = "0 24px 60px -20px rgba(0,0,0,0.7)";

/* ── Flip-act geometry (project-driven; positions tuned from CardFlipGallery) ─ */

// Every flip card IS a real project card, so they all share the deck card's
// proportions — that makes the end frame → deck card #1 handoff a card-to-card
// match rather than a photo morphing into a card. Single source of truth: the
// deck card, the flip faces and the seam maths all derive from these.
const CARD_BASE_W = 840;
const CARD_BASE_H = 560; // 3:2 — narrower than the old 940×520 (1.81:1)
const CARD_ASPECT = CARD_BASE_W / CARD_BASE_H;
// The deck card is viewport-clamped, so on short windows it is SHORTER than
// CARD_BASE_H. The end frame's aspect is therefore derived from the card's
// real height at runtime (see FlipDeck) — a fixed aspect here would leave the
// end frame and card #1 misaligned mid-seam, showing two ghosted copies.
const CARD_VH = 0.72;
const CARD_HEIGHT_CSS = `min(${CARD_VH * 100}dvh, ${CARD_BASE_H}px)`;

const MAIN_ASPECT = 1920 / 1358; // cover still fills the viewport on the opening beat

type DeckProject = ReturnType<typeof getStackedCaseStudies>[number];

/* ── A real project card, rendered as a flip face ────────────────────────────
      The deck's own CardInner drawn at its natural design size and
      uniformly scaled into whatever slot it occupies, so a 220px floating card
      is a faithful miniature of the full card rather than a squashed layout. */

function ProjectCardFace({
  project,
  k,
  width,
  height,
  radius,
}: {
  project: DeckProject;
  k: number;
  width: number;
  height: number;
  radius: number;
}) {
  const s = Math.min(width / CARD_BASE_W, height / CARD_BASE_H);
  return (
    <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: radius }}>
      <div
        style={{
          position: "absolute",
          width: CARD_BASE_W,
          height: CARD_BASE_H,
          left: (width - CARD_BASE_W * s) / 2,
          top: (height - CARD_BASE_H * s) / 2,
          transform: `scale(${s})`,
          transformOrigin: "top left",
        }}
      >
        <CardInner project={project} k={k} hovered={false} />
      </div>
    </div>
  );
}

/* ── The reverse of a floating card — a plain themed back, kept cheap since it
      is only glimpsed as the plane finishes rotating. ───────────────────────── */

function ProjectCardBack({ project, radius }: { project: DeckProject; radius: number }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden flex items-center justify-center"
      style={{ borderRadius: radius, backgroundColor: project.theme }}
    >
      <span
        style={{
          fontFamily: "var(--font-display), sans-serif",
          fontWeight: 600,
          fontSize: 15,
          lineHeight: 1.1,
          textAlign: "center",
          padding: "0 10px",
          color: "rgba(255,255,255,0.92)",
        }}
      >
        {project.title}
      </span>
    </div>
  );
}

/* ── FloatingCard — Act 2/3 (breakpoints × F) ───────────────────────────── */

function FloatingCard({
  project,
  progress,
  index,
  scaleFactor,
}: {
  project: DeckProject;
  progress: MotionValue<number>;
  index: number;
  scaleFactor: number;
}) {
  // Each supporting card shares the cover's footprint (900·sf, the MainCard
  // base) so it reads as the same card, then sits stacked BEHIND the cover —
  // fanned down-and-out like a deck rather than scattered as loose thumbnails.
  const w = 900 * scaleFactor;
  const h = w / CARD_ASPECT;

  const depth = index + 1; // 1..5, how far back in the stack
  const side = index % 2 === 0 ? -1 : 1;
  const xOff = side * depth * 26 * scaleFactor; // fan wider than the cover's sides
  const yEnd = depth * 74 * scaleFactor; // peek well below the shrunk cover's edge
  const rot = side * (2.5 + depth * 1.6); // slight fan
  const stackScale = 0.6 - depth * 0.04; // cover is 0.6; each card a step smaller
  const tz = (150 - depth * 40) * scaleFactor; // behind the cover (which is at 150)

  // Gallery: fan out from a tight pile behind the cover to the peeking stack,
  // then fade as the flip completes so nothing lingers behind the deck.
  const y = useTransform(progress, [0.15 * F, 0.42 * F], [yEnd * 0.2, yEnd]);
  const opacity = useTransform(
    progress,
    [0.15 * F, 0.28 * F, 0.58 * F, 0.72 * F],
    [0, 1, 1, 0],
  );

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: w,
        height: h,
        marginLeft: -w / 2,
        marginTop: -h / 2,
        x: xOff,
        y,
        translateZ: tz,
        rotate: rot,
        scale: stackScale,
        opacity,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
        boxShadow: SHADOW,
        borderRadius: 8,
      }}
    >
      <div
        className="absolute inset-0"
        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden" }}
      >
        <ProjectCardFace project={project} k={index + 1} width={w} height={h} radius={8} />
      </div>
      <div
        className="absolute inset-0"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateX(180deg)",
        }}
      >
        <ProjectCardBack project={project} radius={8} />
      </div>
    </motion.div>
  );
}

/* ── ReelBack (unchanged) ───────────────────────────────────────────────── */

function ReelBack({ playing }: { playing: boolean }) {
  return (
    <div className={"cfg-reel w-full h-full" + (playing ? " cfg-reel-play" : "")} aria-hidden>
      <div className="cfg-reel-grid" />
      <div className="cfg-reel-glow" />
    </div>
  );
}

/* ── MainCard — Acts 1–3 (breakpoints × F) ──────────────────────────────── */

function MainCard({
  progress,
  scaleFactor,
  fillScale,
  project,
}: {
  progress: MotionValue<number>;
  scaleFactor: number;
  fillScale: number;
  project: DeckProject;
}) {
  const [reelPlaying, setReelPlaying] = useState(false);

  const size   = 900 * scaleFactor;
  const height = size / MAIN_ASPECT;

  const scale = useTransform(
    progress,
    [0, 0.15 * F, 0.42 * F],
    [fillScale, fillScale, 0.6],
  );
  const borderRadius = useTransform(progress, [0, 0.15 * F, 0.42 * F], [0, 0, 16]);
  const opacity = useTransform(progress, [0.58 * F, 0.72 * F], [1, 0]);

  useMotionValueEvent(progress, "change", (p) => {
    const shouldPlay = p > 0.55 * F;
    if (shouldPlay !== reelPlaying) setReelPlaying(shouldPlay);
  });

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: size,
        height: height,
        marginLeft: -size / 2,
        marginTop: -height / 2,
        translateZ: 150 * scaleFactor,
        scale,
        borderRadius,
        opacity,
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
        boxShadow: SHADOW,
        overflow: "hidden",
      }}
    >
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ backfaceVisibility: "hidden", WebkitBackfaceVisibility: "hidden", borderRadius: 16 }}
      >
        <CardInner project={project} k={0} hovered={false} />
      </div>
      <div
        className="absolute inset-0 overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateX(180deg)",
          borderRadius: 16,
        }}
      >
        <ReelBack playing={reelPlaying} />
      </div>
    </motion.div>
  );
}

/* ── EndCard — Act 4 + the seam (full screen → deck-card footprint) ─────── */

function EndCard({
  progress,
  scaleFactor,
  deckW,
  deckH,
  endStart,
  endFill,
  endCard,
  project,
}: {
  progress: MotionValue<number>;
  scaleFactor: number;
  deckW: number;
  deckH: number;
  endStart: number;
  endFill: number;
  endCard: number;
  project: DeckProject;
}) {
  // The box IS the deck card's footprint, so CardInner lays out at exactly the
  // same CSS size as card #1 — identical line breaks and padding. The shrink
  // therefore ends at scale ≈ 1 and the crossfade has no text ghosting; sizing
  // the box differently and scaling into place would offset every glyph.
  const scale = useTransform(
    progress,
    [0.68 * F, 0.87 * F, HOLD_END, SHRINK_END],
    [endStart, endFill, endFill, endCard],
  );
  const opacity = useTransform(progress, [0.43, 0.47], [1, 0]);

  return (
    <motion.div
      style={{
        position: "absolute",
        left: "50%",
        top: "50%",
        width: deckW,
        height: deckH,
        marginLeft: -deckW / 2,
        marginTop: -deckH / 2,
        translateZ: 150 * scaleFactor,
        scale,
        opacity,
        borderRadius: 16,
        rotateX: 180, // counter-rotate the ContentPlane's 180° flip
        transformStyle: "preserve-3d",
        backfaceVisibility: "hidden",
        WebkitBackfaceVisibility: "hidden",
        willChange: "transform",
        boxShadow: SHADOW,
        overflow: "hidden",
      }}
    >
      <div className="absolute inset-0 overflow-hidden" style={{ borderRadius: 16 }}>
        <CardInner project={project} k={0} hovered={false} />
      </div>
    </motion.div>
  );
}

/* ── ContentPlane — Act 3 flip (× F) ────────────────────────────────────── */

function ContentPlane({
  progress,
  scaleFactor,
  fillScale,
  endFill,
  endCard,
  endStart,
  deckW,
  deckH,
  projects,
}: {
  progress: MotionValue<number>;
  scaleFactor: number;
  fillScale: number;
  endFill: number;
  endCard: number;
  endStart: number;
  deckW: number;
  deckH: number;
  projects: DeckProject[];
}) {
  const rotateX = useTransform(progress, [0.42 * F, 0.68 * F], [0, 180]);

  // Flagship (project #1) holds the centre as the cover + end frame that hands
  // into the deck; the remaining featured projects sit stacked behind it, in
  // order, so the deepest card renders first (furthest back).
  const cover = projects[0];
  const supporting = projects.slice(1);

  return (
    <motion.div
      className="absolute inset-0 flex items-center justify-center"
      style={{ rotateX, transformStyle: "preserve-3d", willChange: "transform" }}
    >
      {supporting
        .map((project, i) => (
          <FloatingCard
            key={project.slug}
            project={project}
            index={i}
            progress={progress}
            scaleFactor={scaleFactor}
          />
        ))
        .reverse()}
      <MainCard progress={progress} scaleFactor={scaleFactor} fillScale={fillScale} project={cover} />
      <EndCard
        progress={progress}
        scaleFactor={scaleFactor}
        endFill={endFill}
        endCard={endCard}
        endStart={endStart}
        deckW={deckW}
        deckH={deckH}
        project={cover}
      />
    </motion.div>
  );
}

/* ── Cursor-magnet tilt (unchanged from StackedProjects) ────────────────── */

function useTilt() {
  const cardRef = useRef<HTMLDivElement>(null);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cfg = { stiffness: 120, damping: 20, mass: 0.6 };
  const rx   = useSpring(useTransform(my, [-1, 1], [ 6, -6]), cfg);
  const ry   = useSpring(useTransform(mx, [-1, 1], [-8,  8]), cfg);
  const imgX = useSpring(useTransform(mx, [-1, 1], [-12, 12]), { stiffness: 80, damping: 22 });
  const imgY = useSpring(useTransform(my, [-1, 1], [ -8,  8]), { stiffness: 80, damping: 22 });
  const glowX = useTransform(mx, [-1, 1], [0, 100]);
  const glowY = useTransform(my, [-1, 1], [0, 100]);

  const onMove = useCallback((e: React.PointerEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width)  * 2 - 1);
    my.set(((e.clientY - r.top)  / r.height) * 2 - 1);
  }, [mx, my]);

  const onLeave = useCallback(() => { mx.set(0); my.set(0); }, [mx, my]);
  return { cardRef, rx, ry, imgX, imgY, glowX, glowY, onMove, onLeave };
}

/* ── Card inner content (shared by deck + reduced fallback) ─────────────── */

const readMinutes = (p: DeckProject) => {
  const words = [p.overview.challenge, p.overview.approach, p.overview.outcome]
    .join(" ")
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
};

function CardInner({
  project,
  k,
  hovered,
  imgX,
  imgY,
}: {
  project: DeckProject;
  k: number;
  hovered: boolean;
  imgX?: MotionValue<number>;
  imgY?: MotionValue<number>;
}) {
  return (
    <>
      {/* Theme background */}
      <div className="absolute inset-0" style={{ backgroundColor: project.theme }} />

      {/* Noise grain */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
          backgroundSize: "160px",
          mixBlendMode:   "overlay",
          opacity:        0.4,
        }}
      />

      {/* Index watermark */}
      <div
        aria-hidden
        className="absolute right-0 bottom-0 select-none pointer-events-none z-0 font-sans font-bold"
        style={{
          fontSize:    "clamp(5rem,12vw,10rem)",
          lineHeight:  0.85,
          color:       "rgba(255,255,255,0.06)",
        }}
      >
        {String(k + 1).padStart(2, "0")}
      </div>

      {/* Split layout: left text / right image */}
      <div className="relative z-20 h-full grid md:grid-cols-[1fr_1fr] grid-cols-1">
        <div className="flex flex-col justify-end gap-3 p-7 md:p-9 pb-8">
          <span
            className="w-fit px-3 py-1 rounded-full text-[0.65rem] font-medium tracking-[0.1em] uppercase backdrop-blur-sm border"
            style={{
              color:        "rgba(255,255,255,0.85)",
              borderColor:  "rgba(255,255,255,0.22)",
              background:   "rgba(255,255,255,0.1)",
            }}
          >
            {project.categories[0]}
          </span>

          <p className="type-eyebrow is-dark">
            {project.year}&nbsp;&nbsp;·&nbsp;&nbsp;~{readMinutes(project)} min. read
          </p>

          <h3 className="type-title text-white">{project.title}</h3>

          <p
            className="text-sm leading-relaxed hidden md:block"
            style={{ color: "rgba(255,255,255,0.58)", maxWidth: "38ch" }}
          >
            {project.overview.approach.slice(0, 110)}…
          </p>

          <Link
            href={`/work/${project.slug}`}
            className="mt-1 inline-flex items-center gap-2.5 w-fit"
            onClick={(e) => e.stopPropagation()}
          >
            <span
              className="flex items-center justify-center w-11 h-11 rounded-full border transition-colors duration-200"
              style={{
                borderColor: "rgba(255,255,255,0.28)",
                background:  hovered ? "rgba(255,255,255,0.18)" : "rgba(255,255,255,0.08)",
                color:       "#fff",
              }}
            >
              <ArrowUpRight size={15} />
            </span>
            <span className="text-sm font-medium" style={{ color: "rgba(255,255,255,0.65)" }}>
              {t.home.stacked.viewCaseStudy}
            </span>
          </Link>
        </div>

        {/* RIGHT — floating image (desktop) */}
        <div className="hidden md:flex items-center justify-center p-5 overflow-hidden">
          <motion.div
            className="relative w-full h-full rounded-xl overflow-hidden"
            style={{
              x:         imgX,
              y:         imgY,
              boxShadow: "0 20px 48px -12px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <Image
              src={project.heroImage}
              alt={project.title}
              fill
              className="object-cover"
              sizes="440px"
              priority={k < 2}
              loading={k < 2 ? "eager" : "lazy"}
            />
            <div
              aria-hidden
              className="absolute inset-0"
              style={{ background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.28) 100%)" }}
            />
          </motion.div>
        </div>

        {/* Mobile: image strip */}
        <div className="md:hidden relative" style={{ height: 150 }}>
          <Image src={project.heroImage} alt={project.title} fill className="object-cover" sizes="100vw" loading="lazy" />
          <div aria-hidden className="absolute inset-0" style={{ background: "linear-gradient(to bottom, transparent 30%, rgba(0,0,0,0.55))" }} />
        </div>
      </div>
    </>
  );
}

/* ── DeckCard — progress-driven slide-in + staircase scale ──────────────── */

function DeckCard({
  project,
  k,
  progress,
}: {
  project: DeckProject;
  k: number;
  progress: MotionValue<number>;
}) {
  const [hovered, setHovered] = useState(false);
  const { cardRef, rx, ry, imgX, imgY, glowX, glowY, onMove, onLeave } = useTilt();

  // Slide-in: card #1 (k=0) is born in place via the seam crossfade; cards
  // 2–6 ride up from below across their ~100vh window.
  const y = useTransform(
    progress,
    k === 0 ? [0, 1] : [slideStart(k), slideStart(k) + WIN],
    k === 0 ? ["0vh", "0vh"] : ["110vh", "0vh"],
  );

  // Card #1 crossfades in over the shrinking end frame.
  const opacity = useTransform(
    progress,
    k === 0 ? CARD1_FADE : [0, 1],
    k === 0 ? [0, 1] : [1, 1],
  );
  const pointerEvents = useTransform(progress, (p) =>
    k === 0 && p < CARD1_FADE[0] ? ("none" as const) : ("auto" as const),
  );

  // Staircase: 6% per covering card, floor 0.75, each step in the second
  // half of the covering card's slide window (iteration-3 logic, merged
  // progress space).
  const scaleIn: number[] = [];
  const scaleOut: number[] = [];
  const stepsBehind = N - 1 - k;
  if (stepsBehind === 0) {
    scaleIn.push(0, 1);
    scaleOut.push(1, 1);
  } else {
    for (let j = 0; j < stepsBehind; j++) {
      const cover = slideStart(k + 1 + j);
      scaleIn.push(cover + WIN / 2, cover + WIN);
      scaleOut.push(
        Math.max(0.75, 1 - 0.06 * j),
        Math.max(0.75, 1 - 0.06 * (j + 1)),
      );
    }
  }
  const rawScale = useTransform(progress, scaleIn, scaleOut);
  const scale    = useSpring(rawScale, { stiffness: 220, damping: 36 });

  const glowBg = useTransform(
    [glowX, glowY] as MotionValue<number>[],
    ([x, yy]: number[]) =>
      `radial-gradient(480px circle at ${x}% ${yy}%, ${project.theme}45, transparent 65%)`,
  );

  return (
    <div
      className="absolute inset-0 flex w-full items-center justify-center px-4 sm:px-8 md:px-12"
      style={{ paddingTop: k * 18, pointerEvents: "none" }}
    >
      <motion.div
        style={{
          y,
          scale,
          opacity,
          pointerEvents,
          transformOrigin: "top center",
          width: "100%",
          maxWidth: CARD_BASE_W,
          willChange: "transform",
        }}
      >
        {/* Tilt shell — own perspective, no shared 3D context */}
        <motion.div
          ref={cardRef}
          onPointerMove={onMove}
          onPointerEnter={() => setHovered(true)}
          onPointerLeave={() => { setHovered(false); onLeave(); }}
          style={{
            rotateX:           rx,
            rotateY:           ry,
            transformPerspective: 1000,
            position:          "relative",
            height:            CARD_HEIGHT_CSS,
          }}
          className="w-full rounded-[22px] overflow-hidden shadow-[0_28px_72px_-20px_rgba(0,0,0,0.6)] cursor-pointer"
        >
          {/* Cursor glow */}
          <motion.div
            aria-hidden
            className="absolute inset-0 z-10"
            style={{ background: glowBg, opacity: hovered ? 1 : 0, transition: "opacity 0.25s", pointerEvents: "none" }}
          />
          <CardInner project={project} k={k} hovered={hovered} imgX={imgX} imgY={imgY} />
        </motion.div>
      </motion.div>
    </div>
  );
}

/* ── Reduced-motion fallback: the same project cards, plainly stacked ────── */

function ReducedFallback({ projects }: { projects: DeckProject[] }) {
  return (
    <div className="px-4 sm:px-8 md:px-12">
      <div className="mx-auto flex flex-col gap-8" style={{ maxWidth: CARD_BASE_W }}>
        {projects.map((project, k) => (
          <div
            key={project.slug}
            className="relative w-full rounded-[22px] overflow-hidden shadow-[0_28px_72px_-20px_rgba(0,0,0,0.6)]"
            style={{ height: CARD_HEIGHT_CSS }}
          >
            <CardInner project={project} k={k} hovered={false} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ── FlipDeck — root export ─────────────────────────────────────────────── */

export function FlipDeck() {
  const projects   = getStackedCaseStudies();
  const sectionRef = useRef<HTMLDivElement>(null);
  const reduced    = useReducedMotion();

  const [scaleFactor, setScaleFactor] = useState(1);
  const [fillScale,   setFillScale]   = useState(1);
  const [endFill,     setEndFill]     = useState(1);
  const [endCard,     setEndCard]     = useState(1);
  const [endStart,    setEndStart]    = useState(0.6);
  const [deckW,       setDeckW]       = useState(CARD_BASE_W);
  const [deckH,       setDeckH]       = useState(CARD_BASE_H);
  const [perspective, setPerspective] = useState(1200);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const sf = Math.max(0.4, vw / 1440);
      const persp = Math.max(600, Math.min(vw, vh) * 1.2);
      setScaleFactor(sf);
      setPerspective(persp);
      const fill = vw / (900 * sf);
      setFillScale(fill);
      // The EndCard lives on the FLIPPED plane at world z = −150·sf, so
      // perspective shrinks it by persp/(persp + 150·sf). Compensate so its
      // on-screen size hits the viewport (full-screen beat) and then the
      // deck-card footprint (CARD_BASE_W capped, px-4 gutter on mobile) exactly.
      const zComp = (persp + 150 * sf) / persp;
      // Mirror the deck card's own `min(CARD_VH·dvh, CARD_BASE_H)` clamp: on a
      // short window the card is shorter than CARD_BASE_H, so the end frame must
      // take the same box or the two won't sit on the same rect.
      const w = Math.min(CARD_BASE_W, vw - 32);
      const h = Math.min(CARD_VH * vh, CARD_BASE_H);
      setDeckW(w);
      setDeckH(h);
      setEndCard(zComp);              // lands exactly on the deck footprint
      setEndFill((vw / w) * zComp);   // full-bleed beat
      setEndStart((0.6 * (900 * sf)) / w); // preserve the old act-4 entry size
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });

  // Inverse-fill trick (× F): the stage starts scaled down so the full-bleed
  // main card exactly covers the viewport, then settles at 1 for the deck.
  const spaceScale = useTransform(
    scrollYProgress,
    [0, 0.15 * F, 0.42 * F, 1],
    [1 / fillScale, 1 / fillScale, 1, 1],
  );

  // Once card #1 has crossfaded in (CARD1_FADE ends 0.45) and the end frame has
  // faded (by 0.47), retire the whole flip layer so nothing from it can peek
  // behind the deck stack for the rest of the scroll.
  const flipLayerOpacity = useTransform(scrollYProgress, [0.46, 0.5], [1, 0]);

  return (
    <section id="work" className="relative bg-canvas" style={{ isolation: "isolate" }}>
      {/* Section header */}
      <div className="px-6 md:px-12 pt-24 md:pt-32 pb-4">
        <div className="section-header mx-auto max-w-[var(--container-max)]">
          <p className="type-eyebrow">{t.home.stacked.eyebrow}</p>
          <h2 className="type-h2 text-ink">{t.home.stacked.heading}</h2>
          <p className="text-lg md:text-xl max-w-[40ch] text-ink-soft">
            {t.home.stacked.subheading}
          </p>
        </div>
      </div>

      {reduced ? (
        <ReducedFallback projects={projects} />
      ) : (
        <div ref={sectionRef} className="relative h-[1000vh]">
          <div className="sticky top-0 h-dvh overflow-hidden">
            {/* Flip layer (decorative — never intercepts the deck's pointer) */}
            <motion.div
              style={{ perspective, opacity: flipLayerOpacity }}
              className="absolute inset-0 pointer-events-none"
            >
              <motion.div
                className="w-full h-full"
                style={{ scale: spaceScale, transformStyle: "preserve-3d", willChange: "transform" }}
              >
                <ContentPlane
                  progress={scrollYProgress}
                  scaleFactor={scaleFactor}
                  fillScale={fillScale}
                  endFill={endFill}
                  endCard={endCard}
                  endStart={endStart}
                  deckW={deckW}
                  deckH={deckH}
                  projects={projects}
                />
              </motion.div>
            </motion.div>

            {/* Deck layer */}
            {projects.map((project, k) => (
              <DeckCard key={project.slug} project={project} k={k} progress={scrollYProgress} />
            ))}
          </div>
        </div>
      )}

      {/* Outro */}
      <div className="type-eyebrow text-center py-14">
        {t.home.stacked.outro(N)}
      </div>
    </section>
  );
}
