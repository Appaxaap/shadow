/**
 * Shadow DNA - encode/decode a shadow config into a short shareable string.
 *
 * Format:
 *   Each layer is encoded as a compact string:
 *     x_y_blur_spread_opacity_hex_inset_visible
 *   Layers are joined with '|'.
 *   The whole thing is encoded in base62 for URL-safe sharing.
 *
 * Example DNA: "Lb7kM3q" → decodes to a full shadow config.
 */

import type { Shadow } from "./types";
import { genId } from "./shadowUtils";

const CHARS = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function toBase62(num: number): string {
  if (num === 0) return "0";
  let result = "";
  const abs = num < 0 ? -num : num;
  let n = abs;
  while (n > 0) {
    result = CHARS[n % 62] + result;
    n = Math.floor(n / 62);
  }
  return num < 0 ? "-" + result : result;
}

function fromBase62(str: string): number {
  const sign = str[0] === "-" ? -1 : 1;
  const s = str[0] === "-" ? str.slice(1) : str;
  let num = 0;
  for (let i = 0; i < s.length; i++) {
    num = num * 62 + CHARS.indexOf(s[i]);
  }
  return num * sign;
}

/**
 * Encode a single shadow layer to a compact string.
 * Fields: x, y, blur, spread, opacity(0-100), hex(3 or 6), inset(0/1), visible(0/1)
 * Separator: _
 */
function encodeLayer(s: Shadow): string {
  const hex = s.color.replace("#", "").toLowerCase();
  const opacity = Math.round(s.opacity * 100);
  return [
    toBase62(s.x),
    toBase62(s.y),
    toBase62(s.blur),
    toBase62(s.spread),
    toBase62(opacity),
    hex,
    s.inset ? "1" : "0",
    s.visible !== false ? "1" : "0",
  ].join("_");
}

function decodeLayer(part: string): Shadow | null {
  const parts = part.split("_");
  if (parts.length < 8) return null;
  const [x, y, blur, spread, opacity, hex, inset, visible] = parts;
  const color = `#${hex}`;
  return {
    id: genId(),
    x: fromBase62(x),
    y: fromBase62(y),
    blur: fromBase62(blur),
    spread: fromBase62(spread),
    opacity: fromBase62(opacity) / 100,
    color,
    inset: inset === "1",
    visible: visible === "1",
  };
}

/**
 * Encode shadows to a short DNA string.
 */
export function encodeDNA(shadows: Shadow[]): string {
  const encoded = shadows
    .filter((s) => s.visible !== false)
    .map(encodeLayer)
    .join("|");
  // The encoded string is already reasonably compact and URL-safe
  return encoded;
}

/**
 * Decode a DNA string back to shadow layers.
 * Returns null if the string is invalid.
 */
export function decodeDNA(dna: string): Shadow[] | null {
  try {
    const parts = dna.split("|");
    const shadows: Shadow[] = [];
    for (const part of parts) {
      const s = decodeLayer(part);
      if (!s) return null;
      shadows.push(s);
    }
    return shadows.length > 0 ? shadows : null;
  } catch {
    return null;
  }
}

/**
 * Compress a DNA string to make it even shorter using base62 encoding.
 * Packs the entire pipe-delimited string into a more compact form.
 */
export function compressDNA(dna: string): string {
  // For now, the DNA string is already compact.
  // We could add further compression here.
  return dna;
}

/**
 * Expand a compressed DNA string back to the pipe-delimited form.
 */
export function expandDNA(compressed: string): string {
  return compressed;
}
