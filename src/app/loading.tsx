"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const smoothEase = [0.16, 1, 0.3, 1] as const;
const settleEase = [0.76, 0, 0.24, 1] as const;

type LoadingScene = {
  label: string;
  title: string;
  accent: string;
  background: string;
  foreground: "dark" | "light";
  words: string[];
  mode: "press" | "archive" | "story" | "signal" | "grid";
};

const scenes: Record<LoadingScene["mode"], LoadingScene> = {
  press: {
    label: "loading",
    title: "mixing the next frame",
    accent: "#FFF200",
    background: "#0B0A09",
    foreground: "light",
    words: ["cyan", "magenta", "yellow", "key"],
    mode: "press",
  },
  archive: {
    label: "loading work",
    title: "pinning the archive",
    accent: "#00AEEF",
    background: "#F7F3EB",
    foreground: "dark",
    words: ["posters", "banners", "logos", "labels"],
    mode: "archive",
  },
  story: {
    label: "loading about",
    title: "threading the studio story",
    accent: "#EC0080",
    background: "#11100E",
    foreground: "light",
    words: ["2018", "chennai", "ideas", "now"],
    mode: "story",
  },
  signal: {
    label: "loading contact",
    title: "opening a clean signal",
    accent: "#F9665B",
    background: "#F9665B",
    foreground: "dark",
    words: ["brief", "scope", "timeline", "hello"],
    mode: "signal",
  },
  grid: {
    label: "loading",
    title: "drawing the layout",
    accent: "#C7FF3D",
    background: "#0B0A09",
    foreground: "light",
    words: ["depth", "space", "motion", "light"],
    mode: "grid",
  },
};

function getScene(pathname: string): LoadingScene {
  if (pathname.startsWith("/work")) return scenes.archive;
  if (pathname.startsWith("/about")) return scenes.story;
  if (pathname.startsWith("/contact")) return scenes.signal;
  return scenes.press;
}

function SceneVisual({ scene, reduce }: { scene: LoadingScene; reduce: boolean }) {
  if (scene.mode === "archive") {
    return (
      <div className="absolute inset-0 grid grid-cols-3 gap-3 p-4 md:grid-cols-6 md:p-8">
        {Array.from({ length: 30 }).map((_, index) => (
          <motion.span
            key={index}
            className="min-h-24 border border-ink/10 bg-white/60 shadow-[0_18px_42px_-34px_rgba(8,9,12,0.4)]"
            initial={reduce ? undefined : { opacity: 0, y: 28, rotate: -2 }}
            animate={reduce ? undefined : { opacity: 0.72, y: [0, -8, 0], rotate: [0, 0.8, 0] }}
            transition={{
              opacity: { duration: 0.75, delay: index * 0.018, ease: smoothEase },
              y: { duration: 3.2, delay: index * 0.025, repeat: Infinity, ease: "easeInOut" },
              rotate: { duration: 3.2, delay: index * 0.025, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>
    );
  }

  if (scene.mode === "story") {
    return (
      <div className="absolute inset-0 flex items-center px-8 md:px-16">
        <div className="relative h-px w-full bg-warm-white/16">
          {scene.words.map((word, index) => (
            <motion.span
              key={word}
              className="absolute top-1/2 flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-full border border-warm-white/20 bg-ink-black text-[0.68rem] font-bold uppercase tracking-[0.18em] text-warm-white/70"
              style={{ left: `${index * 28}%`, boxShadow: `0 0 38px ${scene.accent}44` }}
              initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
              animate={reduce ? undefined : { opacity: 1, y: [-7, 7, -7], scale: [0.96, 1, 0.96] }}
              transition={{
                opacity: { duration: 0.65, delay: index * 0.1, ease: smoothEase },
                y: { duration: 3.1, delay: index * 0.18, repeat: Infinity, ease: "easeInOut" },
                scale: { duration: 3.1, delay: index * 0.18, repeat: Infinity, ease: "easeInOut" },
              }}
            >
              {word}
            </motion.span>
          ))}
        </div>
      </div>
    );
  }

  if (scene.mode === "signal") {
    return (
      <div className="absolute inset-0 flex items-center justify-center">
        {Array.from({ length: 7 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute rounded-full border border-ink/18"
            style={{ height: `${9 + index * 8}rem`, width: `${9 + index * 8}rem` }}
            animate={reduce ? undefined : { scale: [0.78, 1.08], opacity: [0.55, 0] }}
            transition={{ duration: 1.75, delay: index * 0.16, repeat: Infinity, ease: "easeOut", repeatDelay: 0.18 }}
          />
        ))}
        <motion.span
          className="h-24 w-24 rounded-full bg-ink"
          animate={reduce ? undefined : { scale: [0.94, 1.05, 0.94] }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    );
  }

  if (scene.mode === "grid") {
    return (
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(255,244,230,0.14) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,244,230,0.14) 1px, transparent 1px)",
          backgroundSize: "4rem 4rem",
        }}
      >
        {Array.from({ length: 5 }).map((_, index) => (
          <motion.span
            key={index}
            className="absolute left-1/2 top-1/2 block border border-warm-white/18"
            style={{
              height: `${10 + index * 8}rem`,
              width: `${16 + index * 12}rem`,
              marginLeft: `${-8 - index * 6}rem`,
              marginTop: `${-5 - index * 4}rem`,
            }}
            initial={reduce ? undefined : { opacity: 0, scale: 0.9 }}
            animate={reduce ? undefined : { opacity: 1, rotate: [0, index % 2 ? -2.5 : 2.5, 0], scale: [0.97, 1, 0.97] }}
            transition={{
              opacity: { duration: 0.65, delay: index * 0.08, ease: smoothEase },
              rotate: { duration: 4 + index * 0.22, repeat: Infinity, ease: "easeInOut" },
              scale: { duration: 4 + index * 0.22, repeat: Infinity, ease: "easeInOut" },
            }}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
      {["#00AEEF", "#EC0080", "#FFF200", "#FFF4E6"].map((color, index) => (
        <motion.span
          key={color}
          className="absolute h-[120vh] w-[14vw] min-w-16 rounded-full blur-sm"
          style={{ background: color, mixBlendMode: "screen" }}
          initial={reduce ? undefined : { opacity: 0, x: "-34vw", rotate: index * 14 }}
          animate={reduce ? undefined : { opacity: 0.72, x: ["-34vw", "34vw", "-34vw"], rotate: [index * 14, index * 14 + 18, index * 14] }}
          transition={{
            opacity: { duration: 0.8, delay: index * 0.08, ease: smoothEase },
            x: { duration: 4.8 + index * 0.28, repeat: Infinity, ease: "easeInOut" },
            rotate: { duration: 4.8 + index * 0.28, repeat: Infinity, ease: "easeInOut" },
          }}
        />
      ))}
    </div>
  );
}

export default function Loading() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const scene = useMemo(() => getScene(pathname), [pathname]);
  const [wordIndex, setWordIndex] = useState(0);

  useEffect(() => {
    if (reduce) return;

    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % scene.words.length);
    }, 1400);

    return () => window.clearInterval(timer);
  }, [reduce, scene.words.length]);

  const isDarkText = scene.foreground === "dark";
  const textClass = isDarkText ? "text-ink" : "text-warm-white";
  const mutedClass = isDarkText ? "text-ink/48" : "text-warm-white/52";
  const lineClass = isDarkText ? "bg-ink/16" : "bg-warm-white/16";

  return (
    <motion.div
      className={`relative min-h-screen overflow-hidden ${textClass}`}
      style={{ background: scene.background }}
      initial={reduce ? undefined : { opacity: 0, scale: 1.012 }}
      animate={reduce ? undefined : { opacity: 1, scale: 1 }}
      transition={{ duration: 0.62, ease: smoothEase }}
    >
      <SceneVisual scene={scene} reduce={Boolean(reduce)} />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-[1] w-full origin-left"
        style={{
          background: isDarkText
            ? "linear-gradient(90deg, rgba(255,255,255,0.44), transparent)"
            : "linear-gradient(90deg, rgba(255,244,230,0.12), transparent)",
        }}
        initial={reduce ? undefined : { scaleX: 0 }}
        animate={reduce ? undefined : { scaleX: [0, 1, 0] }}
        transition={{ duration: 1.45, ease: settleEase, repeat: Infinity, repeatDelay: 0.35 }}
      />
      <div className="pointer-events-none absolute inset-0 noise opacity-[0.07]" />

      <motion.div
        className="relative z-10 flex min-h-screen items-end justify-between gap-8 px-5 pb-7 md:px-10 md:pb-10"
        initial={reduce ? undefined : { opacity: 0, y: 28 }}
        animate={reduce ? undefined : { opacity: 1, y: 0 }}
        transition={{ duration: 0.78, delay: 0.12, ease: smoothEase }}
      >
        <div>
          <p className={`brand-kicker mb-5 ${mutedClass}`}>{scene.label}</p>
          <h1 className="brand-display max-w-[13ch] text-[clamp(3.2rem,10vw,8rem)] leading-[0.78]">
            {scene.title}
          </h1>
        </div>

        <div className="hidden min-w-44 text-right md:block">
          <AnimatePresence mode="wait">
            <motion.p
              key={scene.words[wordIndex]}
              className={`brand-kicker ${mutedClass}`}
              initial={reduce ? undefined : { opacity: 0, y: 12 }}
              animate={reduce ? undefined : { opacity: 1, y: 0 }}
              exit={reduce ? undefined : { opacity: 0, y: -12 }}
              transition={{ duration: 0.48, ease: smoothEase }}
            >
              {scene.words[wordIndex]}
            </motion.p>
          </AnimatePresence>
          <div className={`mt-4 h-px w-full ${lineClass}`}>
            <motion.div
              className="h-full origin-left"
              style={{ background: scene.accent }}
              animate={reduce ? undefined : { scaleX: [0, 1, 0] }}
              transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
