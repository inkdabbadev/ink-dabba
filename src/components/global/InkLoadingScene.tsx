"use client";

import { motion, useReducedMotion } from "framer-motion";
import InkBottleMascot from "@/components/ui/InkBottleMascot";

const ease = [0.76, 0, 0.24, 1] as const;

export default function InkLoadingScene() {
  const reduce = useReducedMotion();

  return (
    <div className="relative flex min-h-[100dvh] w-full flex-col justify-between overflow-hidden bg-[#ff2608] p-6 text-black normal-case md:p-10">
      <div className="relative flex justify-between gap-4 text-[10px] font-medium uppercase tracking-[0.18em] md:text-xs" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
        <span className="bg-[#ff2608] pr-4">Ink Dabba / Creative studio</span>
        <span className="bg-[#ff2608] pl-4">Chennai, India</span>
      </div>

      <div aria-hidden="true" className="relative flex flex-col items-center py-12">
        <div className="relative mt-10 overflow-hidden py-2">
          <motion.h2
            className="flex flex-wrap items-center justify-center gap-x-[0.18em] gap-y-2 text-center text-[clamp(3.5rem,17vw,17rem)] uppercase leading-[0.9] tracking-normal"
            style={{ fontFamily: "Brunson, Impact, sans-serif" }}
            initial={reduce ? false : { y: "110%", rotate: 3 }}
            animate={{ y: 0, rotate: 0 }}
            transition={{ duration: 0.65, delay: 0.25, ease }}
          >
            <span className="whitespace-nowrap"><span className="inline-block mr-[0.065em]">I</span>nk</span>
            <span>Dabba</span>
          </motion.h2>
          <motion.div
            className="absolute inset-0 origin-right bg-black"
            initial={reduce ? false : { scaleX: 1 }}
            animate={{ scaleX: 0 }}
            transition={{ duration: 0.7, delay: 0.35, ease }}
          />
        </div>
        <motion.div initial={reduce ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.4 }}>
          <InkBottleMascot />
        </motion.div>
      </div>

      <div className="relative" style={{ fontFamily: "var(--font-outfit), sans-serif" }}>
        <div className="mb-4 flex items-end justify-between gap-4 text-xs font-medium uppercase tracking-[0.14em] md:text-sm">
          <span className="bg-[#ff2608] pr-4">A little ink. A lot of ideas.</span>
          <span role="status" className="bg-[#ff2608] pl-4">Getting things ready<span className="sr-only">. Loading page.</span></span>
        </div>
      </div>
    </div>
  );
}
