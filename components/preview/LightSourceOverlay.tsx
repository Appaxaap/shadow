"use client";

import { useCallback, useRef } from "react";
import type { LightState } from "../../lib/lightSource";
import { lightAngle } from "../../lib/lightSource";

type Props = {
  lightState: LightState;
  onChange: (lx: number, ly: number) => void;
};

/**
 * Draggable light orb rendered as an overlay on the preview canvas.
 * The user drags the orb to set the light direction.
 * Shows a subtle glow trail and an angle readout.
 */
export function LightSourceOverlay({ lightState, onChange }: Props) {
  const dragging = useRef(false);

  const handlePointerDown = useCallback(() => {
    dragging.current = true;
  }, []);

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!dragging.current) return;
      const rect = e.currentTarget.getBoundingClientRect();
      // Map pointer position to -1..1 range
      const lx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const ly = ((e.clientY - rect.top) / rect.height) * 2 - 1;
      onChange(Math.max(-1, Math.min(1, lx)), Math.max(-1, Math.min(1, ly)));
    },
    [onChange],
  );

  const handlePointerUp = useCallback(() => {
    dragging.current = false;
  }, []);

  if (!lightState.active) return null;

  // Map light position (-1..1) to percentage position in the container
  const px = ((lightState.lx + 1) / 2) * 100;
  const py = ((lightState.ly + 1) / 2) * 100;
  const angle = lightAngle(lightState.lx, lightState.ly);

  return (
    <div
      className="absolute inset-0 z-20 cursor-crosshair select-none touch-none"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerLeave={handlePointerUp}
      style={{ touchAction: "none" }}
    >
      {/* Light ray lines — subtle indicators from light to centre */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <line
          x1={`${px}%`}
          y1={`${py}%`}
          x2="50%"
          y2="50%"
          stroke="rgba(255,230,100,0.12)"
          strokeWidth="2"
          strokeDasharray="4 6"
        />
      </svg>

      {/* The light orb */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{ left: `${px}%`, top: `${py}%` }}
      >
        {/* Glow */}
        <div
          className="rounded-full"
          style={{
            width: 64,
            height: 64,
            background:
              "radial-gradient(circle, rgba(255,240,150,0.25) 0%, transparent 70%)",
            position: "absolute",
            top: -32,
            left: -32,
          }}
        />
        {/* Core */}
        <div
          className="rounded-full"
          style={{
            width: 20,
            height: 20,
            background: "radial-gradient(circle at 35% 35%, #ffee88, #ffcc33)",
            boxShadow: "0 0 24px rgba(255,220,80,0.5)",
            position: "absolute",
            top: -10,
            left: -10,
          }}
        />
        {/* Angle badge */}
        <div
          className="absolute rounded-md px-1.5 py-0.5 text-xs font-mono font-semibold whitespace-nowrap pointer-events-none"
          style={{
            background: "rgba(0,0,0,0.7)",
            color: "#ffdd66",
            border: "1px solid rgba(255,220,80,0.25)",
            left: 16,
            top: -20,
          }}
        >
          {Math.round(angle)}°
        </div>
      </div>
    </div>
  );
}
