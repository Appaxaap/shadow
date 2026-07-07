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
    <div className="flex flex-col" style={{ gap: 8 }}>
      <div className="flex items-center justify-between">
        <span className="sg-meta">{label}</span>
        <span className="sg-value">
          {value}
          {unit}
        </span>
      </div>
      <Slider.Root
        className="relative flex items-center select-none touch-none w-full"
        style={{ height: 20 }}
        value={[value]}
        onValueChange={([v]) => onChange(v)}
        min={min}
        max={max}
        step={step}
      >
        <Slider.Track
          className="relative grow rounded-full overflow-hidden sg-transition"
          style={{ height: 3, background: "var(--surface-hover)" }}
        >
          <Slider.Range
            className="absolute h-full rounded-full sg-transition"
            style={{ background: "var(--accent)" }}
          />
        </Slider.Track>
        <Slider.Thumb
          className="block outline-none cursor-pointer sg-transition"
          style={{
            width: 12,
            height: 12,
            borderRadius: "50%",
            background: "white",
            boxShadow: "0 1px 3px rgba(0,0,0,0.25)",
            transition: "box-shadow 0.2s ease",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 2px 6px rgba(0,0,0,0.3)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow =
              "0 1px 3px rgba(0,0,0,0.25)";
          }}
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
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{
        background: "rgba(0,0,0,0.4)",
      }}
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          borderRadius: 8,
          overflow: "hidden",
          width: 220,
        }}
      >
        <HexColorPicker
          color={color}
          onChange={onColorChange}
          style={{ width: "100%", borderRadius: 0 }}
        />
        <div
          className="flex items-center gap-2 p-3"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          <input
            type="text"
            value={hexInput}
            onChange={(e) => onHexInput(e.target.value)}
            className="flex-1 min-w-0 outline-none"
            style={{
              fontSize: 11,
              fontFamily: '"JetBrains Mono", monospace',
              padding: "6px 8px",
              borderRadius: 4,
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
            className="sg-transition"
            style={{
              fontSize: 11,
              fontWeight: 500,
              padding: "6px 12px",
              borderRadius: 4,
              background: "var(--accent)",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
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
    <div className="flex flex-col" style={{ gap: 20 }}>
      <SliderRow
        label="Horizontal offset"
        value={shadow.x}
        min={-100}
        max={100}
        step={1}
        onChange={(x) => onChange({ x })}
      />
      <SliderRow
        label="Vertical offset"
        value={shadow.y}
        min={-100}
        max={100}
        step={1}
        onChange={(y) => onChange({ y })}
      />
      <SliderRow
        label="Blur radius"
        value={shadow.blur}
        min={0}
        max={200}
        step={1}
        onChange={(blur) => onChange({ blur })}
      />
      <SliderRow
        label="Spread radius"
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

      {/* Color + Inset */}
      <div
        className="flex items-center justify-between pt-1"
        style={{ gap: 16 }}
      >
        <div className="flex items-center gap-2.5">
          <span className="sg-meta">Color</span>
          <button
            onClick={() => setColorOpen(true)}
            className="sg-transition"
            style={{
              width: 28,
              height: 28,
              borderRadius: "50%",
              backgroundColor: shadow.color,
              border: "2px solid var(--border-hover)",
              cursor: "pointer",
              outline: "none",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.08)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            aria-label="Pick color"
          />
          <span className="sg-value" style={{ fontSize: 10.5 }}>
            {shadow.color.toUpperCase()}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="sg-meta">Inset</span>
          <button
            onClick={() => onChange({ inset: !shadow.inset })}
            className="relative inline-flex sg-transition"
            style={{
              width: 30,
              height: 16,
              borderRadius: 10,
              background: shadow.inset ? "var(--accent)" : "var(--border)",
              border: "none",
              cursor: "pointer",
              outline: "none",
            }}
            role="switch"
            aria-checked={shadow.inset}
          >
            <span
              className="inline-block bg-white rounded-full"
              style={{
                width: 12,
                height: 12,
                transform: shadow.inset
                  ? "translateX(16px)"
                  : "translateX(2px)",
                transition: "transform 0.2s ease",
              }}
            />
          </button>
        </div>
      </div>

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
