"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCursor } from "@/context/CursorContext";
import Image from "next/image";

// 42 logos
const allLogos = [
  "Adyar Vaishnava's Logo-01.jpg", "Bollineni.jpg", "Conectr.png", "Dank.png", "Every Body Can Yoga Logo.jpg", "Everybody Can Yoga Logo-01.jpg",
  "MEDIJOURN.png", "OCD.png", "SG10 Logo.jpg", "SM Logo-03.jpg", "Smart Check Logo.png",
  "VISHVAS.png", "Wild Flour Mockup.jpg", "Zen Enterprises Logo-04.jpg", "anjappar.png",
  "ashok-leyland.png", "bar-bar-dekho.png", "bhive.png", "dhi.jpg", "dialogues.png",
  "emulsol.png", "fever.png", "honda.png", "kumaran.jpg", "lets-relax.png",
  "liver-india.png", "logo file-12.png", "mazaya.png", "meme-it.png", "misri.png",
  "ns.png", "paper-flower.png", "peach-tree.jpg", "pick-drop.png", "ramani.jpg",
  "red-walk.png", "rgs-rebar.png", "sree-amal.jpg", "the cycle gap.png",
  "vishvas out .png", "yamaha.jpg"
].map(name => `/image/logo/${name}`);

const ROW_1 = allLogos.slice(0, 14);
const ROW_2 = allLogos.slice(14, 28);
const ROW_3 = allLogos.slice(28, 42);

export default function ClientSection() {
  const { setVariant } = useCursor();
  const [selectedClient, setSelectedClient] = useState<string | null>(null);

  return (
    <>
      <style>{`
        .marquee-left { animation: marquee-left linear infinite; }
        .marquee-right { animation: marquee-right linear infinite; }
        .marquee-row:hover .marquee-left, .marquee-row:hover .marquee-right {
          animation-play-state: paused;
        }
        @keyframes marquee-left {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          from { transform: translateX(-50%); }
          to { transform: translateX(0); }
        }
      `}</style>

      <section id="clients" className="relative w-full py-40 bg-ink-black overflow-hidden flex flex-col items-center justify-center border-t border-white/5">
        <div className="mb-24 text-center w-full px-4 relative z-10">
          <h2 className="font-display text-4xl md:text-6xl lg:text-7xl text-warm-white tracking-wide uppercase mb-6">
            CLIENT PARTNERS
          </h2>
          <p className="font-body text-sm md:text-base font-bold tracking-[0.3em] uppercase text-cmyk-cyan">
            THE UNIVERSE WE BUILT
          </p>
        </div>

        {/* Atmospheric glow */}
        <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,rgba(0,174,239,0.05)_0%,rgba(236,0,140,0.04)_34%,transparent_64%)] z-0" />

        <div className="w-full flex flex-col gap-6 md:gap-8 relative z-10 -rotate-[3deg] scale-[1.05]">
          <MarqueeRow logos={ROW_1} direction="left" speed="45s" setVariant={setVariant} onSelect={setSelectedClient} />
          <MarqueeRow logos={ROW_2} direction="right" speed="55s" setVariant={setVariant} onSelect={setSelectedClient} />
          <MarqueeRow logos={ROW_3} direction="left" speed="40s" setVariant={setVariant} onSelect={setSelectedClient} />
        </div>
      </section>

      {/* Client Detail Modal */}
      <AnimatePresence>
        {selectedClient && (
          <ClientModal selectedClient={selectedClient} onClose={() => setSelectedClient(null)} />
        )}
      </AnimatePresence>
    </>
  );
}

function ClientModal({ selectedClient, onClose }: { selectedClient: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    const navHeader = document.querySelector('[data-nav-header]') as HTMLElement | null;
    if (navHeader) navHeader.style.visibility = "hidden";
    return () => {
      document.body.style.overflow = "";
      if (navHeader) navHeader.style.visibility = "";
    };
  }, []);

  return (
    <motion.div 
      className="fixed inset-0 z-[200] bg-ink-black/95 backdrop-blur-md overflow-y-auto custom-scrollbar"
      data-lenis-prevent="true"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
      onClick={onClose}
    >
      {/* The Scrollable Presentation Wrapper */}
      <div className="w-full flex justify-center py-12 md:py-24 px-4 sm:px-8 md:px-16">
        <motion.div 
          className="bg-ink-black w-full max-w-[1400px] min-h-[150vh] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-[0_0_100px_rgba(0,0,0,0.5)] border border-white/5 flex flex-col"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
          onClick={e => e.stopPropagation()}
        >
          {/* Header: Client Logo (White block like Behance header) */}
          <div className="w-full h-[50vh] md:h-[60vh] bg-white flex items-center justify-center relative">
            <Image src={selectedClient} alt="Client Logo" fill className="object-contain p-16 md:p-32" />
            <button
              onClick={onClose}
              aria-label="Close client preview"
              className="group absolute right-4 top-4 md:right-6 md:top-6 grid h-12 w-12 md:h-14 md:w-14 place-items-center rounded-full bg-ink-black text-warm-white shadow-xl outline-none transition-all duration-200 hover:bg-cmyk-cyan focus-visible:ring-2 focus-visible:ring-cmyk-cyan"
            >
              <span className="relative block h-5 w-5 md:h-6 md:w-6" aria-hidden="true">
                <span className="absolute left-0 top-1/2 h-[2.5px] w-full -translate-y-1/2 rotate-45 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-110" />
                <span className="absolute left-0 top-1/2 h-[2.5px] w-full -translate-y-1/2 -rotate-45 rounded-full bg-current transition-transform duration-200 group-hover:scale-x-110" />
              </span>
            </button>
          </div>
          
          {/* Blank Canvas for Future Content (Dark to match Behance style) */}
          <div className="w-full flex-grow bg-ink-black" />
        </motion.div>
      </div>
    </motion.div>
  );
}

function MarqueeRow({ logos, direction, speed, setVariant, onSelect }: any) {
  const isLeft = direction === "left";
  const animationClass = isLeft ? "marquee-left" : "marquee-right";
  
  return (
    <div className="flex w-full relative py-6 marquee-row">
      {/* Gradient Fades for edges */}
      <div className="absolute inset-y-0 left-0 w-24 md:w-48 bg-gradient-to-r from-ink-black to-transparent z-20 pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-24 md:w-48 bg-gradient-to-l from-ink-black to-transparent z-20 pointer-events-none" />

      <div
        className={`flex items-center gap-12 md:gap-16 w-max px-6 ${animationClass}`}
        style={{ animationDuration: speed }}
      >
        {[...logos, ...logos].map((src, i) => (
          <div
            key={`${src}-${i}`}
            onClick={() => onSelect(src)}
            className="relative w-40 h-28 md:w-56 md:h-40 rounded-2xl bg-warm-white flex items-center justify-center p-6 md:p-10 shadow-xl border border-black/10 transition-all duration-500 cursor-none
              grayscale opacity-50 hover:opacity-100 hover:grayscale-0 hover:scale-[1.01] hover:z-50 hover:shadow-[0_0_60px_rgba(0,174,239,0.35)] hover:-translate-y-3
            "
            onMouseEnter={() => setVariant("VIEW")}
            onMouseLeave={() => setVariant("default")}
          >
            <div className="relative w-full h-full pointer-events-none">
              <Image
                src={src}
                alt="Client Partner Logo"
                fill
                sizes="(max-width: 768px) 160px, 224px"
                className="object-contain pointer-events-none select-none"
                quality={65}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
