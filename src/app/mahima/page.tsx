import type { Metadata } from "next";

const MAHIMA_URL = "https://mahima-azure.vercel.app/";

export const metadata: Metadata = {
  title: { absolute: "Mahima weds Vidhan" },
  description: "The wedding website of Mahima and Vidhan.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MahimaPage() {
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
        src={MAHIMA_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Mahima weds Vidhan"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
        allowFullScreen
      />
    </main>
  );
}
