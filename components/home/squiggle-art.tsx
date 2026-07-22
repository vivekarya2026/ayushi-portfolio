"use client";

import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useReducedMotion,
} from "motion/react";

interface SquiggleArtProps {
  strokeColor?: string;
}

const DOODLE_PATHS = [
  "M-37.42,35.33 C-7.46,35.33 30.20,19.65 33.30,18.39 C43.31,14.32 17.97,-20.99 1.24,-23.05 C-8.88,-24.30 -26.23,-26.18 -37.65,-26.18 C-46.27,-26.18 -68.30,-18.57 -68.30,4.26 C-68.30,27.09 -51.60,35.33 -37.42,35.33z",
  "M1.24,-23.05 C13.30,-32.21 21.24,-26.57 28.46,-21.06 C35.69,-15.55 43.37,-4.84 42.16,-2.70 C35.57,8.99 37.51,17.69 33.30,18.39 C-7.10,25.08 -10.82,-13.89 1.24,-23.05z",
  "M11.88,-38.70 C22.86,-51.59 31.78,-50.62 32.11,-47.68 C32.46,-44.60 29.02,-42.57 25.37,-40.37 C24.17,-39.65 19.19,-36.26 16.94,-30.57 C14.34,-23.98 16.99,-18.89 10.60,-17.41 C-2.47,-14.38 -2.36,-21.99 11.88,-38.70z",
  "M17.20,-21.85 C13.55,-26.31 16.80,-33.37 25.89,-39.08 C41.47,-48.86 45.45,-47.60 46.53,-45.09 C48.23,-41.11 41.95,-38.87 36,-34.89 C31.82,-32.09 28.53,-25.52 29.09,-24.08 C30.02,-21.71 20.86,-17.39 17.20,-21.85z",
  "M38.41,-31.61 C54.79,-40.65 59.80,-39.39 61.16,-37.02 C64.40,-31.38 55.04,-29.09 45.72,-22.24 C39.74,-17.85 32.13,-7.12 25.75,-12.99 C20.11,-18.18 26.84,-25.22 38.41,-31.61z",
  "M58.56,-18.65 C50.97,-22.39 29.43,-15.10 29,-8.78 C28.53,-1.98 37.91,4.98 41.86,-2.03 C44.83,-7.29 51.66,-9.18 54.81,-8.15 C60.86,-6.18 65.76,7.68 70.27,1.44 C72.07,-1.04 65,-15.48 58.56,-18.65z",
  "M41.86,-2.03 C38.97,3.62 43.83,12.82 48.35,19.94 C54.53,29.68 52.61,32.08 50.74,32.85 C45.99,34.82 36.67,22.27 33.30,18.39 C14.46,-3.28 44.28,-6.77 41.86,-2.03z",
];

const HEART_COLOR = "rgb(47,132,231)";

const SPARKLE_PATHS = [
  {
    transform: "translate(1474,1036.5)",
    d: "M0.36,4.17 C1.08,2.86 5.1,0.88 4.87,-1.71 C4.73,-3.28 3.49,-4.5 1.77,-4.35 C0.92,-4.28 0.2,-3.79 -0.28,-3.16 C-0.85,-3.7 -1.65,-4.05 -2.5,-3.98 C-4.22,-3.83 -5.23,-2.41 -5.09,-0.84 C-4.87,1.75 -0.57,3 0.36,4.17z",
  },
  {
    transform: "translate(1496,1007)",
    d: "M-2.57,7.07 C-0.41,5.48 7.65,5.31 9.25,0.92 C10.22,-1.75 9.12,-4.69 6.2,-5.76 C4.75,-6.28 3.2,-6.03 1.95,-5.36 C1.43,-6.68 0.4,-7.87 -1.05,-8.39 C-3.97,-9.46 -6.7,-7.91 -7.67,-5.24 C-9.27,-0.85 -3.21,4.46 -2.57,7.07z",
  },
  {
    transform: "translate(1465,973.5)",
    d: "M2.08,11.77 C3.79,7.86 14.73,1.23 13.44,-6.08 C12.66,-10.52 8.82,-13.69 3.95,-12.83 C1.55,-12.41 -0.39,-10.84 -1.57,-8.91 C-3.34,-10.32 -5.7,-11.13 -8.1,-10.71 C-12.97,-9.85 -15.49,-5.55 -14.71,-1.11 C-13.42,6.19 -0.88,8.68 2.08,11.77z",
  },
];

const PATH_A = "M-1432,-582 C-1432,-582 -1069.47,-579.86 -1069.47,-579.86 C-681.69,-576.28 -313.72,-524.24 -291.59,-275.10 C-280.39,-149 -376.99,-19 -511.39,-2.20";
const PATH_B = "M-511.39,-2.20 C-640.01,13.88 -627.79,-135.28 -537.99,-151.40 C-444.39,-168.20 -382.82,-94.07 -372.99,-44.20 C-341.79,114.09 -485,132 -483.75,269.99 C-482.82,373.02 -361.81,373.59 -277.39,313.20 C-217,270 -129.67,283.86 -115.15,383.20 C-104.42,456.57 -100.53,511.85 -40.47,533.76 C-0.49,548.33 60.59,516.33 76.65,503.69";
const PATH_C = "M1662,107 C1662,107 1602.28,106.89 1578.12,106.89 C1473,106.89 1259.14,138.30 1068.86,313.04 C858.15,506.54 721.61,330.50 646.34,304.38 C521.5,261.06 441.67,353.43 419.5,407.54 C393.41,471.22 308.97,615.67 193.05,504.54";

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function remap(v: number, i0: number, i1: number, o0: number, o1: number) {
  if (i1 === i0) return o0;
  return o0 + ((v - i0) / (i1 - i0)) * (o1 - o0);
}

export function SquiggleArt({ strokeColor = "var(--color-accent)" }: SquiggleArtProps) {
  const wrapRef  = useRef<HTMLDivElement>(null);
  const pathARef = useRef<SVGPathElement>(null);
  const pathBRef = useRef<SVGPathElement>(null);
  const pathCRef = useRef<SVGPathElement>(null);
  const reduced  = useReducedMotion();

  const [lengths, setLengths] = useState<{ a: number; b: number; c: number } | null>(null);

  // Scrub as the section rises from near the bottom of the viewport (95%) to
  // its middle (50%). Completing at mid-viewport — rather than the old "near
  // the top" (0.08) — means the reveal finishes at a scroll position EVERY
  // viewport can reach. On tall screens the page bottomed out (footer too
  // short to push the art to the top) before progress hit 0.85, so the
  // heart-hands never appeared. Mid-viewport is always reachable.
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start 0.95", "start 0.5"],
  });

  // Measure path lengths once mounted
  useEffect(() => {
    const run = () => {
      if (pathARef.current && pathBRef.current && pathCRef.current) {
        setLengths({
          a: pathARef.current.getTotalLength(),
          b: pathBRef.current.getTotalLength(),
          c: pathCRef.current.getTotalLength(),
        });
      }
    };
    run();
    const t = window.setTimeout(run, 200);
    return () => window.clearTimeout(t);
  }, []);

  // Initialise dashes (hidden) once lengths are known
  useEffect(() => {
    if (!lengths) return;
    [
      [pathARef.current, lengths.a],
      [pathBRef.current, lengths.b],
      [pathCRef.current, lengths.c],
    ].forEach(([el, len]) => {
      const path = el as SVGPathElement | null;
      if (!path) return;
      path.style.strokeDasharray  = String(len);
      path.style.strokeDashoffset = String(len);
    });
  }, [lengths]);

  // ── Scroll-scrubbed draw (works in both directions) ───────────────────────
  //
  // Scroll progress timeline  0 ──────── 0.4 ──────── 0.8 ─── 0.9 ─── 0.95 ─ 1
  //   Arm  A        :          |────────|
  //   Arms B + C    :                    |────────────|
  //   Doodle hands  :                                        |──────|
  //   Blue hearts   :                                                  |──────|
  //
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (!lengths || reduced) return;
    const a  = clamp01(remap(v, 0,   0.4, 0, 1));
    const bc = clamp01(remap(v, 0.4, 0.8, 0, 1));
    if (pathARef.current) pathARef.current.style.strokeDashoffset = String(lengths.a * (1 - a));
    if (pathCRef.current) pathCRef.current.style.strokeDashoffset = String(lengths.c * (1 - bc));
    if (pathBRef.current) pathBRef.current.style.strokeDashoffset = String(lengths.b * (1 - bc));
  });

  // ── Opacity reveals (scroll-driven → revert on scroll-back) ──────────────
  const doodleOpacity = useTransform(scrollYProgress, [0.85, 0.92], [0, 1]);
  const shadowOpacity = useTransform(scrollYProgress, [0.85, 0.92], [0, 0.6]);
  const heartOpacity  = useTransform(scrollYProgress, [0.92, 0.98], [0, 1]);
  const heartScale    = useTransform(scrollYProgress, [0.92, 0.98], [0.4, 1]);

  const doodleStyle = {
    opacity:         reduced ? 1 : doodleOpacity,
    transformBox:    "fill-box"  as const,
    transformOrigin: "center"    as const,
  };

  return (
    <div ref={wrapRef} style={{ width: "100%", overflow: "visible" }}>
      <svg
        viewBox="430 20 2100 1140"
        width="100%"
        preserveAspectRatio="xMidYMid meet"
        aria-hidden="true"
        style={{ pointerEvents: "none", display: "block", overflow: "visible" }}
      >
        <defs>
          <radialGradient id="squiggle-shadow" cx="0" cy="0" r="73" fx="0" fy="0" gradientUnits="userSpaceOnUse">
            <stop offset="0%"   stopColor="rgb(0,0,0)" stopOpacity="0.2" />
            <stop offset="50%"  stopColor="rgb(0,0,0)" stopOpacity="0.1" />
            <stop offset="100%" stopColor="rgb(0,0,0)" stopOpacity="0"   />
          </radialGradient>
          <clipPath id="doodle-clip"><path d="M0,0 L170,0 L170,110 L0,110z" /></clipPath>
        </defs>

        {/* Shadow under left doodle */}
        <motion.g style={{ opacity: reduced ? 0.6 : shadowOpacity }}>
          <g transform="matrix(1.0234,-0.6903,0.4589,0.6803,691.59,740.50) translate(224.25,-12.25)">
            <path
              fill="url(#squiggle-shadow)"
              d="M0,-72.75 C40.15,-72.75 72.75,-40.15 72.75,0 C72.75,40.15 40.15,72.75 0,72.75 C-40.15,72.75 -72.75,40.15 -72.75,0 C-72.75,-40.15 -40.15,-72.75 0,-72.75z"
            />
          </g>
        </motion.g>

        {/* PATH A — left arm */}
        <g transform="translate(1312,620)">
          <path ref={pathARef} d={PATH_A} fill="none" stroke={strokeColor} strokeWidth={76} strokeLinecap="round" />
        </g>

        {/* PATH C — right arm */}
        <g transform="translate(1376,620)">
          <path ref={pathCRef} d={PATH_C} fill="none" stroke={strokeColor} strokeWidth={76} strokeLinecap="round" />
        </g>

        {/* PATH B — cascading loop */}
        <g transform="translate(1312,620)">
          <path ref={pathBRef} d={PATH_B} fill="none" stroke={strokeColor} strokeWidth={76} strokeLinecap="round" />
        </g>

        {/* LEFT doodle — hand / leaf */}
        <motion.g style={doodleStyle}>
          <g transform="matrix(0.8572,-0.5150,0.5150,0.8572,1313.61,1095.99)">
            <g clipPath="url(#doodle-clip)">
              <g transform="translate(85,55)">
                {DOODLE_PATHS.map((d, i) => <path key={i} d={d} fill={strokeColor} />)}
              </g>
            </g>
          </g>
        </motion.g>

        {/* RIGHT doodle — hand / leaf */}
        <motion.g style={doodleStyle}>
          <g transform="matrix(-0.8480,-0.5299,-0.5299,0.8480,1643.15,1099.58)">
            <g clipPath="url(#doodle-clip)">
              <g transform="translate(85,55)">
                {DOODLE_PATHS.map((d, i) => <path key={i} d={d} fill={strokeColor} />)}
              </g>
            </g>
          </g>
        </motion.g>

        {/* Small blue hearts — scale + fade after doodles */}
        {SPARKLE_PATHS.map((sparkle) => (
          <motion.g
            key={sparkle.transform}
            transform={sparkle.transform}
            style={{
              opacity:         reduced ? 1 : heartOpacity,
              scale:           reduced ? 1 : heartScale,
              transformBox:    "fill-box",
              transformOrigin: "center",
            }}
          >
            <path d={sparkle.d} fill="none" stroke={HEART_COLOR} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
          </motion.g>
        ))}
      </svg>
    </div>
  );
}
