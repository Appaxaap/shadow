"use client";

import { Layers, Lightbulb, Moon, Sun } from "lucide-react";
import React, { useEffect, useState } from "react";
import { CodeOutput } from "../components/code/CodeOutput";
import { PresetsGallery } from "../components/controls/PresetsGallery";
import { ShadowLayerControls } from "../components/controls/ShadowLayerControls";
import { ShadowLayerList } from "../components/controls/ShadowLayerList";
import { DepthMeter } from "../components/controls/DepthMeter";
import { ShadowDNA } from "../components/code/ShadowDNA";
import { ShadowPalette } from "../components/controls/ShadowPalette";
import { NaturalLanguageInput } from "../components/controls/NaturalLanguageInput";
import { ShadowPreview } from "../components/preview/ShadowPreview";
import { useShadowState } from "../hooks/useShadowState";
import { ShadowScale } from "../components/scale/ShadowScale";
import { DEFAULT_MATERIAL, type MaterialId } from "../lib/materials";

export default function Home() {
  const {
    shadows,
    activeId,
    setActiveId,
    addLayer,
    removeLayer,
    updateLayer,
    duplicateLayer,
    toggleLayerVisibility,
    reorderLayers,
    lightState,
    toggleLight,
    setLightPosition,
    computeShadow,
    loadPreset,
  } = useShadowState();

  const [materialId, setMaterialId] = useState<MaterialId>(DEFAULT_MATERIAL);

  // Read initial state from DOM (already set by inline script in layout.tsx)
  const [isLight, setIsLight] = useState(false);
  const [tab, setTab] = useState<"editor" | "presets" | "scale">("editor");

  useEffect(() => {
    setIsLight(document.documentElement.classList.contains("light"));
  }, []);

  function toggleTheme() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    try {
      localStorage.setItem("sg-theme", next ? "light" : "dark");
    } catch {
      /* ok */
    }
  }

  const displayShadows = React.useMemo(
    () => shadows.map(computeShadow),
    [shadows, computeShadow],
  );
  const activeShadow = displayShadows.find((s) => s.id === activeId);

  return (
    <div className="h-screen flex flex-col overflow-hidden sg-page">
      <header
        className="shrink-0 flex items-center px-4 sm:px-5 animate-fade-in"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          height: 52,
        }}
      >
        <div className="flex items-center gap-2.5 flex-1">
          <div
            className="w-6 h-6 rounded-xl flex items-center justify-center shrink-0"
            style={{ background: "var(--accent)" }}
          >
            <Layers
              size={13}
              style={{ color: "var(--bg)" }}
              strokeWidth={2.5}
            />
          </div>
          <span
            className="font-semibold text-sm"
            style={{ color: "var(--text)" }}
          >
            Layerbox
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Tab switcher */}
          <div
            className="flex items-center gap-0.5 p-0.5 rounded-xl"
            style={{
              background: "rgba(128,128,128,0.08)",
              border: "1px solid var(--border)",
            }}
          >
            {(["editor", "presets", "scale"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className="px-3 py-1.5 text-xs font-semibold rounded-xl capitalize transition-all duration-150 active:scale-95"
                style={{
                  background:
                    tab === t ? "var(--surface-raised)" : "transparent",
                  color: tab === t ? "var(--text)" : "var(--text-muted)",
                  border:
                    tab === t
                      ? "1px solid var(--border-hover)"
                      : "1px solid transparent",
                }}
              >
                {t}
              </button>
            ))}
          </div>

          {/* Light source toggle */}
          <button
            onClick={toggleLight}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
            style={{
              background: lightState.active
                ? "color-mix(in srgb, #ffdd44 15%, transparent)"
                : "rgba(128,128,128,0.08)",
              border: `1px solid ${lightState.active ? "rgba(255,220,80,0.3)" : "var(--border)"}`,
              color: lightState.active ? "#ffdd44" : "var(--text-muted)",
            }}
            aria-label="Toggle light source"
            title="Drag a light source to control shadow direction"
          >
            <Lightbulb size={14} />
          </button>

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90 hover:bg-white/5 hover:text-[var(--text)]"
            style={{
              background: "rgba(128,128,128,0.08)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </header>

      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "editor" && (
          <div className="h-full min-h-0 relative">
            {/* Full-bleed preview — lowest layer */}
            <div className="absolute inset-0">
              <ShadowPreview
                shadows={displayShadows}
                isLight={isLight}
                lightState={lightState}
                onLightChange={setLightPosition}
                materialId={materialId}
                onMaterialChange={setMaterialId}
              />
            </div>

            {/* ─── Layout 1: Layers + Controls (left) ─── */}
            <div className="absolute left-3 top-3 bottom-3 w-[270px] flex flex-col gap-2 z-10 pointer-events-none">
              {/* Layers panel */}
              <div
                className="shrink-0 pointer-events-auto animate-fade-up rounded-2xl p-3"
                style={{
                  background: "var(--surface)",
                  border: "1px solid var(--border)",
                  filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                }}
              >
                <ShadowLayerList
                  shadows={shadows}
                  activeId={activeId}
                  onSelect={setActiveId}
                  onAdd={addLayer}
                  onRemove={removeLayer}
                  onDuplicate={duplicateLayer}
                  onToggleVisibility={toggleLayerVisibility}
                  onReorder={reorderLayers}
                />
              </div>

              {/* Controls panel */}
              {activeShadow && (
                <div
                  className="flex-1 min-h-[180px] pointer-events-auto animate-fade-up stagger-1"
                  style={{
                    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                  }}
                >
                  <div
                    className="h-full rounded-2xl p-3 pb-2 flex flex-col gap-1 overflow-y-auto"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                    }}
                  >
                    <div className="flex items-center justify-between mb-1 px-1 shrink-0">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider"
                        style={{ color: "var(--text-faint)" }}
                      >
                        Layer Controls
                      </span>
                      <span
                        className="text-[10px] font-mono"
                        style={{ color: "var(--text-faint)" }}
                      >
                        Layer{" "}
                        {displayShadows.findIndex((s) => s.id === activeId) + 1}
                      </span>
                    </div>
                    <ShadowLayerControls
                      key={activeShadow.id}
                      shadow={activeShadow}
                      onChange={(patch) => updateLayer(activeShadow.id, patch)}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* ─── Panel C: Properties / Tools (right) ─── */}
            <div
              className="absolute right-3 top-3 bottom-3 w-[270px] z-10 animate-fade-up overflow-y-auto pointer-events-auto"
              style={{
                scrollbarWidth: "thin",
                scrollbarColor: "rgba(255,255,255,0.08) transparent",
              }}
            >
              <div className="flex flex-col gap-2">
                <div
                  style={{
                    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                  }}
                >
                  <NaturalLanguageInput onApply={loadPreset} />
                </div>
                <div
                  style={{
                    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                  }}
                >
                  <DepthMeter onApply={loadPreset} />
                </div>
                <div
                  style={{
                    filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                  }}
                >
                  <ShadowDNA shadows={shadows} onLoadDNA={loadPreset} />
                </div>
                {activeShadow && (
                  <div
                    style={{
                      filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                    }}
                  >
                    <ShadowPalette
                      seed={activeShadow}
                      onSelect={(s) => {
                        updateLayer(activeShadow.id, s);
                      }}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* ─── Panel D: Code output (bottom, between left & right panels) ─── */}
            <div
              className="absolute bottom-3 left-[285px] right-[285px] h-[260px] z-10 animate-fade-up rounded-2xl overflow-hidden pointer-events-auto"
              style={{
                filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                borderTop: "1px solid var(--border)",
              }}
            >
              <CodeOutput shadows={displayShadows} />
            </div>
          </div>
        )}

        {tab === "scale" && (
          <div className="h-full overflow-y-auto p-4 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <ShadowScale isLight={isLight} />
            </div>
          </div>
        )}

        {tab === "presets" && (
          <div className="h-full overflow-y-auto p-4 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <div className="mb-5">
                <h2
                  className="text-xl mb-1"
                  style={{
                    color: "var(--text)",
                  }}
                >
                  Shadow Presets
                </h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Click any preset to load it into the editor.
                </p>
              </div>
              <PresetsGallery
                onLoad={(preset) => {
                  loadPreset(preset);
                  setTab("editor");
                }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
