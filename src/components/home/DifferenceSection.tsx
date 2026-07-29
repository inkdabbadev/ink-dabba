"use client";

import React from "react";
import { motion } from "framer-motion";
import Reveal from "@/components/motion/Reveal";

const differentiators = [
  {
    title: "Zero Fluff",
    body: "We strip away the decorative noise until only absolute visual authority remains.",
    colorClass: "hover:border-cmyk-cyan group-hover:text-cmyk-cyan",
    glowColor: "rgba(0,174,239,0.12)",
  },
  {
    title: "Brutal Impact",
    body: "Posters, packaging, and layouts engineered to seize attention in under a second.",
    colorClass: "hover:border-cmyk-magenta group-hover:text-cmyk-magenta",
    glowColor: "rgba(236,0,128,0.12)",
  },
  {
    title: "Print Integrity",
    body: "Deep campaign logic rooted in CMYK ink mechanics and structural design systems.",
    colorClass: "hover:border-cmyk-yellow group-hover:text-cmyk-yellow",
    glowColor: "rgba(255,242,0,0.12)",
  },
];

export default function DifferenceSection() {
  return (
    <section
      id="about"
      className="relative min-h-screen w-full bg-ink-black flex flex-col justify-center items-center py-24 border-t border-white/5 overflow-hidden"
    >
      {/* Background CMYK Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cmyk-magenta/3 blur-[120px] rounded-full pointer-events-none" />

      <div className="max-w-[94%] lg:max-w-6xl mx-auto px-4 lg:px-12 w-full relative z-10 text-center flex flex-col items-center">
        
        {/* Category Label */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="font-sans text-cmyk-yellow text-sm uppercase tracking-[0.3em] font-bold mb-12 text-center"
        >
          What makes us different
        </motion.p>

        {/* Big Centered Typography */}
        <motion.h2 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-display text-5xl md:text-7xl lg:text-[6rem] leading-[1.1] tracking-tighter text-warm-white text-center max-w-4xl"
        >
          WE DON&apos;T JUST DESIGN.<br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cmyk-cyan via-warm-white to-cmyk-magenta">WE ENGINEER VISUAL</span><br className="hidden md:block" />
          <span className="italic font-light opacity-90">SYSTEMS THAT</span> LEAVE A MARK.
        </motion.h2>

        {/* Brief Text Description */}
        <motion.p
           initial={{ opacity: 0, y: 20 }}
           whileInView={{ opacity: 1, y: 0 }}
           viewport={{ once: true }}
           transition={{ delay: 0.4, duration: 0.8 }}
           className="mt-12 font-sans text-white/50 text-xl md:text-2xl max-w-2xl mx-auto font-light leading-relaxed text-center"
        >
          Not every design needs explanation. Some brands whisper. We make them loud. At InkDabba, we strip away the unnecessary until only impact remains.
        </motion.p>

        {/* Brutalist Differentiator Cards Grid */}
        <div className="grid gap-6 sm:grid-cols-3 max-w-5xl w-full mt-20">
          {differentiators.map((diff, index) => (
            <Reveal
              key={index}
              preset="fadeUp"
              delay={0.32 + index * 0.08}
              as="div"
              className="group relative rounded-[1.6rem] border border-white/8 bg-white/[0.02] p-6 transition-all duration-500 hover:bg-white/[0.04] hover:-translate-y-1.5 cursor-none flex flex-col text-left"
            >
              {/* Subtle hover glow halo background */}
              <div 
                className="absolute inset-0 rounded-[1.6rem] opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" 
                style={{
                  boxShadow: `0 24px 60px -20px ${diff.glowColor}, inset 0 0 10px ${diff.glowColor}`
                }}
              />

              {/* Card Contents (Numbers removed per feedback) */}
              <h3 className={`font-display text-2xl text-warm-white border-b border-white/5 pb-2.5 transition-colors duration-300 ${diff.colorClass}`}>
                {diff.title}
              </h3>
              <p className="font-sans text-[0.84rem] text-white/45 group-hover:text-white/70 transition-colors duration-300 leading-relaxed mt-3">
                {diff.body}
              </p>
            </Reveal>
          ))}
        </div>

      </div>
    </section>
  );
}
