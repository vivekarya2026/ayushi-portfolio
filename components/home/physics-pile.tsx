"use client";

/**
 * PhysicsPile — React port of the classic Webflow Matter.js DOM-sync snippet
 * (dm-matter-elem / -circle / -pill), supplied by the user as the reference
 * implementation for "My toolkit".
 *
 * Faithful to the snippet: bodies are created from each element's layout
 * position (density 0.01, friction 0.1, restitution 0.5), pills are
 * left-circle + right-circle + rect composites, a transparent Render canvas
 * hosts the MouseConstraint (stiffness 0.2), the canvas' wheel listeners are
 * removed so the page still scrolls, touch only drags when a body is grabbed,
 * a resize rebuilds the world, and an IntersectionObserver (threshold 0.1)
 * starts the engine exactly once. `afterUpdate` syncs left/top/rotate.
 *
 * React-isms the snippet lacks: refs instead of querySelectorAll, full
 * cleanup on unmount, and a reduced-motion static-scatter fallback.
 */

import Matter from "matter-js";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const {
  Engine,
  Render,
  Runner,
  Bodies,
  Composite,
  MouseConstraint,
  Mouse,
  Events,
  Body,
} = Matter;

/* ── Content ──────────────────────────────────────────────────────────────── */

const SKILLS_LABELS = [
  "Adobe Illustrator",
  "Photoshop",
  "InDesign",
  "Figma",
  "Procreate",
  "After Effects",
  "Packaging",
  "Dielines",
  "Typography",
  "Brand Systems",
  "Hand Lettering",
  "3D Mockups",
  "Print Production",
  "Color Theory",
  "Vector Art",
  "UI/UX Design",
  "Motion Graphics",
  "Art Direction",
  "Visual Identity",
  "Print Design",
  "Digital Illustration",
  "Layout Design",
  "Logo Design",
  "Creative Strategy",
];

/* Icon circles + square tiles + rounded-rect chips — a mix of shapes so the
   pile reads as a physical jumble rather than one repeated form. */
const CIRCLE_ICONS = ["☕", "🏸", "◑"];
const SQUARE_CHIPS = ["Ai", "Ps", "Id", "Ae"]; // app-icon style square tiles
const RECT_CHIPS = ["NIFT", "made w ♥"];

/* Token-derived palette: accent orange + marigold + canvas + graphite. */
const GRADIENTS = [
  "linear-gradient(135deg, oklch(0.75 0.14 75), oklch(0.58 0.13 65))",
  "linear-gradient(135deg, oklch(0.55 0.19 35), oklch(0.42 0.14 35))",
  "linear-gradient(135deg, #f8f5ef, #bdb8ac)",
  "linear-gradient(135deg, oklch(0.55 0.19 35), rgb(42,18,6))",
  "linear-gradient(135deg, rgb(59,59,62), rgb(25,25,28))",
  "radial-gradient(circle at 30% 30%, oklch(0.75 0.14 75), oklch(0.45 0.1 65))",
];

const rng = (i: number) => {
  const r = Math.sin(i * 999.13 + 7) * 10000;
  return r - Math.floor(r);
};

const gradientFor = (i: number) => GRADIENTS[Math.floor(rng(i) * GRADIENTS.length)];
const isLightGradient = (g: string) => g.includes("#f8f5ef");

const BODY_OPTS = {
  density: 0.01,
  friction: 0.1,
  restitution: 0.5,
  render: { opacity: 0 },
};

interface PhysicsPileProps {
  count?: number;
  gravity?: number;
}

export function PhysicsPile({ count = 24, gravity = 1 }: PhysicsPileProps) {
  const boxRef = useRef<HTMLDivElement>(null);
  const pillRefs = useRef<(HTMLDivElement | null)[]>([]);
  const circleRefs = useRef<(HTMLDivElement | null)[]>([]);
  const rectRefs = useRef<(HTMLDivElement | null)[]>([]);
  const squareRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reduced = useReducedMotion();

  // Bigger chips need room; a phone-sized box can't hold all 24 without piling
  // far past its top edge, so cap the count on small screens. Starts false so
  // the server and first client render agree (24), then narrows on mount.
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const update = () => setIsMobile(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  const effectiveCount = isMobile ? Math.min(count, 12) : count;
  const labels = SKILLS_LABELS.slice(0, effectiveCount);
  const squares = isMobile ? SQUARE_CHIPS.slice(0, 2) : SQUARE_CHIPS;

  useEffect(() => {
    const matterBox = boxRef.current;
    if (!matterBox) return;

    // Reveal only once positioned (physics) or statically scattered (reduced).
    matterBox.style.visibility = "visible";
    if (reduced) return;

    const pills = pillRefs.current.filter(Boolean) as HTMLDivElement[];
    const circles = circleRefs.current.filter(Boolean) as HTMLDivElement[];
    // Squares are physically rectangles (equal w/h), so they ride along in the
    // rect body list — one code path builds and syncs both.
    const rects = [
      ...(rectRefs.current.filter(Boolean) as HTMLDivElement[]),
      ...(squareRefs.current.filter(Boolean) as HTMLDivElement[]),
    ];

    /* Lay the elements out in packed rows across the upper area of the box —
       the snippet reads offsetLeft/offsetTop as each body's start position. */
    const layout = () => {
      const W = matterBox.clientWidth;
      const gap = 14;
      let x = gap;
      let y = gap;
      let rowH = 0;
      [...pills, ...rects, ...circles].forEach((el) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        if (x + w + gap > W) {
          x = gap;
          y += rowH + gap;
          rowH = 0;
        }
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        x += w + gap;
        rowH = Math.max(rowH, h);
      });
    };
    layout();

    // create an engine
    const engine = Engine.create();
    engine.gravity.y = gravity;

    // create a renderer (transparent canvas hosting the mouse constraint)
    const render = Render.create({
      element: matterBox,
      engine,
      options: {
        width: matterBox.clientWidth,
        height: matterBox.clientHeight,
        wireframes: false,
        background: "transparent",
      },
    });
    render.canvas.style.position = "absolute";
    render.canvas.style.inset = "0";

    // Function to create rectangles for rect-chip elements
    function createRectangles() {
      return rects.map((el) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const body = Bodies.rectangle(
          el.offsetLeft + w / 2,
          el.offsetTop + h / 2,
          w,
          h,
          { ...BODY_OPTS },
        );
        Composite.add(engine.world, body);
        return body;
      });
    }

    // Function to create circles for circle elements
    function createCircles() {
      return circles.map((el) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const body = Bodies.circle(
          el.offsetLeft + w / 2,
          el.offsetTop + h / 2,
          Math.max(w, h) / 2,
          { ...BODY_OPTS },
        );
        Composite.add(engine.world, body);
        return body;
      });
    }

    // Function to create pill shapes (left circle + right circle + rect)
    function createPills() {
      return pills.map((el) => {
        const w = el.offsetWidth;
        const h = el.offsetHeight;
        const cx = el.offsetLeft + w / 2;
        const cy = el.offsetTop + h / 2;
        const r = h / 2;

        const left = Bodies.circle(cx - w / 2 + r, cy, r, { ...BODY_OPTS });
        const right = Bodies.circle(cx + w / 2 - r, cy, r, { ...BODY_OPTS });
        const mid = Bodies.rectangle(cx, cy, w - h, h, { ...BODY_OPTS });

        const body = Body.create({
          parts: [left, right, mid],
          friction: 0.1,
          restitution: 0.5,
        });
        Composite.add(engine.world, body);
        return body;
      });
    }

    let elemRects = createRectangles();
    let elemCircles = createCircles();
    let elemPills = createPills();

    /* Static boundaries. The snippet uses 1px walls at the exact edges; we use
       thick walls whose inner face sits at the same edge — visually identical
       (opacity 0), but fast flings can't tunnel through. */
    const WALL = 120;
    const createBoundaries = () => {
      const W = matterBox.clientWidth;
      const H = matterBox.clientHeight;
      Composite.add(engine.world, [
        Bodies.rectangle(W / 2, H + WALL / 2, W + WALL * 2, WALL, { isStatic: true, render: { opacity: 0 } }),
        Bodies.rectangle(-WALL / 2, H / 2, WALL, H * 2, { isStatic: true, render: { opacity: 0 } }),
        Bodies.rectangle(W + WALL / 2, H / 2, WALL, H * 2, { isStatic: true, render: { opacity: 0 } }),
        Bodies.rectangle(W / 2, -WALL / 2, W + WALL * 2, WALL, { isStatic: true, render: { opacity: 0 } }),
      ]);
    };
    createBoundaries();

    // create runner
    const runner = Runner.create();

    // add mouse control
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });
    Composite.add(engine.world, mouseConstraint);
    render.mouse = mouse;

    // update positions and rotations after every engine update
    const sync = () => {
      elemPills.forEach((body, i) => {
        const el = pills[i];
        el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
        el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
        el.style.transform = `rotate(${body.angle}rad)`;
      });
      elemCircles.forEach((body, i) => {
        const el = circles[i];
        el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
        el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
        el.style.transform = `rotate(${body.angle}rad)`;
      });
      elemRects.forEach((body, i) => {
        const el = rects[i];
        el.style.left = `${body.position.x - el.offsetWidth / 2}px`;
        el.style.top = `${body.position.y - el.offsetHeight / 2}px`;
        el.style.transform = `rotate(${body.angle}rad)`;
      });
    };
    Events.on(engine, "afterUpdate", sync);

    /* Scroll passthrough: strip the wheel listeners Matter's Mouse registers
       (names vary across versions — remove all three). */
    const mouseEl = mouseConstraint.mouse.element;
    type WheelHandler = (e: Event) => void;
    const wheelHandler = (mouseConstraint.mouse as unknown as { mousewheel: WheelHandler }).mousewheel;
    const stripWheel = () => {
      mouseEl.removeEventListener("mousewheel", wheelHandler);
      mouseEl.removeEventListener("DOMMouseScroll", wheelHandler);
      mouseEl.removeEventListener("wheel", wheelHandler);
    };
    stripWheel();

    /* Touch passthrough: swipes scroll the page unless a body is grabbed. */
    type TouchHandler = (e: Event) => void;
    const m = mouseConstraint.mouse as unknown as {
      mousedown: TouchHandler;
      mousemove: TouchHandler;
      mouseup: TouchHandler;
    };
    mouseEl.removeEventListener("touchstart", m.mousedown);
    mouseEl.removeEventListener("touchmove", m.mousemove);
    mouseEl.removeEventListener("touchend", m.mouseup);
    const onTouchStart: TouchHandler = (e) => m.mousedown(e);
    const onTouchMove: TouchHandler = (e) => {
      if (mouseConstraint.body) m.mousemove(e);
    };
    const onTouchEnd: TouchHandler = (e) => {
      if (mouseConstraint.body) m.mouseup(e);
    };
    mouseEl.addEventListener("touchstart", onTouchStart, { passive: true });
    mouseEl.addEventListener("touchmove", onTouchMove);
    mouseEl.addEventListener("touchend", onTouchEnd);

    // Handle a box resize: re-pack the elements into the NEW width, then rebuild
    // the world at their fresh positions. Re-running layout() is the fix for the
    // desktop→mobile case — without it, bodies kept their old (wide) coordinates
    // and flung the chips off the right edge of the now-narrow box.
    const handleResize = () => {
      Composite.clear(engine.world, false);
      layout();
      createBoundaries();
      elemRects = createRectangles();
      elemCircles = createCircles();
      elemPills = createPills();
      Composite.add(engine.world, mouseConstraint);
      render.options.width = matterBox.clientWidth;
      render.options.height = matterBox.clientHeight;
      render.canvas.width = matterBox.clientWidth;
      render.canvas.height = matterBox.clientHeight;
    };

    // Observe the box itself, not just window resize — device-mode toggles,
    // orientation changes and layout shifts change the box without a window
    // resize event. Debounced; the first (initial) fire is skipped.
    let firstRO = true;
    let resizeTimer = 0;
    const ro = new ResizeObserver(() => {
      if (firstRO) {
        firstRO = false;
        return;
      }
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(handleResize, 150);
    });
    ro.observe(matterBox);

    // Intersection Observer to start the engine only once
    let engineStarted = false;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !engineStarted) {
            engineStarted = true;
            Runner.run(runner, engine);
            Render.run(render);
          }
        });
      },
      { threshold: 0.1 },
    );
    observer.observe(matterBox);

    return () => {
      observer.disconnect();
      ro.disconnect();
      window.clearTimeout(resizeTimer);
      mouseEl.removeEventListener("touchstart", onTouchStart);
      mouseEl.removeEventListener("touchmove", onTouchMove);
      mouseEl.removeEventListener("touchend", onTouchEnd);
      Events.off(engine, "afterUpdate", sync);
      Runner.stop(runner);
      Render.stop(render);
      render.canvas.remove();
      Composite.clear(engine.world, false);
      Engine.clear(engine);
    };
  }, [effectiveCount, gravity, reduced]);

  /* Reduced-motion: static scatter, no physics. */
  const staticStyle = (i: number): React.CSSProperties =>
    reduced
      ? {
          left: `${(i * 137) % 80}%`,
          top: `${8 + ((i * 97) % 72)}%`,
          transform: `rotate(${((i % 7) * 8) - 28}deg)`,
        }
      : { left: 0, top: 0 };

  return (
    <div
      ref={boxRef}
      aria-hidden="true"
      className="matter-box relative w-full overflow-hidden rounded-[24px] border border-white/10"
      style={{
        height: "clamp(380px, 52vh, 480px)",
        background: "var(--ref-bg-dark)",
        cursor: reduced ? "default" : "grab",
        visibility: "hidden", // revealed by the effect once positioned
      }}
    >
      {labels.map((label, i) => {
        const gradient = gradientFor(i);
        const light = isLightGradient(gradient);
        return (
          <div
            key={label}
            ref={(el) => {
              pillRefs.current[i] = el;
            }}
            className={`dm-matter-elem-pill clay ${
              light ? "clay-light" : "clay-dark"
            } absolute select-none rounded-full px-[1.875rem] py-[1.125rem] text-[1.3125rem] font-medium`}
            style={{
              ...staticStyle(i),
              background: gradient,
              color: light ? "rgba(10,10,10,0.85)" : "rgba(245,245,245,0.92)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {label}
          </div>
        );
      })}

      {RECT_CHIPS.map((chip, i) => {
        const gradient = gradientFor(labels.length + i);
        const light = isLightGradient(gradient);
        return (
          <div
            key={chip}
            ref={(el) => {
              rectRefs.current[i] = el;
            }}
            className={`dm-matter-elem clay ${
              light ? "clay-light" : "clay-dark"
            } absolute select-none rounded-[24px] px-6 py-[1.125rem] text-[1.3125rem] font-semibold uppercase tracking-[0.06em]`}
            style={{
              ...staticStyle(labels.length + i),
              background: gradient,
              color: light ? "rgba(10,10,10,0.85)" : "rgba(245,245,245,0.92)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {chip}
          </div>
        );
      })}

      {squares.map((code, i) => {
        const gradient = gradientFor(labels.length + RECT_CHIPS.length + i + 41);
        const light = isLightGradient(gradient);
        return (
          <div
            key={code}
            ref={(el) => {
              squareRefs.current[i] = el;
            }}
            className={`dm-matter-elem-square clay ${
              light ? "clay-light" : "clay-dark"
            } absolute flex select-none items-center justify-center rounded-[22px] font-semibold text-[1.6rem]`}
            style={{
              ...staticStyle(labels.length + RECT_CHIPS.length + i + 41),
              width: 96,
              height: 96,
              background: gradient,
              color: light ? "rgba(10,10,10,0.85)" : "rgba(245,245,245,0.92)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {code}
          </div>
        );
      })}

      {CIRCLE_ICONS.map((icon, i) => {
        const gradient = gradientFor(labels.length + RECT_CHIPS.length + SQUARE_CHIPS.length + i);
        const light = isLightGradient(gradient);
        return (
          <div
            key={icon}
            ref={(el) => {
              circleRefs.current[i] = el;
            }}
            className={`dm-matter-elem-circle clay ${
              light ? "clay-light" : "clay-dark"
            } absolute flex select-none items-center justify-center rounded-full text-[2.25rem]`}
            style={{
              ...staticStyle(labels.length + RECT_CHIPS.length + i),
              width: 96,
              height: 96,
              background: gradient,
              color: light ? "rgba(10,10,10,0.85)" : "rgba(245,245,245,0.92)",
              whiteSpace: "nowrap",
              pointerEvents: "none",
            }}
          >
            {icon}
          </div>
        );
      })}
    </div>
  );
}
