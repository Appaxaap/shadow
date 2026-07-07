/**
 * Depth Meter engine.
 *
 * Generates a multi-layer box-shadow from a single 0–1 depth value.
 * Higher depth = element floats higher above the surface.
 *
 * Produces 3–5 layers mimicking real-world light falloff:
 *   - Core shadow: tight, dark, close
 *   - Mid shadow: medium blur, medium offset
 *   - Ambient shadow: wide, light, far
 *   - (Deep only) Spread shadow: wide, very light
 *   - (Deep only) Contact shadow: tight, very dark, no offset
 */

import type { Shadow } from "./types";
import { genId } from "./shadowUtils";

export type DepthConfig = {
  depth: number; // 0–1
  color: string;
};

export const DEFAULT_DEPTH_COLOR = "#000000";

/**
 * Generate shadow layers from a depth value (0–1).
 * The layer count increases with depth:
 *   0–0.25 → 3 layers  (shallow)
 *   0.25–0.6 → 4 layers (medium)
 *   0.6–1 → 5 layers    (deep)
 */
export function generateDepthShadows(
  depth: number,
  color: string,
  baseOpacity: number = 0.15,
): Shadow[] {
  const clamped = Math.max(0, Math.min(1, depth));

  // Scale factors
  const yOff = clamped * 60; // max 60px Y offset
  const blur = 4 + clamped * 80; // max 84px blur
  const spreadBase = -clamped * 12; // max -12px spread

  const layers: Shadow[] = [];

  // Layer 1: Contact shadow (always present)
  layers.push({
    id: genId(),
    x: 0,
    y: Math.round(clamped * 4),
    blur: Math.round(2 + clamped * 6),
    spread: 0,
    opacity: Math.min(1, baseOpacity * (1 + clamped * 2)),
    color,
    inset: false,
    visible: true,
  });

  // Layer 2: Core shadow (always present)
  layers.push({
    id: genId(),
    x: 0,
    y: Math.round(yOff * 0.5),
    blur: Math.round(blur * 0.4),
    spread: Math.round(spreadBase * 0.3),
    opacity: Math.min(1, baseOpacity * (1 + clamped)),
    color,
    inset: false,
    visible: true,
  });

  // Layer 3: Mid shadow (always present)
  layers.push({
    id: genId(),
    x: 0,
    y: Math.round(yOff * 0.8),
    blur: Math.round(blur * 0.7),
    spread: Math.round(spreadBase * 0.6),
    opacity: Math.min(1, baseOpacity * (0.8 + clamped * 0.4)),
    color,
    inset: false,
    visible: true,
  });

  // Layer 4: Ambient shadow (depth > 0.25)
  if (clamped > 0.25) {
    layers.push({
      id: genId(),
      x: 0,
      y: Math.round(yOff * 1.0),
      blur: Math.round(blur * 0.9),
      spread: Math.round(spreadBase * 0.8),
      opacity: Math.min(1, baseOpacity * (0.5 + clamped * 0.3)),
      color,
      inset: false,
      visible: true,
    });
  }

  // Layer 5: Far ambient (depth > 0.6)
  if (clamped > 0.6) {
    layers.push({
      id: genId(),
      x: 0,
      y: Math.round(yOff * 1.2),
      blur: Math.round(blur * 1.2),
      spread: Math.round(spreadBase),
      opacity: Math.min(1, baseOpacity * (0.3 + clamped * 0.2)),
      color,
      inset: false,
      visible: true,
    });
  }

  return layers;
}

/**
 * Compute a human-readable label for a depth value.
 */
export function depthLabel(depth: number): string {
  if (depth < 0.05) return "Flat";
  if (depth < 0.15) return "Raised";
  if (depth < 0.3) return "Lifted";
  if (depth < 0.5) return "Floating";
  if (depth < 0.75) return "Hovering";
  return "Levitated";
}
