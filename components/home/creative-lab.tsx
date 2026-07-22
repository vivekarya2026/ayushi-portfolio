"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  motion,
  useAnimationFrame,
  useInView,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from "motion/react";
import { t } from "@/content/copy";

/**
 * Creative Lab — 3D cylinder carousel matching the Framer reference design.
 *
 * Geometry: each card's transform-origin is set to its LEFT edge (0% 50% 0px).
 * Rotating by angleStep around the left edge places every card flush on the
 * cylinder surface — no translateZ needed. The implicit radius is:
 *
 *   R = cardWidth / (2 · tan(π / N))   ← left-edge-pivot formula
 *
 * The hierarchy follows the Framer structure:
 *   perspective wrapper
 *     └─ scale + perspective outer
 *        └─ rotateX envelope (entrance animation lives here)
 *           └─ drag stage (rotateY: smooth spring, slight rotateX tilt)
 *              └─ cylinder (preserve-3d)
 *                 └─ N × Image Wrap (rotateY slot, origin 0% 50%)
 *                    ├─ front face
 *                    └─ back face (rotateY 180deg)
 */

type PlaygroundItem = { front: string; back?: string; alt: string };

const items: PlaygroundItem[] = [
  { front: "/images/nebula/020934ba-ab6d-4630-a6ba-aa5da0a3f98f.png", back: "/images/nebula/0484db01-d873-412e-97fe-277ad514698f.png", alt: "Nebula brand exploration" },
  { front: "/images/accexx/016b8d7c-c460-46c1-8d8b-8157a7111038.png", back: "/images/accexx/0b63ecfe-d37a-4c50-94a7-88582df348a2.png", alt: "Accexx packaging study" },
  { front: "/images/budweiser/139a4ebf-6ed3-440b-847f-9152b1de744f.png", back: "/images/budweiser/502ccd7a-b5ca-43b1-ad9a-bef5689615eb.png", alt: "Budweiser campaign frame" },
  { front: "/images/kuikma/939a7860-a217-429e-9aab-ba420f2f44aa.png", back: "/images/kuikma/e26b7cee-d78b-4f78-bfe5-7931d05e588f.png", alt: "Kuikma product graphics" },
  { front: "/images/rasbhari/232b7222-2b49-4199-832a-9c346859e5cc.png", back: "/images/rasbhari/5b61c023-6c62-447d-9751-c37defa9615d.png", alt: "Rasbhari identity" },
  { front: "/images/pawfect-bowls/1198bd33-32d1-4cf3-9f47-79e7e9342d20.png", back: "/images/pawfect-bowls/ee3ebeba-72b9-4487-bf7c-bceb9d8e8146.png", alt: "Pawfect Bowls branding" },
  { front: "/images/twiggle/39023032-714e-47f6-9e09-333f81ec0dcf.png", back: "/images/twiggle/76fb0cda-001d-45a6-a38d-b53df492f6c3.png", alt: "Twiggle illustration" },
  { front: "/images/mool-mule/055bb933-8f6a-4786-893a-e09845d398bc.png", back: "/images/mool-mule/53d92d78-e625-407d-9e9a-1f8cfeef79b5.png", alt: "Mool Mule visual" },
];

function useResponsive() {
  const [cfg, setCfg] = useState({
    cardWidth: 360,
    perspective: 1500,
    pad: 48,
  });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      if (vw >= 1200) {
        setCfg({
          cardWidth: Math.min(420, Math.max(360, vw * 0.26)),
          perspective: 2200,
          pad: 96,
        });
      } else if (vw >= 768) {
        setCfg({ cardWidth: 280, perspective: 1800, pad: 64 });
      } else {
        setCfg({ cardWidth: 200, perspective: 1200, pad: 32 });
      }
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return cfg;
}

/**
 * A single card on the cylinder.
 *
 * The card is positioned so its LEFT edge sits at the cylinder's center axis.
 * Rotating by `angle` degrees around the Y-axis (with origin at the left edge)
 * fans all cards out into a perfect cylinder.
 */
function Card({
  item,
  angle,
  cardWidth,
  cardHeight,
  eager,
}: {
  item: PlaygroundItem;
  angle: number;
  cardWidth: number;
  cardHeight: number;
  eager: boolean;
}) {
  return (
    <div
      className="absolute"
      style={{
        width: cardWidth,
        height: cardHeight,
        top: "50%",
        left: "50%",
        marginTop: -cardHeight / 2,
        transformOrigin: "0% 50% 0px",
        transform: `rotateY(${angle}deg)`,
        transformStyle: "preserve-3d",
      }}
    >
      {/* Front face */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "translateZ(1px)",
          boxShadow: "0 24px 60px -20px rgba(0,0,0,0.75)",
        }}
      >
        <Image
          src={item.front}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="420px"
          priority={eager}
          loading={eager ? undefined : "lazy"}
        />
      </div>

      {/* Back face — rotateY(180deg) so it faces inward on the far side */}
      <div
        className="absolute inset-0 rounded-lg overflow-hidden"
        style={{
          backfaceVisibility: "hidden",
          WebkitBackfaceVisibility: "hidden",
          transform: "rotateY(180deg) translateZ(1px)",
          boxShadow: "0 24px 60px -20px rgba(0,0,0,0.75)",
        }}
      >
        <Image
          src={item.back ?? item.front}
          alt={item.alt}
          fill
          className="object-cover"
          sizes="420px"
          loading="lazy"
        />
      </div>
    </div>
  );
}

function ArrowButton({
  dir,
  onClick,
}: {
  dir: "prev" | "next";
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === "prev" ? "Previous" : "Next"}
      className="btn-icon focus-accent focus:outline-none"
    >
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
        <path
          d={dir === "prev" ? "M15 6l-6 6 6 6" : "M9 6l6 6-6 6"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>
  );
}

export function CreativeLab() {
  const N = items.length;
  const angleStep = 360 / N;
  const reduced = useReducedMotion();
  const { cardWidth, perspective, pad } = useResponsive();

  const cardHeight = (cardWidth * 3) / 4;

  /**
   * Left-edge-pivot radius: the distance from the pivot (left edge) to the
   * center of the cylinder so adjacent cards don't overlap.
   *   chord = cardWidth
   *   R = chord / (2 · tan(π/N))
   * This pushes the whole card array outward by offsetting each card's left
   * edge by -R (via marginLeft), so the left edges lie on the cylinder axis.
   */
  const radius = cardWidth / (2 * Math.tan(Math.PI / N));

  const sectionRef = useRef<HTMLElement>(null);
  const inView = useInView(sectionRef, { amount: 0.3 });

  const [entered, setEntered] = useState(false);
  useEffect(() => {
    if (inView && !entered) setEntered(true);
  }, [inView, entered]);

  // Rotation pipeline: target ref → rotation motion value → smooth spring
  const target = useRef(0);
  const rotation = useMotionValue(0);
  const smooth = useSpring(rotation, { stiffness: 55, damping: 20 });

  // Cursor-attraction tilt — normalised −1…+1 mouse position in the section
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  const tiltX = useSpring(cursorY, { stiffness: 60, damping: 18 });
  const tiltY = useSpring(cursorX, { stiffness: 60, damping: 18 });
  // Map −1…+1 → tilt degrees (Y: ±14°  X: ±10°)
  const magnetTiltY = useTransform(tiltY, [-1, 1], [14, -14]);
  const magnetTiltX = useTransform(tiltX, [-1, 1], [-10, 10]);
  // Background text reveal: opacity lifts as cursor moves away from centre
  const cursorDist = useMotionValue(0);
  const textOpacity = useSpring(cursorDist, { stiffness: 60, damping: 20 });
  const bgTextOpacity = useTransform(textOpacity, [0, 0.6, 1], [0.04, 0.18, 0.26]);

  const carouselRef = useRef<HTMLDivElement>(null);

  const onCursorMove = useCallback(
    (e: React.PointerEvent) => {
      if (!carouselRef.current) return;
      const rect = carouselRef.current.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;   // −1…+1
      const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;   // −1…+1
      cursorX.set(nx);
      cursorY.set(ny);
      cursorDist.set(Math.min(1, Math.sqrt(nx * nx + ny * ny)));
    },
    [cursorX, cursorY, cursorDist],
  );

  const onCursorLeave = useCallback(() => {
    cursorX.set(0);
    cursorY.set(0);
    cursorDist.set(0);
  }, [cursorX, cursorY, cursorDist]);

  const [dragging, setDragging] = useState(false);
  const [hovering, setHovering] = useState(false);
  const dragStartX = useRef(0);
  const rotationStart = useRef(0);
  const lastMoveX = useRef(0);
  const lastMoveT = useRef(0);
  const velocity = useRef(0);

  // Auto-spin + inertia decay
  useAnimationFrame((_, delta) => {
    if (Math.abs(velocity.current) > 0.001) {
      target.current += velocity.current * delta;
      velocity.current *= 0.94;
      if (Math.abs(velocity.current) < 0.002) velocity.current = 0;
    } else if (!reduced && !dragging && !hovering && inView && entered) {
      target.current += (delta / 40000) * 360;
    }
    rotation.set(target.current);
  });

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (reduced) return;
      setDragging(true);
      velocity.current = 0;
      dragStartX.current = e.clientX;
      rotationStart.current = target.current;
      lastMoveX.current = e.clientX;
      lastMoveT.current = performance.now();
      (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    },
    [reduced],
  );

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging) return;
      const delta = e.clientX - dragStartX.current;
      target.current = rotationStart.current + delta * 0.35;

      const now = performance.now();
      const dt = now - lastMoveT.current;
      if (dt > 0) {
        const dx = e.clientX - lastMoveX.current;
        const v = (dx * 0.35) / dt;
        velocity.current = Math.max(-0.9, Math.min(0.9, v));
      }
      lastMoveX.current = e.clientX;
      lastMoveT.current = now;
    },
    [dragging],
  );

  const onPointerUp = useCallback(() => setDragging(false), []);

  const onWheel = useCallback(
    (e: React.WheelEvent) => {
      if (reduced || !inView) return;
      const boost = Math.max(-15, Math.min(15, e.deltaY * 0.05));
      target.current += boost;
    },
    [reduced, inView],
  );

  const snap = useCallback(
    (dir: 1 | -1) => {
      target.current += dir * angleStep;
      rotation.set(target.current);
    },
    [angleStep, rotation],
  );

  const onKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        snap(1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        snap(-1);
      }
    },
    [snap],
  );

  // Container height: tall enough to see both front cards and a bit of depth
  const containerHeight = cardHeight * 1.5 + 80;

  return (
    <section
      ref={sectionRef}
      className="section-pad overflow-hidden relative"
      style={{ backgroundColor: "var(--ref-bg-dark)" }}
    >
      {/* ── Giant background text that reveals on hover ───────────────────── */}
      <motion.div
        aria-hidden
        style={{ opacity: bgTextOpacity }}
        className="pointer-events-none absolute inset-0 flex flex-col items-end justify-center select-none overflow-hidden"
      >
        <span
          className="font-sans font-extrabold leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(5rem,18vw,16rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(245,245,245,0.55)",
            letterSpacing: "-0.04em",
          }}
        >
          CREATIVE
        </span>
        <span
          className="font-sans font-extrabold leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(5rem,18vw,16rem)",
            color: "transparent",
            WebkitTextStroke: "1px rgba(245,245,245,0.55)",
            letterSpacing: "-0.04em",
          }}
        >
          LAB
        </span>
      </motion.div>

      <div className="section-header mx-auto max-w-[var(--container-max)] px-6 md:px-12 mb-12 md:mb-16">
        <p className="type-eyebrow is-dark">{t.home.creativeLab.eyebrow}</p>
        <h2 className="type-h2 text-canvas">{t.home.creativeLab.heading}</h2>
        <p className="text-base" style={{ color: "rgba(245,245,245,0.6)" }}>
          {t.home.creativeLab.subheading}
        </p>
      </div>

      {/* ── Interaction capture layer ─────────────────────────────────── */}
      <div
        ref={carouselRef}
        role="group"
        aria-label="Creative work carousel — drag or use arrow keys"
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerMove={(e) => { onPointerMove(e); onCursorMove(e); }}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onPointerEnter={(e) => { setHovering(true); onCursorMove(e); }}
        onPointerLeave={() => {
          setHovering(false);
          setDragging(false);
          onCursorLeave();
        }}
        onWheel={onWheel}
        className="relative w-full grid place-items-center cursor-grab active:cursor-grabbing focus:outline-none"
        style={{
          perspective,
          perspectiveOrigin: "center center",
          height: containerHeight,
          touchAction: "none",
          userSelect: "none",
          WebkitUserSelect: "none",
        }}
      >
        {/* L1: scale + inner perspective (matches Framer scale(1.1) wrapper) */}
        <div
          style={{
            transform: "scale(1.1)",
            perspective: 1200,
            transformStyle: "preserve-3d",
          }}
        >
          {/* L2: rotateX envelope — entrance animation attaches here */}
          <motion.div
            initial={false}
            animate={
              reduced
                ? { opacity: 1, rotateX: 0, scale: 1 }
                : entered
                  ? { opacity: 1, rotateX: 0, scale: 1 }
                  : { opacity: 0, rotateX: -15, scale: 0.92 }
            }
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            style={{ transformStyle: "preserve-3d" }}
          >
            {/* L3: drag stage — smooth rotateY spin + cursor-attracted tilt */}
            <motion.div
              style={{
                transformStyle: "preserve-3d",
                rotateX: reduced ? 1.5 : magnetTiltX,
                rotateY: smooth,
                rotateZ: reduced ? 0 : magnetTiltY,
                willChange: "transform",
              }}
            >
              {/* L4: cylinder — all cards are children of this */}
              <div
                style={{
                  position: "relative",
                  width: 0,
                  height: 0,
                  transformStyle: "preserve-3d",
                }}
              >
                {items.map((item, i) => (
                  <Card
                    key={item.front}
                    item={item}
                    angle={i * angleStep}
                    cardWidth={cardWidth}
                    cardHeight={cardHeight}
                    eager={i < 3}
                  />
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex items-center justify-center gap-4 mt-8">
        <ArrowButton dir="prev" onClick={() => snap(1)} />
        <span className="type-eyebrow is-dark">
          {reduced ? t.home.creativeLab.arrowsHint : t.home.creativeLab.dragHint}
        </span>
        <ArrowButton dir="next" onClick={() => snap(-1)} />
      </div>
    </section>
  );
}
