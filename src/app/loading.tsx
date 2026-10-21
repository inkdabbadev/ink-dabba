"use client";

import { usePathname } from "next/navigation";
import { embeddedRoutes } from "@/lib/embedded-routes";
import InkLoadingScene from "@/components/global/InkLoadingScene";

export default function Loading() {
  const pathname = usePathname();
  if (embeddedRoutes.has(pathname)) return null;
  return <InkLoadingScene />;
}
