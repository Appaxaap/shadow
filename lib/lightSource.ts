/**
 * Light Source engine.
 *
 * Computes shadow x/y offsets based on a 2D light position.
 * The element sits at the center; the light orbits around it.
 * Each layer has a "lift" value (how high off the surface) that
 * determines how far the shadow is cast.
 */

export type LightState = {
  active: boolean;
  /** Normalised light position (-1..1). (0,0) is directly above the element. */
  lx: number;
  ly: number;
};

export const DEFAULT_LIGHT: LightState = {
  active: false,
  lx: 0.6,
  ly: -0.8,
};

/**
 * Given a light position and a layer's lift, return the computed x,y offsets.
 * lift is a normalised 0..1 value per layer (derived from blur or stored).
 */
export function lightOffsets(
  lx: number,
  ly: number,
  lift: number,
  maxOffset: number,
): { x: number; y: number } {
  // Angle from light → element centre
  const angle = Math.atan2(-ly, -lx);
  const distance = Math.sqrt(lx * lx + ly * ly);
  // Clamp distance so we never divide by zero
  const mag = Math.max(distance, 0.01);
  // Direction vector from light toward centre
  const dx = -lx / mag;
  const dy = -ly / mag;
  // Scale by lift and a configurable max offset
  const scale = lift * maxOffset;
  return {
    x: Math.round(dx * scale),
    y: Math.round(dy * scale),
  };
}

/**
 * Compute a display-friendly angle in degrees (0 = top, 90 = right).
 */
export function lightAngle(lx: number, ly: number): number {
  return (Math.atan2(lx, -ly) * 180) / Math.PI;
}
