import type { Metadata } from "next";

const PUZZLE_URL = "https://puzzle-evidence.vercel.app/";

export const metadata: Metadata = {
  title: "PUZZLE",
  description: "Embedded Puzzle Evidence website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PuzzlePage() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000000",
      }}
    >
      <iframe
        src={PUZZLE_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Puzzle Evidence"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
        allowFullScreen
      />
    </main>
  );
}
