import type { Shadow } from "./types";
import { shadowToCss, shadowsToCssValue } from "./shadowUtils";

export type ExportFormat =
  | "css"
  | "tailwind"
  | "tailwind-config"
  | "scss"
  | "css-var"
  | "js"
  | "flutter";

/** CSS rule */
export function toCss(shadows: Shadow[]): string {
  return `box-shadow: ${shadowsToCssValue(shadows)};`;
}

/** Tailwind arbitrary class */
export function toTailwind(shadows: Shadow[]): string {
  if (shadows.length === 0) return "shadow-none";
  const val = shadows.map(shadowToCss).join(",");
  const escaped = val.replace(/\s*,\s*/g, ",").replace(/ /g, "_");
  return `shadow-[${escaped}]`;
}

/** Tailwind theme config */
export function toTailwindConfig(shadows: Shadow[], name = "primary"): string {
  const val = shadows.map(shadowToCss).join(", ");
  return `// tailwind.config.js\nmodule.exports = {\n  theme: {\n    extend: {\n      boxShadow: {\n        '${name}': '${val}',\n      },\n    },\n  },\n}`;
}

/** SCSS variable */
export function toScss(shadows: Shadow[], name = "shadow-primary"): string {
  const val = shadows.map(shadowToCss).join(",\n  ");
  return `$${name}:\n  ${val};`;
}

/** CSS custom property */
export function toCssVar(shadows: Shadow[], name = "shadow-primary"): string {
  const val = shadows.map(shadowToCss).join(", ");
  return `:root {\n  --${name}: ${val};\n}`;
}

/** JS / React inline style */
export function toJs(shadows: Shadow[]): string {
  const val = shadows.map(shadowToCss).join(", ");
  return `const style = {\n  boxShadow: '${val}',\n}`;
}

/** Flutter BoxShadow - converts each shadow layer */
export function toFlutter(shadows: Shadow[]): string {
  // hex + opacity → Flutter Color (0xAARRGGBB)
  function toFlutterColor(hex: string, opacity: number): string {
    const clean = hex.replace("#", "");
    const full =
      clean.length === 3
        ? clean
            .split("")
            .map((c) => c + c)
            .join("")
        : clean;
    const alpha = Math.round(opacity * 255)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase();
    return `Color(0x${alpha}${full.toUpperCase()})`;
  }

  const layers = shadows.map((s) => {
    const color = toFlutterColor(s.color, s.opacity);
    const lines = [
      `  BoxShadow(`,
      `    color: ${color},`,
      `    blurRadius: ${s.blur},`,
    ];
    if (s.spread !== 0) lines.push(`    spreadRadius: ${s.spread},`);
    lines.push(`    offset: Offset(${s.x}, ${s.y}),`);
    if (s.inset)
      lines.push(
        `    // Note: Flutter does not support inset shadows natively`,
      );
    lines.push(`  ),`);
    return lines.join("\n");
  });

  return `BoxDecoration(\n  boxShadow: [\n${layers.join("\n")}\n  ],\n)`;
}

export function getFormatCode(format: ExportFormat, shadows: Shadow[]): string {
  switch (format) {
    case "css":
      return toCss(shadows);
    case "tailwind":
      return toTailwind(shadows);
    case "tailwind-config":
      return toTailwindConfig(shadows);
    case "scss":
      return toScss(shadows);
    case "css-var":
      return toCssVar(shadows);
    case "js":
      return toJs(shadows);
    case "flutter":
      return toFlutter(shadows);
    default:
      return toCss(shadows);
  }
}
