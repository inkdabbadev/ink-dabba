import type { Metadata } from "next";

const EIGHTH_ELEMENT_URL = "https://firstshow8thelement.vercel.app/";

export const metadata: Metadata = {
  title: "The 8th Element",
  description: "Embedded preview of The 8th Element website.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function The8thElementPage() {
  return (
    <main className="min-h-screen bg-black">
      <iframe
        src={EIGHTH_ELEMENT_URL}
        title="The 8th Element"
        className="block h-screen w-full border-0 bg-white"
        loading="eager"
        referrerPolicy="strict-origin-when-cross-origin"
        allow="fullscreen; clipboard-write; autoplay; encrypted-media; picture-in-picture"
        sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-popups-to-escape-sandbox allow-downloads"
        allowFullScreen
      />
    </main>
  );
}
