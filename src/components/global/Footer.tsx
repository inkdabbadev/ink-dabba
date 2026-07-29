"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, useAnimation, useReducedMotion } from "framer-motion";
import InteractiveEye from "@/components/ui/InteractiveEye";

const quickLinks = ["Work", "About", "Contact"];
const socialLinks = ["Instagram", "Twitter", "Behance", "LinkedIn"];

export default function Footer() {
  const blinkControls = useAnimation();
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) return;
    let active = true;
    const run = async () => {
      while (active) {
        await new Promise(r => setTimeout(r, Math.random() * 4000 + 2000));
        if (!active) break;
        await blinkControls.start({ scaleY: [1, 0.05, 1], transition: { duration: 0.15, times: [0, 0.5, 1], ease: "easeInOut" } });
        if (Math.random() > 0.8) {
          await new Promise(r => setTimeout(r, 100));
          if (!active) break;
          await blinkControls.start({ scaleY: [1, 0.05, 1], transition: { duration: 0.15, times: [0, 0.5, 1], ease: "easeInOut" } });
        }
      }
    };
    run();
    return () => { active = false; };
  }, [blinkControls, reduceMotion]);

  return (
    <footer className="relative bg-ink-black pt-14 pb-12 overflow-hidden border-t border-warm-white/10 md:pt-16">

      <div className="relative z-10 max-w-[92%] mx-auto">
        {/* Headline removed as it's redundant with ContactSection */}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">

          {/* Studio Info */}
          <div className="md:col-span-2">
            <Link href="/" className="block mb-6">
              <div className="relative w-48 aspect-[4/1]">
                <Image src="/logo/inkdabba-white.svg" alt="INKDABBA Logo" fill className="object-contain" />
                <InteractiveEye
                  left="29.5%" top="59.4%" size="5%"
                  containerColor="#111111" irisColor="#ffffff" irisSize="70%" pupilColor="#111111" pupilSize="55%"
                  blinkControls={blinkControls}
                />
                <InteractiveEye
                  left="36%" top="59.4%" size="5%"
                  containerColor="#111111" irisColor="#ffffff" irisSize="70%" pupilColor="#111111" pupilSize="55%"
                  blinkControls={blinkControls}
                />
              </div>
            </Link>
            <p className="font-body text-warm-paper/60 text-sm max-w-sm">
              Chennai-based visual studio specializing in posters, branding, and campaigns that make noise.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-warm-paper/40 mb-6">Explore</h4>
            <ul className="flex flex-col gap-3">
              {quickLinks.map(link => (
                <li key={link}>
                  <Link href={`#${link.toLowerCase()}`} className="font-body text-warm-white hover:text-cmyk-cyan transition-colors uppercase text-sm tracking-wider">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Socials */}
          <div>
            <h4 className="font-body text-xs font-bold tracking-[0.2em] uppercase text-warm-paper/40 mb-6">Connect</h4>
            <ul className="flex flex-col gap-3">
              {socialLinks.map(link => (
                <li key={link}>
                  <a
                    href={link === "Instagram" ? "https://www.instagram.com/ink_dabba_/" : "#"}
                    target={link === "Instagram" ? "_blank" : undefined}
                    rel={link === "Instagram" ? "noopener noreferrer" : undefined}
                    className="font-body text-warm-white hover:text-cmyk-magenta transition-colors uppercase text-sm tracking-wider"
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        <div className="mt-24 flex flex-col md:flex-row items-center justify-between pt-8 border-t border-warm-white/10">
          <p className="font-body text-xs text-warm-paper/40 uppercase tracking-widest">
            &copy; {new Date().getFullYear()} INKDABBA STUDIO. ALL RIGHTS RESERVED.
          </p>
          <div className="flex items-center gap-4 mt-4 md:mt-0">
            <span className="font-body text-[0.65rem] font-bold tracking-[0.3em] text-warm-paper/80 uppercase">CHENNAI VISUAL STUDIO</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
