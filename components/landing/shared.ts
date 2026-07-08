import { hexToRgba } from "../../lib/shadowUtils";

export interface ShadowState {
  x: number; y: number; blur: number; spread: number;
  opacity: number; color: string; inset: boolean; visible: boolean;
}

export function computeCss(s: ShadowState): string {
  const inset = s.inset ? "inset " : "";
  const color = hexToRgba(s.color, s.opacity);
  return `${inset}${s.x}px ${s.y}px ${s.blur}px ${s.spread}px ${color}`;
}
