"use client";

import { motion } from "framer-motion";

const formats = [
  "CSS",
  "Tailwind",
  "SCSS",
  "JavaScript",
  "Flutter",
  "Tailwind Config",
  "CSS Variables",
];

export default function FormatStrip() {
  return (
    <section style={{ background: "#0E0F11", borderTop: "1px solid #2A2C30", borderBottom: "1px solid #2A2C30" }}>
      <div className="max-w-7xl mx-auto px-6 py-8">
        <p
          className="text-[11px] font-semibold uppercase tracking-[0.12em] text-center mb-5"
          style={{ color: "#8B8D93" }}
        >
          Export to any format
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          {formats.map((fmt, i) => (
            <motion.span
              key={fmt}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05, duration: 0.3 }}
              className="px-4 py-2 rounded-full text-sm font-mono"
              style={{
                background: "#1F2023",
                border: "1px solid #2A2C30",
                color: "#F2F2F0",
              }}
            >
              {fmt}
            </motion.span>
          ))}
        </div>
      </div>
    </section>
  );
}
