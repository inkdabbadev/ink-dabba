"use client";

import { useLayoutEffect, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion, AnimationControls } from "framer-motion";

export interface InteractiveEyeProps {
  top: string;
  left: string;
  size: string;
  containerColor?: string;
  irisColor?: string;
  irisSize?: string;
  pupilColor?: string;
  pupilSize?: string;
  clipToContainer?: boolean;
  activationDelayMs?: number;
  initialLookX?: number;
  initialLookY?: number;
  blinkControls: AnimationControls;
}

export default function InteractiveEye({
  top,
  left,
  size,
  containerColor = "#111111",
  irisColor = "#ffffff",
  irisSize = "45%",
  pupilColor = "#111111",
  pupilSize = "35%",
  clipToContainer = true,
  activationDelayMs = 0,
  initialLookX = 0,
  initialLookY = 0,
  blinkControls,
}: InteractiveEyeProps) {
  const eyeRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const isInteractiveRef = useRef(activationDelayMs === 0);
  const reduceMotion = useReducedMotion();
  const targetX = useMotionValue(0);
  const targetY = useMotionValue(0);
  const x = useSpring(targetX, { stiffness: 320, damping: 28, mass: 0.45 });
  const y = useSpring(targetY, { stiffness: 320, damping: 28, mass: 0.45 });
  const pupilX = useTransform(x, (v) => v * 0.4);
  const pupilY = useTransform(y, (v) => v * 0.4);

  useLayoutEffect(() => {
    if (reduceMotion) return;

    let activationTimer: number | null = null;

    const setRestingLook = () => {
      const rect = boundsRef.current;
      if (!rect) return;

      const maxDist = rect.width * (clipToContainer ? 0.25 : 0.16);
      targetX.set(maxDist * initialLookX);
      targetY.set(maxDist * initialLookY);
    };

    const updateBounds = () => {
      boundsRef.current = eyeRef.current?.getBoundingClientRect() ?? null;
      if (!isInteractiveRef.current) {
        setRestingLook();
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isInteractiveRef.current) return;

      const rect = boundsRef.current;
      if (!rect) return;
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const angle = Math.atan2(e.clientY - cy, e.clientX - cx);
      const maxDist = rect.width * (clipToContainer ? 0.25 : 0.16);
      const dist = Math.min(maxDist, Math.hypot(e.clientX - cx, e.clientY - cy) / 25);
      targetX.set(Math.cos(angle) * dist);
      targetY.set(Math.sin(angle) * dist);
    };

    isInteractiveRef.current = activationDelayMs === 0;
    updateBounds();
    setRestingLook();

    if (activationDelayMs > 0) {
      activationTimer = window.setTimeout(() => {
        isInteractiveRef.current = true;
      }, activationDelayMs);
    }

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });
    return () => {
      if (activationTimer !== null) {
        window.clearTimeout(activationTimer);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);
    };
  }, [activationDelayMs, clipToContainer, initialLookX, initialLookY, reduceMotion, targetX, targetY]);

  return (
    <div
      className="pointer-events-none absolute z-20"
      style={{ top, left, width: size, aspectRatio: "1/1", transform: "translate(-50%, -50%)" }}
    >
      <motion.div
        ref={eyeRef}
        className={`relative w-full h-full rounded-full flex items-center justify-center will-change-transform transform-gpu ${
          clipToContainer ? "overflow-hidden" : "overflow-visible"
        }`}
        style={{ backgroundColor: containerColor, originY: 0.5 }}
        animate={blinkControls}
        initial={{ scaleY: 1 }}
      >
        <motion.div
          className="rounded-full flex items-center justify-center"
          style={{ width: irisSize, height: irisSize, backgroundColor: irisColor, x, y }}
        >
          <motion.div
            className="rounded-full"
            style={{ width: pupilSize, height: pupilSize, backgroundColor: pupilColor, x: pupilX, y: pupilY }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
