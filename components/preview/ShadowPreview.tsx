"use client";

import { useCallback, useRef, useState } from "react";
import type { PreviewShape, Shadow } from "../../lib/types";
import { shadowsToCssValue } from "../../lib/shadowUtils";
import type { LightState } from "../../lib/lightSource";
import { LightSourceOverlay } from "./LightSourceOverlay";
import type { Material, MaterialId } from "../../lib/materials";
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
};

const SHAPES: { label: string; value: PreviewShape }[] = [
  { label: "Box", value: "box" },
  { label: "Circle", value: "circle" },
  { label: "Button", value: "button" },
  { label: "Card", value: "card" },
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
}: Props) {
  const [shape, setShape] = useState<PreviewShape>("box");
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const panState = useRef({ x: 0, y: 0 });
  const isPanning = useRef(false);
  const panStart = useRef({ clientX: 0, clientY: 0, originX: 0, originY: 0 });
  const contentRef = useRef<HTMLDivElement>(null);

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
    // Direct DOM — avoid React re-render lag during drag
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
    // Direct DOM — skip React reconciliation for 60fps
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
      {/* Floating material + shape selector - centered top overlay (fixed) */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 z-20 flex flex-col gap-1.5 items-center pointer-events-none">
        {/* Material selector */}
        {onMaterialChange && (
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
            {MATERIALS.map((m) => {
              const active = m.id === materialId;
              return (
                <button
                  key={m.id}
                  onClick={() => onMaterialChange(m.id)}
                  className="px-2 py-1.5 text-[11px] font-semibold rounded-xl transition-all"
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
                  {m.icon} {m.name}
                </button>
              );
            })}
          </div>
        )}

        {/* Shape selector */}
        <div
          className="pointer-events-auto flex items-center gap-0.5 p-0.5 rounded-xl mx-auto"
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
            {shape === "box" && (
              <div
                className="w-32 h-32 rounded-2xl"
                style={{
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
                className="w-32 h-32 rounded-full"
                style={{
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
                className="px-8 py-3.5 rounded-full font-semibold text-sm select-none"
                style={{
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
                className="w-60 rounded-2xl p-5 flex flex-col gap-3"
                style={{
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
  );
}
