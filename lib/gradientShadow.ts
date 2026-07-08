/**
 * Gradient Shadow Generator
 *
 * Creates a multi-layer shadow stack that simulates a smooth
 * gradient falloff - each layer is progressively more blurred
 * and more transparent, producing a natural "glow" effect that
 * single-layer shadows can't achieve.
 */

import type { Shadow } from "./types";
import { genId } from "./shadowUtils";

export type GradientShadowParams = {
  /** Number of layers (2–12) */
  layers: number;
  /** How quickly blur increases per layer (0.5–3.0) */
  falloff: number;
  /** Overall depth multiplier (0–100) */
  depth: number;
  /** Base shadow color */
  color: string;
  /** Horizontal offset per layer */
  xOffset: number;
  /** Vertical offset per layer */
  yOffset: number;
};

export const DEFAULT_GRADIENT_PARAMS: GradientShadowParams = {
  layers: 6,
  falloff: 1.4,
  depth: 40,
  color: "#000000",
  xOffset: 0,
  yOffset: 4,
};

/**
 * Generate a gradient shadow stack from the given parameters.
 */
export function generateGradientShadow(params: GradientShadowParams): Shadow[] {
  const { layers, falloff, depth, color, xOffset, yOffset } = params;
  const shadows: Shadow[] = [];

  for (let i = 0; i < layers; i++) {
    const progress = i / Math.max(layers - 1, 1); // 0..1
    const blurStep = Math.pow(falloff, progress);
    const opacityStep = 1 - progress * 0.7;

    shadows.push({
      id: genId(),
      x: Math.round(xOffset * (1 + progress * 0.3)),
      y: Math.round(yOffset * (1 + progress * 0.5)),
      blur: Math.max(1, Math.round(2 * blurStep * (depth / 20))),
      spread: 0,
      opacity: Math.max(
        0,
        parseFloat(((depth / 100) * opacityStep * 0.2).toFixed(3)),
      ),
      color,
      inset: false,
      visible: true,
    });
  }

  return shadows;
}
