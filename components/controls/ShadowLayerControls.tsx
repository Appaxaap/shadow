"use client";

import * as Slider from "@radix-ui/react-slider";
import { HexColorPicker } from "react-colorful";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import type { Shadow } from "../../lib/types";

type Props = {
  shadow: Shadow;
  onChange: (patch: Partial<Shadow>) => void;
};

type SliderRowProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  unit?: string;
  onChange: (v: number) => void;
};

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  unit = "px",
  onChange,
}: SliderRowProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex justify-between items-center">
        <label
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </label>
        <span
          className="text-[11px] font-mono font-medium px-2 py-0.5 rounded-md"
          style={{
            background: "var(--surface-raised)",
            color: "var(--accent)",
            border: "1px solid var(--border)",
          }}
        >
          {value}
          {unit}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full h-5"
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track
          className="relative grow rounded-full h-1.5 overflow-hidden"
          style={{ background: "var(--surface-raised)" }}
        >
          <Slider.Range
            className="absolute h-full rounded-full"
            style={{ background: "var(--accent)" }}
          />
        </Slider.Track>
        <Slider.Thumb
          className="block w-[16px] h-[16px] rounded-full outline-none cursor-pointer"
          style={{
            background: "white",
            border: "2px solid var(--accent)",
            transition: "transform 0.15s cubic-bezier(0.34,1.56,0.64,1)",
          }}
          onMouseEnter={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1.25)")
          }
          onMouseLeave={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1)")
          }
          onFocus={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1.25)")
          }
          onBlur={(e) =>
            ((e.target as HTMLElement).style.transform = "scale(1)")
          }
          aria-label={label}
        />
      </Slider.Root>
    </div>
  );
}

function ColorPickerDialog({
  color,
  hexInput,
  onHexInput,
  onColorChange,
  onClose,
}: {
  color: string;
  hexInput: string;
  onHexInput: (v: string) => void;
  onColorChange: (v: string) => void;
  onClose: () => void;
}) {
  // Close on Escape
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center animate-fade-in"
      style={{
        backdropFilter: "blur(6px)",
        WebkitBackdropFilter: "blur(6px)",
        background: "rgba(11,20,20,0.55)",
      }}
      onClick={onClose}
    >
      <div
        className="animate-scale-in rounded-2xl overflow-hidden"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border-hover)",
          width: 220,
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Picker */}
        <HexColorPicker
          color={color}
          onChange={onColorChange}
          style={{ width: "100%", borderRadius: 0 }}
        />

        {/* Hex input + Done */}
        <div
          className="flex items-center gap-2 p-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <input
            type="text"
            value={hexInput}
            onChange={(e) => onHexInput(e.target.value)}
            className="flex-1 min-w-0 text-xs font-mono rounded-xl px-2.5 py-2 outline-none"
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
              color: "var(--text)",
            }}
            onFocus={(e) =>
              (e.currentTarget.style.borderColor = "var(--accent)")
            }
            onBlur={(e) =>
              (e.currentTarget.style.borderColor = "var(--border)")
            }
            maxLength={7}
            placeholder="#000000"
          />
          <button
            onClick={onClose}
            className="shrink-0 text-xs font-semibold px-3 py-2 rounded-xl transition-all duration-150 active:scale-95"
            style={{ background: "var(--accent)", color: "var(--bg)" }}
          >
            Done
          </button>
        </div>
      </div>
    </div>,
    document.body,
  );
}

export function ShadowLayerControls({ shadow, onChange }: Props) {
  const [colorOpen, setColorOpen] = useState(false);
  const [hexInput, setHexInput] = useState(shadow.color);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  useEffect(() => {
    setHexInput(shadow.color);
  }, [shadow.color]);

  function handleHexInput(val: string) {
    setHexInput(val);
    if (/^#[0-9a-fA-F]{6}$/.test(val)) onChange({ color: val });
  }

  function handleColorChange(val: string) {
    setHexInput(val);
    onChange({ color: val });
  }

  return (
    <div className="flex flex-col gap-4">
      <SliderRow
        label="Horizontal (X)"
        value={shadow.x}
        min={-100}
        max={100}
        step={1}
        onChange={(x) => onChange({ x })}
      />
      <SliderRow
        label="Vertical (Y)"
        value={shadow.y}
        min={-100}
        max={100}
        step={1}
        onChange={(y) => onChange({ y })}
      />
      <SliderRow
        label="Blur Radius"
        value={shadow.blur}
        min={0}
        max={200}
        step={1}
        onChange={(blur) => onChange({ blur })}
      />
      <SliderRow
        label="Spread Radius"
        value={shadow.spread}
        min={-50}
        max={100}
        step={1}
        onChange={(spread) => onChange({ spread })}
      />
      <SliderRow
        label="Opacity"
        value={Math.round(shadow.opacity * 100)}
        min={0}
        max={100}
        step={1}
        unit="%"
        onChange={(v) => onChange({ opacity: v / 100 })}
      />

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)" }} />

      {/* Color + Inset */}
      <div className="flex items-center gap-4">
        {/* Color swatch + label */}
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <label
            className="text-xs font-medium shrink-0"
            style={{ color: "var(--text-muted)" }}
          >
            Color
          </label>
          <button
            onClick={() => setColorOpen(true)}
            className="w-9 h-9 rounded-xl shrink-0 outline-none transition-transform duration-150 active:scale-95"
            style={{
              backgroundColor: shadow.color,
              border: "2px solid var(--border-hover)",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.1)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Pick color"
          />
          <span
            className="text-xs font-mono truncate"
            style={{ color: "var(--text-muted)" }}
          >
            {shadow.color.toUpperCase()}
          </span>
        </div>

        {/* Inset toggle */}
        <div className="flex items-center gap-2 shrink-0">
          <label
            className="text-xs font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Inset
          </label>
          <button
            onClick={() => onChange({ inset: !shadow.inset })}
            className="relative inline-flex h-5 w-10 items-center rounded-full outline-none"
            style={{
              background: shadow.inset
                ? "var(--accent)"
                : "rgba(128,128,128,0.2)",
              transition: "background 0.2s ease",
            }}
            role="switch"
            aria-checked={shadow.inset}
          >
            <span
              className="inline-block w-3.5 h-3.5 rounded-full bg-white"
              style={{
                transform: shadow.inset
                  ? "translateX(22px)"
                  : "translateX(3px)",
                transition: "transform 0.25s cubic-bezier(0.34,1.56,0.64,1)",
              }}
            />
          </button>
        </div>
      </div>

      {/* Color picker dialog (portal) */}
      {mounted && colorOpen && (
        <ColorPickerDialog
          color={shadow.color}
          hexInput={hexInput}
          onHexInput={handleHexInput}
          onColorChange={handleColorChange}
          onClose={() => setColorOpen(false)}
        />
      )}
    </div>
  );
}
