"use client";

import { useState } from "react";
import { CATEGORIES, PRESETS } from "../../lib/presets";
import type { Shadow } from "../../lib/types";
import { shadowsToCssValue } from "../../lib/shadowUtils";

type Props = { onLoad: (shadows: Shadow[]) => void };

export function PresetsGallery({ onLoad }: Props) {
  const [activeCategory, setActiveCategory] = useState<string>("All");
  const categories = ["All", ...CATEGORIES];
  const filtered =
    activeCategory === "All"
      ? PRESETS
      : PRESETS.filter((p) => p.category === activeCategory);

  return (
    <div className="flex flex-col" style={{ gap: 28 }}>
      {/* Category filters — editorial text */}
      <div className="flex items-center flex-wrap" style={{ gap: 12 }}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="sg-transition"
              style={{
                background: "none",
                border: "none",
                padding: 0,
                cursor: "pointer",
                fontSize: 11,
                fontWeight: isActive ? 500 : 400,
                color: isActive ? "var(--text)" : "var(--text-muted)",
                letterSpacing: "0.02em",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Preset grid */}
      <div
        className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
        style={{ gap: 12 }}
      >
        {filtered.map((preset, i) => {
          const shadowValue = shadowsToCssValue(preset.shadows);
          return (
            <button
              key={preset.name}
              onClick={() => onLoad(preset.shadows)}
              className="sg-transition"
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 12,
                padding: "16px 12px",
                borderRadius: 8,
                background: "var(--surface)",
                border: "1px solid var(--border)",
                cursor: "pointer",
                textAlign: "left",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--surface-hover)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              {/* Mini preview */}
              <div
                className="w-full flex items-center justify-center"
                style={{
                  height: 56,
                  borderRadius: 6,
                  background: "#F4F4F2",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 6,
                    background: "white",
                    boxShadow: shadowValue,
                    transition: "box-shadow 0.2s ease",
                  }}
                />
              </div>
              {/* Name */}
              <span
                className="sg-meta"
                style={{
                  fontSize: 10.5,
                  textAlign: "center",
                  lineHeight: 1.3,
                }}
              >
                {preset.name}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
