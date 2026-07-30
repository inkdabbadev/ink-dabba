"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CursorProvider } from "@/context/CursorContext";
import CustomCursor from "@/components/global/CustomCursor";
import FloatingBadge from "@/components/global/FloatingBadge";
import Navigation from "@/components/global/Navigation";
import Preloader from "@/components/global/Preloader";
import SmoothScroll from "@/components/global/SmoothScroll";

const chromeExcludedRoutes = new Set([
  "/the8thelement",
  "/pathologymcq",
  "/works",
  "/aarushi",
  "/AARUFLIX",
]);

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (chromeExcludedRoutes.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <CursorProvider>
      <Preloader />
      <CustomCursor />
      <Navigation />
      <SmoothScroll>{children}</SmoothScroll>
      <FloatingBadge />
    </CursorProvider>
  );
}
