import type { Metadata } from "next";

const SPORTATHON_URL = "https://sportathon-30.vercel.app/admin/login";

export const metadata: Metadata = {
  title: { absolute: "Sportathon Admin" },
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
        cursor: "auto",
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
        title="Sportathon Admin"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write"
        allowFullScreen
      />
    </main>
  );
}
