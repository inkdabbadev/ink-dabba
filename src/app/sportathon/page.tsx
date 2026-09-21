import type { Metadata } from "next";

const SPORTATHON_URL = "https://sportathon-30.vercel.app/admin/login";
const SPORTATHON_FRAME = "sportathon-admin";
const sections = [
  { label: "Dashboard", url: "https://sportathon-30.vercel.app/admin/dashboard" },
  { label: "Players", url: "https://sportathon-30.vercel.app/admin/players" },
  { label: "Teams", url: "https://sportathon-30.vercel.app/admin/teams" },
  { label: "Settings", url: "https://sportathon-30.vercel.app/admin/settings" },
];

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
        display: "grid",
        gridTemplateRows: "auto minmax(0, 1fr)",
        cursor: "auto",
        fontFamily: "Arial, sans-serif",
        textTransform: "none",
        letterSpacing: "normal",
      }}
    >
      <nav
        aria-label="Sportathon sections"
        className="flex flex-wrap items-center gap-1 border-b border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-900"
      >
        {/* Named targets load a full document without relying on the embedded app's router. */}
        {sections.map((section) => (
          <a
            key={section.url}
            href={section.url}
            target={SPORTATHON_FRAME}
            className="inline-flex min-h-11 items-center rounded px-3 hover:bg-slate-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
            {section.label}
          </a>
        ))}
      </nav>
      <iframe
        name={SPORTATHON_FRAME}
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
