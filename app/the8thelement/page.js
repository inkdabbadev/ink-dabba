// app/page.tsx

export const metadata = {
  title: "Your Masked Title",
};

export default function Page() {
  return (
    <main
      style={{
        margin: 0,
        padding: 0,
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <iframe
        src="https://firstshow8thelement.vercel.app"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
          display: "block",
        }}
        title="Embedded Website"
      />
    </main>
  );
}