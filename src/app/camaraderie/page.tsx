import type { Metadata } from "next";

const CAM_URL = "https://camaraderie-brown.vercel.app/";

export const metadata: Metadata = {
  title: { absolute: "Camaraderie" },
  description: "Camaraderie",
  robots: {
    index: false,
    follow: false,
  },
};

export default function CamaraderiePage() {
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
        src={CAM_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Camaraderie"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        allowFullScreen
      />
    </main>
  );
}
