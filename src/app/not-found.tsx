import InkBottleMascot from "@/components/ui/InkBottleMascot";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="relative flex min-h-[100dvh] flex-col items-center justify-center overflow-hidden bg-[#ff2608] px-6 py-16 text-center text-black normal-case">
      <section className="relative z-10 flex w-full max-w-5xl flex-col items-center">
        <p
          className="text-sm font-semibold uppercase tracking-[0.18em]"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          404 / page not found
        </p>
        <h1
          className="mt-6 text-[clamp(3rem,8vw,6.5rem)] uppercase leading-[0.88] tracking-normal"
          style={{ fontFamily: "Brunson, Impact, sans-serif" }}
        >
          <span className="block">This page is</span>
          <span className="block">out of ink.</span>
        </h1>
        <p
          className="mt-7 max-w-sm text-base leading-relaxed tracking-normal md:text-lg"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Looks like a wrong turn. Let&apos;s get you back to the dabba.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex min-h-14 items-center justify-center rounded-full border-2 border-black bg-black px-9 py-3 text-base font-semibold text-[#fff4e6] transition-colors hover:bg-[#fff4e6] hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black"
          style={{ fontFamily: "var(--font-outfit), sans-serif" }}
        >
          Back to the dabba <span aria-hidden="true" className="ml-3">&nearr;</span>
        </Link>
        <InkBottleMascot />
      </section>
    </main>
  );
}
