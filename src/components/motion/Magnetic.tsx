"use client";

import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { useRef, type ReactNode } from "react";

interface MagneticProps {
  children: ReactNode;
  className?: string;
  /** Pull strength — 0 = none, 1 = follows cursor 1:1. */
  strength?: number;
  /** Tag to render as. */
  as?: "div" | "span" | "button" | "a";
  /**
   * Brightness / scale feedback on hover. Set to 0 to opt out.
   */
  scaleOnHover?: number;
  /** Data attribute applied to the wrapper — useful for cursor rules. */
  dataCursor?: string;
}

/**
 * Magnetic — cursor-proximity pull for CTAs and nav. Uses motion
 * values + springs (no React re-renders on mousemove). Respects
 * prefers-reduced-motion by skipping the pull entirely.
 */
export default function Magnetic({
  children,
  className,
  strength = 0.35,
  as = "div",
  scaleOnHover = 1.05,
  dataCursor = "magnetic",
}: MagneticProps) {
  const ref = useRef<any>(null);
  const reduce = useReducedMotion();

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Smooth out coordinate tracking with dampening springs
  const springX = useSpring(x, { stiffness: 120, damping: 20, mass: 0.8 });
  const springY = useSpring(y, { stiffness: 120, damping: 20, mass: 0.8 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (reduce) return;
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;

    // Center coordinates of the bounding box
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    // Delta offset
    const distX = e.clientX - centerX;
    const distY = e.clientY - centerY;

    // Apply the magnetic pull strength
    x.set(distX * strength);
    y.set(distY * strength);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  const MotionEl = motion[as] as typeof motion.div;

  return (
    <MotionEl
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      data-cursor={dataCursor}
      style={{
        x: reduce ? 0 : springX,
        y: reduce ? 0 : springY,
        display: "inline-flex",
      }}
      whileHover={reduce ? undefined : (scaleOnHover > 0 ? { scale: scaleOnHover } : undefined)}
      className={className}
    >
      {children}
    </MotionEl>
  );
}
