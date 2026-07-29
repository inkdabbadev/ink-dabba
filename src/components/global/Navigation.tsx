"use client";

import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import Magnetic from "@/components/motion/Magnetic";

const navLinks = [
  {
    name: "Home",
    href: "#home",
    color: "#00AEEF",
    preview: "Start the story",
    wash: "radial-gradient(circle at 12% 18%, rgba(0,174,239,0.08), transparent 34%), radial-gradient(circle at 88% 72%, rgba(255,242,0,0.035), transparent 36%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.96))",
  },
  {
    name: "About",
    href: "#about",
    color: "#EC0080",
    preview: "Why we exist",
    wash: "radial-gradient(circle at 88% 20%, rgba(236,0,128,0.08), transparent 34%), radial-gradient(circle at 14% 76%, rgba(0,174,239,0.035), transparent 36%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.96))",
  },
  {
    name: "Clients",
    href: "#clients",
    color: "#FFF200",
    preview: "Brands we shaped",
    wash: "radial-gradient(circle at 12% 74%, rgba(255,242,0,0.06), transparent 36%), radial-gradient(circle at 82% 22%, rgba(236,0,128,0.035), transparent 34%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.96))",
  },
  {
    name: "Contact",
    href: "#contact",
    color: "#FFF4E6",
    preview: "Start a project",
    wash: "radial-gradient(circle at 84% 76%, rgba(255,244,230,0.06), transparent 36%), radial-gradient(circle at 16% 20%, rgba(0,174,239,0.035), transparent 34%), linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.96))",
  },
];

const panelEase = [0.76, 0, 0.24, 1] as const;
const itemEase  = [0.16, 1, 0.3,  1] as const;

export default function Navigation() {
  const [menuOpen, setMenuOpen]       = useState(false);
  const [activeHref, setActiveHref]   = useState("#home");
  const [hoveredHref, setHoveredHref] = useState<string | null>(null);
  const { setVariant } = useCursor();

  const activeLink  = navLinks.find(l => l.href === activeHref) ?? navLinks[0];
  const hoveredLink = navLinks.find(l => l.href === hoveredHref) ?? null;
  const visualLink  = hoveredLink ?? activeLink;

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    const onEscape = (e: KeyboardEvent) => { if (e.key === "Escape") setMenuOpen(false); };
    window.addEventListener("keydown", onEscape);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onEscape);
    };
  }, [menuOpen]);

  useEffect(() => {
    const sections = navLinks
      .map(l => document.querySelector<HTMLElement>(l.href))
      .filter(Boolean) as HTMLElement[];
    if (!sections.length) return;

    const observer = new IntersectionObserver(
      entries => {
        const top = entries
          .filter(e => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (top?.target.id) setActiveHref(`#${top.target.id}`);
      },
      { rootMargin: "-38% 0px -38% 0px", threshold: [0.18, 0.32, 0.48, 0.64] },
    );
    sections.forEach(s => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  const scrollToHref = (href: string) => {
    const target = document.querySelector<HTMLElement>(href);
    if (!target) return;
    setMenuOpen(false);
    setHoveredHref(null);
    window.setTimeout(() => {
      const top = target.getBoundingClientRect().top + window.scrollY;
      if (window.__inkLenis) {
        window.__inkLenis.scrollTo(top, {
          duration: 1.15,
          easing: (t: number) => 1 - Math.pow(1 - t, 4),
        });
        return;
      }
      window.scrollTo({ top, behavior: "smooth" });
    }, 80);
  };

  return (
    <>
      {/* ── Hamburger ── */}
      <motion.header
        data-nav-header="true"
        className="fixed right-0 top-0 z-[120] flex w-full items-start justify-end px-4 py-4 md:px-7 md:py-6"
        initial={{ y: -28, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.75, ease: itemEase, delay: 1.05 }}
      >
        <Magnetic>
          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(v => !v)}
            onMouseEnter={() => setVariant("ENTER")}
            onMouseLeave={() => setVariant("default")}
            className="group relative grid h-16 w-16 place-items-center overflow-hidden bg-transparent text-warm-white transition-colors duration-500 hover:text-cmyk-cyan md:h-20 md:w-20"
          >
            <span className="relative h-10 w-10">
              <motion.span
                className="absolute left-0 top-[11px] block h-[4px] w-10 origin-center rounded-full bg-current"
                animate={menuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                transition={{ duration: 0.42, ease: itemEase }}
              />
              <motion.span
                className="absolute right-0 top-[25px] block h-[4px] w-7 origin-center rounded-full bg-current"
                animate={menuOpen ? { rotate: -45, y: -6, width: 40 } : { rotate: 0, y: 0, width: 28 }}
                transition={{ duration: 0.42, ease: itemEase }}
              />
            </span>
          </button>
        </Magnetic>
      </motion.header>

      {/* ── Full-screen menu ── */}
      <AnimatePresence>
        {menuOpen && (
          <>
            {/* Main Dark Menu Container */}
            <motion.div
              key="menu-main-panel"
              className="fixed inset-0 z-[100] overflow-hidden bg-[#080808]"
              initial={{ x: "100%" }}
              animate={{
                x: "0%",
                transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] }
              }}
              exit={{
                x: "100%",
                transition: { duration: 0.65, ease: [0.76, 0, 0.24, 1] }
              }}
            >
            {/* Colour atmosphere */}
            <motion.div
              aria-hidden
              className="absolute inset-0 pointer-events-none"
              animate={{ background: visualLink.wash }}
              transition={{ duration: 0.5, ease: itemEase }}
            />

            {/* Noise grain */}
            <div aria-hidden className="absolute inset-0 opacity-[0.045] noise" />

            {/* CMYK top accent line */}
            <motion.div
              aria-hidden
              className="absolute left-0 right-0 top-0 h-[2px] origin-left bg-gradient-to-r from-cmyk-cyan via-cmyk-magenta to-cmyk-yellow"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              exit={{ scaleX: 0, originX: 1 }}
              transition={{ duration: 0.5, ease: panelEase, delay: 0.06 }}
            />

            {/* Decorative sweep lines (kept from original feel) */}
            <motion.div
              aria-hidden
              className="absolute inset-x-[-12vw] top-[18vh] h-36 -rotate-6 bg-[linear-gradient(90deg,transparent,rgba(0,174,239,0.06),rgba(236,0,128,0.05),rgba(255,242,0,0.03),transparent)] blur-2xl"
              initial={{ x: "-18%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "14%", opacity: 0 }}
              transition={{ duration: 0.7, ease: itemEase, delay: 0.06 }}
            />
            <motion.div
              aria-hidden
              className="absolute inset-x-[-10vw] bottom-[16vh] h-32 rotate-3 bg-[linear-gradient(90deg,transparent,rgba(255,242,0,0.03),rgba(0,174,239,0.05),rgba(236,0,128,0.06),transparent)] blur-2xl"
              initial={{ x: "16%", opacity: 0 }}
              animate={{ x: "0%", opacity: 1 }}
              exit={{ x: "-14%", opacity: 0 }}
              transition={{ duration: 0.7, ease: itemEase, delay: 0.08 }}
            />
            {/* ── Nav links — Centered Editorial Layout ── */}
            <nav
              className="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-6 py-24 text-center"
              onMouseLeave={() => setHoveredHref(null)}
            >
              <div 
                className="flex flex-col gap-6 md:gap-9 items-center justify-center max-w-4xl w-full"
                style={{ perspective: "1200px", transformStyle: "preserve-3d" }}
              >
                {navLinks.map((link, i) => {
                  const lineDelay  = 0.08 + i * 0.04;
                  const isHovered  = hoveredHref === link.href;
                  const anyHovered = hoveredHref !== null;

                  return (
                    <motion.div
                      key={link.name}
                      className="group relative flex flex-col items-center py-2 md:py-3"
                      initial={{
                        x: 120,
                        opacity: 0,
                        scale: 0.96,
                        filter: "blur(12px)",
                      }}
                      animate={{
                        x: 0,
                        opacity: 1,
                        scale: 1,
                        filter: "blur(0px)",
                      }}
                      exit={{
                        x: 80,
                        opacity: 0,
                        scale: 0.98,
                        filter: "blur(8px)",
                      }}
                      transition={{
                        duration: 0.72,
                        delay: menuOpen ? lineDelay : (navLinks.length - i - 1) * 0.03,
                        ease: itemEase,
                      }}
                    >
                      {/* Nav button */}
                      <button
                        type="button"
                        style={{ "--menu-hover": link.color } as React.CSSProperties}
                        onClick={() => scrollToHref(link.href)}
                        onMouseEnter={() => { setHoveredHref(link.href); setVariant("ENTER"); }}
                        onMouseLeave={() => setVariant("default")}
                        className="relative inline-flex items-center justify-center max-w-[92vw] overflow-hidden py-1.5 focus:outline-none"
                      >
                        {/* Title Text */}
                        <span
                          className="relative inline-block font-display uppercase leading-[0.9] tracking-tighter transition-[color,opacity,text-shadow,filter] duration-500 align-middle"
                          style={{
                            fontSize: "clamp(3.2rem, 9.5vw, 7.8rem)",
                            color: isHovered
                              ? link.color
                              : anyHovered
                              ? "rgba(242,232,216,0.12)"
                              : "#F2E8D8",
                            textShadow: isHovered
                              ? `0 0 24px color-mix(in srgb, ${link.color} 18%, transparent)`
                              : "none",
                            filter: isHovered
                              ? "blur(0px)"
                              : anyHovered
                              ? "blur(5px)"
                              : "blur(0px)",
                          }}
                        >
                          {link.name}
                        </span>
                      </button>

                      {/* Subtitle / Preview - Positioned cleanly below the link */}
                      <motion.div
                        aria-hidden
                        initial={{ opacity: 0, y: -4 }}
                        animate={isHovered ? { opacity: 0.62, y: 2, filter: "blur(0px)" } : { opacity: 0, y: -4, filter: "blur(2px)" }}
                        transition={{ duration: 0.28, ease: itemEase }}
                        className="pointer-events-none mt-1"
                      >
                        <span
                          className="block font-body text-[clamp(0.65rem,1.8vw,0.88rem)] uppercase tracking-[0.24em] font-semibold"
                          style={{ color: link.color }}
                        >
                          {link.preview}
                        </span>
                      </motion.div>
                    </motion.div>
                  );
                })}
              </div>
            </nav>
          </motion.div>
        </>
        )}
      </AnimatePresence>
    </>
  );
}
