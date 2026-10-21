"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useAnimation, useReducedMotion } from "framer-motion";
import InteractiveEye from "@/components/ui/InteractiveEye";

export default function InkBottleMascot() {
  const blinkControls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      void blinkControls.start({
        scaleY: [1, 0.06, 1],
        transition: { duration: 0.18, times: [0, 0.48, 1], ease: "easeInOut" },
      });
    }, 4800);
    return () => window.clearInterval(timer);
  }, [blinkControls, reduceMotion]);

  return (
    <div className="relative mt-12 w-40 shrink-0 md:w-52">
      <Image
        src="/logo/ink-bottle.svg"
        alt="Ink Dabba ink bottle character"
        width={630}
        height={501}
        className="h-auto w-full"
        priority
      />
      {["31.1%", "60.4%"].map((left) => (
        <InteractiveEye
          key={left}
          left={left}
          top="58.4%"
          size="19.6%"
          containerColor="#050505"
          irisColor="#f7f7ed"
          irisSize="72%"
          pupilColor="#050505"
          pupilSize="54%"
          clipToContainer={false}
          blinkControls={blinkControls}
        />
      ))}
    </div>
  );
}
