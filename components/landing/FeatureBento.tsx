"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { computeCss, type ShadowState } from "./shared";

function BentoCard({
  title,
  description,
  children,
  className,
  index,
}: {
  title: string;
  description: string;
  children?: React.ReactNode;
  className?: string;
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.1, duration: 0.4 }}
      className={`rounded-2xl p-6 sm:p-8 ${className || ""}`}
      style={{
        background: "#17181B",
        border: "1px solid #2A2C30",
      }}
    >
      <h3 className="text-lg font-semibold mb-2" style={{ color: "#F2F2F0" }}>
        {title}
      </h3>
      <p className="text-sm leading-relaxed" style={{ color: "#8B8D93" }}>
        {description}
      </p>
      {children && <div className="mt-4">{children}</div>}
    </motion.div>
  );
}

function LightSourceDemo() {
  const [angle, setAngle] = useState(45);
  const rad = (angle * Math.PI) / 180;
  const shadow: ShadowState = {
    x: Math.round(Math.cos(rad) * 12),
    y: Math.round(Math.sin(rad) * 12),
    blur: 20,
    spread: 0,
    opacity: 0.35,
    color: "#000000",
    inset: false,
    visible: true,
  };
  const css = useMemo(() => computeCss(shadow), [shadow]);

  return (
    <div>
      <div
        className="relative mx-auto mb-4 flex items-center justify-center overflow-hidden rounded-lg"
        style={{
          width: "100%",
          maxWidth: 200,
          height: 120,
          background: "#1F2023",
          border: "1px solid #2A2C30",
          borderRadius: 10,
        }}
      >
        <div
          className="w-16 h-10 rounded-md transition-shadow duration-75"
          style={{
            background: "#2A2C30",
            borderRadius: 6,
            boxShadow: css,
          }}
        />
        {/* Light dot */}
        <div
          className="absolute w-3 h-3 rounded-full opacity-80"
          style={{
            background: "#E8664D",
            left: `calc(50% + ${Math.sin(rad) * 40}px)`,
            top: `calc(50% + ${Math.cos(rad) * -40}px)`,
            transition: "left 0.2s, top 0.2s",
          }}
        />
      </div>
      <input
        type="range"
        min={0}
        max={360}
        value={angle}
        onChange={(e) => setAngle(parseInt(e.target.value))}
        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
        style={{
          background: "#2A2C30",
          accentColor: "#E8664D",
        }}
      />
      <p
        className="text-center text-xs font-mono mt-2"
        style={{ color: "#8B8D93" }}
      >
        {angle}deg
      </p>
    </div>
  );
}

function NLDemo() {
  const examples = [
    {
      label: '"soft floating shadow"',
      shadow: { y: 6, blur: 18, opacity: 0.25 },
    },
    { label: '"sharp deep shadow"', shadow: { y: 10, blur: 8, opacity: 0.5 } },
    {
      label: '"warm glow"',
      shadow: { y: 0, blur: 30, opacity: 0.2, color: "#d4a050" },
    },
  ];
  const [active, setActive] = useState(0);
  const ex = examples[active];
  const shadow: ShadowState = {
    x: 0,
    y: ex.shadow.y ?? 4,
    blur: ex.shadow.blur ?? 12,
    spread: 0,
    opacity: ex.shadow.opacity ?? 0.3,
    color: ex.shadow.color ?? "#000000",
    inset: false,
    visible: true,
  };
  const css = useMemo(() => computeCss(shadow), [shadow]);

  return (
    <div>
      <div
        className="rounded-lg mb-3 flex items-center justify-center transition-shadow duration-200"
        style={{
          width: "100%",
          height: 80,
          background: "#1F2023",
          border: "1px solid #2A2C30",
          borderRadius: 8,
          boxShadow: css,
        }}
      >
        <span className="text-xs" style={{ color: "#8B8D93" }}>
          {ex.label}
        </span>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {examples.map((_, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
            style={{
              background: i === active ? "#E8664D" : "#1F2023",
              color: i === active ? "#0E0F11" : "#F2F2F0",
              border: i === active ? "none" : "1px solid #2A2C30",
            }}
          >
            {examples[i].label}
          </button>
        ))}
      </div>
    </div>
  );
}

const features = [
  {
    title: "Natural language input",
    description:
      "Type phrases like 'soft floating shadow with a blue tint' and Layerbox generates the layers automatically. No slider fiddling required.",
    demo: <NLDemo />,
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Draggable light source",
    description:
      "Toggle a light orb on the canvas and drag it around. Shadows track the light position in real-time, creating physically plausible results.",
    demo: <LightSourceDemo />,
    span: "md:col-span-1 md:row-span-2",
  },
  {
    title: "Material simulation",
    description:
      "Simulate different surfaces: paper, glass, metal, frosted, fabric, or plastic. Each material adjusts shadow lightness and opacity to match real-world reflectivity.",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Preset library",
    description:
      "Browse 40+ curated presets across 10 categories: Subtle, Elevated, Material, Apple, Soft UI, Glassmorphism, Neumorphism, Dashboard, Colored, and Inset.",
    span: "md:col-span-1 md:row-span-1",
  },
  {
    title: "Multi-format export",
    description:
      "Export to CSS, Tailwind, SCSS, CSS Variables, JavaScript inline styles, or Flutter/Dart. Syntax-highlighted output ready for one-click copy.",
    span: "md:col-span-2 md:row-span-1",
  },
];

export default function FeatureBento() {
  return (
    <section className="py-24" style={{ background: "#0E0F11" }}>
      <div className="max-w-6xl mx-auto px-6">
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
          style={{ color: "#8B8D93" }}
        >
          FEATURES
        </p>
        <h2
          className="text-[clamp(1.75rem,3.5vw,3rem)] font-semibold tracking-[-0.015em] mb-12"
          style={{ color: "#F2F2F0" }}
        >
          Everything you need to craft shadows
        </h2>

        <div className="grid md:grid-cols-3 gap-4 auto-rows-auto">
          {features.map((f, i) => (
            <BentoCard
              key={f.title}
              title={f.title}
              description={f.description}
              index={i}
              className={f.span}
            >
              {f.demo || null}
            </BentoCard>
          ))}
        </div>
      </div>
    </section>
  );
}
