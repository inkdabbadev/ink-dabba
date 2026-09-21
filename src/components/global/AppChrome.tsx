"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { CursorProvider } from "@/context/CursorContext";
import CustomCursor from "@/components/global/CustomCursor";
import SmoothScroll from "@/components/global/SmoothScroll";
import { embeddedRoutes } from "@/lib/embedded-routes";

export default function AppChrome({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  if (embeddedRoutes.has(pathname)) {
    return <>{children}</>;
  }

  return (
    <CursorProvider>
      <CustomCursor />
      <SmoothScroll>{children}</SmoothScroll>
    </CursorProvider>
  );
}
