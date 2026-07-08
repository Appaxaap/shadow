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
  title: "Layerbox - CSS Box Shadow Generator | Multi-layer Shadow Tool",
  description:
    "Free online CSS box shadow generator. Build multi-layer shadows visually with real-time preview. Export to CSS, Tailwind, SCSS, JavaScript, or Flutter. Open source, no signup required.",
  keywords: [
    "box shadow generator",
    "css box shadow generator",
    "tailwind shadow generator",
    "box shadow css",
    "shadow generator online",
    "multi-layer shadow",
    "css shadow tool",
    "box shadow maker",
    "drop shadow css",
    "shadow effect generator",
  ],
  openGraph: {
    title: "Layerbox - CSS Box Shadow Generator",
    description:
      "Create, visualize, and export multi-layer box shadows. Supports CSS, Tailwind, SCSS, JavaScript, and Flutter formats.",
    url: "https://layerbox.vercel.app",
    siteName: "Layerbox",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Layerbox - CSS Box Shadow Generator",
    description:
      "Create, visualize, and export multi-layer box shadows. Free, open source, no signup required.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

// Runs synchronously before any paint - prevents theme flash
const themeScript = `
try {
  if (localStorage.getItem('sg-theme') === 'light') {
    document.documentElement.classList.add('light');
  }
} catch(e) {}
`;

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Layerbox",
  url: "https://layerbox.vercel.app",
  description:
    "Free online CSS box shadow generator. Build multi-layer shadows visually with real-time preview. Export to CSS, Tailwind, SCSS, JavaScript, or Flutter.",
  applicationCategory: "DeveloperApplication",
  operatingSystem: "All",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "USD",
  },
  author: {
    "@type": "Organization",
    name: "Layerbox",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <head>
        {/* eslint-disable-next-line @next/next/no-before-interactive-script-component */}
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">{children}</body>
    </html>
  );
}
