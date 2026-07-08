"use client";

import { useCallback, useRef, useState } from "react";
import type { PreviewShape, Shadow } from "../../lib/types";
import { shadowsToCssValue } from "../../lib/shadowUtils";
import type { LightState } from "../../lib/lightSource";
import { LightSourceOverlay } from "./LightSourceOverlay";
import type { MaterialId } from "../../lib/materials";
import {
  MATERIALS,
  getMaterial,
  applyMaterialToColor,
} from "../../lib/materials";

type Props = {
  shadows: Shadow[];
  isLight: boolean;
  lightState?: LightState;
  onLightChange?: (lx: number, ly: number) => void;
  materialId?: MaterialId;
  onMaterialChange?: (id: MaterialId) => void;
  panUnbounded?: boolean;
  previewBg?: string;
  bgId?: string;
  onBgChange?: (bgId: string) => void;
};

type InteractionState = "normal" | "hover" | "focus" | "active";

const PRESET_BG_LIST: { id: string; label: string; css: string }[] = [
  { id: "light", label: "Light", css: "#F0F3F2" },
  { id: "white", label: "White", css: "#ffffff" },
  { id: "dark", label: "Dark", css: "#0e1a1a" },
  { id: "black", label: "Black", css: "#000000" },
  { id: "warm-gray", label: "Warm", css: "#F5F0EB" },
  { id: "cool-gray", label: "Cool", css: "#E8EDF2" },
  {
    id: "gradient-sunset",
    label: "Sunset",
    css: "linear-gradient(135deg, #f093fb, #f5576c)",
  },
  {
    id: "gradient-ocean",
    label: "Ocean",
    css: "linear-gradient(135deg, #4facfe, #00f2fe)",
  },
  {
    id: "gradient-forest",
    label: "Forest",
    css: "linear-gradient(135deg, #11998e, #38ef7d)",
  },
];

const SHAPES: { label: string; value: PreviewShape }[] = [
  { label: "Box", value: "box" },
  { label: "Circle", value: "circle" },
  { label: "Button", value: "button" },
  { label: "Card", value: "card" },
];

const INTERACTION_STATES: { label: string; value: InteractionState }[] = [
  { label: "Normal", value: "normal" },
  { label: "Hover", value: "hover" },
  { label: "Focus", value: "focus" },
  { label: "Active", value: "active" },
];

const PAN_BOUNDS = 600;

export function ShadowPreview({
  shadows,
  isLight,
  lightState,
  onLightChange,
  materialId = "paper",
  onMaterialChange,
  panUnbounded = false,
  previewBg,
  bgId,
  onBgChange,
}: Props) {
  const [shape, setShape] = useState<PreviewShape>("box");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panState = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ clientX: 0, clientY: 0, originX: 0, originY: 0 });
  const contentRef = useRef<HTMLDivElement>(null);
  const [interactionState, setInteractionState] =
    useState<InteractionState>("normal");
  const [elementSize, setElementSize] = useState(128);
  const [elementRotation, setElementRotation] = useState(0);
  const [splitView, setSplitView] = useState(false);

  const handlePanStart = useCallback((e: React.PointerEvent) => {
    isPanning.current = true;
    const target = e.currentTarget as HTMLElement;
    target.setPointerCapture(e.pointerId);
    panStart.current = {
      clientX: e.clientX,
      clientY: e.clientY,
      originX: panState.current.x,
      originY: panState.current.y,
    };
    // Direct DOM - avoid React re-render lag during drag
    if (contentRef.current) {
      contentRef.current.style.transition = "none";
    }
  }, []);

  const handlePanMove = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    const dx = e.clientX - panStart.current.clientX;
    const dy = e.clientY - panStart.current.clientY;
    const bound = panUnbounded ? 5000 : PAN_BOUNDS;
    const newX = Math.max(
      -bound,
      Math.min(bound, panStart.current.originX + dx),
    );
    const newY = Math.max(
      -bound,
      Math.min(bound, panStart.current.originY + dy),
    );
    panState.current = { x: newX, y: newY };
    // Direct DOM - skip React reconciliation for 60fps
    if (contentRef.current) {
      contentRef.current.style.transform = `translate(${newX}px, ${newY}px)`;
    }
  }, []);

  const handlePanEnd = useCallback((e: React.PointerEvent) => {
    if (!isPanning.current) return;
    isPanning.current = false;
    try {
      (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {}
    // Restore transition (for double-click animation)
    if (contentRef.current) {
      contentRef.current.style.transition = "";
    }
    // Sync React state for non-drag interactions
    setPan({ x: panState.current.x, y: panState.current.y });
  }, []);

  const handleDoubleClick = useCallback(() => {
    panState.current = { x: 0, y: 0 };
    setPan({ x: 0, y: 0 });
    // Animate back to center smoothly
    if (contentRef.current) {
      contentRef.current.style.transition =
        "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)";
      contentRef.current.style.transform = "translate(0px, 0px)";
      setTimeout(() => {
        if (contentRef.current) {
          contentRef.current.style.transition = "";
        }
      }, 350);
    }
  }, []);

  const material = getMaterial(materialId);

  // Apply material modifiers to shadow colors
  const materialShadows = shadows.map((s) => {
    if (s.visible === false) return s;
    const r = parseInt(s.color.slice(1, 3), 16);
    const g = parseInt(s.color.slice(3, 5), 16);
    const b = parseInt(s.color.slice(5, 7), 16);
    const rgba = `rgba(${r},${g},${b},${s.opacity})`;
    const adjusted = applyMaterialToColor(rgba, material);
    // Parse adjusted rgba back to individual values
    const match = adjusted.match(/rgba\((\d+),(\d+),(\d+),([\d.]+)\)/);
    if (!match) return s;
    const [_, ar, ag, ab, ao] = match.map(Number);
    const newHex = `#${ar.toString(16).padStart(2, "0")}${ag.toString(16).padStart(2, "0")}${ab.toString(16).padStart(2, "0")}`;
    return { ...s, color: newHex, opacity: ao };
  });
  const shadowValue = shadowsToCssValue(materialShadows);
  const primaryVisible = shadows.find((s) => s.visible !== false);

  // Canvas background - custom or theme-based
  const defaultBg = isLight ? "#F0F3F2" : "#0e1a1a";
  const canvasBg = previewBg || defaultBg;
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

  // Interaction state transforms
  const interactionTransform =
    interactionState === "hover"
      ? "scale(1.03)"
      : interactionState === "active"
        ? "scale(0.97)"
        : interactionState === "focus"
          ? "scale(1.02)"
          : "scale(1)";

  // CSS snippet for interaction states
  const stateCss =
    interactionState !== "normal"
      ? `.element {\n  box-shadow: ${shadowValue};\n  transition: box-shadow 0.2s cubic-bezier(0.16,1,0.3,1), transform 0.2s ease;\n}\n\n.element:${interactionState} {\n  transform: ${interactionTransform};\n  box-shadow: ${shadowValue};\n}`
      : "";

  return (
    <div
      className="relative w-full h-full"
      style={{
        background: splitView ? (isLight ? "#EEF2F2" : "#1a2828") : canvasBg,
        transition: "background 0.2s ease",
        ...(splitView ? {} : dotGrid),
      }}
    >
      {/* Floating material + shape selector - centered top overlay (fixed) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-1.5 items-center pointer-events-none max-w-[95vw] sm:max-w-none">
        {/* Material selector */}
        {onMaterialChange && (
          <div
            className="pointer-events-auto flex items-center gap-0.5 p-0.5 rounded-xl overflow-x-auto"
            style={{
              background: isLight
                ? "rgba(255,255,255,0.75)"
                : "rgba(11,20,20,0.75)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
            }}
          >
            {MATERIALS.map((m) => {
              const active = m.id === materialId;
              return (
                <button
                  key={m.id}
                  onClick={() => onMaterialChange(m.id)}
                  className="shrink-0 px-2 py-1.5 text-xs font-semibold rounded-xl transition-all flex items-center gap-1"
                  style={{
                    background: active
                      ? "var(--surface-raised)"
                      : "transparent",
                    color: active ? "var(--text)" : "var(--text-muted)",
                    border: active
                      ? "1px solid var(--border-hover)"
                      : "1px solid transparent",
                  }}
                  title={m.description}
                >
                  <span
                    className="w-[22px] h-[22px] rounded-lg flex items-center justify-center text-xs font-bold uppercase shrink-0"
                    style={{
                      background: active ? "var(--accent)" : "var(--surface)",
                      color: active ? "var(--bg)" : "var(--text-muted)",
                    }}
                  >
                    {m.badge}
                  </span>
                  <span className="hidden sm:inline">{m.name}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* Interaction state toggles + Shape row */}
        <div
          className="flex items-center gap-2 max-w-full overflow-x-auto"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {/* Interaction states */}
          <div
            className="pointer-events-auto flex items-center gap-0.5 p-0.5 rounded-xl"
            style={{
              background: isLight
                ? "rgba(255,255,255,0.75)"
                : "rgba(11,20,20,0.75)",
              border: "1px solid var(--border)",
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {INTERACTION_STATES.map((st) => {
              const active = st.value === interactionState;
              return (
                <button
                  key={st.value}
                  onClick={() => setInteractionState(st.value)}
                  className="px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95"
                  style={{
                    background: active
                      ? "var(--surface-raised)"
                      : "transparent",
                    color: active ? "var(--text)" : "var(--text-muted)",
                    border: active
                      ? "1px solid var(--border-hover)"
                      : "1px solid transparent",
                  }}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Shape selector */}
          <div
            className="pointer-events-auto flex items-center gap-0.5 p-0.5 rounded-xl"
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
                    background: active
                      ? "var(--surface-raised)"
                      : "transparent",
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

        {/* Background selector + Split view toggle */}
        {onBgChange && (
          <div
            className="flex items-center gap-2 max-w-full overflow-x-auto"
            style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
          >
            <div
              className="pointer-events-auto flex items-center gap-0.5 p-0.5 rounded-xl"
              style={{
                background: isLight
                  ? "rgba(255,255,255,0.75)"
                  : "rgba(11,20,20,0.75)",
                border: "1px solid var(--border)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
                maxWidth: "calc(100vw - 120px)",
                overflowX: "auto",
                overflowY: "hidden",
                scrollbarWidth: "none",
              }}
            >
              {PRESET_BG_LIST.map((b) => {
                const active = b.id === bgId;
                return (
                  <button
                    key={b.id}
                    onClick={() => onBgChange(b.id)}
                    className="shrink-0 w-6 h-6 rounded-lg transition-all duration-150 active:scale-90"
                    style={{
                      background: b.css,
                      border: active
                        ? "2px solid var(--accent)"
                        : "2px solid transparent",
                      outline: active
                        ? "1px solid var(--accent)"
                        : "1px solid var(--border)",
                      boxShadow: active
                        ? "0 0 0 2px var(--bg), 0 0 0 4px var(--accent)"
                        : "none",
                    }}
                    title={b.label}
                    aria-label={b.label}
                  />
                );
              })}
            </div>

            {/* Split view toggle */}
            <button
              onClick={() => setSplitView(!splitView)}
              className="pointer-events-auto shrink-0 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: splitView
                  ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                  : isLight
                    ? "rgba(255,255,255,0.75)"
                    : "rgba(11,20,20,0.75)",
                border: `1px solid ${splitView ? "color-mix(in srgb, var(--accent) 25%, transparent)" : "var(--border)"}`,
                color: splitView ? "var(--accent)" : "var(--text-muted)",
                backdropFilter: "blur(8px)",
                WebkitBackdropFilter: "blur(8px)",
              }}
              title="Compare shadow on dark + light backgrounds"
            >
              {splitView ? "Split on" : "Side by side"}
            </button>
          </div>
        )}
      </div>

      {/* Split view overlay when active */}
      {splitView && (
        <div className="absolute inset-0 z-[5] pointer-events-none flex">
          <div
            className="h-full"
            style={{
              width: "50%",
              background: isLight ? "#1a2828" : "#1a2828",
            }}
          />
          <div
            className="h-full"
            style={{
              width: "50%",
              background: isLight ? "#EEF2F2" : "#EEF2F2",
            }}
          />
          {/* Divider line */}
          <div
            className="absolute top-0 bottom-0 left-1/2 w-px"
            style={{ background: "var(--accent)" }}
          />
          {/* Labels */}
          <span
            className="absolute top-2 left-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "rgba(255,255,255,0.35)" }}
          >
            Dark
          </span>
          <span
            className="absolute top-2 right-3 text-[11px] font-semibold uppercase tracking-wider"
            style={{ color: "rgba(0,0,0,0.25)" }}
          >
            Light
          </span>
        </div>
      )}

      {/* Draggable canvas surface */}
      <div
        className="absolute inset-0 z-10 cursor-grab active:cursor-grabbing select-none touch-none"
        style={{ touchAction: "none" }}
        onPointerDown={handlePanStart}
        onPointerMove={handlePanMove}
        onPointerUp={handlePanEnd}
        onPointerLeave={handlePanEnd}
        onDoubleClick={handleDoubleClick}
      >
        {/* Panned content */}
        <div
          ref={contentRef}
          className="absolute inset-0 flex items-center justify-center"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px)`,
          }}
        >
          {/* Light source overlay (moves with canvas) */}
          {lightState && onLightChange && (
            <LightSourceOverlay
              lightState={lightState}
              onChange={onLightChange}
            />
          )}

          {/* Centered preview element */}
          <div
            className="rounded-3xl p-8 sm:p-10"
            style={{
              background: stageBg,
              border: `1px solid ${stageBorder}`,
              transition: "background 0.2s ease, border-color 0.2s ease",
            }}
          >
            {/* The preview element with interaction state simulation */}
            <div
              style={{
                transform: `${interactionTransform} rotate(${elementRotation}deg)`,
                transition:
                  "transform 0.2s cubic-bezier(0.16,1,0.3,1), box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
                outline:
                  interactionState === "focus"
                    ? `3px solid ${shadowColor}`
                    : "none",
                outlineOffset: interactionState === "focus" ? "3px" : "0",
              }}
            >
              {shape === "box" && (
                <div
                  className="rounded-2xl"
                  style={{
                    width: elementSize,
                    height: elementSize,
                    background: material.elementBg,
                    boxShadow: shadowValue,
                    transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
                    ...(material.elementExtra
                      ? Object.fromEntries(
                          material.elementExtra
                            .split(";")
                            .filter(Boolean)
                            .map((s) => {
                              const [k, ...v] = s.split(":");
                              return [k.trim(), v.join(":").trim()];
                            }),
                        )
                      : {}),
                  }}
                />
              )}

              {shape === "circle" && (
                <div
                  className="rounded-full"
                  style={{
                    width: elementSize,
                    height: elementSize,
                    background: material.elementBg,
                    boxShadow: shadowValue,
                    transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
                    ...(material.elementExtra
                      ? Object.fromEntries(
                          material.elementExtra
                            .split(";")
                            .filter(Boolean)
                            .map((s) => {
                              const [k, ...v] = s.split(":");
                              return [k.trim(), v.join(":").trim()];
                            }),
                        )
                      : {}),
                  }}
                />
              )}

              {shape === "button" && (
                <div
                  className="rounded-full font-semibold text-sm select-none"
                  style={{
                    paddingLeft: Math.round(elementSize * 0.25),
                    paddingRight: Math.round(elementSize * 0.25),
                    paddingTop: Math.round(elementSize * 0.1),
                    paddingBottom: Math.round(elementSize * 0.1),
                    background: material.elementBg,
                    color: textColor,
                    boxShadow: shadowValue,
                    transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
                    ...(material.elementExtra
                      ? Object.fromEntries(
                          material.elementExtra
                            .split(";")
                            .filter(Boolean)
                            .map((s) => {
                              const [k, ...v] = s.split(":");
                              return [k.trim(), v.join(":").trim()];
                            }),
                        )
                      : {}),
                  }}
                >
                  Click me
                </div>
              )}

              {shape === "card" && (
                <div
                  className="rounded-2xl p-5 flex flex-col gap-3"
                  style={{
                    width: Math.max(elementSize * 1.5, 200),
                    background: material.elementBg,
                    boxShadow: shadowValue,
                    transition: "box-shadow 0.2s cubic-bezier(0.16,1,0.3,1)",
                    ...(material.elementExtra
                      ? Object.fromEntries(
                          material.elementExtra
                            .split(";")
                            .filter(Boolean)
                            .map((s) => {
                              const [k, ...v] = s.split(":");
                              return [k.trim(), v.join(":").trim()];
                            }),
                        )
                      : {}),
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
      </div>

      {/* Element size + rotation controls - bottom center */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-30 animate-fade-up max-w-[95vw]">
        {/* Rotation buttons */}
        <div
          className="pointer-events-auto flex items-center gap-0.5 p-0.5 rounded-xl mb-1.5 mx-auto w-fit overflow-x-auto"
          style={{
            background: isLight
              ? "rgba(255,255,255,0.75)"
              : "rgba(11,20,20,0.75)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            scrollbarWidth: "none",
          }}
        >
          <span
            className="text-[11px] font-semibold px-1.5"
            style={{ color: "var(--text-faint)" }}
          >
            Rotate
          </span>
          {[
            { label: "0°", value: 0 },
            { label: "45°", value: 45 },
            { label: "90°", value: 90 },
            { label: "180°", value: 180 },
          ].map((r) => {
            const active = elementRotation === r.value;
            return (
              <button
                key={r.value}
                onClick={() => setElementRotation(r.value)}
                className="px-2 py-1 text-xs font-semibold rounded-lg transition-all active:scale-95"
                style={{
                  background: active ? "var(--surface-raised)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  border: active
                    ? "1px solid var(--border-hover)"
                    : "1px solid transparent",
                }}
              >
                {r.label}
              </button>
            );
          })}
        </div>
        <div
          className="pointer-events-auto flex items-center gap-2 px-3 py-1.5 rounded-xl overflow-x-auto"
          style={{
            background: isLight
              ? "rgba(255,255,255,0.75)"
              : "rgba(11,20,20,0.75)",
            border: "1px solid var(--border)",
            backdropFilter: "blur(8px)",
            WebkitBackdropFilter: "blur(8px)",
            scrollbarWidth: "none",
          }}
        >
          {/* Preset sizes */}
          {[
            { label: "S", value: 80 },
            { label: "M", value: 128 },
            { label: "L", value: 200 },
            { label: "XL", value: 300 },
          ].map((preset) => {
            const active = elementSize === preset.value;
            return (
              <button
                key={preset.label}
                onClick={() => setElementSize(preset.value)}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg transition-all active:scale-95"
                style={{
                  background: active ? "var(--surface-raised)" : "transparent",
                  color: active ? "var(--text)" : "var(--text-muted)",
                  border: active
                    ? "1px solid var(--border-hover)"
                    : "1px solid transparent",
                }}
              >
                {preset.label}
              </button>
            );
          })}
          {/* Custom size slider */}
          <div className="flex items-center gap-1.5 ml-1">
            <input
              type="range"
              min={40}
              max={400}
              value={elementSize}
              onChange={(e) => setElementSize(Number(e.target.value))}
              className="w-16 h-1 rounded-full appearance-none cursor-pointer"
              style={{
                background: "var(--surface-raised)",
                accentColor: "var(--accent)",
              }}
            />
            <span
              className="text-xs font-mono font-medium min-w-[32px] text-right"
              style={{ color: "var(--accent)" }}
            >
              {elementSize}px
            </span>
          </div>
        </div>
      </div>

      {/* State CSS tooltip (bottom of canvas) */}
      {interactionState !== "normal" && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-30 animate-fade-up">
          <div
            className="rounded-xl px-4 py-2 text-[10px] font-mono leading-relaxed whitespace-pre select-all"
            style={{
              background: "rgba(11,20,20,0.9)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              backdropFilter: "blur(8px)",
              maxWidth: "90vw",
              overflow: "auto",
            }}
          >
            {stateCss}
          </div>
        </div>
      )}
    </div>
  );
}
