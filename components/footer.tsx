"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { t } from "@/content/copy";
import { EASE_OUT_EXPO } from "@/lib/motion";

const NAV = [
  { label: "Home", href: "/" },
  { label: t.nav.links.work, href: "/work" },
  { label: t.nav.links.about, href: "/about" },
  { label: t.nav.links.contact, href: "/contact" },
];

const SOCIALS = [
  { label: "LinkedIn", href: "https://linkedin.com/in/ayushidubey1210" },
  { label: "Behance", href: "https://behance.net/ayushidubey1210" },
  { label: "Instagram", href: "https://instagram.com/dayushi962" },
];

export function Footer() {
  return (
    <footer className="relative bg-pit text-canvas overflow-hidden">
      <div className="mx-auto max-w-[var(--container-max)] px-6 md:px-12 pt-20 md:pt-28">
        {/* Nav — centered */}
        <nav aria-label="Footer navigation" className="flex justify-center gap-7 md:gap-10">
          {NAV.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="tap-safe text-lg md:text-xl text-canvas hover:text-accent transition-colors tracking-tight focus-accent"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Socials — centered, quieter than the nav */}
        <div className="mt-10 md:mt-12 flex justify-center gap-7 md:gap-9">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="tap-safe text-base text-canvas/55 hover:text-canvas transition-colors focus-accent"
            >
              {s.label}
            </a>
          ))}
        </div>

        {/* Sign-off — the sentence the wordmark below completes */}
        <p className="mt-12 md:mt-16 text-center text-sm md:text-base text-canvas">
          {t.footer.signOff}
        </p>
      </div>

      {/* Signature wordmark — full-bleed, cropped by the footer's overflow so it
          reads as the page's last mark rather than a line of text. */}
      <motion.p
        aria-hidden
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.7, ease: EASE_OUT_EXPO }}
        className="footer-wordmark"
      >
        {t.footer.signature}
      </motion.p>

      <span className="sr-only">{t.footer.copyright}</span>
    </footer>
  );
}
