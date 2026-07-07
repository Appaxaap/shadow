"use client";

import { useState, useCallback } from "react";
import { Check, Copy } from "lucide-react";
import { hexToRgba } from "../../lib/shadowUtils";

type ScaleStyle = "soft" | "sharp" | "spread" | "colored";
type ScaleEntry = { name: string; value: string };

// Generate a 6-level elevation scale
function generateScale(
  color: string,
  baseOpacity: number,
  style: ScaleStyle,
): ScaleEntry[] {
  const levels = [
    { name: "xs", yMult: 1, blurMult: 2, spreadMult: 0, opMult: 0.6 },
    { name: "sm", yMult: 2, blurMult: 4, spreadMult: 0, opMult: 0.7 },
    { name: "md", yMult: 4, blurMult: 12, spreadMult: -1, opMult: 0.85 },
    { name: "lg", yMult: 8, blurMult: 24, spreadMult: -2, opMult: 1.0 },
    { name: "xl", yMult: 16, blurMult: 48, spreadMult: -4, opMult: 1.15 },
    { name: "2xl", yMult: 24, blurMult: 64, spreadMult: -6, opMult: 1.25 },
  ];

  return levels.map(({ name, yMult, blurMult, spreadMult, opMult }) => {
    const opacity = Math.min(baseOpacity * opMult, 1);
    const rgba = hexToRgba(color, opacity);

    let value: string;
    if (style === "soft") {
      // Two-layer soft shadow
      const rgba2 = hexToRgba(color, opacity * 0.5);
      value = `0 ${yMult}px ${blurMult}px ${spreadMult}px ${rgba}, 0 ${Math.round(yMult * 0.4)}px ${Math.round(blurMult * 0.3)}px 0 ${rgba2}`;
    } else if (style === "sharp") {
      value = `0 ${yMult}px ${Math.round(blurMult * 0.5)}px ${spreadMult}px ${rgba}`;
    } else if (style === "spread") {
      value = `0 ${yMult}px ${blurMult}px ${Math.abs(spreadMult)}px ${rgba}`;
    } else {
      // colored — three layers
      const rgba2 = hexToRgba(color, opacity * 0.4);
      const rgba3 = hexToRgba(color, opacity * 0.15);
      value = `0 ${yMult}px ${blurMult}px ${spreadMult}px ${rgba}, 0 ${Math.round(yMult * 0.3)}px ${Math.round(blurMult * 0.4)}px 0 ${rgba2}, 0 0 0 ${Math.round(yMult * 0.25)}px ${rgba3}`;
    }

    return { name, value };
  });
}

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

type ExportType = "css-vars" | "tailwind" | "scss" | "js-tokens" | "json";

export function ShadowScale({ isLight }: { isLight: boolean }) {
  const [color, setColor] = useState("#000000");
  const [intensity, setIntensity] = useState(10); // base opacity %
  const [style, setStyle] = useState<ScaleStyle>("soft");
  const [scale, setScale] = useState<ScaleEntry[]>(() =>
    generateScale("#000000", 0.1, "soft"),
  );
  const [exportType, setExportType] = useState<ExportType>("css-vars");
  const [copied, setCopied] = useState(false);

  // Auto-generate on any change
  const handleChange = useCallback(
    (newColor: string, newIntensity: number, newStyle: ScaleStyle) => {
      setColor(newColor);
      setIntensity(newIntensity);
      setStyle(newStyle);
      setScale(generateScale(newColor, newIntensity / 100, newStyle));
    },
    [],
  );

  function getExportCode(): string {
    switch (exportType) {
      case "css-vars":
        return `:root {\n${scale.map((e) => `  --shadow-${e.name}: ${e.value};`).join("\n")}\n}`;
      case "tailwind":
        return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      boxShadow: {\n${scale.map((e) => `        ${e.name}: '${e.value}',`).join("\n")}\n      },\n    },\n  },\n}`;
      case "scss":
        return scale.map((e) => `$shadow-${e.name}: ${e.value};`).join("\n");
      case "js-tokens":
        return `export const shadows = {\n${scale.map((e) => `  ${e.name}: '${e.value}',`).join("\n")}\n}`;
      case "json":
        return JSON.stringify(
          Object.fromEntries(scale.map((e) => [e.name, e.value])),
          null,
          2,
        );
    }
  }

  async function handleCopy() {
    await copyText(getExportCode());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const STYLES: { id: ScaleStyle; label: string }[] = [
    { id: "soft", label: "Soft" },
    { id: "sharp", label: "Sharp" },
    { id: "spread", label: "Spread" },
    { id: "colored", label: "Colored" },
  ];

  const EXPORTS: { id: ExportType; label: string }[] = [
    { id: "css-vars", label: "CSS Vars" },
    { id: "tailwind", label: "Tailwind" },
    { id: "scss", label: "SCSS" },
    { id: "js-tokens", label: "JS Tokens" },
    { id: "json", label: "JSON" },
  ];

  const canvasBg = isLight ? "#F0F3F2" : "#111C1C";

  return (
    <div className="flex flex-col gap-5 h-full overflow-y-auto">
      {/* Header */}
      <div>
        <h2
          className="text-lg font-semibold mb-0.5"
          style={{
            color: "var(--text)",
          }}
        >
          Elevation Scale
        </h2>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Generate a consistent 6-step shadow scale for your design system.
        </p>
      </div>

      {/* Controls */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-4"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <div className="flex flex-wrap gap-4 items-end">
          {/* Color */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Color
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleChange(e.target.value, intensity, style)}
                className="w-9 h-9 rounded-lg cursor-pointer outline-none"
                style={{
                  border: "2px solid var(--border-hover)",
                  background: "none",
                  padding: 2,
                }}
              />
              <span
                className="text-xs font-mono"
                style={{ color: "var(--text-muted)" }}
              >
                {color.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Intensity */}
          <div className="flex flex-col gap-1.5 flex-1 min-w-32">
            <div className="flex justify-between">
              <label
                className="text-xs font-medium"
                style={{ color: "var(--text-muted)" }}
              >
                Base Opacity
              </label>
              <span
                className="text-[11px] font-mono"
                style={{
                  color: "var(--accent)",
                  background: "var(--surface-raised)",
                  padding: "1px 6px",
                  borderRadius: 4,
                }}
              >
                {intensity}%
              </span>
            </div>
            <input
              type="range"
              min={1}
              max={30}
              value={intensity}
              onChange={(e) =>
                handleChange(color, Number(e.target.value), style)
              }
              className="w-full h-1.5 rounded-full outline-none cursor-pointer appearance-none"
              style={{
                accentColor: "var(--accent)",
                background: `linear-gradient(to right, var(--accent) ${(intensity / 30) * 100}%, var(--surface-raised) 0%)`,
              }}
            />
          </div>

          {/* Style */}
          <div className="flex flex-col gap-1.5">
            <label
              className="text-xs font-medium"
              style={{ color: "var(--text-muted)" }}
            >
              Style
            </label>
            <div
              className="flex items-center gap-1 p-0.5 rounded-xl"
              style={{
                background: "rgba(128,128,128,0.08)",
                border: "1px solid var(--border)",
              }}
            >
              {STYLES.map((s) => (
                <button
                  key={s.id}
                  onClick={() => handleChange(color, intensity, s.id)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150"
                  style={{
                    background:
                      style === s.id ? "var(--surface-raised)" : "transparent",
                    color: style === s.id ? "var(--text)" : "var(--text-muted)",
                    border:
                      style === s.id
                        ? "1px solid var(--border-hover)"
                        : "1px solid transparent",
                  }}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Scale preview */}
      <div
        className="rounded-2xl p-4 flex flex-col gap-3"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
        }}
      >
        <p
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Preview
        </p>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {scale.map((entry) => (
            <div
              key={entry.name}
              className="flex flex-col items-center gap-2.5"
            >
              <div
                className="w-full rounded-xl flex items-center justify-center"
                style={{
                  background: canvasBg,
                  height: 72,
                  transition: "background 0.2s ease",
                }}
              >
                <div
                  className="w-9 h-9 rounded-lg bg-white"
                  style={{ boxShadow: entry.value }}
                />
              </div>
              <span
                className="text-[11px] font-mono font-semibold"
                style={{ color: "var(--text-muted)" }}
              >
                {entry.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Export */}
      <div
        className="rounded-2xl overflow-hidden"
        style={{ border: "1px solid var(--border)" }}
      >
        <div
          className="flex items-center justify-between px-2"
          style={{
            background: "var(--surface-raised)",
            borderBottom: "1px solid var(--border)",
          }}
        >
          <div
            className="flex items-center overflow-x-auto"
            style={{ scrollbarWidth: "none" }}
          >
            {EXPORTS.map((e) => (
              <button
                key={e.id}
                onClick={() => setExportType(e.id)}
                className="shrink-0 px-3.5 py-2.5 text-xs font-semibold transition-all relative"
                style={{
                  color:
                    exportType === e.id ? "var(--accent)" : "var(--text-muted)",
                }}
              >
                {e.label}
                {exportType === e.id && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                    style={{ background: "var(--accent)" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="px-2 py-1.5 shrink-0">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95"
              style={{
                background: copied
                  ? "rgba(94,158,136,0.15)"
                  : "rgba(128,128,128,0.1)",
                color: copied ? "var(--accent)" : "var(--text-muted)",
                border: `1px solid ${copied ? "rgba(94,158,136,0.3)" : "var(--border)"}`,
              }}
            >
              {copied ? (
                <Check size={11} className="animate-check-pop" />
              ) : (
                <Copy size={11} />
              )}
              {copied ? "Copied!" : "Copy All"}
            </button>
          </div>
        </div>
        <div style={{ background: "var(--surface-code)" }}>
          <pre
            className="p-4 text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap"
            style={{
              color: "var(--accent)",
              maxHeight: 200,
              overflowY: "auto",
            }}
          >
            {getExportCode()}
          </pre>
        </div>
      </div>
    </div>
  );
}
