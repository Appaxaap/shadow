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
      {/* ─── Header ─── */}
      <header
        className="shrink-0 flex items-center px-6"
        style={{
          height: 48,
          background: "var(--surface-raised)",
        }}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <Layers
            size={15}
            strokeWidth={1.5}
            style={{ color: "var(--text-muted)" }}
          />
          <span
            className="text-sm font-medium"
            style={{ color: "var(--text)" }}
          >
            Shadow Studio
          </span>
        </div>

        <div className="flex items-center gap-5">
          {(["editor", "presets", "scale"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="text-xs"
              style={{
                fontWeight: tab === t ? 500 : 400,
                color: tab === t ? "var(--text)" : "var(--text-muted)",
                background: "none",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
                transition: "color 0.2s ease",
              }}
            >
              {t === "editor"
                ? "Editor"
                : t === "presets"
                  ? "Presets"
                  : "Scale"}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-end flex-1">
          <button
            onClick={toggleTheme}
            style={{
              background: "none",
              border: "none",
              color: "var(--text-muted)",
              cursor: "pointer",
              padding: 4,
              transition: "color 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
            onMouseLeave={(e) =>
              (e.currentTarget.style.color = "var(--text-muted)")
            }
            aria-label="Toggle theme"
          >
            {isLight ? <Moon size={14} /> : <Sun size={14} />}
          </button>
        </div>
      </header>

      {/* ─── Workspace ─── */}
      <div
        className="flex-1 min-h-0 overflow-hidden"
        style={{ background: "var(--bg)" }}
      >
        {tab === "editor" && (
          <div className="h-full flex">
            {/* Left sidebar — Layers + Properties */}
            <div
              className="w-[280px] shrink-0 flex flex-col overflow-y-auto"
              style={{ background: "var(--surface)" }}
            >
              <div className="px-5 pt-6 pb-3">
                <p className="sg-caption" style={{ marginBottom: 16 }}>
                  Layers
                </p>
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
                <div className="px-5 pb-6 pt-2">
                  <p className="sg-caption" style={{ marginBottom: 16 }}>
                    Properties
                  </p>
                  <ShadowLayerControls
                    key={activeShadow.id}
                    shadow={activeShadow}
                    onChange={(patch) => updateLayer(activeShadow.id, patch)}
                  />
                </div>
              )}
            </div>

            {/* Center — Canvas */}
            <div className="flex-1 min-w-0">
              <ShadowPreview shadows={shadows} isLight={isLight} />
            </div>

            {/* Right — Code Inspector */}
            <div
              className="w-[400px] shrink-0 flex flex-col"
              style={{ background: "var(--surface)" }}
            >
              <div className="px-5 pt-6 pb-3">
                <p className="sg-caption">Generated Code</p>
              </div>
              <div className="flex-1 min-h-0 px-5 pb-5">
                <CodeOutput shadows={shadows} getShareUrl={getShareUrl} />
              </div>
            </div>
          </div>
        )}

        {tab === "presets" && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto px-8 py-10">
              <p className="sg-caption" style={{ marginBottom: 8 }}>
                Presets
              </p>
              <p className="sg-meta" style={{ marginBottom: 32 }}>
                Click any preset to load it into the editor.
              </p>
              <PresetsGallery
                onLoad={(preset) => {
                  loadPreset(preset);
                  setTab("editor");
                }}
              />
            </div>
          </div>
        )}

        {tab === "scale" && (
          <div className="h-full overflow-y-auto">
            <div className="max-w-5xl mx-auto px-8 py-10">
              <ShadowScale isLight={isLight} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
