"use client";

import React, { useEffect, useRef } from "react";
import {
  motion,
  useAnimation,
  useReducedMotion,
  useScroll,
  useTransform,
} from "framer-motion";
import Image from "next/image";
import InteractiveEye from "@/components/ui/InteractiveEye";

export default function HeroSection() {
  const containerRef = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const blinkControls = useAnimation();

  useEffect(() => {
    if (reduceMotion) {
      return;
    }

    let isActive = true;

    const blinkRoutine = async () => {
      while (isActive) {
        const waitTime = 2600 + Math.random() * 5200;
        await new Promise((resolve) => setTimeout(resolve, waitTime));

        if (!isActive) {
          break;
        }

        await blinkControls.start({
          scaleY: [1, 0.06, 1],
          transition: { duration: 0.18, times: [0, 0.48, 1], ease: "easeInOut" },
        });

        if (Math.random() > 0.82) {
          await new Promise((resolve) => setTimeout(resolve, 120 + Math.random() * 90));

          if (!isActive) {
            break;
          }

          await blinkControls.start({
            scaleY: [1, 0.08, 1],
            transition: { duration: 0.14, times: [0, 0.5, 1], ease: "easeInOut" },
          });
        }
      }
    };

    blinkRoutine();

    return () => {
      isActive = false;
    };
  }, [blinkControls, reduceMotion]);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.98]);

  return (
    <section
      id="home"
      ref={containerRef}
      className="relative h-[100dvh] min-h-[34rem] w-full overflow-hidden bg-[#ff2608] text-black md:min-h-[42rem]"
    >
      <motion.div
        className="relative z-10 mx-auto flex h-full w-full flex-col items-center overflow-hidden px-4 text-center will-change-transform transform-gpu"
        style={{ opacity: heroOpacity, scale: heroScale }}
      >
        <motion.div
          className="relative z-20 mt-[12.5vh] flex w-full flex-col items-center md:mt-[12.75vh]"
          style={reduceMotion ? undefined : { y: copyY }}
          initial={{ opacity: 0, y: 26, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.75, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
        >
          <h1
            className="w-full max-w-[94vw] text-center text-[clamp(2.4rem,12vw,4.1rem)] uppercase leading-[0.86] tracking-normal text-black md:max-w-[min(62rem,92vw)] md:text-[clamp(4.1rem,8.35vw,8.8rem)]"
            style={{ fontFamily: "Brunson, Impact, sans-serif" }}
          >
            <span className="block whitespace-nowrap">We&apos;re still</span>
            <span className="flex w-full justify-center whitespace-nowrap">filling the dabba brb</span>
          </h1>
        </motion.div>

        <motion.div
          className="absolute bottom-[-5.2rem] left-1/2 z-10 aspect-[629.57/500.75] w-[min(45rem,82vw)] md:bottom-[-5.8rem] md:w-[min(45rem,45vw)]"
          style={{ x: "-50%" }}
          initial={{ opacity: 0, y: 36, scale: 0.985 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.86, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
        >
          <Image
            src="/logo/ink-bottle.svg"
            alt="Ink bottle character"
            fill
            className="relative z-10 object-contain object-bottom"
            priority
            sizes="(max-width: 768px) 74vw, 45vw"
          />
          <InteractiveEye
            left="31.1%"
            top="58.4%"
            size="19.6%"
            containerColor="#050505"
            irisColor="#f7f7ed"
            irisSize="72%"
            pupilColor="#050505"
            pupilSize="54%"
            clipToContainer={false}
            activationDelayMs={1500}
            initialLookX={0.72}
            initialLookY={0.72}
            blinkControls={blinkControls}
          />
          <InteractiveEye
            left="60.4%"
            top="58.4%"
            size="19.6%"
            containerColor="#050505"
            irisColor="#f7f7ed"
            irisSize="72%"
            pupilColor="#050505"
            pupilSize="54%"
            clipToContainer={false}
            activationDelayMs={1500}
            initialLookX={0.72}
            initialLookY={0.72}
            blinkControls={blinkControls}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
