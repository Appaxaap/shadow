"use client";

import { useCallback, useState } from "react";
import * as Slider from "@radix-ui/react-slider";
import type { Shadow } from "../../lib/types";
import {
  generateGradientShadow,
  type GradientShadowParams,
  DEFAULT_GRADIENT_PARAMS,
} from "../../lib/gradientShadow";

type Props = {
  onApply: (shadows: Shadow[]) => void;
};

export function GradientShadow({ onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [params, setParams] = useState<GradientShadowParams>(
    DEFAULT_GRADIENT_PARAMS,
  );

  const update = useCallback(
    (patch: Partial<GradientShadowParams>) => {
      setParams((p) => ({ ...p, ...patch }));
    },
    [],
  );

  const handleGenerate = useCallback(() => {
    const shadows = generateGradientShadow(params);
    onApply(shadows);
    setOpen(false);
  }, [params, onApply]);

  const previewShadows = generateGradientShadow(params);
  const previewCss = previewShadows
    .filter((s) => s.visible !== false)
    .map(
      (s) =>
        `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px rgba(0,0,0,${s.opacity})`,
    )
    .join(",\n  ");

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-2">
          <span className="text-[13px]">🌈</span>
          <span>Gradient Shadow</span>
        </div>
        <span
          className="text-[10px] transition-transform"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          className="px-3 pb-3 flex flex-col gap-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Mini preview */}
          <div
            className="w-full h-14 rounded-lg flex items-center justify-center mt-2.5"
            style={{ background: "#1a2828" }}
          >
            <div
              className="w-8 h-8 rounded-xl bg-white"
              style={{ boxShadow: previewCss }}
            />
          </div>

          {/* Depth slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label
                className="text-[10px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                Depth
              </label>
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--accent)" }}
              >
                {params.depth}%
              </span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[params.depth]}
              onValueChange={([v]) => update({ depth: v })}
              min={5}
              max={100}
              step={1}
            >
              <Slider.Track
                className="relative grow rounded-full h-1 overflow-hidden"
                style={{ background: "var(--surface-raised)" }}
              >
                <Slider.Range
                  className="absolute h-full rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              </Slider.Track>
              <Slider.Thumb
                className="block w-4 h-4 rounded-full outline-none cursor-pointer"
                style={{
                  background: "white",
                  border: "2px solid var(--accent)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
                aria-label="Depth"
              />
            </Slider.Root>
          </div>

          {/* Falloff slider */}
          <div className="flex flex-col gap-1">
            <div className="flex justify-between items-center">
              <label
                className="text-[10px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                Falloff
              </label>
              <span
                className="text-[10px] font-mono"
                style={{ color: "var(--accent)" }}
              >
                {params.falloff.toFixed(1)}x
              </span>
            </div>
            <Slider.Root
              className="relative flex items-center select-none touch-none w-full h-5"
              value={[params.falloff]}
              onValueChange={([v]) => update({ falloff: v })}
              min={0.5}
              max={3}
              step={0.1}
            >
              <Slider.Track
                className="relative grow rounded-full h-1 overflow-hidden"
                style={{ background: "var(--surface-raised)" }}
              >
                <Slider.Range
                  className="absolute h-full rounded-full"
                  style={{ background: "var(--accent)" }}
                />
              </Slider.Track>
              <Slider.Thumb
                className="block w-4 h-4 rounded-full outline-none cursor-pointer"
                style={{
                  background: "white",
                  border: "2px solid var(--accent)",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
                }}
                aria-label="Falloff"
              />
            </Slider.Root>
          </div>

          {/* Layer count + Color row */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <label
                className="text-[10px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                Layers
              </label>
              <span
                className="text-[10px] font-mono font-semibold"
                style={{ color: "var(--accent)" }}
              >
                {params.layers}
              </span>
              <input
                type="range"
                min={2}
                max={12}
                value={params.layers}
                onChange={(e) =>
                  update({ layers: Number(e.target.value) })
                }
                className="w-12 h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: "var(--surface-raised)",
                  accentColor: "var(--accent)",
                }}
              />
            </div>
            <div className="flex items-center gap-1.5 ml-auto">
              <label
                className="text-[10px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                Color
              </label>
              <input
                type="color"
                value={params.color}
                onChange={(e) => update({ color: e.target.value })}
                className="w-6 h-6 rounded-md cursor-pointer outline-none"
                style={{
                  border: "1px solid var(--border)",
                  background: "none",
                  padding: 1,
                }}
              />
            </div>
          </div>

          {/* Apply button */}
          <button
            onClick={handleGenerate}
            className="w-full py-2 rounded-xl text-xs font-semibold transition-all active:scale-[0.98]"
            style={{
              background: "var(--accent)",
              color: "var(--bg)",
            }}
          >
            Generate & Apply ({params.layers} layers)
          </button>
        </div>
      )}
    </div>
  );
}
