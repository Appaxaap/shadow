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

  // Quieter canvas — reduced contrast, subtle atmosphere
  const canvasBg = isLight ? "#f0f3f2" : "#0d1818";
  const dotColor = isLight ? "rgba(0,0,0,0.05)" : "rgba(255,255,255,0.04)";
  const elementBg = "#ffffff";
  const textColor = "#1A2828";

  // Mute the stage (surface behind the object) based on shadow luminance
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
  const stageBg = luminance < 0.45 ? "#f0f4f3" : "#102020";
  const stageBorder =
    luminance < 0.45 ? "rgba(0,0,0,0.06)" : "rgba(255,255,255,0.06)";

  const dotGrid = {
    backgroundImage: `radial-gradient(circle, ${dotColor} 1px, transparent 1px)`,
    backgroundSize: "24px 24px",
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
      {/* Shape selector — minimal text buttons */}
      <div
        className="absolute flex items-center"
        style={{ gap: 8, top: 16, left: 20, zIndex: 10 }}
      >
        {SHAPES.map((s) => {
          const active = s.value === shape;
          return (
            <button
              key={s.value}
              onClick={() => setShape(s.value)}
              className="sg-transition"
              style={{
                background: "none",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
                fontSize: 11,
                fontWeight: active ? 500 : 400,
                color: active ? "var(--text)" : "var(--text-faint)",
                letterSpacing: "0.02em",
              }}
            >
              {s.label}
            </button>
          );
        })}
      </div>

      {/* Preview object — centered with generous breathing room */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{ padding: 48 }}
      >
        <div
          style={{
            background: stageBg,
            border: `1px solid ${stageBorder}`,
            borderRadius: 16,
            padding: 40,
            transition: "background 0.2s ease, border-color 0.2s ease",
          }}
        >
          {shape === "box" && (
            <div
              className="w-32 h-32"
              style={{
                background: elementBg,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s ease",
              }}
            />
          )}

          {shape === "circle" && (
            <div
              className="w-32 h-32"
              style={{
                background: elementBg,
                borderRadius: "50%",
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s ease",
              }}
            />
          )}

          {shape === "button" && (
            <div
              className="px-8 py-3.5 select-none"
              style={{
                background: elementBg,
                color: textColor,
                borderRadius: 9999,
                fontSize: 13,
                fontWeight: 500,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s ease",
              }}
            >
              Click me
            </div>
          )}

          {shape === "card" && (
            <div
              className="w-60 p-5 flex flex-col"
              style={{
                background: elementBg,
                borderRadius: 12,
                gap: 12,
                boxShadow: shadowValue,
                transition: "box-shadow 0.2s ease",
              }}
            >
              <div
                style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: "#E8ECEA",
                }}
              />
              <div
                style={{
                  height: 10,
                  borderRadius: 4,
                  width: "70%",
                  background: "#E8ECEA",
                }}
              />
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: "100%",
                  background: "#EEF2F0",
                }}
              />
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: "80%",
                  background: "#EEF2F0",
                }}
              />
              <div
                style={{
                  height: 8,
                  borderRadius: 4,
                  width: "60%",
                  background: "#EEF2F0",
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
