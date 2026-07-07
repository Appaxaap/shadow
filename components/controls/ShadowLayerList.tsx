"use client";

import { useRef } from "react";
import { Copy, Eye, EyeOff, GripVertical, Plus, Trash2 } from "lucide-react";
import type { Shadow } from "../../lib/types";
import { hexToRgba } from "../../lib/shadowUtils";

type Props = {
  shadows: Shadow[];
  activeId: string;
  onSelect: (id: string) => void;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onDuplicate: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onReorder: (newOrder: Shadow[]) => void;
};

export function ShadowLayerList({
  shadows,
  activeId,
  onSelect,
  onAdd,
  onRemove,
  onDuplicate,
  onToggleVisibility,
  onReorder,
}: Props) {
  // Drag state in refs — zero re-renders during drag
  const dragId = useRef<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
    // Minimal ghost — just the element itself
    e.dataTransfer.setDragImage(e.currentTarget as HTMLElement, 12, 12);
  }

  function handleDragOver(e: React.DragEvent, id: string) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    dragOverId.current = id;
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    const from = dragId.current;
    const to = dragOverId.current;
    if (!from || !to || from === to) return;
    const next = [...shadows];
    const fromIdx = next.findIndex((s) => s.id === from);
    const toIdx = next.findIndex((s) => s.id === to);
    const [moved] = next.splice(fromIdx, 1);
    next.splice(toIdx, 0, moved);
    onReorder(next);
    dragId.current = null;
    dragOverId.current = null;
  }

  function handleDragEnd() {
    dragId.current = null;
    dragOverId.current = null;
  }

  return (
    <div className="flex flex-col gap-2.5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          Layers
        </span>
        <button
          onClick={onAdd}
          className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl transition-all duration-150 active:scale-95"
          style={{
            color: "var(--accent)",
            background: "rgba(94,158,136,0.1)",
            border: "1px solid rgba(94,158,136,0.2)",
          }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "rgba(94,158,136,0.18)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "rgba(94,158,136,0.1)")
          }
        >
          <Plus size={13} strokeWidth={2.5} />
          Add layer
        </button>
      </div>

      {/* Layer rows */}
      <div
        className="flex flex-col gap-1.5"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
      >
        {shadows.map((shadow, i) => {
          const isActive = shadow.id === activeId;
          const isVisible = shadow.visible !== false;
          const previewColor = hexToRgba(shadow.color, shadow.opacity);

          return (
            <div
              key={shadow.id}
              draggable
              onDragStart={(e) => handleDragStart(e, shadow.id)}
              onDragOver={(e) => handleDragOver(e, shadow.id)}
              onDragEnd={handleDragEnd}
              onClick={() => onSelect(shadow.id)}
              className="group flex items-center gap-2 px-2.5 py-2 rounded-xl cursor-pointer animate-slide-in hover:opacity-100"
              style={{
                background: isActive ? "rgba(94,158,136,0.08)" : "transparent",
                opacity: isVisible ? 1 : 0.45,
                transition: "all 0.15s ease",
              }}
            >
              {/* Drag handle */}
              <span
                className="shrink-0 cursor-grab active:cursor-grabbing"
                style={{ color: "var(--text-faint)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical size={13} />
              </span>

              {/* Color dot */}
              <div
                className="w-4 h-4 rounded-md shrink-0"
                style={{
                  backgroundColor: previewColor,
                  border: "1.5px solid rgba(255,255,255,0.1)",
                }}
              />

              {/* Label */}
              <span
                className="flex-1 text-sm font-medium truncate"
                style={{
                  color: isActive ? "var(--accent)" : "var(--text)",
                  textDecoration: isVisible ? "none" : "line-through",
                }}
              >
                Layer {i + 1}
                {shadow.inset && (
                  <span
                    className="ml-1.5 text-[11px] font-normal"
                    style={{ color: "var(--text-faint)" }}
                  >
                    inset
                  </span>
                )}
              </span>

              {/* Actions */}
              <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {/* Visibility */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleVisibility(shadow.id);
                  }}
                  className="p-1.5 rounded-xl transition-all active:scale-90"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  title={isVisible ? "Hide layer" : "Show layer"}
                >
                  {isVisible ? <Eye size={12} /> : <EyeOff size={12} />}
                </button>
                {/* Duplicate */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicate(shadow.id);
                  }}
                  className="p-1.5 rounded-xl transition-all active:scale-90"
                  style={{ color: "var(--text-muted)" }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                    e.currentTarget.style.color = "var(--text)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "transparent";
                    e.currentTarget.style.color = "var(--text-muted)";
                  }}
                  title="Duplicate"
                >
                  <Copy size={12} />
                </button>
                {/* Remove */}
                {shadows.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onRemove(shadow.id);
                    }}
                    className="p-1.5 rounded-xl transition-all active:scale-90"
                    style={{ color: "var(--text-muted)" }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = "rgba(201,96,96,0.12)";
                      e.currentTarget.style.color = "var(--destructive)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                      e.currentTarget.style.color = "var(--text-muted)";
                    }}
                    title="Remove"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
