import { Bree_Serif, Poppins } from "next/font/google";
import "./globals.css";

const breeSerif = Bree_Serif({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-body",
});

export const metadata = {
  title: "Ink Dabba",
  description:
    "Ink Dabba is a superhero-style creative and marketing studio for branding, digital marketing, web development, production, and strategy.",
  icons: {
    icon: "/Site%20Files/FAVICON%20ID-01.jpg",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${breeSerif.variable} ${poppins.variable}`}>{children}</body>
    </html>
  );
}
