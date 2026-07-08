"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function OpenSource() {
  const [stars, setStars] = useState<number | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetch("https://api.github.com/repos/Appaxaap/Layerbox")
      .then((r) => r.json())
      .then((data) => {
        if (data.stargazers_count !== undefined) {
          setStars(data.stargazers_count);
        } else {
          setError(true);
        }
      })
      .catch(() => setError(true));
  }, []);

  return (
    <section
      className="py-24"
      style={{ background: "#0E0F11" }}
    >
      <div className="max-w-4xl mx-auto px-6 text-center">
        <p
          className="text-xs font-semibold uppercase tracking-[0.12em] mb-3"
          style={{ color: "#8B8D93" }}
        >
          OPEN SOURCE
        </p>
        <h2
          className="text-[clamp(1.75rem,3.5vw,2.5rem)] font-semibold tracking-[-0.015em] mb-4"
          style={{ color: "#F2F2F0" }}
        >
          Built in the open
        </h2>
        <p
          className="text-base leading-relaxed max-w-2xl mx-auto mb-8"
          style={{ color: "#8B8D93" }}
        >
          Layerbox is MIT licensed. No telemetry, no accounts, no paywall. The
          code is on GitHub for anyone to audit, fork, or contribute to.
        </p>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="inline-flex items-center gap-6 flex-wrap justify-center"
        >
          {/* GitHub stars */}
          <a
            href="https://github.com/Appaxaap/Layerbox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-150 active:scale-[0.97]"
            style={{
              background: "#17181B",
              border: "1px solid #2A2C30",
              color: "#F2F2F0",
            }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
            </svg>
            {error ? (
              <span>GitHub</span>
            ) : stars !== null ? (
              <span>{stars.toLocaleString()} stars</span>
            ) : (
              <span>Loading...</span>
            )}
          </a>

          {/* MIT badge */}
          <span
            className="px-4 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider"
            style={{
              background: "#1F2023",
              border: "1px solid #2A2C30",
              color: "#8B8D93",
            }}
          >
            MIT License
          </span>

          {/* View on GitHub */}
          <a
            href="https://github.com/Appaxaap/Layerbox"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm font-medium transition-opacity hover:opacity-70"
            style={{ color: "#E8664D" }}
          >
            View on GitHub
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M7 17l9.2-9.2M17 17V7H7" />
            </svg>
          </a>
        </motion.div>
      </div>
    </section>
  );
}
