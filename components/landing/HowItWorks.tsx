"use client";

import { useRef, useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { computeCss, type ShadowState } from "./shared";

function MiniShadowPreview({ seed }: { seed: Partial<ShadowState> }) {
  const shadow: ShadowState = {
    x: seed.x ?? 0,
    y: seed.y ?? 4,
    blur: seed.blur ?? 12,
    spread: seed.spread ?? 0,
    opacity: seed.opacity ?? 0.3,
    color: seed.color ?? "#000000",
    inset: false,
    visible: true,
  };
  const css = useMemo(() => computeCss(shadow), [shadow]);
  return (
    <div
      className="rounded-lg mx-auto"
      style={{
        width: 80,
        height: 56,
        background: "#1F2023",
        border: "1px solid #2A2C30",
        borderRadius: 8,
        boxShadow: css,
      }}
    />
  );
}

const steps = [
  {
    title: "Stack shadow layers",
    description:
      "Add multiple layers with independent blur, offset, spread, opacity, and color controls. Reorder, duplicate, or toggle each layer.",
    shadow: { y: 3, blur: 8, opacity: 0.25 },
  },
  {
    title: "Drag the light source",
    description:
      "Toggle a draggable light orb on the canvas. Shadows respond in real-time as you move the light, simulating natural falloff.",
    shadow: { x: 6, y: 6, blur: 16, opacity: 0.3 },
  },
  {
    title: "Copy the code",
    description:
      "Switch between CSS, Tailwind, SCSS, JavaScript, or Flutter output. Syntax-highlighted and ready to paste into your project.",
    shadow: { y: 8, blur: 24, opacity: 0.35 },
  },
];

export default function HowItWorks() {
  const lineRef = useRef<HTMLDivElement>(null);
  const [scrollProgress, setScrollProgress] = useState(0);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          const rect = entry.boundingClientRect;
          const windowHeight = window.innerHeight;
          const visible = Math.min(1, Math.max(0, 1 - rect.top / windowHeight));
          setScrollProgress(visible);
        }
      },
      { threshold: Array.from({ length: 101 }, (_, i) => i / 100) },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24" style={{ background: "#0E0F11" }}>
      <div className="max-w-6xl mx-auto px-6">
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
          style={{ color: "#8B8D93" }}
        >
          HOW IT WORKS
        </p>
        <h2
          className="text-[clamp(1.75rem,3.5vw,3rem)] font-semibold tracking-[-0.015em] mb-16"
          style={{ color: "#F2F2F0" }}
        >
          Three steps to a production shadow
        </h2>

        <div className="relative flex flex-col gap-16">
          {/* Connecting line */}
          <div
            ref={lineRef}
            className="absolute left-[40px] top-4 bottom-4 w-[2px]"
            style={{ background: "#2A2C30" }}
          >
            <div
              className="w-full transition-all duration-300"
              style={{
                height: `${scrollProgress * 100}%`,
                background: "#E8664D",
              }}
            />
          </div>

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15, duration: 0.5 }}
              className="relative flex items-start gap-8 pl-16"
            >
              <div
                className="absolute left-[26px] w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold -translate-x-1/2"
                style={{
                  background: i === 0 ? "#E8664D" : "#17181B",
                  border: i === 0 ? "none" : "2px solid #2A2C30",
                  color: i === 0 ? "#0E0F11" : "#F2F2F0",
                }}
              >
                {i + 1}
              </div>
              <div className="shrink-0">
                <MiniShadowPreview seed={step.shadow} />
              </div>
              <div>
                <h3
                  className="text-xl font-semibold mb-2"
                  style={{ color: "#F2F2F0" }}
                >
                  {step.title}
                </h3>
                <p
                  className="text-base leading-relaxed max-w-lg"
                  style={{ color: "#8B8D93" }}
                >
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
