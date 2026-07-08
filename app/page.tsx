"use client";

import {
  Layers,
  Lightbulb,
  Moon,
  Sun,
  PanelLeftClose,
  PanelLeft,
  Undo2,
  Redo2,
  Sliders,
  Code2,
  Wrench,
  X,
} from "lucide-react";
import React, { useEffect, useState, useCallback } from "react";
import { CodeOutput } from "../components/code/CodeOutput";
import { PresetsGallery } from "../components/controls/PresetsGallery";
import { ShadowLayerControls } from "../components/controls/ShadowLayerControls";
import { ShadowLayerList } from "../components/controls/ShadowLayerList";
import { DepthMeter } from "../components/controls/DepthMeter";
import { GradientShadow } from "../components/controls/GradientShadow";
import { ShadowDNA } from "../components/code/ShadowDNA";
import { FocusRingGenerator } from "../components/controls/FocusRingGenerator";
import { ShadowPalette } from "../components/controls/ShadowPalette";
import { ShadowMorph } from "../components/controls/ShadowMorph";
import { NaturalLanguageInput } from "../components/controls/NaturalLanguageInput";
import { ShadowPreview } from "../components/preview/ShadowPreview";
import { useShadowState } from "../hooks/useShadowState";
import { ShadowScale } from "../components/scale/ShadowScale";
import { ShadowInspector } from "../components/controls/ShadowInspector";
import { DEFAULT_MATERIAL, type MaterialId } from "../lib/materials";

type MobileTab = "layers" | "controls" | "tools" | "code" | null;

function useMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    function check() {
      setMobile(window.innerWidth < 768);
    }
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return mobile;
}

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
    undo,
    redo,
    canUndo,
    canRedo,
  } = useShadowState();

  const [materialId, setMaterialId] = useState<MaterialId>(DEFAULT_MATERIAL);
  const [isLight, setIsLight] = useState(false);
  const [tab, setTab] = useState<"editor" | "presets" | "scale">("editor");
  const [showPanels, setShowPanels] = useState(true);
  const [bgId, setBgId] = useState("light");
  const [mobileTab, setMobileTab] = useState<MobileTab>(null);
  const mobile = useMobile();

  const bgMap: Record<string, string> = {
    light: "#F0F3F2",
    white: "#ffffff",
    dark: "#0e1a1a",
    black: "#000000",
    "warm-gray": "#F5F0EB",
    "cool-gray": "#E8EDF2",
    "gradient-sunset": "linear-gradient(135deg, #f093fb, #f5576c)",
    "gradient-ocean": "linear-gradient(135deg, #4facfe, #00f2fe)",
    "gradient-forest": "linear-gradient(135deg, #11998e, #38ef7d)",
  };
  const previewBg = bgMap[bgId] || bgMap.light;

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      const isCtrl = e.ctrlKey || e.metaKey;
      if (isCtrl && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
      }
      if (isCtrl && e.key === "z" && e.shiftKey) {
        e.preventDefault();
        redo();
      }
      if (isCtrl && e.key === "y") {
        e.preventDefault();
        redo();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [undo, redo]);

  useEffect(() => {
    const light = document.documentElement.classList.contains("light");
    setIsLight(light);
    setBgId(light ? "light" : "dark");
  }, []);

  function toggleTheme() {
    const next = !isLight;
    setIsLight(next);
    document.documentElement.classList.toggle("light", next);
    setBgId(next ? "light" : "dark");
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

  const closeMobileTab = useCallback(() => setMobileTab(null), []);

  return (
    <div className="h-screen flex flex-col overflow-hidden sg-page">
      {/* ─── HEADER ─── */}
      <header
        className="shrink-0 flex items-center px-3 sm:px-5 animate-fade-in"
        style={{
          borderBottom: "1px solid var(--border)",
          background: "var(--header-bg)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          height: mobile ? 48 : 52,
        }}
      >
        <div className="flex items-center gap-2 flex-1 min-w-0">
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
            className="font-semibold text-sm truncate"
            style={{ color: "var(--text)" }}
          >
            Layerbox
          </span>
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Tab switcher - hidden on mobile */}
          {!mobile && (
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
          )}

          {/* Undo / Redo */}
          <div className="flex items-center gap-0.5">
            <button
              onClick={undo}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
              style={{
                background: "rgba(128,128,128,0.08)",
                border: "1px solid var(--border)",
                color: canUndo ? "var(--text-muted)" : "var(--text-faint)",
                opacity: canUndo ? 1 : 0.4,
                cursor: canUndo ? "pointer" : "default",
              }}
              aria-label="Undo"
              title="Undo (Ctrl+Z)"
            >
              <Undo2 size={mobile ? 11 : 13} />
            </button>
            <button
              onClick={redo}
              className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
              style={{
                background: "rgba(128,128,128,0.08)",
                border: "1px solid var(--border)",
                color: canRedo ? "var(--text-muted)" : "var(--text-faint)",
                opacity: canRedo ? 1 : 0.4,
                cursor: canRedo ? "pointer" : "default",
              }}
              aria-label="Redo"
              title="Redo (Ctrl+Shift+Z)"
            >
              <Redo2 size={mobile ? 11 : 13} />
            </button>
          </div>

          {/* Light source toggle */}
          <button
            onClick={toggleLight}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
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
            <Lightbulb size={mobile ? 12 : 14} />
          </button>

          {/* Toggle panels - desktop only */}
          {!mobile && (
            <button
              onClick={() => setShowPanels((v) => !v)}
              className="w-8 h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
              style={{
                background: showPanels
                  ? "rgba(128,128,128,0.08)"
                  : "color-mix(in srgb, var(--accent) 12%, transparent)",
                border: `1px solid ${showPanels ? "var(--border)" : "color-mix(in srgb, var(--accent) 25%, transparent)"}`,
                color: showPanels ? "var(--text-muted)" : "var(--accent)",
              }}
              aria-label={showPanels ? "Hide all panels" : "Show all panels"}
              title="Toggle all panels"
            >
              {showPanels ? (
                <PanelLeftClose size={14} />
              ) : (
                <PanelLeft size={14} />
              )}
            </button>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded-xl transition-all duration-150 active:scale-90"
            style={{
              background: "rgba(128,128,128,0.08)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
            aria-label="Toggle theme"
          >
            {isLight ? (
              <Moon size={mobile ? 12 : 14} />
            ) : (
              <Sun size={mobile ? 12 : 14} />
            )}
          </button>
        </div>
      </header>

      {/* ─── MAIN CONTENT ─── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {tab === "editor" && (
          <div className="h-full min-h-0 relative">
            {/* Full-bleed preview canvas */}
            <div className="absolute inset-0">
              <ShadowPreview
                shadows={displayShadows}
                isLight={isLight}
                lightState={lightState}
                onLightChange={setLightPosition}
                materialId={materialId}
                onMaterialChange={setMaterialId}
                panUnbounded={!showPanels}
                previewBg={previewBg}
                bgId={bgId}
                onBgChange={setBgId}
              />
            </div>

            {/* ─── DESKTOP LAYOUT ─── */}
            {!mobile && (
              <>
                {/* Left panel: Layers + Controls */}
                {showPanels && (
                  <div className="absolute left-3 top-3 bottom-3 w-[270px] flex flex-col gap-2 z-10 pointer-events-none">
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
                              {displayShadows.findIndex(
                                (s) => s.id === activeId,
                              ) + 1}
                            </span>
                          </div>
                          <ShadowLayerControls
                            key={activeShadow.id}
                            shadow={activeShadow}
                            onChange={(patch) =>
                              updateLayer(activeShadow.id, patch)
                            }
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Right panel: Tools */}
                {showPanels && (
                  <div
                    className="absolute right-3 top-3 bottom-3 w-[270px] z-10 animate-fade-up pointer-events-auto rounded-2xl overflow-hidden"
                    style={{
                      background: "var(--surface)",
                      border: "1px solid var(--border)",
                      filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                    }}
                  >
                    <div
                      className="flex flex-col gap-2 p-3 h-full overflow-y-auto"
                      style={{
                        scrollbarWidth: "thin",
                        scrollbarColor: "rgba(255,255,255,0.08) transparent",
                      }}
                    >
                      <ShadowInspector shadows={displayShadows} />
                      <NaturalLanguageInput onApply={loadPreset} />
                      <ShadowMorph shadows={shadows} onApply={loadPreset} />
                      <DepthMeter onApply={loadPreset} />
                      <GradientShadow onApply={loadPreset} />
                      <ShadowDNA shadows={shadows} onLoadDNA={loadPreset} />
                      <FocusRingGenerator activeShadow={activeShadow ?? null} />
                      {activeShadow && (
                        <ShadowPalette
                          seed={activeShadow}
                          onSelect={(s) => updateLayer(activeShadow.id, s)}
                        />
                      )}
                      <div className="flex-1" />
                    </div>
                  </div>
                )}

                {/* Code panel: bottom center */}
                {showPanels && (
                  <div
                    className="absolute bottom-3 left-[300px] right-[300px] h-[360px] z-10 animate-fade-up rounded-2xl overflow-hidden pointer-events-auto"
                    style={{
                      background: "var(--surface-code)",
                      border: "1px solid var(--border)",
                      filter: "drop-shadow(0 8px 32px rgba(0,0,0,0.35))",
                    }}
                  >
                    <CodeOutput shadows={displayShadows} />
                  </div>
                )}
              </>
            )}
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
                <h2 className="text-xl mb-1" style={{ color: "var(--text)" }}>
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

        {/* ─── MOBILE BOTTOM TABS ─── */}
        {mobile && (
          <>
            {/* Bottom tab bar */}
            <div
              className="absolute bottom-0 left-0 right-0 z-20 flex items-center"
              style={{
                background: "var(--surface)",
                borderTop: "1px solid var(--border)",
                backdropFilter: "blur(12px)",
                WebkitBackdropFilter: "blur(12px)",
              }}
            >
              {[
                { id: "layers" as const, icon: Layers, label: "Layers" },
                { id: "controls" as const, icon: Sliders, label: "Controls" },
                { id: "tools" as const, icon: Wrench, label: "Tools" },
                { id: "code" as const, icon: Code2, label: "Code" },
              ].map(({ id, icon: Icon, label }) => {
                const isActive = mobileTab === id;
                return (
                  <button
                    key={id}
                    onClick={() => setMobileTab(isActive ? null : id)}
                    className="flex-1 flex flex-col items-center gap-0.5 py-2 transition-all duration-150 active:scale-95"
                    style={{
                      color: isActive ? "var(--accent)" : "var(--text-muted)",
                    }}
                  >
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className="text-[10px] font-semibold">{label}</span>
                  </button>
                );
              })}

              {/* Presets & Scale quick buttons */}
              <div className="flex flex-col gap-0.5 items-center py-2 px-1">
                <button
                  onClick={() => setTab("presets")}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                  style={{
                    background:
                      tab === "presets"
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : "transparent",
                    color:
                      tab === "presets" ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  Presets
                </button>
                <button
                  onClick={() => setTab("scale")}
                  className="text-[10px] font-semibold px-2 py-1 rounded-lg"
                  style={{
                    background:
                      tab === "scale"
                        ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                        : "transparent",
                    color:
                      tab === "scale" ? "var(--accent)" : "var(--text-muted)",
                  }}
                >
                  Scale
                </button>
              </div>
            </div>

            {/* Mobile tab panel overlay */}
            {mobileTab && (
              <div
                className="absolute left-0 right-0 z-30 animate-fade-up pointer-events-auto"
                style={{
                  bottom: 52,
                  maxHeight: "55vh",
                  background: "var(--surface)",
                  borderTop: "1px solid var(--border)",
                  borderRadius: "16px 16px 0 0",
                  overflow: "hidden",
                }}
              >
                {/* Drag handle + close */}
                <div className="flex items-center justify-between px-4 pt-2.5 pb-1.5 shrink-0">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-8 h-1 rounded-full"
                      style={{ background: "var(--text-faint)" }}
                    />
                    <span
                      className="text-xs font-semibold capitalize"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {mobileTab}
                    </span>
                  </div>
                  <button
                    onClick={closeMobileTab}
                    className="w-7 h-7 flex items-center justify-center rounded-xl"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <X size={14} />
                  </button>
                </div>

                {/* Scrollable content */}
                <div
                  className="overflow-y-auto px-3 pb-4"
                  style={{ maxHeight: "calc(55vh - 40px)" }}
                >
                  {mobileTab === "layers" && (
                    <div className="flex flex-col gap-2">
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
                  )}

                  {mobileTab === "controls" && activeShadow && (
                    <div>
                      <div className="flex items-center justify-between mb-2 px-1">
                        <span
                          className="text-xs font-semibold"
                          style={{ color: "var(--text-muted)" }}
                        >
                          Layer{" "}
                          {displayShadows.findIndex((s) => s.id === activeId) +
                            1}
                        </span>
                      </div>
                      <ShadowLayerControls
                        key={activeShadow.id}
                        shadow={activeShadow}
                        onChange={(patch) =>
                          updateLayer(activeShadow.id, patch)
                        }
                      />
                    </div>
                  )}

                  {mobileTab === "tools" && (
                    <div className="flex flex-col gap-2">
                      <ShadowInspector shadows={displayShadows} />
                      <NaturalLanguageInput onApply={loadPreset} />
                      <ShadowMorph shadows={shadows} onApply={loadPreset} />
                      <DepthMeter onApply={loadPreset} />
                      <GradientShadow onApply={loadPreset} />
                      <ShadowDNA shadows={shadows} onLoadDNA={loadPreset} />
                      <FocusRingGenerator activeShadow={activeShadow ?? null} />
                      {activeShadow && (
                        <ShadowPalette
                          seed={activeShadow}
                          onSelect={(s) => updateLayer(activeShadow.id, s)}
                        />
                      )}
                    </div>
                  )}

                  {mobileTab === "code" && (
                    <div className="h-[280px] sm:h-[320px]">
                      <CodeOutput shadows={displayShadows} />
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
