"use client";

import { Check, Copy, Dna, Import } from "lucide-react";
import { useState, useCallback } from "react";
import { encodeDNA, decodeDNA } from "../../lib/shadowDna";
import type { Shadow } from "../../lib/types";

type Props = {
  shadows: Shadow[];
  onLoadDNA: (shadows: Shadow[]) => void;
};

export function ShadowDNA({ shadows, onLoadDNA }: Props) {
  const [mode, setMode] = useState<"idle" | "export" | "import">("idle");
  const [copied, setCopied] = useState(false);
  const [importInput, setImportInput] = useState("");
  const [importError, setImportError] = useState("");

  const dna = encodeDNA(shadows);

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(dna);
    } catch {
      const el = document.createElement("textarea");
      el.value = dna;
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [dna]);

  const handleImport = useCallback(() => {
    const trimmed = importInput.trim();
    if (!trimmed) {
      setImportError("Paste a Shadow DNA string first");
      return;
    }
    const decoded = decodeDNA(trimmed);
    if (!decoded) {
      setImportError("Invalid DNA - check the string and try again");
      return;
    }
    setImportError("");
    onLoadDNA(decoded);
    setMode("idle");
    setImportInput("");
  }, [importInput, onLoadDNA]);

  const characters = dna.length;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        border: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Header */}
      <button
        onClick={() => setMode(mode === "idle" ? "export" : "idle")}
        className="w-full flex items-center justify-between px-3 py-2.5 text-xs font-semibold transition-all"
        style={{
          color: "var(--text-muted)",
          borderBottom: mode !== "idle" ? "1px solid var(--border)" : "none",
        }}
      >
        <div className="flex items-center gap-2">
          <Dna size={13} />
          <span>Shadow DNA</span>
        </div>
        <div className="flex items-center gap-2">
          {mode === "idle" && (
            <span
              className="text-[10px] font-mono"
              style={{ color: "var(--text-faint)" }}
            >
              {characters} chars
            </span>
          )}
          <span
            className="text-[10px] transition-transform"
            style={{
              transform: mode !== "idle" ? "rotate(180deg)" : "rotate(0deg)",
              display: "inline-block",
            }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Expanded content */}
      {mode === "export" && (
        <div className="p-3 flex flex-col gap-2.5">
          {/* DNA display */}
          <div
            className="rounded-xl px-3 py-2.5 font-mono text-xs break-all select-all"
            style={{
              background: "var(--surface-code)",
              border: "1px solid var(--border)",
              color: "var(--accent)",
              lineHeight: 1.6,
            }}
          >
            {dna}
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: copied
                  ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                  : "rgba(128,128,128,0.08)",
                color: copied ? "var(--accent)" : "var(--text-muted)",
                border: `1px solid ${copied ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)"}`,
              }}
            >
              {copied ? <Check size={12} /> : <Copy size={12} />}
              {copied ? "Copied!" : "Copy DNA"}
            </button>

            <button
              onClick={() => {
                setMode("import");
                setImportInput("");
                setImportError("");
              }}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: "rgba(128,128,128,0.08)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              <Import size={12} />
              Paste DNA
            </button>
          </div>
        </div>
      )}

      {/* Import panel */}
      {mode === "import" && (
        <div className="p-3 flex flex-col gap-2.5">
          <div
            className="rounded-xl px-3 py-2 font-mono text-xs"
            style={{
              background: "var(--surface-code)",
              border: `1px solid ${importError ? "var(--destructive)" : "var(--border)"}`,
            }}
          >
            <input
              type="text"
              value={importInput}
              onChange={(e) => {
                setImportInput(e.target.value);
                setImportError("");
              }}
              placeholder="Paste Shadow DNA here..."
              className="w-full bg-transparent outline-none"
              style={{ color: "var(--text)" }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleImport();
              }}
              autoFocus
            />
          </div>
          {importError && (
            <p
              className="text-[11px] font-medium"
              style={{ color: "var(--destructive)" }}
            >
              {importError}
            </p>
          )}
          <div className="flex items-center gap-2">
            <button
              onClick={handleImport}
              className="flex-1 py-2 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: "var(--accent)",
                color: "var(--bg)",
              }}
            >
              Load from DNA
            </button>
            <button
              onClick={() => setMode("export")}
              className="py-2 px-4 text-xs font-semibold rounded-xl transition-all active:scale-95"
              style={{
                background: "rgba(128,128,128,0.08)",
                color: "var(--text-muted)",
                border: "1px solid var(--border)",
              }}
            >
              Back
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
