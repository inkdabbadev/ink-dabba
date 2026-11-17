import type { Metadata } from "next";

const HUGSYY_URL = "https://hugsyyy.vercel.app/";

export const metadata: Metadata = {
  title: { absolute: "Hugsyy" },
  description: "Hugsyy website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function HugsyyPage() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100%",
        height: "100dvh",
        overflow: "hidden",
        background: "#000000",
        cursor: "auto",
      }}
    >
      <iframe
        src={HUGSYY_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Hugsyy"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
