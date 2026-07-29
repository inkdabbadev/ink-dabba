"use client";

import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();

  if (reduce) {
    return <main>{children}</main>;
  }

  const columns = 5;

  return (
    <>
      <div className="fixed inset-0 z-[9999] pointer-events-none flex w-full h-full overflow-hidden">
        {/* Staggered Columns - Multi-layer CMYK Wipe */}
        {Array.from({ length: columns }).map((_, i) => {
          const colors = [
            "bg-cmyk-cyan",
            "bg-cmyk-magenta",
            "bg-cmyk-yellow",
            "bg-cmyk-cyan",
            "bg-cmyk-magenta",
          ];
          const colorClass = colors[i % colors.length];

          return (
            <div key={i} className="relative h-full flex-1 overflow-hidden">
              {/* Lead Color Wave Accent */}
              <motion.div
                className={`absolute inset-0 ${colorClass} opacity-20 origin-top will-change-transform`}
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{
                  duration: 0.85,
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.05,
                }}
              />
              {/* Trailing Dark Main Curtain Panel */}
              <motion.div
                className="absolute inset-0 bg-ink-black origin-top will-change-transform"
                initial={{ scaleY: 1 }}
                animate={{ scaleY: 0 }}
                exit={{ scaleY: 1 }}
                transition={{
                  duration: 0.85,
                  ease: [0.76, 0, 0.24, 1],
                  delay: i * 0.05 + 0.05,
                }}
              />
            </div>
          );
        })}
      </div>

      <motion.main
        initial={{ opacity: 0, scale: 0.975, y: 16, filter: "blur(8px)" }}
        animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
        transition={{
          duration: 0.92,
          delay: 0.35,
          ease: [0.16, 1, 0.3, 1],
        }}
      >
        {children}
      </motion.main>
    </>
  );
}
