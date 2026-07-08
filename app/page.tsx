import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-[var(--bg)] text-[var(--text)] font-sans">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 60% 50% at 50% 0%, rgba(94,158,136,0.08), transparent)",
          }}
        />
        <header className="flex items-center justify-between px-6 py-4 max-w-6xl mx-auto">
          <span className="text-lg font-bold tracking-tight">Layerbox</span>
          <Link
            href="/editor"
            className="px-5 py-2 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-95"
            style={{
              background: "var(--accent)",
              color: "#fff",
            }}
          >
            Open Editor
          </Link>
        </header>

        <div className="max-w-4xl mx-auto px-6 pt-20 pb-24 text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1] mb-5">
            CSS Box Shadow Generator
          </h1>
          <p
            className="text-lg sm:text-xl max-w-2xl mx-auto mb-8"
            style={{ color: "var(--text-muted)" }}
          >
            Create, visualize, and export multi-layer box shadows in seconds.
            Supports CSS, Tailwind, SCSS, JavaScript, and Flutter formats.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <Link
              href="/editor"
              className="px-8 py-3 rounded-xl text-base font-semibold transition-all duration-150 active:scale-95"
              style={{
                background: "var(--accent)",
                color: "#fff",
              }}
            >
              Start Designing
            </Link>
            <Link
              href="#features"
              className="px-8 py-3 rounded-xl text-base font-semibold transition-all duration-150 active:scale-95"
              style={{
                background: "rgba(255,255,255,0.06)",
                border: "1px solid var(--border)",
                color: "var(--text)",
              }}
            >
              Learn More
            </Link>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Everything you need for perfect shadows
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={i}
              className="rounded-2xl p-6"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4 text-lg"
                style={{
                  background: "rgba(94,158,136,0.12)",
                  color: "var(--accent)",
                }}
              >
                {f.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{f.title}</h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-4xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">How it works</h2>
        <div className="flex flex-col gap-6">
          {steps.map((s, i) => (
            <div key={i} className="flex items-start gap-4">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-sm font-bold"
                style={{ background: "var(--accent)", color: "#fff" }}
              >
                {i + 1}
              </div>
              <div>
                <h3 className="font-semibold mb-1">{s.title}</h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-muted)" }}
                >
                  {s.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Formats */}
      <section className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h2 className="text-3xl font-bold mb-4">Export to any format</h2>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>
          Copy code in your preferred format and paste directly into your
          project.
        </p>
        <div className="flex flex-wrap justify-center gap-2">
          {[
            "CSS",
            "Tailwind",
            "Tailwind Config",
            "SCSS",
            "CSS Variables",
            "JavaScript",
            "Flutter/Dart",
          ].map((fmt) => (
            <span
              key={fmt}
              className="px-4 py-2 rounded-xl text-sm font-medium"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              {fmt}
            </span>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="max-w-3xl mx-auto px-6 py-20">
        <h2 className="text-3xl font-bold text-center mb-12">
          Frequently asked questions
        </h2>
        <div className="flex flex-col gap-4">
          {faq.map((item, i) => (
            <details
              key={i}
              className="rounded-2xl p-5 group"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
              }}
            >
              <summary className="font-semibold cursor-pointer list-none flex items-center justify-between">
                {item.q}
                <span className="text-xs opacity-50 group-open:rotate-180 transition-transform">
                  v
                </span>
              </summary>
              <p
                className="mt-3 text-sm leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {item.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="text-center px-6 py-20">
        <h2 className="text-3xl font-bold mb-4">
          Ready to create your shadows?
        </h2>
        <p className="mb-8" style={{ color: "var(--text-muted)" }}>
          No signup required. Free, open source, runs entirely in your browser.
        </p>
        <Link
          href="/editor"
          className="inline-block px-8 py-3 rounded-xl text-base font-semibold transition-all duration-150 active:scale-95"
          style={{
            background: "var(--accent)",
            color: "#fff",
          }}
        >
          Open Layerbox Editor
        </Link>
      </section>

      {/* Footer */}
      <footer
        className="text-center px-6 py-8 text-sm"
        style={{
          color: "var(--text-faint)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <p>Layerbox is open source. MIT License.</p>
      </footer>
    </main>
  );
}

const features = [
  {
    icon: "M",
    title: "Multi-layer shadows",
    description:
      "Stack unlimited shadow layers with independent controls for offset, blur, spread, opacity, and color. Each layer can be toggled, reordered, duplicated, or deleted.",
  },
  {
    icon: "R",
    title: "Real-time preview",
    description:
      "See your changes instantly on an interactive canvas. Drag to pan, double-click to reset view. Preview on different shapes and background colors.",
  },
  {
    icon: "E",
    title: "Multiple export formats",
    description:
      "Export generated shadows as CSS, Tailwind CSS, SCSS, CSS variables, JavaScript objects, or Flutter/Dart code. Syntax-highlighted output with one-click copy.",
  },
  {
    icon: "L",
    title: "Light source engine",
    description:
      "Toggle a draggable light source to automatically compute shadow directions. Shadows respond realistically as you move the light around the canvas.",
  },
  {
    icon: "D",
    title: "Depth and material simulation",
    description:
      "Generate multi-layer shadow stacks from a single depth slider. Simulate surfaces like paper, glass, metal, frosted, fabric, and plastic.",
  },
  {
    icon: "P",
    title: "Preset library and sharing",
    description:
      "Browse 40+ curated presets across 10 categories. Share your shadow configurations via compact encoded URLs or Shadow DNA strings.",
  },
];

const steps = [
  {
    title: "Add shadow layers",
    description:
      "Start with one or more shadow layers. Each layer has independent controls for horizontal and vertical offset, blur radius, spread, opacity, and color.",
  },
  {
    title: "Adjust and preview",
    description:
      "Tweak each layer using the polar angle/distance widget or individual sliders. See real-time updates on the interactive canvas with your chosen shape and background.",
  },
  {
    title: "Export your code",
    description:
      "Switch between CSS, Tailwind, SCSS, JavaScript, or Flutter format. Copy the syntax-highlighted code with one click and paste it directly into your project.",
  },
];

const faq = [
  {
    q: "What is a CSS box shadow generator?",
    a: "A CSS box shadow generator is a visual tool that helps you create box-shadow CSS declarations without writing code manually. You adjust sliders and controls to set offset, blur, spread, color, and other properties, and the tool generates the corresponding CSS code for you to copy and use in your projects.",
  },
  {
    q: "How do I use Layerbox?",
    a: "Open the editor, add shadow layers using the left panel, adjust each layer's properties (offset, blur, spread, opacity, color), preview the result on the canvas, and copy the generated code in your preferred format (CSS, Tailwind, SCSS, JS, or Flutter).",
  },
  {
    q: "Can I create multi-layer shadows?",
    a: "Yes. Layerbox supports unlimited shadow layers. You can add, remove, reorder, duplicate, and toggle visibility for each layer independently. Multi-layer shadows create depth and realism that single shadows cannot achieve.",
  },
  {
    q: "What export formats are supported?",
    a: "Layerbox supports CSS, Tailwind CSS arbitrary value syntax, Tailwind config theme extension, SCSS variables, CSS custom properties, JavaScript inline style objects, and Flutter/Dart BoxDecoration with BoxShadow list.",
  },
  {
    q: "Is Layerbox free to use?",
    a: "Yes. Layerbox is completely free and open source under the MIT License. It runs entirely in your browser with no backend, no signup, and no data collection.",
  },
  {
    q: "Can I share my shadow configurations?",
    a: "Yes. Layerbox encodes your entire shadow configuration into the URL query parameter, so you can share a link with anyone. You can also use the Shadow DNA feature to encode/decode shadows as compact strings.",
  },
];
