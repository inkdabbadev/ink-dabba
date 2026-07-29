"use client";

import { useEffect, useState, useMemo, useId } from "react";
import { motion, useReducedMotion, useMotionValue, useTransform } from "framer-motion";

const BADGE_TEXT = "INK DABBA / DESIGN-LED STUDIO / ONE STRONG MARK / ";

export default function FloatingBadge() {
  const reduceMotion = useReducedMotion();
  const pathId = useId();

  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const scrollProgress = useMotionValue(0);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);

    const handleBadgeScroll = (e: Event) => {
      const progress = (e as CustomEvent).detail.progress;
      scrollProgress.set(progress);
    };
    window.addEventListener("ink-badge-scroll", handleBadgeScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("ink-badge-scroll", handleBadgeScroll);
    };
  }, [scrollProgress]);

  const { targetX, targetY } = useMemo(() => {
    if (windowSize.width === 0) return { targetX: 0, targetY: 0 };
    
    // Margins and sizes to match FloatingBadge classes:
    // md: bottom-6 right-6 h-28 w-28 (112px)
    // sm: bottom-4 right-4 h-[5.4rem] w-[5.4rem] (86.4px)
    // mobile: bottom-3 right-3 h-[4.8rem] w-[4.8rem] (76.8px)
    const margin = windowSize.width >= 768 ? 24 : windowSize.width >= 640 ? 16 : 12;
    const size = windowSize.width >= 768 ? 112 : windowSize.width >= 640 ? 86.4 : 76.8;

    // Moving from bottom-right (0, 0 local offsets) to center of the screen
    const tX = - (windowSize.width / 2 - size / 2 - margin);
    const tY = - (windowSize.height / 2 - size / 2 - margin);

    return { targetX: tX, targetY: tY };
  }, [windowSize]);

  // Motion mappings based on scroll progress (0.0 to 1.0)
  // Stage 1: Float badge to center early (0.0 -> 0.30)
  const badgeX = useTransform(scrollProgress, (val) => {
    if (val <= 0) return 0;
    if (val >= 0.30) return targetX;
    return (val / 0.30) * targetX;
  });

  const badgeY = useTransform(scrollProgress, (val) => {
    if (val <= 0) return 0;
    if (val >= 0.30) return targetY;
    return (val / 0.30) * targetY;
  });

  // Stage 2 & 3: Scale badge:
  // - Starts in the corner: scale 1 (0.0)
  // - Settle zoomed in center: scale 2.8 (0.30)
  // - Focus rotation state: scale 4.0 (0.55)
  // - Zoom massive to reveal contact: scale 10 (0.85) (Yellow circle expands inside SVG to fill viewport)
  const badgeScale = useTransform(scrollProgress, (val) => {
    if (val <= 0.0) return 1;
    if (val <= 0.30) {
      const p = val / 0.30;
      return 1 + p * (2.8 - 1);
    }
    if (val <= 0.55) {
      const p = (val - 0.30) / (0.55 - 0.30);
      return 2.8 + p * (4.0 - 2.8);
    }
    if (val <= 0.85) {
      const p = (val - 0.55) / (0.85 - 0.55);
      return 4.0 + p * (10.0 - 4.0);
    }
    return 10.0;
  });

  // Rotate the badge wrapper dynamically in response to scroll progress
  const badgeScrollRotate = useTransform(scrollProgress, [0.0, 0.85], [0, 240]);

  // Local badge visibility handoff
  const badgeOpacity = useTransform(scrollProgress, (val) => {
    if (val <= 0.02) return 0.9;
    if (val >= 0.98) return 0.9;
    if (val >= 0.86) return 0;
    if (val >= 0.82) {
      const p = (val - 0.82) / (0.86 - 0.82);
      return 0.9 * (1 - p);
    }
    return 0.9;
  });

  // Dynamic opacities for text, concentric rings, and orbiting dots to fade out as portal opens
  const textOpacity = useTransform(scrollProgress, (val) => {
    if (val <= 0.55) return 1.0;
    if (val >= 0.65) return 0.0;
    return 1.0 - (val - 0.55) / 0.10;
  });

  const cyanRingOpacity = useTransform(scrollProgress, (val) => {
    const base = val <= 0.55 ? 1.0 : val >= 0.65 ? 0.0 : 1.0 - (val - 0.55) / 0.10;
    return base * 0.7;
  });

  const magentaRingOpacity = useTransform(scrollProgress, (val) => {
    const base = val <= 0.55 ? 1.0 : val >= 0.65 ? 0.0 : 1.0 - (val - 0.55) / 0.10;
    return base * 0.75;
  });

  const yellowRingOpacity = useTransform(scrollProgress, (val) => {
    const base = val <= 0.55 ? 1.0 : val >= 0.65 ? 0.0 : 1.0 - (val - 0.55) / 0.10;
    return base * 0.8;
  });

  const orbitOpacity = useTransform(scrollProgress, (val) => {
    if (val <= 0.55) return 1.0;
    if (val >= 0.65) return 0.0;
    return 1.0 - (val - 0.55) / 0.10;
  });

  // Portal expansion math inside SVG coordinates (r grows from 2.4 to 150)
  const yellowRadius = useTransform(scrollProgress, (val) => {
    if (val <= 0.55) return 2.4;
    if (val >= 0.82) return 150;
    const p = (val - 0.55) / (0.82 - 0.55);
    return 2.4 + p * (150 - 2.4);
  });

  // Portal fade out to reveal contact form inside it
  const yellowFillOpacity = useTransform(scrollProgress, (val) => {
    if (val <= 0.55) return 1.0;
    if (val >= 0.72) return 0.0;
    const p = (val - 0.55) / (0.72 - 0.55);
    return 1.0 - p;
  });

  return (
    <motion.div
      initial={reduceMotion ? undefined : { opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      style={{
        x: badgeX,
        y: badgeY,
        scale: badgeScale,
        opacity: badgeOpacity,
        rotate: badgeScrollRotate,
      }}
      className="floating-badge-global pointer-events-none fixed bottom-3 right-3 z-40 h-[4.8rem] w-[4.8rem] mix-blend-screen will-change-transform transform-gpu sm:bottom-4 sm:right-4 sm:h-[5.4rem] sm:w-[5.4rem] md:bottom-6 md:right-6 md:h-28 md:w-28"
      aria-hidden
    >
      <motion.svg
        viewBox="0 0 100 100"
        className="absolute inset-0 h-full w-full overflow-visible will-change-transform transform-gpu"
        animate={reduceMotion ? undefined : { rotate: 360 }}
        transition={{ duration: 18, ease: "linear", repeat: Infinity }}
      >
        <defs>
          <path
            id={pathId}
            d="M 50,50 m -39,0 a 39,39 0 1,1 78,0 a 39,39 0 1,1 -78,0"
          />
        </defs>
        <motion.text 
          className="fill-warm-white text-[7px] font-bold uppercase"
          style={{
            opacity: textOpacity,
            fontFamily: "Arial Narrow, system-ui, sans-serif",
            letterSpacing: "0.02em",
          }}
        >
          <textPath
            href={`#${pathId}`}
            startOffset="50%"
            textAnchor="middle"
            textLength={244}
            lengthAdjust="spacing"
          >
            {BADGE_TEXT}
          </textPath>
        </motion.text>

        {/* Cyan, Magenta, Yellow concentric rings (drawn as vector circles to keep them 100% crisp and clear at all scales) */}
        <motion.circle cx="50" cy="50" r="32" fill="none" stroke="#00AEEF" strokeWidth="0.5" opacity={cyanRingOpacity} />
        <motion.circle cx="50" cy="50" r="23" fill="none" stroke="#EC0080" strokeWidth="0.5" opacity={magentaRingOpacity} />
        <motion.circle cx="50" cy="50" r="14" fill="none" stroke="#FFF200" strokeWidth="0.5" opacity={yellowRingOpacity} />

        {/* Orbiting dots drawn as vector circles to prevent pixelation/blur */}
        <motion.g
          animate={reduceMotion ? undefined : { rotate: -360 }}
          transition={{ duration: 9, ease: "linear", repeat: Infinity }}
          style={{ originX: "50px", originY: "50px", opacity: orbitOpacity }}
        >
          {/* Cyan Dot on the right ring */}
          <circle cx="76" cy="50" r="1.6" fill="#00AEEF" />
          {/* Magenta Dot on the bottom ring */}
          <circle cx="50" cy="76" r="1.6" fill="#EC0080" />
        </motion.g>

        {/* Central Yellow Dot (expanding portal shutter) */}
        <motion.circle 
          cx="50" 
          cy="50" 
          r={yellowRadius} 
          fill="#FFF200" 
          stroke="#0B0A09" 
          strokeWidth="0.8" 
          fillOpacity={yellowFillOpacity}
          strokeOpacity={yellowFillOpacity}
        />
      </motion.svg>
    </motion.div>
  );
}
