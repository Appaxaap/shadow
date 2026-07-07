"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Shadow } from "../lib/types";
import { decodeShadows, encodeShadows, genId } from "../lib/shadowUtils";
import type { LightState } from "../lib/lightSource";
import { DEFAULT_LIGHT, lightOffsets } from "../lib/lightSource";

const DEFAULT_SHADOWS: Shadow[] = [
  {
    id: "default",
    x: 0,
    y: 10,
    blur: 30,
    spread: 0,
    opacity: 0.15,
    color: "#000000",
    inset: false,
    visible: true,
  },
];

const MAX_HISTORY = 30;

export function useShadowState() {
  const [shadows, setShadowsRaw] = useState<Shadow[]>(DEFAULT_SHADOWS);
  const [activeId, setActiveId] = useState<string>("default");
  const [lightState, setLightState] = useState<LightState>(DEFAULT_LIGHT);
  const [mounted, setMounted] = useState(false);

  const history = useRef<Shadow[][]>([DEFAULT_SHADOWS]);
  const historyIdx = useRef(0);
  const skipHistory = useRef(false); // set true during undo/redo to avoid double-push

  // Wrap setShadows so every state change is pushed to history
  const setShadows = useCallback(
    (updater: Shadow[] | ((prev: Shadow[]) => Shadow[])) => {
      setShadowsRaw((prev) => {
        const next = typeof updater === "function" ? updater(prev) : updater;
        if (!skipHistory.current) {
          // Trim any forward history
          history.current = history.current.slice(0, historyIdx.current + 1);
          history.current.push(next);
          if (history.current.length > MAX_HISTORY) history.current.shift();
          historyIdx.current = history.current.length - 1;
        }
        return next;
      });
    },
    [],
  );

  const undo = useCallback(() => {
    if (historyIdx.current <= 0) return;
    historyIdx.current -= 1;
    skipHistory.current = true;
    setShadowsRaw(history.current[historyIdx.current]);
    skipHistory.current = false;
  }, []);

  const redo = useCallback(() => {
    if (historyIdx.current >= history.current.length - 1) return;
    historyIdx.current += 1;
    skipHistory.current = true;
    setShadowsRaw(history.current[historyIdx.current]);
    skipHistory.current = false;
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");
    if (encoded) {
      const decoded = decodeShadows(encoded);
      if (decoded && decoded.length > 0) {
        // Back-compat: add visible:true if missing
        const fixed = decoded.map((s) => ({
          ...s,
          visible: s.visible ?? true,
        }));
        setShadows(fixed);
        setActiveId(fixed[0].id);
        // Reset history to this loaded state
        history.current = [fixed];
        historyIdx.current = 0;
      }
    }
    setMounted(true);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (!mounted) return;
    const url = new URL(window.location.href);
    url.searchParams.set("s", encodeShadows(shadows));
    window.history.replaceState(null, "", url.toString());
  }, [shadows, mounted]);

  const addLayer = useCallback(() => {
    const id = genId();
    const newShadow: Shadow = {
      id,
      x: 0,
      y: 4,
      blur: 12,
      spread: 0,
      opacity: 0.12,
      color: "#000000",
      inset: false,
      visible: true,
    };
    setShadows((prev) => [...prev, newShadow]);
    setActiveId(id);
  }, [setShadows]);

  const removeLayer = useCallback(
    (id: string) => {
      setShadows((prev) => {
        if (prev.length === 1) return prev;
        return prev.filter((s) => s.id !== id);
      });
      setActiveId((prev) => {
        if (prev !== id) return prev;
        const remaining = shadows.filter((s) => s.id !== id);
        return remaining[0]?.id ?? "";
      });
    },
    [setShadows, shadows],
  );

  const updateLayer = useCallback(
    (id: string, patch: Partial<Shadow>) => {
      setShadows((prev) =>
        prev.map((s) => (s.id === id ? { ...s, ...patch } : s)),
      );
    },
    [setShadows],
  );

  const duplicateLayer = useCallback(
    (id: string) => {
      setShadows((prev) => {
        const idx = prev.findIndex((s) => s.id === id);
        if (idx === -1) return prev;
        const newId = genId();
        const copy = { ...prev[idx], id: newId };
        const next = [...prev];
        next.splice(idx + 1, 0, copy);
        setActiveId(newId);
        return next;
      });
    },
    [setShadows],
  );

  const toggleLayerVisibility = useCallback(
    (id: string) => {
      setShadows((prev) =>
        prev.map((s) => (s.id === id ? { ...s, visible: !s.visible } : s)),
      );
    },
    [setShadows],
  );

  const reorderLayers = useCallback(
    (newOrder: Shadow[]) => {
      setShadows(newOrder);
    },
    [setShadows],
  );

  const loadPreset = useCallback(
    (presetShadows: Shadow[]) => {
      const fresh = presetShadows.map((s) => ({
        ...s,
        id: genId(),
        visible: s.visible ?? true,
      }));
      setShadows(fresh);
      setActiveId(fresh[0]?.id ?? "");
    },
    [setShadows],
  );

  const toggleLight = useCallback(() => {
    setLightState((prev) => ({ ...prev, active: !prev.active }));
  }, []);

  const setLightPosition = useCallback((lx: number, ly: number) => {
    setLightState((prev) => ({ ...prev, lx, ly }));
  }, []);

  /**
   * Return the effective shadow for display purposes.
   * When light source is active, x/y are overridden by light calculations.
   */
  const computeShadow = useCallback(
    (s: Shadow): Shadow => {
      if (!lightState.active) return s;
      const lift = Math.min(1, (s.blur + Math.abs(s.y)) / 200);
      const maxOffset = Math.abs(s.x) + Math.abs(s.y) + 10 || 20;
      const { x, y } = lightOffsets(
        lightState.lx,
        lightState.ly,
        lift,
        maxOffset,
      );
      return { ...s, x, y };
    },
    [lightState],
  );

  const getShareUrl = useCallback(() => {
    const url = new URL(window.location.href);
    url.searchParams.set("s", encodeShadows(shadows));
    return url.toString();
  }, [shadows]);

  return {
    shadows,
    activeId,
    setActiveId,
    lightState,
    toggleLight,
    setLightPosition,
    computeShadow,
    addLayer,
    removeLayer,
    updateLayer,
    duplicateLayer,
    toggleLayerVisibility,
    reorderLayers,
    loadPreset,
    getShareUrl,
    undo,
    redo,
  };
}
