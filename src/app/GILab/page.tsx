import type { Metadata } from "next";

const GI_LABS_URL = "https://gi-labs.vercel.app/";

export const metadata: Metadata = {
  title: { absolute: "GI Labs" },
  description: "GI Labs website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function GiLabsPage() {
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
        src={GI_LABS_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="GI Labs"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
