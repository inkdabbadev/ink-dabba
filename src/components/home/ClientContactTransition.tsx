"use client";

import React, { useEffect, useState, useRef, useMemo } from "react";
import { motion, useMotionValue, useTransform } from "framer-motion";
import ContactSection from "@/components/home/ContactSection";

export default function ClientContactTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Screen size tracking for responsive portal clip-path offsets
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { badgeSize } = useMemo(() => {
    if (windowSize.width === 0) return { badgeSize: 112 };
    const size = windowSize.width >= 768 ? 112 : windowSize.width >= 640 ? 86.4 : 76.8;
    return { badgeSize: size };
  }, [windowSize]);

  // Custom high-fidelity scroll tracker
  const scrollYProgress = useMotionValue(0);
  const [isContactActive, setIsContactActive] = useState(false);

  useEffect(() => {
    let registeredLenis = false;

    const handleScroll = () => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const containerHeight = rect.height;
      const windowHeight = window.innerHeight;

      // start end coordinate: rect.top = windowHeight
      // end end coordinate: rect.top = - containerHeight + windowHeight
      const startScroll = windowHeight;
      const endScroll = - containerHeight + windowHeight;
      
      const totalRange = startScroll - endScroll;
      const currentScroll = windowHeight - rect.top;
      const val = Math.max(0, Math.min(1, currentScroll / totalRange));
      
      scrollYProgress.set(val);

      const active = val > 0.62;
      setIsContactActive((prev) => {
        if (prev !== active) return active;
        return prev;
      });

      // Dispatch custom scroll event to animate the global badge directly
      window.dispatchEvent(new CustomEvent("ink-badge-scroll", { detail: { progress: val } }));
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    
    // Support Lenis smooth scroller updates directly
    const lenis = window.__inkLenis;
    if (lenis) {
      lenis.on("scroll", handleScroll);
      registeredLenis = true;
    }

    // Initial calculate
    handleScroll();

    // Check periodically for layout recalculations after load/shift
    // Also hooks into Lenis scroll events if Lenis gets initialized after this component mounts
    const timer = setInterval(() => {
      handleScroll();
      if (!registeredLenis && window.__inkLenis) {
        window.__inkLenis.on("scroll", handleScroll);
        registeredLenis = true;
      }
    }, 250);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
      if (window.__inkLenis) {
        window.__inkLenis.off("scroll", handleScroll);
      }
      clearInterval(timer);
      
      // Reset the global badge scroll progress when unmounting
      window.dispatchEvent(new CustomEvent("ink-badge-scroll", { detail: { progress: 0 } }));
    };
  }, [scrollYProgress]);

  // Contact section scale and fade in emerging from the center of the badge (0.55 -> 0.82)
  const contactOpacity = useTransform(scrollYProgress, [0.55, 0.80], [0, 1]);
  const contactScale = useTransform(scrollYProgress, [0.55, 0.82], [0.05, 1]);
  
  // Circular mask that grows dynamically matching the SVG yellow circle's responsive screen radius
  const contactClipPath = useTransform(scrollYProgress, (val) => {
    if (val <= 0.55) {
      // R = 4.0 (scale) * badgeSize * 2.4% (initial yellow circle radius)
      const r = 4.0 * badgeSize * 0.024;
      return `circle(${r}px at 50% 50%)`;
    }
    
    // Interpolate badgeScale from 4.0 (at 0.55) to 10.0 (at 0.85)
    const pScale = Math.min(1, Math.max(0, (val - 0.55) / (0.85 - 0.55)));
    const currentScale = 4.0 + pScale * (10.0 - 4.0);
    
    // Interpolate yellowRadius from 2.4 (at 0.55) to 150 (at 0.82)
    const pRadius = Math.min(1, Math.max(0, (val - 0.55) / (0.82 - 0.55)));
    const currentRadiusSvg = 2.4 + pRadius * (150 - 2.4);
    
    const r = currentScale * badgeSize * (currentRadiusSvg / 100);
    
    return `circle(${Math.min(2200, r)}px at 50% 50%)`;
  });

  return (
    <div
      ref={containerRef}
      className="relative h-[300vh] w-full bg-ink-black"
    >
      {/* Sticky viewport frame */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">

        {/* Contact Form Section (Reveals and scales up from center) */}
        <motion.div
          style={{
            opacity: contactOpacity,
            scale: contactScale,
            clipPath: contactClipPath,
            pointerEvents: isContactActive ? "auto" : "none",
          }}
          className="absolute inset-0 z-20 flex flex-col justify-center items-center bg-ink-black"
        >
          <ContactSection />
        </motion.div>

      </div>
    </div>
  );
}
