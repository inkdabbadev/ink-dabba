import type { Metadata } from "next";

const SPORTATHON_URL = "https://sportathon-30.vercel.app/admin/login";

export const metadata: Metadata = {
  title: { absolute: "Sportathon Admin Login" },
  description: "Sign in to the Sportathon admin portal.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function SportathonPage() {
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
        src={SPORTATHON_URL}
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Sportathon Admin Login"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
        allowFullScreen
      />
    </main>
  );
}
