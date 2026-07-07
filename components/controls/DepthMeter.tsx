"use client";

import { useState, useCallback } from "react";
import * as Slider from "@radix-ui/react-slider";
import { generateDepthShadows, depthLabel } from "../../lib/depthMeter";
import type { Shadow } from "../../lib/types";

type Props = {
  onApply: (shadows: Shadow[]) => void;
};

export function DepthMeter({ onApply }: Props) {
  const [depth, setDepth] = useState(30);
  const [color, setColor] = useState("#000000");
  const [preview, setPreview] = useState<Shadow[]>(() =>
    generateDepthShadows(0.3, "#000000"),
  );

  const update = useCallback(
    (newDepth: number, newColor: string) => {
      setDepth(newDepth);
      setColor(newColor);
      setPreview(generateDepthShadows(newDepth / 100, newColor));
    },
    [],
  );

  const handleApply = useCallback(() => {
    const shadows = generateDepthShadows(depth / 100, color);
    onApply(shadows.map((s) => ({ ...s, id: s.id })));
  }, [depth, color, onApply]);

  const label = depthLabel(depth / 100);
  const layerCount = preview.length;

  return (
    <div
      className="rounded-2xl p-4 flex flex-col gap-4"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Depth Meter
        </span>
        <span
          className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-md"
          style={{
            background: "color-mix(in srgb, var(--accent) 12%, transparent)",
            color: "var(--accent)",
            border: "1px solid color-mix(in srgb, var(--accent) 20%, transparent)",
          }}
        >
          {label}
        </span>
      </div>

      {/* Depth slider */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <label
            className="text-[11px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            Distance from surface
          </label>
          <span
            className="text-xs font-mono font-semibold"
            style={{ color: "var(--accent)" }}
          >
            {depth}%
          </span>
        </div>
        <Slider.Root
          className="relative flex items-center select-none touch-none w-full h-6"
          value={[depth]}
          onValueChange={([v]) => update(v, color)}
          min={0}
          max={100}
          step={1}
        >
          <Slider.Track
            className="relative grow rounded-full h-2 overflow-hidden"
            style={{ background: "var(--surface-raised)" }}
          >
            <Slider.Range
              className="absolute h-full rounded-full"
              style={{
                background:
                  "linear-gradient(to right, rgba(94,158,136,0.3), var(--accent))",
              }}
            />
          </Slider.Track>
          <Slider.Thumb
            className="block w-5 h-5 rounded-full outline-none cursor-pointer"
            style={{
              background: "white",
              border: "2px solid var(--accent)",
              boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
            }}
            aria-label="Depth"
          />
        </Slider.Root>

        {/* Depth markers */}
        <div
          className="flex justify-between text-[9px] font-mono"
          style={{ color: "var(--text-faint)", padding: "0 2px" }}
        >
          <span>Flat</span>
          <span>Lifted</span>
          <span>Floating</span>
          <span>Levitated</span>
        </div>
      </div>

      {/* Color picker row */}
      <div className="flex items-center gap-3">
        <label
          className="text-[11px] font-medium shrink-0"
          style={{ color: "var(--text-faint)" }}
        >
          Shadow color
        </label>
        <input
          type="color"
          value={color}
          onChange={(e) => update(depth, e.target.value)}
          className="w-8 h-8 rounded-xl cursor-pointer outline-none"
          style={{
            border: "2px solid var(--border-hover)",
            background: "none",
            padding: 2,
          }}
        />
        <span
          className="text-[11px] font-mono"
          style={{ color: "var(--text-muted)" }}
        >
          {color.toUpperCase()}
        </span>
        <span
          className="text-[11px] font-mono ml-auto"
          style={{ color: "var(--text-faint)" }}
        >
          {layerCount} layers
        </span>
      </div>

      {/* Live mini-preview */}
      <div
        className="h-12 rounded-xl flex items-center justify-center"
        style={{ background: "#1a2828" }}
      >
        <div
          className="w-10 h-10 rounded-xl bg-white"
          style={{
            boxShadow: preview
              .filter((s) => s.visible)
              .map(
                (s) =>
                  `${s.inset ? "inset " : ""}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px rgba(0,0,0,${s.opacity})`,
              )
              .join(",\n  "),
          }}
        />
      </div>

      {/* Apply button */}
      <button
        onClick={handleApply}
        className="w-full py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98]"
        style={{
          background: "var(--accent)",
          color: "var(--bg)",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = "0.9";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = "1";
        }}
      >
        Apply Depth
      </button>
    </div>
  );
}
