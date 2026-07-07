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
  const dragId = useRef<string | null>(null);
  const dragOverId = useRef<string | null>(null);

  function handleDragStart(e: React.DragEvent, id: string) {
    dragId.current = id;
    e.dataTransfer.effectAllowed = "move";
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
    <div className="flex flex-col" style={{ gap: 12 }}>
      {/* Add layer — subtle text action */}
      <button
        onClick={onAdd}
        className="sg-transition"
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          background: "none",
          border: "none",
          padding: 0,
          cursor: "pointer",
          color: "var(--text-muted)",
          fontSize: 11,
          fontWeight: 450,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = "var(--text)")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.color = "var(--text-muted)")
        }
      >
        <Plus size={12} strokeWidth={1.5} />
        Add shadow layer
      </button>

      {/* Layer rows */}
      <div
        className="flex flex-col"
        style={{ gap: 4 }}
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
              className="group flex items-center gap-2.5 sg-transition"
              style={{
                padding: "6px 8px",
                borderRadius: 6,
                background: isActive ? "var(--surface-hover)" : "transparent",
                opacity: isVisible ? 1 : 0.4,
                cursor: "pointer",
              }}
              onMouseEnter={(e) => {
                if (!isActive)
                  e.currentTarget.style.background = "var(--surface-hover)";
              }}
              onMouseLeave={(e) => {
                if (!isActive) e.currentTarget.style.background = "transparent";
              }}
            >
              {/* Drag handle */}
              <span
                className="shrink-0 cursor-grab active:cursor-grabbing"
                style={{ color: "var(--text-faint)" }}
                onClick={(e) => e.stopPropagation()}
              >
                <GripVertical size={12} strokeWidth={1.5} />
              </span>

              {/* Color dot */}
              <div
                className="shrink-0"
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: "50%",
                  backgroundColor: previewColor,
                }}
              />

              {/* Label */}
              <span
                className="flex-1 truncate sg-label"
                style={{
                  fontWeight: isActive ? 500 : 400,
                  color: isActive ? "var(--text)" : "var(--text-muted)",
                  textDecoration: isVisible ? "none" : "line-through",
                  fontSize: 12,
                }}
              >
                Layer {i + 1}
                {shadow.inset && (
                  <span
                    style={{
                      color: "var(--text-faint)",
                      marginLeft: 6,
                      fontSize: 10.5,
                    }}
                  >
                    inset
                  </span>
                )}
              </span>

              {/* Actions — appear on hover */}
              <div
                className="flex items-center"
                style={{ gap: 1, opacity: 0, transition: "opacity 0.15s ease" }}
                onMouseEnter={(e) => (e.currentTarget.style.opacity = "1")}
                onMouseLeave={(e) => (e.currentTarget.style.opacity = "0")}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => onToggleVisibility(shadow.id)}
                  className="sg-transition"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer",
                    borderRadius: 4,
                    color: "var(--text-faint)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-faint)")
                  }
                  title={isVisible ? "Hide layer" : "Show layer"}
                >
                  {isVisible ? (
                    <Eye size={11} strokeWidth={1.5} />
                  ) : (
                    <EyeOff size={11} strokeWidth={1.5} />
                  )}
                </button>
                <button
                  onClick={() => onDuplicate(shadow.id)}
                  className="sg-transition"
                  style={{
                    background: "none",
                    border: "none",
                    padding: 4,
                    cursor: "pointer",
                    borderRadius: 4,
                    color: "var(--text-faint)",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "var(--text)")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "var(--text-faint)")
                  }
                  title="Duplicate"
                >
                  <Copy size={11} strokeWidth={1.5} />
                </button>
                {shadows.length > 1 && (
                  <button
                    onClick={() => onRemove(shadow.id)}
                    className="sg-transition"
                    style={{
                      background: "none",
                      border: "none",
                      padding: 4,
                      cursor: "pointer",
                      borderRadius: 4,
                      color: "var(--text-faint)",
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.color = "var(--destructive)")
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.color = "var(--text-faint)")
                    }
                    title="Remove"
                  >
                    <Trash2 size={11} strokeWidth={1.5} />
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
