"use client";

import { useState } from "react";
import type { PreviewShape, Shadow } from "../../lib/types";
import { shadowsToCssValue } from "../../lib/shadowUtils";

type Props = { shadows: Shadow[]; isLight: boolean };

const SHAPES: { label: string; value: PreviewShape }[] = [
  { label: "Box", value: "box" },
  { label: "Circle", value: "circle" },
  { label: "Button", value: "button" },
  { label: "Card", value: "card" },
];

export function ShadowPreview({ shadows, isLight }: Props) {
  const [shape, setShape] = useState<PreviewShape>("box");

  const shadowValue = shadowsToCssValue(shadows);
  const primaryVisible = shadows.find((s) => s.visible !== false);

  // Canvas and element colors follow the global theme
  const canvasBg = isLight ? "#F0F3F2" : "#0e1a1a";
  const dotColor = isLight ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.055)";
  const elementBg = "#ffffff";
  const textColor = "#1A2828";
  const shadowColor = primaryVisible?.color ?? "#000000";
  const clean = shadowColor.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  const r = Number.parseInt(full.slice(0, 2), 16);
  const g = Number.parseInt(full.slice(2, 4), 16);
  const b = Number.parseInt(full.slice(4, 6), 16);
  const luminance =
    Number.isNaN(r) || Number.isNaN(g) || Number.isNaN(b)
      ? 0
      : (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  const stageBg = luminance < 0.45 ? "#F8FBFA" : "#132121";
  const stageBorder =
    luminance < 0.45 ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.08)";

  const dotGrid = {
    backgroundImage: `radial-gradient(circle, ${dotColor} 1.5px, transparent 1.5px)`,
    backgroundSize: "22px 22px",
  };

  return (
    <div
      className="relative w-full h-full"
      style={{
        background: canvasBg,
        transition: "background 0.2s ease",
        ...dotGrid,
      }}
    >
      {/* Floating shape selector — top-left overlay */}
      <div className="absolute top-3 left-3 z-10">
        <div
          className="flex items-center gap-0.5 p-0.5 rounded-xl"
          style={{
            background: isLight
              ? "rgba(255,255,255,0.75)"
              : "rgba(11,20,20,0.75)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
          }}
        >
          {SHAPES.map((s) => {
            const active = s.value === shape;
            return (
              <button
                key={s.value}
                onClick={() => setShape(s.value)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl transition-all"
                style={{
                  background: active ? "var(--surface-raised)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  border: active
                    ? "1px solid var(--border-hover)"
                    : "1px solid transparent",
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Centered preview element */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: stageBg,
            border: `1px solid ${stageBorder}`,
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
        >
          {shape === "box" && (
            <div
              className="w-32 h-32 rounded-2xl"
              style={{
                background: elementBg,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          )}

          {shape === "circle" && (
            <div
              className="w-32 h-32 rounded-full"
              style={{
                background: elementBg,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            />
          )}

          {shape === "button" && (
            <div
              className="px-8 py-3.5 rounded-full font-semibold text-sm select-none"
              style={{
                background: elementBg,
                color: textColor,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              Click me
            </div>
          )}

          {shape === "card" && (
            <div
              className="w-60 rounded-2xl p-5 flex flex-col gap-3"
              style={{
                background: elementBg,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
              }}
            >
              <div
                className="w-9 h-9 rounded-xl"
                style={{ background: "#EEF2F0" }}
              />
              <div
                className="h-2.5 rounded-full w-3/4"
                style={{ background: "#E8ECEA" }}
              />
              <div
                className="h-2 rounded-full w-full"
                style={{ background: "#F0F3F2" }}
              />
              <div
                className="h-2 rounded-full w-5/6"
                style={{ background: "#F0F3F2" }}
              />
              <div
                className="h-2 rounded-full w-4/6"
                style={{ background: "#F0F3F2" }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
