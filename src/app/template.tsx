"use client";

import { motion, useReducedMotion } from "framer-motion";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { embeddedRoutes } from "@/lib/embedded-routes";
import InkLoadingScene from "@/components/global/InkLoadingScene";

export default function Template({ children }: { children: React.ReactNode }) {
  const reduce = useReducedMotion();
  const pathname = usePathname();
  const [revealed, setRevealed] = useState(false);

  if (embeddedRoutes.has(pathname) || reduce) return <>{children}</>;

  return (
    <>
      {!revealed && (
        <motion.div
          aria-hidden="true"
          className="pointer-events-none fixed inset-0 z-[9999] overflow-hidden"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.75, delay: 1.25, ease: [0.76, 0, 0.24, 1] }}
          onAnimationComplete={() => setRevealed(true)}
        >
          <InkLoadingScene />
        </motion.div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.65, delay: 1.4, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </>
  );
}
