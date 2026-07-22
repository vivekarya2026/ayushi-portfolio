"use client";

/**
 * Home hero — a centered heading ("Hey, I'm" · character card · "Ayushi")
 * whose card cycles 8 poses, a speech bubble that always matches the pose
 * showing, and a click-to-scatter sticker burst. The flung stickers can be
 * dragged around and each clears itself after a short lifespan. The card /
 * pose / bubble choreography stays imperative (refs + one timer-driven
 * useEffect, matching physics-pile.tsx's ref-synced approach) since its
 * classList-toggle timing is sensitive; the flung stickers and CTA confetti
 * are ordinary React state + AnimatePresence, matching the navbar's
 * dropdown-panel precedent for discrete appear/remove elements.
 */

import { useCallback, useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence, useReducedMotion } from "motion/react";
import { t } from "@/content/copy";
import { riseIn, riseInContainer } from "@/lib/motion";
import { asset } from "@/lib/base-path";

const POSE_FILES = [
  "namaste",
  "waving-hello",
  "peek-a-boo",
  "you-found-me",
  "lets-create",
  "tadaa",
  "double-thumbs-up",
  "laughing",
] as const;

const POSES = POSE_FILES.map((file, i) => ({
  src: `/images/hero/stickers/${file}.webp`,
  alt: t.home.hero.poses[i].alt,
  bubble: t.home.hero.poses[i].bubble,
}));

const CONFETTI_COLORS = [
  "var(--color-accent)",
  "var(--color-ink)",
  "var(--color-canvas)",
  "oklch(0.75 0.14 75)", // marigold — same token physics-pile.tsx uses for its second hue
];

/** How long a flung sticker lingers before it clears itself (ms). */
const STICKER_LIFESPAN = 6500;

interface StickerItem {
  id: number;
  src: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  duration: number;
}

interface ConfettiItem {
  id: number;
  color: string;
  x: number;
  y: number;
  dx: number;
  dy: number;
  rotate: number;
  duration: number;
}

/** Fisher–Yates over pose indices, excluding one — shared by pose cycling and the sticker burst. */
function pickDistinctPoses(count: number, excludeIdx: number): number[] {
  const pool: number[] = [];
  for (let i = 0; i < POSES.length; i++) {
    if (i !== excludeIdx) pool.push(i);
  }
  for (let j = pool.length - 1; j > 0; j--) {
    const k = Math.floor(Math.random() * (j + 1));
    const tmp = pool[j];
    pool[j] = pool[k];
    pool[k] = tmp;
  }
  return pool.slice(0, count);
}

export function HeroSection() {
  const reduce = useReducedMotion();

  const sectionRef = useRef<HTMLElement>(null);
  const wordLeftRef = useRef<HTMLSpanElement>(null);
  const wordRightRef = useRef<HTMLSpanElement>(null);
  const tiltRef = useRef<HTMLSpanElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const poseRefs = useRef<(HTMLDivElement | null)[]>([]);
  const bubbleRef = useRef<HTMLDivElement>(null);

  const poseIndexRef = useRef(0);
  const busyRef = useRef(true);
  const tickRef = useRef(0);
  const idRef = useRef(0);
  const stickerTimers = useRef<Map<number, number>>(new Map());

  const [mounted, setMounted] = useState(false);
  const [stickers, setStickers] = useState<StickerItem[]>([]);
  const [confetti, setConfetti] = useState<ConfettiItem[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const removeSticker = useCallback((id: number) => {
    setStickers((cur) => cur.filter((s) => s.id !== id));
    stickerTimers.current.delete(id);
  }, []);

  const scheduleRemoval = useCallback(
    (id: number) => {
      const existing = stickerTimers.current.get(id);
      if (existing) window.clearTimeout(existing);
      const tid = window.setTimeout(() => removeSticker(id), STICKER_LIFESPAN);
      stickerTimers.current.set(id, tid);
    },
    [removeSticker],
  );

  const cancelRemoval = useCallback((id: number) => {
    const existing = stickerTimers.current.get(id);
    if (existing) {
      window.clearTimeout(existing);
      stickerTimers.current.delete(id);
    }
  }, []);

  // Clear any pending sticker-expiry timers on unmount.
  useEffect(() => {
    const timers = stickerTimers.current;
    return () => {
      timers.forEach((tid) => window.clearTimeout(tid));
      timers.clear();
    };
  }, []);

  const spawnStickers = useCallback(() => {
    const card = cardRef.current;
    if (!card) return;
    const r = card.getBoundingClientRect();
    const cx = r.left + r.width / 2;
    const cy = r.top + r.height / 2;
    const picks = pickDistinctPoses(3, poseIndexRef.current);
    const items: StickerItem[] = picks.map((p) => {
      const dx = (Math.random() - 0.5) * window.innerWidth * 0.7;
      const endY = window.innerHeight - 70 - Math.random() * 90;
      return {
        id: idRef.current++,
        src: POSES[p].src,
        x: cx,
        y: cy,
        dx,
        dy: endY - cy,
        rotate: Math.random() * 720 - 360,
        duration: 900 + Math.random() * 500,
      };
    });
    setStickers((cur) => [...cur, ...items].slice(-60));
  }, []);

  const handleCtaClick = useCallback(
    (e: React.MouseEvent<HTMLAnchorElement>) => {
      if (reduce) return;
      const r = e.currentTarget.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const items: ConfettiItem[] = Array.from({ length: 26 }, () => {
        const angle = Math.random() * Math.PI * 2;
        const d = 70 + Math.random() * 130;
        return {
          id: idRef.current++,
          color: CONFETTI_COLORS[Math.floor(Math.random() * CONFETTI_COLORS.length)],
          x: cx,
          y: cy,
          dx: Math.cos(angle) * d,
          dy: Math.sin(angle) * d + 60,
          rotate: Math.random() * 540 - 270,
          duration: 800 + Math.random() * 500,
        };
      });
      setConfetti((cur) => [...cur, ...items]);
    },
    [reduce],
  );

  useEffect(() => {
    const setVisiblePose = (index: number) => {
      poseRefs.current.forEach((el, i) => {
        el?.classList.toggle("is-visible", i === index);
      });
    };

    if (reduce) {
      // Static, fully-assembled fallback: no timers, no listeners, one fixed pose.
      cardRef.current?.classList.remove("is-gone");
      poseIndexRef.current = 0;
      setVisiblePose(0);
      if (bubbleRef.current) {
        bubbleRef.current.textContent = POSES[0].bubble;
        bubbleRef.current.classList.add("is-show");
      }
      busyRef.current = false;
      return;
    }

    setVisiblePose(poseIndexRef.current);

    const timers: number[] = [];
    const setT = (fn: () => void, ms: number) => {
      const id = window.setTimeout(fn, ms);
      timers.push(id);
      return id;
    };

    function showBubble() {
      const bubble = bubbleRef.current;
      if (!bubble) return;
      bubble.textContent = POSES[poseIndexRef.current].bubble;
      bubble.classList.add("is-show");
      setT(() => bubble.classList.remove("is-show"), 1500);
    }

    function selectNextPose() {
      const next = pickDistinctPoses(1, poseIndexRef.current)[0];
      poseIndexRef.current = next;
      setVisiblePose(next);
    }

    // Drop the card in from above (used on first assemble and on the periodic
    // full re-entry) — no longer gated on any letter typing.
    function assemble() {
      const card = cardRef.current;
      card?.classList.remove("is-gone");
      card?.classList.add("is-shut");
      card?.classList.remove("is-dropin");
      void card?.offsetWidth;
      card?.classList.add("is-dropin");
      setT(() => {
        card?.classList.remove("is-shut");
        setT(() => {
          showBubble();
          busyRef.current = false;
        }, 500);
      }, 600);
    }

    // Full re-entry: collapse the card away, swap pose, drop a fresh one in.
    function retype() {
      busyRef.current = true;
      const card = cardRef.current;
      card?.classList.add("is-shut");
      setT(() => {
        selectNextPose();
        card?.classList.add("is-gone");
        setT(() => setT(assemble, 450), 300);
      }, 350);
    }

    // Quick pose swap without a full drop-in; optionally fling stickers.
    function pop(withStickers: boolean) {
      if (busyRef.current) return;
      busyRef.current = true;
      cardRef.current?.classList.add("is-shut");
      setT(() => {
        selectNextPose();
        cardRef.current?.classList.remove("is-shut");
        showBubble();
        if (withStickers) spawnStickers();
        setT(() => {
          busyRef.current = false;
        }, 900);
      }, 340);
    }

    const cleanups: (() => void)[] = [];

    const onCardClick = () => pop(true);
    cardRef.current?.addEventListener("click", onCardClick);
    cleanups.push(() => cardRef.current?.removeEventListener("click", onCardClick));

    const section = sectionRef.current;
    const onMouseMove = (e: MouseEvent) => {
      const r = section!.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      if (tiltRef.current) {
        tiltRef.current.style.transform = `perspective(700px) rotateY(${x * 10}deg) rotateX(${-y * 8}deg)`;
      }
      if (wordLeftRef.current) {
        wordLeftRef.current.style.transform = `translate(${-x * 10}px,${-y * 6}px)`;
      }
      if (wordRightRef.current) {
        wordRightRef.current.style.transform = `translate(${x * 10}px,${-y * 6}px)`;
      }
    };
    const onMouseLeave = () => {
      if (tiltRef.current) tiltRef.current.style.transform = "";
      if (wordLeftRef.current) wordLeftRef.current.style.transform = "";
      if (wordRightRef.current) wordRightRef.current.style.transform = "";
    };
    section?.addEventListener("mousemove", onMouseMove);
    section?.addEventListener("mouseleave", onMouseLeave);
    cleanups.push(() => {
      section?.removeEventListener("mousemove", onMouseMove);
      section?.removeEventListener("mouseleave", onMouseLeave);
    });

    setT(assemble, 450);
    const loop = window.setInterval(() => {
      if (busyRef.current) return;
      tickRef.current++;
      if (tickRef.current % 4 === 0) retype();
      else pop(false);
    }, 8000);
    timers.push(loop);

    return () => {
      timers.forEach((id) => {
        window.clearTimeout(id);
        window.clearInterval(id);
      });
      cleanups.forEach((fn) => fn());
    };
  }, [reduce, spawnStickers]);

  return (
    <section ref={sectionRef} className="hero-section">
      <div className="hero-inner">
        <h1 className="hero-word-row">
          <span ref={wordLeftRef} className="hero-word hero-word-left">
            {t.home.hero.headline}
          </span>

          <span ref={tiltRef} className="hero-tilt">
            <span ref={bubbleRef} className="hero-bubble">
              {POSES[0].bubble}
            </span>
            <button
              ref={cardRef}
              type="button"
              className="hero-card is-gone focus-accent"
              aria-label={t.home.hero.characterAlt}
            >
              {POSES.map((p, i) => (
                <div
                  key={p.src}
                  ref={(el) => {
                    poseRefs.current[i] = el;
                  }}
                  className={`hero-card-pose${i === 0 ? " is-visible" : ""}`}
                >
                  <Image
                    src={p.src}
                    alt=""
                    fill
                    sizes="(max-width: 480px) 140px, 230px"
                    {...(i === 0
                      ? { preload: true as const, fetchPriority: "high" as const }
                      : { loading: "eager" as const })}
                  />
                </div>
              ))}
            </button>
            <span className="hero-hint" aria-hidden="true">
              {t.home.hero.clickHint}
            </span>
          </span>

          <span ref={wordRightRef} className="hero-word hero-word-right">
            {t.home.hero.name}
          </span>
        </h1>

        {/* initial/animate stay fixed string keys regardless of `reduce` — useReducedMotion()
            resolves to null on the server, so branching the prop *value* itself (rather than
            just the transition timing) would make the server and first client render disagree
            on the rendered opacity/transform style and trip a hydration mismatch. Only timing
            varies with `reduce`; the keyframe values stay identical either way. */}
        <motion.div
          className="hero-bottom"
          initial="hidden"
          animate="visible"
          variants={riseInContainer}
          transition={{ delayChildren: reduce ? 0 : 2.1, staggerChildren: reduce ? 0 : 0.15 }}
        >
          <motion.p
            variants={riseIn}
            transition={reduce ? { duration: 0.15 } : undefined}
            className="hero-subheading type-body-sm"
          >
            {t.home.hero.bio}
          </motion.p>

          <motion.div variants={riseIn} transition={reduce ? { duration: 0.15 } : undefined}>
            <Link href="/work" className="btn-outline focus-accent" onClick={handleCtaClick}>
              {t.home.hero.ctaWork}
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {mounted &&
        createPortal(
          <AnimatePresence>
            {stickers.map((s) => (
              <motion.div
                key={s.id}
                className="hero-mini"
                style={{ left: s.x - 32, top: s.y - 32 }}
                initial={{ x: 0, y: 0, rotate: 0 }}
                animate={{ x: s.dx, y: s.dy, rotate: s.rotate }}
                exit={{ opacity: 0, scale: 0.6 }}
                transition={{ duration: s.duration / 1000, ease: [0.3, 0.6, 0.4, 1.25] }}
                drag
                dragMomentum={false}
                whileDrag={{ scale: 1.15, zIndex: 60 }}
                onAnimationComplete={() => scheduleRemoval(s.id)}
                onDragStart={() => cancelRemoval(s.id)}
                onDragEnd={() => scheduleRemoval(s.id)}
              >
                <img src={asset(s.src)} alt="" draggable={false} />
              </motion.div>
            ))}
          </AnimatePresence>,
          document.body,
        )}

      {mounted &&
        createPortal(
          <AnimatePresence>
            {confetti.map((c) => (
              <motion.div
                key={c.id}
                className="hero-confetti"
                style={{ left: c.x, top: c.y, background: c.color }}
                initial={{ x: 0, y: 0, rotate: 0, opacity: 1, scale: 1 }}
                animate={{ x: c.dx, y: c.dy, rotate: c.rotate, opacity: 0, scale: 0.4 }}
                transition={{ duration: c.duration / 1000, ease: [0.18, 0.9, 0.32, 1] }}
                onAnimationComplete={() =>
                  setConfetti((cur) => cur.filter((item) => item.id !== c.id))
                }
              />
            ))}
          </AnimatePresence>,
          document.body,
        )}
    </section>
  );
}
