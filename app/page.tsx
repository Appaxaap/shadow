"use client";

import { Layers, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { CodeOutput } from "../components/code/CodeOutput";
import { PresetsGallery } from "../components/controls/PresetsGallery";
import { ShadowLayerControls } from "../components/controls/ShadowLayerControls";
import { ShadowLayerList } from "../components/controls/ShadowLayerList";
import { ShadowPreview } from "../components/preview/ShadowPreview";
import { useShadowState } from "../hooks/useShadowState";
import { ShadowScale } from "../components/scale/ShadowScale";

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
    loadPreset,
    getShareUrl,
  } = useShadowState();

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

  const activeShadow = shadows.find((s) => s.id === activeId);

  return (
    <div className="h-screen flex flex-col overflow-hidden sg-page">
      {/* ── Header ── */}
      <header
        className="shrink-0 h-13 flex items-center px-4 sm:px-5 animate-fade-in"
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
            className="w-6 h-6 rounded-lg flex items-center justify-center shrink-0"
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
            Shadow Studio
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
                className="px-3 py-1.5 text-xs font-semibold rounded-lg capitalize transition-all duration-150 active:scale-95"
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

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 flex items-center justify-center rounded-lg transition-all duration-150 active:scale-90 hover:bg-white/5 hover:text-[var(--text)]"
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

      {/* ── Content ── */}
      <div className="flex-1 min-h-0 overflow-hidden">
        {/* ── EDITOR TAB ── */}
        {tab === "editor" && (
          <div className="h-full min-h-0 flex flex-col lg:flex-row">
            {/* Left sidebar */}
            <div
              className="w-full lg:w-[320px] xl:w-[340px] lg:shrink-0 flex flex-col overflow-y-auto animate-fade-up"
              style={{
                borderRight: "1px solid var(--border)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              {/* Layers section */}
              <div className="p-4">
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

              {/* Divider */}
              <div
                style={{
                  height: 1,
                  background: "var(--border)",
                  flexShrink: 0,
                }}
              ></div>

              {/* Controls section */}
              {activeShadow && (
                <div className="p-4 flex-1">
                  <p
                    className="text-[11px] font-semibold tracking-[0.08em] uppercase mb-4"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Layer Controls
                  </p>
                  <ShadowLayerControls
                    key={activeShadow.id}
                    shadow={activeShadow}
                    onChange={(patch) => updateLayer(activeShadow.id, patch)}
                  />
                </div>
              )}

              {/* Copyright */}
              <div
                className="mt-auto px-4 py-3"
                style={{ borderTop: "1px solid var(--border)" }}
              >
                <p
                  className="text-[11px]"
                  style={{ color: "var(--text-faint)" }}
                >
                  © {new Date().getFullYear()} Codecx. All rights reserved.
                </p>
              </div>
            </div>

            {/* Center preview */}
            <div className="flex-1 min-w-0 min-h-[320px] lg:min-h-0">
              <ShadowPreview shadows={shadows} isLight={isLight} />
            </div>

            {/* Right code generator */}
            <div
              className="w-full lg:w-[430px] xl:w-[470px] shrink-0 min-h-[260px] lg:min-h-0 animate-fade-up stagger-3 border-t lg:border-t-0 lg:border-l"
              style={{ borderColor: "var(--border)" }}
            >
              <div className="h-full">
                <CodeOutput
                  shadows={shadows}
                  getShareUrl={getShareUrl}
                  panelMode
                />
              </div>
            </div>
          </div>
        )}

        {/* ── SCALE TAB ── */}
        {tab === "scale" && (
          <div className="h-full overflow-y-auto p-4 animate-fade-up">
            <div className="max-w-5xl mx-auto">
              <ShadowScale isLight={isLight} />
            </div>
          </div>
        )}

        {/* ── PRESETS TAB ── */}
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
