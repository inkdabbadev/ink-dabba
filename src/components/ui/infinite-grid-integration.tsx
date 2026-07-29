"use client";

import React, { useEffect, useId, useRef } from "react";
import {
  motion,
  MotionValue,
  useAnimationFrame,
  useMotionTemplate,
  useMotionValue,
  useReducedMotion,
  useSpring,
} from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GridPattern = ({
  patternId,
  size,
}: {
  patternId: string;
  size: number;
}) => {
  return (
    <svg className="h-full w-full" aria-hidden="true">
      <defs>
        <pattern
          id={patternId}
          width={size}
          height={size}
          patternUnits="userSpaceOnUse"
          x={0}
          y={0}
        >
          <path
            d={`M ${size} 0 L 0 0 0 ${size}`}
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${patternId})`} />
    </svg>
  );
};

type InfiniteGridBackgroundProps = {
  className?: string;
  gridSize?: number;
};

export default function InfiniteGridBackground({
  className,
  gridSize = 42,
}: InfiniteGridBackgroundProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundsRef = useRef<DOMRect | null>(null);
  const activityTimeoutRef = useRef<number | null>(null);
  const reduceMotion = useReducedMotion();
  const patternId = `infinite-grid-${useId().replace(/:/g, "")}`;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const highlightOpacity = useMotionValue(0);
  const highlightOpacitySpring = useSpring(highlightOpacity, {
    stiffness: 140,
    damping: 26,
    mass: 0.45,
  });

  useEffect(() => {
    const updateBounds = () => {
      boundsRef.current = containerRef.current?.getBoundingClientRect() ?? null;
    };

    const handlePointerMove = (event: PointerEvent) => {
      const rect = boundsRef.current;
      if (!rect) {
        return;
      }

      mouseX.set(event.clientX - rect.left);
      mouseY.set(event.clientY - rect.top);
      highlightOpacity.set(1);

      if (activityTimeoutRef.current) {
        window.clearTimeout(activityTimeoutRef.current);
      }

      activityTimeoutRef.current = window.setTimeout(() => {
        highlightOpacity.set(0);
      }, 700);
    };

    updateBounds();
    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("resize", updateBounds, { passive: true });
    window.addEventListener("scroll", updateBounds, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("resize", updateBounds);
      window.removeEventListener("scroll", updateBounds);

      if (activityTimeoutRef.current) {
        window.clearTimeout(activityTimeoutRef.current);
      }
    };
  }, [highlightOpacity, mouseX, mouseY]);

  const maskImage = useMotionTemplate`radial-gradient(130px circle at ${mouseX}px ${mouseY}px, black 0%, black 28%, transparent 72%)`;

  return (
    <div
      ref={containerRef}
      className={cn(
        "pointer-events-none absolute inset-0 overflow-hidden will-change-transform transform-gpu",
        className
      )}
      aria-hidden="true"
    >
      <style>{`
        @keyframes grid-drift {
          from {
            transform: translate3d(-${gridSize}px, -${gridSize}px, 0);
          }
          to {
            transform: translate3d(0, 0, 0);
          }
        }
        .grid-drift-layer {
          animation: grid-drift 22s linear infinite;
        }
        @media (prefers-reduced-motion: reduce) {
          .grid-drift-layer {
            animation: none !important;
            transform: translate3d(0, 0, 0) !important;
          }
        }
      `}</style>

      {/* Base Grid Layer */}
      <div
        className="absolute text-warm-white opacity-[0.1] grid-drift-layer"
        style={{
          top: -gridSize,
          left: -gridSize,
          width: `calc(100% + ${gridSize}px)`,
          height: `calc(100% + ${gridSize}px)`,
        }}
      >
        <GridPattern
          patternId={`${patternId}-base`}
          size={gridSize}
        />
      </div>

      {/* Highlighted Grid Spotlight Layer */}
      <motion.div
        className="absolute inset-0 overflow-hidden"
        style={{
          maskImage,
          WebkitMaskImage: maskImage,
          opacity: highlightOpacitySpring,
        }}
      >
        <div
          className="absolute text-warm-white opacity-60 drop-shadow-[0_0_16px_rgba(255,244,230,0.65)] grid-drift-layer"
          style={{
            top: -gridSize,
            left: -gridSize,
            width: `calc(100% + ${gridSize}px)`,
            height: `calc(100% + ${gridSize}px)`,
          }}
        >
          <GridPattern
            patternId={`${patternId}-highlight`}
            size={gridSize}
          />
        </div>
      </motion.div>

      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-ink-black via-ink-black/70 to-transparent" />
    </div>
  );
}
