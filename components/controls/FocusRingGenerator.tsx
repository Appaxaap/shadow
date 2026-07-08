"use client";

import { Check, Copy, Eye } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import type { Shadow } from "../../lib/types";

type Props = {
  activeShadow: Shadow | null;
};

/**
 * Generate a WCAG-compliant focus ring based on a shadow's color.
 * Uses a two-layer box-shadow:
 *   - outer ring: the accent color (from the shadow)
 *   - inner ring: white/background to create contrast
 */
function generateFocusRing(shadow: Shadow | null): {
  css: string;
  ringColor: string;
} {
  const baseColor = shadow?.color ?? "#5e9e88";
  // Darken the base color slightly for the ring
  const r = parseInt(baseColor.slice(1, 3), 16);
  const g = parseInt(baseColor.slice(3, 5), 16);
  const b = parseInt(baseColor.slice(5, 7), 16);
  const ringColor = `rgba(${r},${g},${b},0.6)`;

  const css = `/* Focus ring — accessible + on-brand */
*:focus-visible {
  outline: none;
  box-shadow:
    0 0 0 3px var(--bg),
    0 0 0 5px ${ringColor};
  transition: box-shadow 0.15s ease;
}`;

  return { css, ringColor };
}

export function FocusRingGenerator({ activeShadow }: Props) {
  const [copied, setCopied] = useState(false);
  const [showPreview, setShowPreview] = useState(false);

  const { css, ringColor } = useMemo(
    () => generateFocusRing(activeShadow),
    [activeShadow],
  );

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(css);
    } catch {
      const el = document.createElement("textarea");
      el.value = css;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [css]);

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2.5">
        <div className="flex items-center gap-2">
          <Eye size={13} />
          <span
            className="text-xs font-semibold"
            style={{ color: "var(--text-muted)" }}
          >
            Focus Ring
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {/* Preview toggle */}
          <button
            onClick={() => setShowPreview(!showPreview)}
            className="px-2 py-1 text-xs font-semibold rounded-md transition-all active:scale-95"
            style={{
              background: showPreview
                ? "color-mix(in srgb, var(--accent) 12%, transparent)"
                : "rgba(128,128,128,0.08)",
              color: showPreview ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${
                showPreview
                  ? "color-mix(in srgb, var(--accent) 25%, transparent)"
                  : "var(--border)"
              }`,
            }}
          >
            Preview
          </button>

          {/* Copy */}
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 px-2 py-1 text-xs font-semibold rounded-md transition-all active:scale-95"
            style={{
              background: copied
                ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                : "rgba(128,128,128,0.08)",
              color: copied ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${
                copied
                  ? "color-mix(in srgb, var(--accent) 30%, transparent)"
                  : "var(--border)"
              }`,
            }}
          >
            {copied ? (
              <>
                <Check size={10} /> Copied
              </>
            ) : (
              <>
                <Copy size={10} /> Copy
              </>
            )}
          </button>
        </div>
      </div>

      {/* Live ring preview */}
      {showPreview && (
        <div className="px-3 pb-2">
          <div
            className="w-full h-14 rounded-lg flex items-center justify-center transition-all duration-150"
            style={{
              background: "#1a2828",
              boxShadow: showPreview
                ? `0 0 0 3px #1a2828, 0 0 0 5px ${ringColor}`
                : "none",
            }}
          >
            <span
              className="text-xs font-semibold"
              style={{ color: "rgba(255,255,255,0.5)" }}
            >
              Focus me
            </span>
          </div>
        </div>
      )}

      {/* Code display */}
      <div
        className="mx-3 mb-3 rounded-xl p-2.5 text-[10px] font-mono leading-relaxed whitespace-pre select-all"
        style={{
          background: "var(--surface-code)",
          border: "1px solid var(--border)",
          color: "var(--text-muted)",
          maxHeight: 80,
          overflow: "auto",
        }}
      >
        {css}
      </div>
    </div>
  );
}
