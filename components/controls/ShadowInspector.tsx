"use client";

import { BarChart3 } from "lucide-react";
import { useMemo } from "react";
import type { Shadow } from "../../lib/types";
import { shadowsToCssValue } from "../../lib/shadowUtils";

type Props = {
  shadows: Shadow[];
};

function luminance(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function ShadowInspector({ shadows }: Props) {
  const stats = useMemo(() => {
    const visible = shadows.filter((s) => s.visible !== false);
    const totalCount = shadows.length;
    const visibleCount = visible.length;
    const hiddenCount = totalCount - visibleCount;

    const cssValue = shadowsToCssValue(shadows);
    const cssLength = cssValue.length;

    // Average stats
    const avgOpacity =
      visible.length > 0
        ? visible.reduce((sum, s) => sum + s.opacity, 0) / visible.length
        : 0;

    const avgBlur =
      visible.length > 0
        ? visible.reduce((sum, s) => sum + s.blur, 0) / visible.length
        : 0;

    // Total offset magnitude
    const totalOffset = visible.reduce((sum, s) => {
      return sum + Math.sqrt(s.x * s.x + s.y * s.y);
    }, 0);

    const avgOffset =
      visible.length > 0
        ? Math.round(totalOffset / visible.length)
        : 0;

    // Dominant color (average of visible shadow colors weighted by opacity)
    let rTotal = 0,
      gTotal = 0,
      bTotal = 0,
      weightTotal = 0;
    for (const s of visible) {
      const hex = s.color.replace("#", "");
      const full =
        hex.length === 3
          ? hex
              .split("")
              .map((c) => c + c)
              .join("")
          : hex;
      const r = parseInt(full.slice(0, 2), 16);
      const g = parseInt(full.slice(2, 4), 16);
      const b = parseInt(full.slice(4, 6), 16);
      const w = s.opacity;
      rTotal += r * w;
      gTotal += g * w;
      bTotal += b * w;
      weightTotal += w;
    }
    const avgR = weightTotal > 0 ? Math.round(rTotal / weightTotal) : 0;
    const avgG = weightTotal > 0 ? Math.round(gTotal / weightTotal) : 0;
    const avgB = weightTotal > 0 ? Math.round(bTotal / weightTotal) : 0;
    const dominantColor = `#${avgR.toString(16).padStart(2, "0")}${avgG.toString(16).padStart(2, "0")}${avgB.toString(16).padStart(2, "0")}`;

    // Depth score (0-100): based on avg blur + avg offset
    const rawDepth = Math.min(100, Math.round((avgBlur * 0.4 + avgOffset * 0.6) * 1.5));
    const depthScore = Math.min(100, rawDepth);

    // Luminance
    const lum = luminance(avgR, avgG, avgB);
    const contrastLevel = lum > 0.5 ? "light" : "dark";

    // Inset count
    const insetCount = visible.filter((s) => s.inset).length;

    return {
      totalCount,
      visibleCount,
      hiddenCount,
      cssLength,
      avgOpacity,
      avgBlur,
      avgOffset,
      dominantColor,
      depthScore,
      contrastLevel,
      insetCount,
      avgR,
      avgG,
      avgB,
    };
  }, [shadows]);

  const depthLabel =
    stats.depthScore < 20
      ? "Shallow"
      : stats.depthScore < 45
        ? "Moderate"
        : stats.depthScore < 70
          ? "Deep"
          : "Very Deep";

  return (
    <div
      className="rounded-2xl p-3 flex flex-col gap-2.5"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <BarChart3 size={13} />
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Inspector
          </span>
        </div>
        <span
          className="text-[10px] font-semibold px-1.5 py-0.5 rounded-md"
          style={{
            background:
              stats.depthScore > 60
                ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                : "rgba(128,128,128,0.08)",
            color:
              stats.depthScore > 60 ? "var(--accent)" : "var(--text-faint)",
          }}
        >
          {depthLabel}
        </span>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 gap-x-3 gap-y-1.5">
        {/* Layers */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            Layers
          </span>
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: "var(--text)" }}
          >
            {stats.visibleCount}
            {stats.hiddenCount > 0 && (
              <span style={{ color: "var(--text-faint)" }}>
                {" "}
                (+{stats.hiddenCount} hidden)
              </span>
            )}
          </span>
        </div>

        {/* CSS Length */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            CSS length
          </span>
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: "var(--text)" }}
          >
            {stats.cssLength} chars
          </span>
        </div>

        {/* Avg Opacity */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            Avg opacity
          </span>
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: "var(--text)" }}
          >
            {Math.round(stats.avgOpacity * 100)}%
          </span>
        </div>

        {/* Avg Blur */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            Avg blur
          </span>
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: "var(--text)" }}
          >
            {Math.round(stats.avgBlur)}px
          </span>
        </div>

        {/* Avg Offset */}
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            Avg offset
          </span>
          <span
            className="text-[11px] font-mono font-semibold"
            style={{ color: "var(--text)" }}
          >
            {stats.avgOffset}px
          </span>
        </div>

        {/* Inset count */}
        {stats.insetCount > 0 && (
          <div className="flex items-center justify-between">
            <span
              className="text-[10px] font-medium"
              style={{ color: "var(--text-faint)" }}
            >
              Inset layers
            </span>
            <span
              className="text-[11px] font-mono font-semibold"
              style={{ color: "var(--text)" }}
            >
              {stats.insetCount}
            </span>
          </div>
        )}
      </div>

      {/* Dominant color bar */}
      <div
        className="flex items-center gap-2 rounded-xl px-2.5 py-1.5"
        style={{
          background: "var(--surface-raised)",
          border: "1px solid var(--border)",
        }}
      >
        <div
          className="w-5 h-5 rounded-lg shrink-0"
          style={{
            background: stats.dominantColor,
            border: "1px solid var(--border)",
          }}
        />
        <span
          className="text-[11px] font-mono font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {stats.dominantColor.toUpperCase()}
        </span>
        <span
          className="text-[10px] ml-auto"
          style={{ color: "var(--text-faint)" }}
        >
          {stats.contrastLevel === "light" ? "Light tone" : "Dark tone"}
        </span>
      </div>

      {/* Depth meter bar */}
      <div className="flex flex-col gap-1">
        <div className="flex items-center justify-between">
          <span
            className="text-[10px] font-medium"
            style={{ color: "var(--text-faint)" }}
          >
            Depth
          </span>
          <span
            className="text-[10px] font-mono font-semibold"
            style={{ color: "var(--accent)" }}
          >
            {stats.depthScore}/100
          </span>
        </div>
        <div
          className="h-1.5 rounded-full overflow-hidden"
          style={{ background: "var(--surface-raised)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-300"
            style={{
              width: `${stats.depthScore}%`,
              background:
                stats.depthScore < 30
                  ? "var(--accent)"
                  : stats.depthScore < 60
                    ? "linear-gradient(to right, var(--accent), #d4a040)"
                    : "linear-gradient(to right, #d4a040, #c96060)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
