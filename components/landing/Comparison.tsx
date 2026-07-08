"use client";

import { motion } from "framer-motion";

const handWritten = `box-shadow:
  2px 4px 8px rgba(0,0,0,0.15),
  4px 8px 16px rgba(0,0,0,0.1),
  8px 16px 32px rgba(0,0,0,0.05);`;

const layerboxOutput = `box-shadow:
  0px 2px 4px rgba(0,0,0,0.06),
  0px 4px 8px rgba(0,0,0,0.06),
  0px 8px 24px rgba(0,0,0,0.08),
  0px 16px 48px rgba(0,0,0,0.06);`;

function CodeBlock({
  code,
  label,
  variant,
}: {
  code: string;
  label: string;
  variant: "hand" | "layerbox";
}) {
  const isHand = variant === "hand";
  return (
    <div>
      <p
        className="text-xs font-semibold uppercase tracking-[0.08em] mb-3"
        style={{ color: "#8B8D93" }}
      >
        {label}
      </p>
      <div
        className="rounded-xl p-5 font-mono text-sm leading-relaxed overflow-x-auto"
        style={{
          background: "#0E0F11",
          border: `1px solid ${isHand ? "#2A2C30" : "#E8664D"}`,
          color: "#F2F2F0",
        }}
      >
        <pre className="whitespace-pre-wrap">{code}</pre>
      </div>
    </div>
  );
}

export default function Comparison() {
  return (
    <section
      className="py-24"
      style={{ background: "#0E0F11" }}
    >
      <div className="max-w-5xl mx-auto px-6">
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em] text-center mb-3"
          style={{ color: "#8B8D93" }}
        >
          HAND-WRITTEN VS PRECISION
        </p>
        <h2
          className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.015em] text-center mb-12"
          style={{ color: "#F2F2F0" }}
        >
          Guesswork to results
        </h2>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <CodeBlock
              code={handWritten}
              label="Hand-written guesswork"
              variant="hand"
            />
            <p
              className="text-sm mt-3 text-center"
              style={{ color: "#8B8D93" }}
            >
              Random values, no visual feedback, trial and error
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <CodeBlock
              code={layerboxOutput}
              label="Layerbox precision"
              variant="layerbox"
            />
            <p
              className="text-sm mt-3 text-center"
              style={{ color: "#8B8D93" }}
            >
              Visually crafted with depth falloff, instant feedback
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
