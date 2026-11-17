import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "JV’s little world — from Hugsy" },
  description: "A birthday wish and a little world, just for JV.",
  robots: { index: false, follow: false },
};

export default function HugsyyPage() {
  return (
    <main style={{ position: "fixed", inset: 0, zIndex: 20, background: "#171320", cursor: "auto" }}>
      <iframe
        src="/hugsyy/experience/index.html"
        title="JV’s birthday, from Hugsy"
        style={{ width: "100%", height: "100%", border: 0, display: "block" }}
        allow="microphone 'self'; autoplay 'self'; fullscreen 'self'"
        referrerPolicy="same-origin"
        allowFullScreen
      />
    </main>
  );
}
