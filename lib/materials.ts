/**
 * Material Simulator — defines surface materials that affect
 * how shadows appear on the preview canvas.
 *
 * Each material provides:
 *   - A display name and icon
 *   - Element background color
 *   - Shadow color multiplier (how the surface absorbs/reflects light)
 *   - Optional CSS filter or background pattern
 */

export type Material = {
  id: string;
  name: string;
  icon: string;
  /** Background color of the element (the surface the shadow falls on) */
  elementBg: string;
  /** Lightness multiplier applied to the shadow color (0=fully absorbed, 2=fully reflected) */
  shadowLightness: number;
  /** Opacity multiplier for the shadow */
  shadowOpacity: number;
  /** Optional CSS to apply to the element */
  elementExtra?: string;
  /** Label for the surface layer */
  description: string;
};

export const MATERIALS: Material[] = [
  {
    id: "paper",
    name: "Paper",
    icon: "📄",
    elementBg: "#F5F0E8",
    shadowLightness: 1.0,
    shadowOpacity: 1.0,
    description: "Matte surface, natural absorption",
  },
  {
    id: "glass",
    name: "Glass",
    icon: "🪟",
    elementBg: "rgba(255,255,255,0.3)",
    shadowLightness: 0.6,
    shadowOpacity: 0.5,
    elementExtra:
      "backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255,255,255,0.15);",
    description: "Transparent, light passes through",
  },
  {
    id: "metal",
    name: "Metal",
    icon: "⚙️",
    elementBg: "#A0AAB5",
    shadowLightness: 1.3,
    shadowOpacity: 1.2,
    elementExtra:
      "background: linear-gradient(145deg, #b8c4d0 0%, #8a96a2 100%);",
    description: "Reflective, high-contrast shadows",
  },
  {
    id: "frosted",
    name: "Frosted",
    icon: "🧊",
    elementBg: "rgba(255,255,255,0.15)",
    shadowLightness: 0.7,
    shadowOpacity: 0.6,
    elementExtra:
      "backdrop-filter: blur(24px); -webkit-backdrop-filter: blur(24px); border: 1px solid rgba(255,255,255,0.08);",
    description: "Diffused, soft light transmission",
  },
  {
    id: "fabric",
    name: "Fabric",
    icon: "🧵",
    elementBg: "#D4CFC4",
    shadowLightness: 0.85,
    shadowOpacity: 1.1,
    description: "Textured, soft shadow edges",
  },
  {
    id: "plastic",
    name: "Plastic",
    icon: "🧩",
    elementBg: "#E8E0D8",
    shadowLightness: 1.1,
    shadowOpacity: 0.9,
    elementExtra:
      "box-shadow: inset 0 1px 0 rgba(255,255,255,0.3), inset 0 -1px 0 rgba(0,0,0,0.05);",
    description: "Smooth, slightly glossy",
  },
];

export type MaterialId = (typeof MATERIALS)[number]["id"];
export const DEFAULT_MATERIAL: MaterialId = "paper";

export function getMaterial(id: string): Material {
  return MATERIALS.find((m) => m.id === id) ?? MATERIALS[0];
}

/**
 * Apply a material's shadow modifiers to an rgba color string.
 * Lightens or darkens the shadow based on surface reflectivity.
 */
export function applyMaterialToColor(
  rgba: string,
  material: Material,
): string {
  // Extract r,g,b from rgba(r,g,b,a)
  const match = rgba.match(/rgba\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (!match) return rgba;

  let [, r, g, b, a] = match.map(Number);

  // Apply lightness multiplier (darker surface = more absorbed = lighter shadow)
  const factor = material.shadowLightness;
  if (factor < 1) {
    // Absorbing surface — shadow gets lighter
    r = Math.min(255, Math.round(r + (255 - r) * (1 - factor)));
    g = Math.min(255, Math.round(g + (255 - g) * (1 - factor)));
    b = Math.min(255, Math.round(b + (255 - b) * (1 - factor)));
  } else {
    // Reflective surface — shadow gets darker
    const extra = factor - 1;
    r = Math.max(0, Math.round(r - r * extra * 0.3));
    g = Math.max(0, Math.round(g - g * extra * 0.3));
    b = Math.max(0, Math.round(b - b * extra * 0.3));
  }

  const opacity = Math.min(1, a * material.shadowOpacity);
  return `rgba(${r},${g},${b},${opacity})`;
}
