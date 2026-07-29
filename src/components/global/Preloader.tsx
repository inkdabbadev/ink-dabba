"use client";

import { motion, useReducedMotion } from "framer-motion";

const cmykLayers = [
  { color: "#00AEEF", x: -5, y: 4 },
  { color: "#EC0080", x: 5, y: -3 },
  { color: "#FFF200", x: 0, y: 6 },
];

export default function Preloader() {
  const reduce = useReducedMotion();

  if (reduce) return null;

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center overflow-hidden bg-ink-black pointer-events-none will-change-transform transform-gpu"
      initial={{ y: "0%" }}
      animate={{ y: "-105%" }}
      transition={{ duration: 1.18, delay: 1.5, ease: [0.83, 0, 0.17, 1] }}
    >
      <div
        aria-hidden
        className="absolute inset-0 opacity-30"
        style={{
          background:
            "linear-gradient(90deg, rgba(0,174,239,0.16), transparent 18%, transparent 82%, rgba(236,0,128,0.16)), linear-gradient(180deg, transparent 0%, rgba(255,242,0,0.08) 50%, transparent 100%)",
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.97, y: 18 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative flex w-full flex-col items-center justify-center px-6 will-change-transform transform-gpu"
      >
        <div className="relative mb-7">
          {cmykLayers.map((layer, index) => (
            <motion.span
              key={layer.color}
              aria-hidden
              className="absolute inset-0 select-none font-display text-[clamp(4.4rem,9vw,8.75rem)] uppercase leading-none tracking-normal"
              style={{ color: layer.color, mixBlendMode: "screen" }}
              initial={{ opacity: 0, x: 0, y: 8 }}
              animate={{ opacity: [0, 0.56, 0.2], x: [0, layer.x, layer.x * 0.35], y: [8, layer.y, layer.y * 0.35] }}
              transition={{ duration: 1.05, delay: 0.1 + index * 0.05, ease: [0.16, 1, 0.3, 1] }}
            >
              We are
            </motion.span>
          ))}

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.82, ease: [0.16, 1, 0.3, 1], delay: 0.04 }}
            className="relative font-display text-[clamp(4.4rem,9vw,8.75rem)] uppercase leading-none tracking-normal text-warm-white"
          >
            We are
          </motion.p>
        </div>

        <div className="relative mb-6 h-24 w-72 overflow-hidden md:h-32 md:w-[24rem]">
          <motion.img
            src="/logo/inkdabba-white-pre.svg"
            alt="INK DABBA"
            className="h-full w-full object-contain will-change-transform transform-gpu"
            style={{ backfaceVisibility: "hidden" }}
            initial={{ y: 28, opacity: 0, clipPath: "inset(100% 0 0 0)" }}
            animate={{ y: 0, opacity: 1, clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 0.92, ease: [0.16, 1, 0.3, 1], delay: 0.24 }}
          />
        </div>
      </motion.div>
    </motion.div>
  );
}
