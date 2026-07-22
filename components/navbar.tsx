"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useId, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion, type Variants } from "motion/react";
import { RolloverMask } from "@/components/rollover-mask";
import { t } from "@/content/copy";
import { asset } from "@/lib/base-path";

const NAV_LINKS = [
  { href: "/about", label: t.nav.links.about },
  { href: "/work", label: t.nav.links.work },
  { href: "/contact", label: t.nav.links.contact },
  { href: "#", label: t.nav.links.blogs },
];

const EASE = [0.6, 0, 0.2, 1] as const;

function Chevron({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M13.17 12L8.22 7.05 9.64 5.64 16 12l-6.36 6.36-1.42-1.41L13.17 12z"
        fill="currentColor"
      />
    </svg>
  );
}

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  // Hide-on-scroll / show-on-cursor-near-top logic.
  // `visible` drives the header translateY animation.
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);
  const scrolledDown = useRef(false);

  useEffect(() => {
    const HIDE_THRESHOLD = 80;   // px scrolled before hiding
    const CURSOR_ZONE   = 80;    // px from top that re-shows header

    const onScroll = () => {
      const y = window.scrollY;
      if (y > lastScrollY.current && y > HIDE_THRESHOLD) {
        // Scrolling down — hide
        scrolledDown.current = true;
        setVisible(false);
      } else if (y < lastScrollY.current) {
        // Scrolling up — show
        setVisible(true);
      }
      if (y <= HIDE_THRESHOLD) {
        // Back near top — always show
        scrolledDown.current = false;
        setVisible(true);
      }
      lastScrollY.current = y;
    };

    const onMouseMove = (e: MouseEvent) => {
      if (scrolledDown.current && e.clientY <= CURSOR_ZONE) {
        setVisible(true);
      } else if (scrolledDown.current && e.clientY > CURSOR_ZONE && window.scrollY > HIDE_THRESHOLD) {
        setVisible(false);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouseMove);
    };
  }, []);

  // Close on route change.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Close on Escape + click outside.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        toggleRef.current?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      const target = e.target as Node;
      if (
        panelRef.current &&
        !panelRef.current.contains(target) &&
        toggleRef.current &&
        !toggleRef.current.contains(target)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  const panelVariants: Variants = {
    closed: {
      height: 0,
      opacity: 0,
      y: -16,
      transition: { duration: 0.4, ease: EASE, when: "afterChildren" },
    },
    open: {
      height: "auto",
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: EASE,
        when: "beforeChildren",
        delayChildren: 0.08,
        staggerChildren: 0.07,
      },
    },
  };

  const linkVariants: Variants = {
    closed: { opacity: 0, y: "35%" },
    open: { opacity: 1, y: "0%", transition: { duration: 0.5, ease: EASE } },
  };

  const topLine = open
    ? { rotate: 45, y: 4 }
    : { rotate: 0, y: 0 };
  const bottomLine = open
    ? { rotate: -45, y: -4 }
    : { rotate: 0, y: 0 };

  return (
    <motion.header
      role="banner"
      className="fixed top-0 left-0 right-0 z-50"
      style={{ color: "var(--color-ink)" }}
      animate={{ y: visible ? 0 : "-110%" }}
      transition={
        reduceMotion
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 28, mass: 0.8 }
      }
    >
      <nav
        className="mx-auto flex items-center justify-between px-6 md:px-12 h-16 md:h-20"
        aria-label="Main navigation"
        style={{
          backgroundColor: "transparent",
          boxSizing: "content-box",
        }}
      >
        {/* LEFT: brand */}
        <Link href="/" className="ref-brand focus-accent" aria-label="Home">
          {t.nav.brand}
        </Link>

        {/* RIGHT */}
        <div className="flex items-center gap-2 md:gap-3">
          <a
            href={asset("/resume.pdf")}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline focus-accent rollover-trigger hidden sm:inline-flex"
          >
            <RolloverMask>{t.nav.resume}</RolloverMask>
          </a>
          <Link
            href="/contact"
            className="btn-outline focus-accent rollover-trigger hidden sm:inline-flex"
          >
            <RolloverMask>{t.nav.scheduleCall}</RolloverMask>
          </Link>

          <button
            ref={toggleRef}
            type="button"
            className="ref-toggle focus-accent"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            aria-controls={panelId}
            onClick={() => setOpen((v) => !v)}
          >
            <motion.span
              className="ref-toggle-line"
              animate={topLine}
              transition={{ duration: 0.3, ease: EASE }}
            />
            <motion.span
              className="ref-toggle-line"
              animate={bottomLine}
              transition={{ duration: 0.3, ease: EASE }}
            />
          </button>
        </div>
      </nav>

      {/* Dropdown panel */}
      <div className="mx-auto px-6 md:px-12 flex justify-end">
        <AnimatePresence initial={false}>
          {open && (
            <motion.div
              id={panelId}
              ref={panelRef}
              key="nav-panel"
              variants={panelVariants}
              initial="closed"
              animate="open"
              exit="closed"
              className="overflow-hidden w-full md:w-[360px] mt-2"
            >
              <div className="ref-drop-content p-6">
                <ul className="flex flex-col">
                  {NAV_LINKS.map((link) => (
                    <motion.li key={link.label} variants={linkVariants}>
                      <Link
                        href={link.href}
                        className="nav-drop-link focus-accent flex items-center justify-between py-3.5 border-b border-black/10 last:border-0"
                      >
                        <span className="heading-h5">{link.label}</span>
                        <span className="chev-clip">
                          <span className="chev chev-first">
                            <Chevron />
                          </span>
                          <span className="chev chev-second">
                            <Chevron />
                          </span>
                        </span>
                      </Link>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.header>
  );
}
