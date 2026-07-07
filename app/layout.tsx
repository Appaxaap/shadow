import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "Layerbox - Professional Shadow Workflow Tool",
  description:
    "Free online CSS box shadow generator. Build multi-layer shadows visually, preview in real-time, and copy CSS, Tailwind, or React code instantly.",
  keywords: [
    "box shadow generator",
    "css box shadow generator",
    "tailwind shadow generator",
    "box shadow css",
    "shadow generator online",
  ],
};

// Runs synchronously before any paint - prevents theme flash
const themeScript = `
try {
  if (localStorage.getItem('sg-theme') === 'light') {
    document.documentElement.classList.add('light');
  }
} catch(e) {}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
