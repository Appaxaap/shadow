"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { Sparkles, X } from "lucide-react";
import { parseNaturalLanguage, getExamples } from "../../lib/naturalLanguage";
import type { Shadow } from "../../lib/types";

type Props = {
  onApply: (shadows: Shadow[]) => void;
};

export function NaturalLanguageInput({ onApply }: Props) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [examples] = useState(getExamples);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
    }
  }, [open]);

  const handleParse = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || trimmed.length < 3) {
        setError('Type a description like "soft shadow to the right"');
        return;
      }
      const result = parseNaturalLanguage(trimmed);
      if (!result || result.length === 0) {
        setError("Couldn't parse that. Try a different description.");
        return;
      }
      setError("");
      onApply(result);
      setOpen(false);
      setInput("");
    },
    [onApply],
  );

  const handleSubmit = useCallback(() => {
    handleParse(input);
  }, [input, handleParse]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSubmit();
      if (e.key === "Escape") setOpen(false);
    },
    [handleSubmit],
  );

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
    >
      {/* Header / trigger */}
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all"
        style={{ color: "var(--text-muted)" }}
      >
        <div className="flex items-center gap-2">
          <Sparkles size={13} />
          <span>Describe your shadow</span>
        </div>
        <span
          className="text-xs transition-transform"
          style={{
            transform: open ? "rotate(180deg)" : "rotate(0deg)",
            display: "inline-block",
          }}
        >
          ▾
        </span>
      </button>

      {/* Expanded panel */}
      {open && (
        <div
          className="px-3 pb-3 flex flex-col gap-2.5"
          style={{ borderTop: "1px solid var(--border)" }}
        >
          {/* Input row */}
          <div
            className="flex items-center gap-2 rounded-xl px-3 py-2"
            style={{
              background: "var(--surface-code)",
              border: `1px solid ${error ? "var(--destructive)" : "var(--border)"}`,
            }}
          >
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                setError("");
              }}
              onKeyDown={handleKeyDown}
              placeholder='e.g. "soft drop shadow to the right"'
              className="flex-1 bg-transparent text-xs font-medium outline-none min-w-0"
              style={{ color: "var(--text)" }}
            />
            {input && (
              <button
                onClick={() => {
                  setInput("");
                  setError("");
                }}
                className="shrink-0"
                style={{ color: "var(--text-faint)" }}
              >
                <X size={12} />
              </button>
            )}
            <button
              onClick={handleSubmit}
              className="shrink-0 px-3 py-1 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
              }}
            >
              Go
            </button>
          </div>

          {error && (
            <p
              className="text-[11px] font-medium"
              style={{ color: "var(--destructive)" }}
            >
              {error}
            </p>
          )}

          {/* Examples */}
          <div className="flex flex-col gap-1.5">
            <span
              className="text-xs font-medium"
              style={{ color: "var(--text-faint)" }}
            >
              Try saying:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {examples.slice(0, 6).map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setInput(ex);
                    handleParse(ex);
                  }}
                  className="px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap"
                  style={{
                    background: "var(--surface-raised)",
                    color: "var(--text-muted)",
                    border: "1px solid var(--border)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor =
                      "color-mix(in srgb, var(--accent) 30%, transparent)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "var(--border)";
                  }}
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
