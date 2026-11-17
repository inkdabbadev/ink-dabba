import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = {
  title: "JV’s little world — Special delivery",
  description:
    "A lovingly packed, playable birthday care package. Unwrap it. Move things. Make a little magic.",
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
