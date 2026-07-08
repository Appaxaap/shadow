"use client";

import { Play, Pause, RotateCcw } from "lucide-react";
import { useCallback, useRef, useState } from "react";
import type { Shadow } from "../../lib/types";
import { shadowsToCssValue } from "../../lib/shadowUtils";

type Props = {
  shadows: Shadow[];
  onApply: (shadows: Shadow[]) => void;
};

const DEFAULT_B_SHADOW: Shadow = {
  id: "morph-b",
  x: 0,
  y: 20,
  blur: 50,
  spread: 0,
  opacity: 0.25,
  color: "#000000",
  inset: false,
  visible: true,
};

export function ShadowMorph({ shadows, onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [bShadow, setBShadow] = useState<Shadow>(DEFAULT_B_SHADOW);
  const [duration, setDuration] = useState(0.3);
  const [playing, setPlaying] = useState(false);
  const [atB, setAtB] = useState(false);
  const [codeMode, setCodeMode] = useState<"transition" | "keyframes">(
    "transition",
  );
  const [animationIterations, setAnimationIterations] = useState("infinite");
  const [animationEasing, setAnimationEasing] = useState(
    "cubic-bezier(0.16, 1, 0.3, 1)",
  );
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Capture the current State A as a baseline
  const stateARef = useRef(shadows);
  stateARef.current = shadows;

  const handlePlay = useCallback(() => {
    if (playing) {
      // Stop
      if (intervalRef.current) clearInterval(intervalRef.current);
      setPlaying(false);
      // Restore State A
      onApply(stateARef.current);
      setAtB(false);
      return;
    }

    // Start morphing between A and B
    setPlaying(true);
    const a = stateARef.current;
    const b = a.map((s) => ({
      ...s,
      x: bShadow.x,
      y: bShadow.y,
      blur: bShadow.blur,
      spread: bShadow.spread,
      opacity: bShadow.opacity,
      color: bShadow.color,
    }));

    // Apply B
    onApply(b);
    setAtB(true);

    // Auto-restore to A after transition duration
    intervalRef.current = setTimeout(() => {
      onApply(stateARef.current);
      setAtB(false);
      setPlaying(false);
      intervalRef.current = null;
    }, duration * 1000);
  }, [playing, bShadow, duration, onApply]);

  // Cleanup on unmount
  const cleanup = useCallback(() => {
    if (intervalRef.current) {
      clearTimeout(intervalRef.current);
      intervalRef.current = null;
    }
    setPlaying(false);
    setAtB(false);
  }, []);

  const bValue = shadowsToCssValue([
    {
      ...(shadows[0] || DEFAULT_B_SHADOW),
      x: bShadow.x,
      y: bShadow.y,
      blur: bShadow.blur,
      spread: bShadow.spread,
      opacity: bShadow.opacity,
      color: bShadow.color,
    },
  ]);

  const transitionCss = `/* Morph transition */
.preview-element {
  box-shadow: ${shadowsToCssValue(shadows)};
  transition: box-shadow ${duration}s ${animationEasing};
}

.preview-element:hover {
  box-shadow: ${bValue};
}`;

  const keyframesCss = `/* Shadow keyframe animation */
@keyframes shadow-morph {
  0%, 100% {
    box-shadow: ${shadowsToCssValue(shadows)};
    transform: scale(1);
  }
  50% {
    box-shadow: ${bValue};
    transform: scale(1.03);
  }
}

.preview-element {
  animation: shadow-morph ${duration}s ${animationEasing} ${animationIterations};
}`;

  const cssCode = codeMode === "transition" ? transitionCss : keyframesCss;

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
        onClick={() => {
          if (!open) cleanup();
          setOpen(!open);
        }}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-2">
          <Play size={13} />
          <span>Shadow Morph</span>
        </div>
        <span
          className="text-xs transition-transform"
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
          {/* Mini A → B preview */}
          <div className="flex items-center gap-2 pt-2.5">
            {/* State A */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-12 rounded-lg flex items-center justify-center"
                style={{ background: "#1a2828" }}
              >
                <div
                  className="w-6 h-6 rounded-md bg-white"
                  style={{
                    boxShadow: shadowsToCssValue(
                      stateARef.current.filter((s) => s.visible !== false),
                    ),
                  }}
                />
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                A (current)
              </span>
            </div>

            {/* Arrow */}
            <span
              className="text-xs font-bold shrink-0"
              style={{ color: "var(--text-faint)" }}
            >
              →
            </span>

            {/* State B */}
            <div className="flex-1 flex flex-col items-center gap-1">
              <div
                className="w-full h-12 rounded-lg flex items-center justify-center"
                style={{ background: "#1a2828" }}
              >
                <div
                  className="w-6 h-6 rounded-md bg-white"
                  style={{
                    boxShadow: `${bShadow.x}px ${bShadow.y}px ${bShadow.blur}px ${bShadow.spread}px rgba(0,0,0,${bShadow.opacity})`,
                  }}
                />
              </div>
              <span
                className="text-[11px] font-medium"
                style={{ color: "var(--accent)" }}
              >
                B (target)
              </span>
            </div>
          </div>

          {/* State B controls */}
          <div className="flex flex-col gap-2">
            {/* X, Y row */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  className="text-[11px] font-medium"
                  style={{ color: "var(--text-faint)" }}
                >
                  X
                </label>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={bShadow.x}
                  onChange={(e) =>
                    setBShadow((p) => ({ ...p, x: Number(e.target.value) }))
                  }
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-raised)",
                    accentColor: "var(--accent)",
                  }}
                />
              </div>
              <div className="flex-1">
                <label
                  className="text-[11px] font-medium"
                  style={{ color: "var(--text-faint)" }}
                >
                  Y
                </label>
                <input
                  type="range"
                  min={-50}
                  max={50}
                  value={bShadow.y}
                  onChange={(e) =>
                    setBShadow((p) => ({ ...p, y: Number(e.target.value) }))
                  }
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-raised)",
                    accentColor: "var(--accent)",
                  }}
                />
              </div>
            </div>

            {/* Blur, Opacity row */}
            <div className="flex gap-2">
              <div className="flex-1">
                <label
                  className="text-[11px] font-medium"
                  style={{ color: "var(--text-faint)" }}
                >
                  Blur
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={bShadow.blur}
                  onChange={(e) =>
                    setBShadow((p) => ({
                      ...p,
                      blur: Number(e.target.value),
                    }))
                  }
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-raised)",
                    accentColor: "var(--accent)",
                  }}
                />
              </div>
              <div className="flex-1">
                <label
                  className="text-[11px] font-medium"
                  style={{ color: "var(--text-faint)" }}
                >
                  Opacity
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={Math.round(bShadow.opacity * 100)}
                  onChange={(e) =>
                    setBShadow((p) => ({
                      ...p,
                      opacity: Number(e.target.value) / 100,
                    }))
                  }
                  className="w-full h-1 rounded-full appearance-none cursor-pointer"
                  style={{
                    background: "var(--surface-raised)",
                    accentColor: "var(--accent)",
                  }}
                />
              </div>
            </div>
          </div>

          {/* Play / Duration row */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePlay}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: playing
                  ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                  : "var(--accent)",
                color: playing ? "var(--accent)" : "var(--bg)",
                border: `1px solid ${playing ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--accent)"}`,
              }}
            >
              {playing ? (
                <>
                  <Pause size={11} /> Stop
                </>
              ) : (
                <>
                  <Play size={11} /> Play
                </>
              )}
            </button>

            {!playing && (
              <button
                onClick={() => {
                  onApply(stateARef.current);
                  setAtB(false);
                }}
                className="flex items-center gap-1 px-2 py-1.5 text-xs font-semibold rounded-xl transition-all active:scale-95"
                style={{
                  background: "rgba(128,128,128,0.08)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border)",
                }}
              >
                <RotateCcw size={11} /> Reset
              </button>
            )}

            <div className="flex items-center gap-1.5 ml-auto">
              <label
                className="text-xs font-medium"
                style={{ color: "var(--text-faint)" }}
              >
                {duration.toFixed(1)}s
              </label>
              <input
                type="range"
                min={0.1}
                max={2}
                step={0.1}
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-14 h-1 rounded-full appearance-none cursor-pointer"
                style={{
                  background: "var(--surface-raised)",
                  accentColor: "var(--accent)",
                }}
              />
            </div>
          </div>

          {/* Code mode toggle */}
          <div
            className="flex items-center gap-1 p-0.5 rounded-xl"
            style={{
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <button
              onClick={() => setCodeMode("transition")}
              className="flex-1 px-2 py-1 text-xs font-semibold rounded-lg transition-all active:scale-95"
              style={{
                background:
                  codeMode === "transition" ? "var(--surface)" : "transparent",
                color:
                  codeMode === "transition"
                    ? "var(--text)"
                    : "var(--text-muted)",
                border:
                  codeMode === "transition"
                    ? "1px solid var(--border-hover)"
                    : "1px solid transparent",
              }}
            >
              Transition CSS
            </button>
            <button
              onClick={() => setCodeMode("keyframes")}
              className="flex-1 px-2 py-1 text-xs font-semibold rounded-lg transition-all active:scale-95"
              style={{
                background:
                  codeMode === "keyframes" ? "var(--surface)" : "transparent",
                color:
                  codeMode === "keyframes"
                    ? "var(--text)"
                    : "var(--text-muted)",
                border:
                  codeMode === "keyframes"
                    ? "1px solid var(--border-hover)"
                    : "1px solid transparent",
              }}
            >
              @keyframes
            </button>
          </div>

          {/* Animation options (keyframes mode only) */}
          {codeMode === "keyframes" && (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--text-faint)" }}
                >
                  Loop
                </label>
                <select
                  value={animationIterations}
                  onChange={(e) => setAnimationIterations(e.target.value)}
                  className="text-xs font-mono rounded-lg px-2 py-1 outline-none"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <option value="infinite">∞</option>
                  <option value="1">1x</option>
                  <option value="2">2x</option>
                  <option value="3">3x</option>
                  <option value="5">5x</option>
                </select>
              </div>
              <div className="flex items-center gap-1.5">
                <label
                  className="text-xs font-medium"
                  style={{ color: "var(--text-faint)" }}
                >
                  Easing
                </label>
                <select
                  value={animationEasing}
                  onChange={(e) => setAnimationEasing(e.target.value)}
                  className="text-xs font-mono rounded-lg px-2 py-1 outline-none max-w-[120px]"
                  style={{
                    background: "var(--surface-raised)",
                    border: "1px solid var(--border)",
                    color: "var(--text)",
                  }}
                >
                  <option value="cubic-bezier(0.16, 1, 0.3, 1)">
                    Ease-out
                  </option>
                  <option value="ease-in-out">Ease-in-out</option>
                  <option value="ease-in">Ease-in</option>
                  <option value="ease-out">Ease-out</option>
                  <option value="linear">Linear</option>
                </select>
              </div>
            </div>
          )}

          {/* Code output */}
          <div
            className="rounded-xl p-2.5 text-[10px] font-mono leading-relaxed whitespace-pre select-all"
            style={{
              background: "var(--surface-code)",
              border: "1px solid var(--border)",
              color: "var(--text-muted)",
              maxHeight: 120,
              overflow: "auto",
            }}
          >
            {cssCode}
          </div>
        </div>
      )}
    </div>
  );
}
