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
    <div className="flex flex-col gap-5">
      {/* Category pills */}
      <div className="flex items-center gap-2 flex-wrap">
        {categories.map((cat) => {
          const isActive = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:scale-95"
              style={{
                background: isActive
                  ? "var(--accent)"
                  : "rgba(255,255,255,0.06)",
                color: isActive ? "#0b1414" : "var(--text-muted)",
                border: isActive
                  ? "1px solid var(--accent)"
                  : "1px solid rgba(255,255,255,0.07)",
                boxShadow: isActive ? "0 0 16px rgba(94,158,136,0.25)" : "none",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.1)";
              }}
              onMouseLeave={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "rgba(255,255,255,0.06)";
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {filtered.map((preset, i) => {
          const shadowValue = shadowsToCssValue(preset.shadows);
          return (
            <button
              key={preset.name}
              onClick={() => onLoad(preset.shadows)}
              className="group flex flex-col items-center gap-3 p-4 rounded-2xl text-left transition-all active:scale-[0.97] animate-fade-up"
              style={{
                background: "var(--surface)",
                border: "1px solid rgba(255,255,255,0.07)",
                animationDelay: `${i * 0.03}s`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(94,158,136,0.3)";
                e.currentTarget.style.background = "var(--surface-raised)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.07)";
                e.currentTarget.style.background = "var(--surface)";
              }}
            >
              {/* Mini preview */}
              <div
                className="w-full h-16 rounded-xl flex items-center justify-center"
                style={{ background: "#F4F4F2" }}
              >
                <div
                  className="w-8 h-8 rounded-xl bg-white"
                  style={{
                    boxShadow: shadowValue,
                    transition: "box-shadow 0.3s ease",
                  }}
                />
              </div>
              {/* Name */}
              <span
                className="text-xs font-semibold text-center leading-tight w-full transition-colors duration-200"
                style={{ color: "var(--text-muted)" }}
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
