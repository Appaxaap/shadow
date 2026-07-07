/**
 * Natural Language Shadow Parser.
 *
 * A rule-based engine that converts plain English descriptions
 * into shadow layer configurations. No AI needed — just smart
 * keyword matching and sensible defaults.
 *
 * Examples:
 *   "soft drop shadow to the right" →
 *   "elevated card with a warm glow" →
 *   "pressed inset shadow on a button" →
 *   "floating in deep space with multiple layers" →
 */

import type { Shadow } from "./types";
import { genId } from "./shadowUtils";

// ─── Keyword maps ───────────────────────────────────────────────────

type Intensity = "subtle" | "light" | "medium" | "strong" | "deep";
type Direction = "top" | "bottom" | "left" | "right" | "center";
type Style = "soft" | "sharp" | "glow" | "inset" | "natural" | "floating";

const INTENSITY_MAP: Record<Intensity, number> = {
  subtle: 0.15,
  light: 0.3,
  medium: 0.5,
  strong: 0.75,
  deep: 1.0,
};

const DIRECTION_VECTORS: Record<Direction, { x: number; y: number }> = {
  top: { x: 0, y: -1 },
  bottom: { x: 0, y: 1 },
  left: { x: -1, y: 0 },
  right: { x: 1, y: 0 },
  center: { x: 0, y: 0 },
};

// ─── Tokeniser ──────────────────────────────────────────────────────

type Token = {
  word: string;
  isIntensity: boolean;
  isDirection: boolean;
  isStyle: boolean;
  isColor: boolean;
  isLayer: boolean;
};

function tokenise(input: string): Token[] {
  const lower = input.toLowerCase().trim();
  const words = lower.split(/[\s,]+/).filter(Boolean);

  const intensityWords = new Set([
    "subtle",
    "light",
    "medium",
    "strong",
    "deep",
    "soft",
    "gentle",
    "heavy",
    "intense",
    "faint",
    "bold",
    "mild",
    "powerful",
    "barely",
    "very",
    "super",
    "ultra",
    "extra",
  ]);

  const directionWords = new Set([
    "top",
    "bottom",
    "left",
    "right",
    "center",
    "centre",
    "above",
    "below",
    "under",
    "over",
    "upward",
    "downward",
    "side",
    "sides",
    "north",
    "south",
    "east",
    "west",
    "upper",
    "lower",
    "down",
    "up",
  ]);

  const styleWords = new Set([
    "soft",
    "sharp",
    "glow",
    "inset",
    "natural",
    "floating",
    "drop",
    "ethereal",
    "diffuse",
    "crisp",
    "tight",
    "wide",
    "ambient",
    "contact",
    "layered",
    "multi",
    "elevated",
    "raised",
    "pressed",
    "hovering",
    "levitating",
  ]);

  const colorWords = new Set([
    "black",
    "white",
    "gray",
    "grey",
    "dark",
    "light",
    "warm",
    "cool",
    "amber",
    "blue",
    "teal",
    "green",
    "red",
    "purple",
    "gold",
    "silver",
    "bronze",
    "shadowy",
    "transparent",
    "clear",
  ]);

  const layerWords = new Set([
    "layer",
    "layers",
    "multi",
    "stack",
    "stacked",
    "double",
    "triple",
  ]);

  return words.map((word) => ({
    word,
    isIntensity: intensityWords.has(word),
    isDirection: directionWords.has(word),
    isStyle: styleWords.has(word),
    isColor: colorWords.has(word),
    isLayer: layerWords.has(word),
  }));
}

// ─── Parser ─────────────────────────────────────────────────────────

type ParsedIntent = {
  intensity: Intensity;
  direction: Direction;
  style: Style;
  layers: number; // 1-5
  colorHint: "dark" | "warm" | "cool" | "none";
  glow: boolean;
};

function parse(tokens: Token[]): ParsedIntent {
  const intent: ParsedIntent = {
    intensity: "medium",
    direction: "bottom",
    style: "natural",
    layers: 1,
    colorHint: "none",
    glow: false,
  };

  for (const t of tokens) {
    // Intensity
    if (t.isIntensity) {
      if (
        ["subtle", "gentle", "faint", "barely", "mild"].includes(t.word)
      ) {
        intent.intensity = "subtle";
      } else if (["light", "soft"].includes(t.word)) {
        intent.intensity = "light";
      } else if (["medium", "mild"].includes(t.word)) {
        intent.intensity = "medium";
      } else if (
        ["strong", "heavy", "bold", "intense", "powerful", "super", "ultra", "extra"].includes(
          t.word,
        )
      ) {
        intent.intensity = "strong";
      } else if (["deep", "very"].includes(t.word)) {
        intent.intensity = "deep";
      }
    }

    // Direction
    if (t.isDirection) {
      if (["top", "above", "upward", "up", "upper", "north"].includes(t.word)) {
        intent.direction = "top";
      } else if (
        ["bottom", "below", "under", "downward", "down", "lower", "south"].includes(
          t.word,
        )
      ) {
        intent.direction = "bottom";
      } else if (["left", "west", "side"].includes(t.word)) {
        intent.direction = "left";
      } else if (["right", "east"].includes(t.word)) {
        intent.direction = "right";
      } else if (["center", "centre"].includes(t.word)) {
        intent.direction = "center";
      }
    }

    // Style
    if (t.isStyle) {
      if (t.word === "soft") intent.style = "soft";
      else if (t.word === "sharp" || t.word === "crisp" || t.word === "tight")
        intent.style = "sharp";
      else if (
        t.word === "glow" ||
        t.word === "ethereal" ||
        t.word === "diffuse"
      )
        intent.style = "glow";
      else if (t.word === "inset" || t.word === "pressed")
        intent.style = "inset";
      else if (
        t.word === "floating" ||
        t.word === "hovering" ||
        t.word === "levitating" ||
        t.word === "elevated"
      )
        intent.style = "floating";
      else if (t.word === "natural" || t.word === "drop")
        intent.style = "natural";
    }

    // Layers
    if (t.isLayer) {
      if (
        t.word === "multi" ||
        t.word === "stack" ||
        t.word === "stacked" ||
        t.word === "layered"
      ) {
        intent.layers = Math.max(intent.layers, 3);
      } else if (t.word === "double") {
        intent.layers = Math.max(intent.layers, 2);
      } else if (t.word === "triple") {
        intent.layers = Math.max(intent.layers, 3);
      }
    }

    // Color hints
    if (t.isColor) {
      if (["warm", "amber", "gold", "bronze"].includes(t.word)) {
        intent.colorHint = "warm";
      } else if (["cool", "blue", "teal", "silver"].includes(t.word)) {
        intent.colorHint = "cool";
      } else if (
        ["black", "dark", "shadowy", "gray", "grey"].includes(t.word)
      ) {
        intent.colorHint = "dark";
      }
    }

    // Glow hint
    if (t.word === "glow") {
      intent.glow = true;
    }
  }

  return intent;
}

// ─── Generator ──────────────────────────────────────────────────────

const INTENSITY_OFFSET: Record<Intensity, number> = {
  subtle: 4,
  light: 8,
  medium: 16,
  strong: 32,
  deep: 60,
};

const INTENSITY_BLUR: Record<Intensity, number> = {
  subtle: 4,
  light: 8,
  medium: 16,
  strong: 30,
  deep: 50,
};

const INTENSITY_OPACITY: Record<Intensity, number> = {
  subtle: 0.06,
  light: 0.1,
  medium: 0.15,
  strong: 0.25,
  deep: 0.35,
};

function styleColor(colorHint: string, opacity: number): { color: string; opacity: number } {
  switch (colorHint) {
    case "warm":
      return { color: "#8B5E3C", opacity };
    case "cool":
      return { color: "#3C6E8B", opacity };
    case "dark":
      return { color: "#000000", opacity: opacity * 1.2 };
    default:
      return { color: "#000000", opacity };
  }
}

function generateShadows(intent: ParsedIntent): Shadow[] {
  const baseOffset = INTENSITY_OFFSET[intent.intensity];
  const baseBlur = INTENSITY_BLUR[intent.intensity];
  const baseOpacity = INTENSITY_OPACITY[intent.intensity];
  const dir = DIRECTION_VECTORS[intent.direction];
  const { color, opacity } = styleColor(intent.colorHint, baseOpacity);
  const shadows: Shadow[] = [];

  if (intent.style === "inset") {
    // Inset shadow
    shadows.push({
      id: genId(),
      x: Math.round(dir.x * baseOffset * 0.5),
      y: Math.round(dir.y * baseOffset * 0.5),
      blur: Math.round(baseBlur * 0.5),
      spread: Math.round(baseOffset * 0.1),
      opacity: Math.min(1, opacity * 1.5),
      color,
      inset: true,
      visible: true,
    });
    // Outer rim for depth
    shadows.push({
      id: genId(),
      x: 0,
      y: Math.round(baseOffset * 0.1),
      blur: Math.round(baseBlur * 0.3),
      spread: 0,
      opacity: opacity * 0.5,
      color,
      inset: false,
      visible: true,
    });
    return shadows;
  }

  if (intent.style === "glow" || intent.glow) {
    // Glow effect — symmetrical, wide, colored light
    const glowColor = intent.colorHint === "warm" ? "#FF8C42" : intent.colorHint === "cool" ? "#4296FF" : color;
    shadows.push({
      id: genId(),
      x: 0,
      y: 0,
      blur: Math.round(baseBlur * 2),
      spread: Math.round(baseOffset * 0.3),
      opacity: opacity * 0.6,
      color: glowColor,
      inset: false,
      visible: true,
    });
    shadows.push({
      id: genId(),
      x: 0,
      y: 0,
      blur: Math.round(baseBlur),
      spread: 0,
      opacity: opacity * 0.3,
      color: glowColor,
      inset: false,
      visible: true,
    });
    return shadows;
  }

  if (intent.style === "floating") {
    // Multi-layer floating shadow (like Depth Meter)
    shadows.push({
      id: genId(),
      x: 0,
      y: Math.round(baseOffset * 0.8),
      blur: Math.round(baseBlur * 1.2),
      spread: -Math.round(baseOffset * 0.1),
      opacity: opacity * 0.6,
      color,
      inset: false,
      visible: true,
    });
    shadows.push({
      id: genId(),
      x: 0,
      y: Math.round(baseOffset * 1.5),
      blur: Math.round(baseBlur * 2),
      spread: -Math.round(baseOffset * 0.2),
      opacity: opacity * 0.3,
      color,
      inset: false,
      visible: true,
    });
    if (intent.layers >= 3) {
      shadows.push({
        id: genId(),
        x: 0,
        y: Math.round(baseOffset * 2.5),
        blur: Math.round(baseBlur * 3),
        spread: -Math.round(baseOffset * 0.3),
        opacity: opacity * 0.15,
        color,
        inset: false,
        visible: true,
      });
    }
    return shadows;
  }

  // Standard / natural / soft / sharp
  const blurMult = intent.style === "sharp" ? 0.3 : intent.style === "soft" ? 1.5 : 0.8;

  const numLayers = intent.layers;

  for (let i = 0; i < numLayers; i++) {
    const layerFactor = (i + 1) / numLayers;
    const layerOpacity = opacity * (1.2 - layerFactor * 0.6);
    const offX = Math.round(dir.x * baseOffset * layerFactor);
    const offY = Math.round(dir.y * baseOffset * layerFactor);
    const blurRadius = Math.round(baseBlur * blurMult * layerFactor);
    const spreadRadius = Math.round(-baseOffset * 0.05 * layerFactor);

    shadows.push({
      id: genId(),
      x: offX,
      y: offY,
      blur: blurRadius,
      spread: spreadRadius,
      opacity: Math.min(1, layerOpacity),
      color,
      inset: false,
      visible: true,
    });
  }

  return shadows;
}

// ─── Public API ─────────────────────────────────────────────────────

export function parseNaturalLanguage(input: string): Shadow[] | null {
  const trimmed = input.trim();
  if (!trimmed || trimmed.length < 3) return null;

  const tokens = tokenise(trimmed);
  const intent = parse(tokens);
  return generateShadows(intent);
}

/**
 * Get a list of example phrases the parser understands.
 */
export function getExamples(): string[] {
  return [
    "soft drop shadow to the right",
    "strong shadow below",
    "subtle glow around",
    "pressed inset shadow",
    "floating card with warm tone",
    "deep multi-layer shadow bottom right",
    "crisp shadow to the left",
    "ethereal glow in cool blue",
    "gentle shadow above",
    "bold heavy shadow underneath",
  ];
}
