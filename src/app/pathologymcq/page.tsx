import type { Metadata } from "next";

const PATHOLOGY_MCQ_URL = "https://pathologymcq.vercel.app/";

export const metadata: Metadata = {
  title: "Your Masked Title",
  description: "Embedded prototype preview for Pathology MCQ.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function PathologyMcqPage() {
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
        src={PATHOLOGY_MCQ_URL}
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
