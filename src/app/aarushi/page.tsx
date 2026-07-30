import type { Metadata } from "next";

const AARUSHI_URL = "https://aarushi1.vercel.app/";

export const metadata: Metadata = {
  title: "Your Masked Title",
  description: "Embedded prototype preview for Aarushi.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AarushiPage() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        background: "#ffffff",
      }}
    >
      <iframe
        src={AARUSHI_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Embedded Website"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
        allowFullScreen
      />
    </main>
  );
}
