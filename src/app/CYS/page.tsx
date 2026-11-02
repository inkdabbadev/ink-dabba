import type { Metadata } from "next";

const CYS_URL = "https://cys-henna.vercel.app/";

export const metadata: Metadata = {
  title: { absolute: "CYS" },
  description: "CYS",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CYSPage() {
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
        src={CYS_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="CYS"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
