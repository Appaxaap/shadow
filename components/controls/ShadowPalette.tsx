"use client";

import { useMemo } from "react";
import { generatePalette, paletteShadowCss } from "../../lib/shadowPalette";
import type { Shadow } from "../../lib/types";

type Props = {
  seed: Shadow | null;
  onSelect: (shadow: Shadow) => void;
};

export function ShadowPalette({ seed, onSelect }: Props) {
  const palette = useMemo(() => (seed ? generatePalette(seed) : []), [seed]);

  if (!seed || palette.length === 0) {
    return (
      <div
        className="rounded-2xl p-4 flex flex-col gap-2"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Shadow Palette
        </p>
        <p className="text-[11px]" style={{ color: "var(--text-faint)" }}>
          Select a layer to generate variations from it.
        </p>
      </div>
    );
  }

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-3"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-semibold"
          style={{ color: "var(--text-muted)" }}
        >
          Shadow Palette
        </span>
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-faint)" }}
        >
          {palette.length} variations
        </span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {palette.map((entry) => {
          const css = paletteShadowCss(entry);
          return (
            <button
              key={entry.name}
              onClick={() => onSelect(entry.shadow)}
              className="group flex flex-col items-stretch gap-1.5 p-2 rounded-xl transition-all active:scale-[0.97] duration-150"
              style={{
                background: "var(--surface-raised)",
                border: "1px solid var(--border)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor =
                  "color-mix(in srgb, var(--accent) 30%, transparent)";
                e.currentTarget.style.background =
                  "color-mix(in srgb, var(--accent) 5%, var(--surface-raised))";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "var(--border)";
                e.currentTarget.style.background = "var(--surface-raised)";
              }}
            >
              {/* Mini preview */}
              <div
                className="w-full h-14 rounded-lg flex items-center justify-center overflow-hidden"
                style={{ background: "#1a2828" }}
              >
                <div
                  className="w-7 h-7 rounded-lg bg-white transition-transform duration-200 group-hover:scale-105"
                  style={{ boxShadow: css }}
                />
              </div>
              {/* Label row */}
              <div className="flex items-center gap-1.5 px-0.5">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ background: entry.dotColor }}
                />
                <span
                  className="text-xs font-semibold leading-none truncate"
                  style={{ color: "var(--text)" }}
                >
                  {entry.name}
                </span>
              </div>
              <span
                className="text-[11px] leading-none px-0.5"
                style={{ color: "var(--text-faint)" }}
              >
                {entry.description}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
