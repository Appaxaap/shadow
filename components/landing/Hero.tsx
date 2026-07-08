"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { computeCss, type ShadowState } from "./shared";

function Slider({
  label,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span
        className="text-[11px] font-medium uppercase tracking-widest shrink-0 w-12"
        style={{ color: "#8B8D93" }}
      >
        {label}
      </span>
      <div className="flex-1 relative h-5 flex items-center">
        <div
          className="absolute h-[3px] rounded-full w-full"
          style={{ background: "#2A2C30" }}
        />
        <div
          className="absolute h-[3px] rounded-full"
          style={{ background: "#E8664D", width: `${pct}%` }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(parseFloat(e.target.value))}
          className="absolute inset-0 w-full opacity-0 cursor-pointer z-10"
        />
        <motion.div
          className="w-3.5 h-3.5 rounded-full z-0"
          style={{ background: "#F2F2F0", marginLeft: `calc(${pct}% - 7px)` }}
          whileTap={{ scale: 1.1 }}
        />
      </div>
      <span
        className="text-[11px] font-mono tabular-nums w-9 text-right"
        style={{ color: "#F2F2F0" }}
      >
        {value}
      </span>
    </div>
  );
}

const headlineWords = "Build precise CSS box shadows visually".split(" ");

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.1 } },
};

const wordVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] as const },
  },
};

export default function Hero() {
  const [shadow, setShadow] = useState<ShadowState>({
    x: 0,
    y: 8,
    blur: 24,
    spread: 0,
    opacity: 0.35,
    color: "#000000",
    inset: false,
    visible: true,
  });

  const cssValue = useMemo(() => computeCss(shadow), [shadow]);

  return (
    <section
      className="relative overflow-hidden min-h-screen flex items-center"
      style={{ background: "#0E0F11" }}
    >
      <div className="max-w-7xl mx-auto px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center pt-24 pb-20">
          {/* Left: Text */}
          <div className="z-10">
            <motion.h1
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="text-[clamp(2.5rem,5vw,5rem)] font-bold leading-[1.05] tracking-[-0.02em]"
              style={{ color: "#F2F2F0" }}
            >
              {headlineWords.map((word, i) => (
                <motion.span
                  key={i}
                  variants={wordVariants}
                  className="inline-block"
                >
                  {i > 0 ? "\u00A0" : ""}
                  {word}
                </motion.span>
              ))}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="text-lg sm:text-xl mt-6 max-w-[50ch] leading-relaxed"
              style={{ color: "#8B8D93" }}
            >
              Drag a slider, watch every layer update. Copy the code in CSS,
              Tailwind, SCSS, JavaScript, or Flutter. No signup, no trial gate,
              runs entirely in your browser.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.75, duration: 0.4 }}
            >
              <a
                href="/editor"
                className="inline-flex items-center gap-2 mt-8 px-7 py-3.5 rounded-xl text-base font-semibold transition-all duration-150 active:scale-[0.97]"
                style={{ background: "#E8664D", color: "#0E0F11" }}
              >
                Open Layerbox
              </a>
            </motion.div>
          </div>

          {/* Right: Live interactive mini-canvas */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="relative z-10"
          >
            <div
              className="rounded-2xl p-6 sm:p-8"
              style={{ background: "#17181B", border: "1px solid #2A2C30" }}
            >
              {/* Preview card */}
              <div
                className="rounded-xl mx-auto mb-6 flex items-center justify-center text-sm font-medium transition-shadow duration-100"
                style={{
                  width: "100%",
                  maxWidth: 220,
                  height: 140,
                  background: "#1F2023",
                  border: "1px solid #2A2C30",
                  borderRadius: 12,
                  boxShadow: cssValue,
                  color: "#8B8D93",
                }}
              >
                <span>layerbox</span>
              </div>

              {/* Sliders */}
              <div className="flex flex-col gap-4">
                <Slider
                  label="Blur"
                  value={shadow.blur}
                  min={0}
                  max={80}
                  step={1}
                  onChange={(v) => setShadow((s) => ({ ...s, blur: v }))}
                />
                <Slider
                  label="Offset Y"
                  value={shadow.y}
                  min={0}
                  max={40}
                  step={1}
                  onChange={(v) => setShadow((s) => ({ ...s, y: v }))}
                />
                <Slider
                  label="Opacity"
                  value={Math.round(shadow.opacity * 100)}
                  min={0}
                  max={100}
                  step={1}
                  onChange={(v) =>
                    setShadow((s) => ({ ...s, opacity: v / 100 }))
                  }
                />
              </div>

              {/* Live CSS output */}
              <div
                className="mt-4 rounded-lg px-4 py-3 text-xs font-mono overflow-x-auto whitespace-nowrap"
                style={{
                  background: "#0E0F11",
                  color: "#8B8D93",
                  border: "1px solid #2A2C30",
                }}
              >
                <span style={{ color: "#E8664D" }}>box-shadow</span>
                <span style={{ color: "#8B8D93" }}>: </span>
                <span style={{ color: "#F2F2F0" }}>{cssValue}</span>
                <span style={{ color: "#8B8D93" }}>;</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
