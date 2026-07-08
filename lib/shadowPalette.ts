/**
 * Shadow Palette - generates a family of harmonized shadow variations
 * from a single seed shadow.
 *
 * Produces 6 variations:
 *   Subtle    - soft, gentle, low opacity
 *   Bold      - strong, deep, high contrast
 *   Ethereal  - wide, light, floating
 *   Sharp     - tight, precise, close
 *   Warm      - shifted toward amber/orange
 *   Cool      - shifted toward blue/teal
 */

import type { Shadow } from "./types";
import { genId } from "./shadowUtils";

export type PaletteEntry = {
  name: string;
  /** Color dot hex value derived from the shadow */
  dotColor: string;
  description: string;
  shadow: Shadow;
};

function shiftHex(
  hex: string,
  rShift: number,
  gShift: number,
  bShift: number,
): string {
  const clean = hex.replace("#", "");
  const full =
    clean.length === 3
      ? clean
          .split("")
          .map((c) => c + c)
          .join("")
      : clean;
  let r = parseInt(full.slice(0, 2), 16);
  let g = parseInt(full.slice(2, 4), 16);
  let b = parseInt(full.slice(4, 6), 16);
  r = Math.max(0, Math.min(255, r + rShift));
  g = Math.max(0, Math.min(255, g + gShift));
  b = Math.max(0, Math.min(255, b + bShift));
  return `#${r.toString(16).padStart(2, "0")}${g.toString(16).padStart(2, "0")}${b.toString(16).padStart(2, "0")}`;
}

function cloneShadow(s: Shadow, overrides: Partial<Shadow>): Shadow {
  return { ...s, id: genId(), ...overrides };
}

/**
 * Generate a palette of 6 shadow variations from a seed shadow.
 */
export function generatePalette(seed: Shadow): PaletteEntry[] {
  const { x, y, blur, spread, opacity, color } = seed;

  return [
    {
      name: "Subtle",
      dotColor: shiftHex(color, 30, 30, 30),
      description: "Soft and gentle",
      shadow: cloneShadow(seed, {
        x: Math.round(x * 0.3),
        y: Math.round(y * 0.3),
        blur: Math.round(blur * 0.5),
        spread: Math.round(spread * 0.3),
        opacity: opacity * 0.4,
      }),
    },
    {
      name: "Bold",
      dotColor: shiftHex(color, -20, -20, -20),
      description: "Strong and deep",
      shadow: cloneShadow(seed, {
        x: Math.round(x * 1.5),
        y: Math.round(y * 1.5),
        blur: Math.round(blur * 1.2),
        spread: Math.round(spread * 0.8),
        opacity: Math.min(1, opacity * 2),
        color: shiftHex(color, -20, -20, -20),
      }),
    },
    {
      name: "Ethereal",
      dotColor: shiftHex(color, 40, 40, 50),
      description: "Wide and floating",
      shadow: cloneShadow(seed, {
        x: Math.round(x * 0.6),
        y: Math.round(y * 0.6),
        blur: Math.round(blur * 2.5),
        spread: -Math.round(Math.abs(spread || 4)),
        opacity: opacity * 0.5,
      }),
    },
    {
      name: "Sharp",
      dotColor: shiftHex(color, -5, -5, -5),
      description: "Tight and precise",
      shadow: cloneShadow(seed, {
        x,
        y,
        blur: Math.round(blur * 0.25),
        spread: 0,
        opacity: Math.min(1, opacity * 1.3),
      }),
    },
    {
      name: "Warm",
      dotColor: shiftHex(color, 25, 5, -15),
      description: "Amber-toned glow",
      shadow: cloneShadow(seed, {
        color: shiftHex(color, 25, 5, -15),
        opacity: opacity * 0.85,
      }),
    },
    {
      name: "Cool",
      dotColor: shiftHex(color, -15, 5, 25),
      description: "Blue-toned depth",
      shadow: cloneShadow(seed, {
        color: shiftHex(color, -15, 5, 25),
        opacity: opacity * 0.85,
      }),
    },
  ];
}

/**
 * Convert a palette entry to a CSS box-shadow value.
 */
export function paletteShadowCss(entry: PaletteEntry): string {
  const s = entry.shadow;
  const r = parseInt(s.color.slice(1, 3), 16);
  const g = parseInt(s.color.slice(3, 5), 16);
  const b = parseInt(s.color.slice(5, 7), 16);
  const rgba = `rgba(${r},${g},${b},${s.opacity})`;
  return `${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${rgba}`;
}
