"use client";

import { Check, Copy, ChevronDown } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { Shadow } from "../../lib/types";
import { type ExportFormat, getFormatCode } from "../../lib/exportFormats";
import { highlightCode } from "../../lib/syntaxHighlight";

type Props = {
  shadows: Shadow[];
};

const TABS: { id: ExportFormat; label: string; short: string }[] = [
  { id: "css", label: "CSS", short: "CSS" },
  { id: "tailwind", label: "Tailwind", short: "TW" },
  { id: "tailwind-config", label: "TW Config", short: "TWC" },
  { id: "scss", label: "SCSS", short: "SCSS" },
  { id: "css-var", label: "CSS Var", short: "Vars" },
  { id: "js", label: "JavaScript", short: "JS" },
  { id: "flutter", label: "Flutter", short: "FL" },
];

async function copyText(text: string) {
  try {
    await navigator.clipboard.writeText(text);
  } catch {
    const el = document.createElement("textarea");
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand("copy");
    document.body.removeChild(el);
  }
}

export function CodeOutput({ shadows }: Props) {
  const [tab, setTab] = useState<ExportFormat>("css");
  const [codeCopied, setCodeCopied] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const codeRef = useRef<HTMLPreElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const code = getFormatCode(tab, shadows);
  const highlighted = highlightCode(code);
  const lineCount = code.split("\n").length;
  const charCount = code.length;

  // Close dropdown on outside click
  useEffect(() => {
    if (!showDropdown) return;
    function handleClick(e: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showDropdown]);

  async function handleCopy() {
    await copyText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  // Scroll to top when tab changes
  useEffect(() => {
    if (codeRef.current) {
      codeRef.current.scrollTop = 0;
    }
  }, [tab]);

  const activeTab = TABS.find((t) => t.id === tab) ?? TABS[0];

  return (
    <div
      className="overflow-hidden h-full flex flex-col"
      style={{ background: "var(--surface-code)" }}
    >
      {/* ─── Top bar: format selector + copy ─── */}
      <div
        className="shrink-0 flex items-center justify-between gap-2 px-3 py-2"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Format selector — pills on desktop, dropdown on narrow */}
        <div
          className="hidden sm:flex items-center gap-1 overflow-x-auto min-w-0"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((t) => {
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="shrink-0 px-2.5 py-1 text-[11px] font-semibold rounded-lg whitespace-nowrap transition-all duration-150 active:scale-95"
                style={{
                  color: isActive ? "var(--bg)" : "var(--text-muted)",
                  background: isActive ? "var(--accent)" : "transparent",
                  border: `1px solid ${isActive ? "var(--accent)" : "transparent"}`,
                  letterSpacing: "0.01em",
                }}
              >
                {t.label}
              </button>
            );
          })}
        </div>

        {/* Mobile dropdown */}
        <div className="sm:hidden relative flex-1 min-w-0" ref={dropdownRef}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="w-full flex items-center justify-between gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg"
            style={{
              color: "var(--text)",
              background: "var(--surface-raised)",
              border: "1px solid var(--border)",
            }}
          >
            <span className="truncate">{activeTab.label}</span>
            <ChevronDown
              size={12}
              style={{
                transform: showDropdown ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 0.15s ease",
              }}
            />
          </button>
          {showDropdown && (
            <div
              className="absolute left-0 right-0 top-full mt-1 z-30 rounded-xl overflow-hidden"
              style={{
                background: "var(--surface)",
                border: "1px solid var(--border)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
              }}
            >
              {TABS.map((t) => (
                <button
                  key={t.id}
                  onClick={() => {
                    setTab(t.id);
                    setShowDropdown(false);
                  }}
                  className="w-full text-left px-3 py-2 text-xs font-semibold transition-all"
                  style={{
                    color: t.id === tab ? "var(--accent)" : "var(--text-muted)",
                    background:
                      t.id === tab
                        ? "color-mix(in srgb, var(--accent) 8%, transparent)"
                        : "transparent",
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-semibold rounded-lg transition-all duration-150 active:scale-95"
          style={{
            background: codeCopied
              ? "color-mix(in srgb, var(--accent) 15%, transparent)"
              : "rgba(128,128,128,0.08)",
            color: codeCopied ? "var(--accent)" : "var(--text-muted)",
            border: `1px solid ${codeCopied ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)"}`,
          }}
        >
          {codeCopied ? (
            <>
              <Check size={12} className="animate-check-pop" />
              Copied
            </>
          ) : (
            <>
              <Copy size={12} />
              Copy
            </>
          )}
        </button>
      </div>

      {/* ─── Code viewport ─── */}
      <div className="flex-1 min-h-0 overflow-hidden relative">
        <pre
          ref={codeRef}
          className="absolute inset-0 overflow-y-auto text-[13px] font-mono leading-relaxed whitespace-pre"
          style={{
            margin: 0,
            padding: "24px 20px",
            color: "var(--text)",
            tabSize: 2,
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>

      {/* ─── Bottom status bar ─── */}
      <div
        className="shrink-0 flex items-center justify-between px-3 py-1.5"
        style={{
          background: "var(--surface)",
          borderTop: "1px solid var(--border)",
        }}
      >
        <div className="flex items-center gap-3">
          <span
            className="text-[10px] font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            {activeTab.short}
          </span>
          <span
            className="text-[10px] font-mono"
            style={{ color: "var(--text-faint)" }}
          >
            {lineCount} lines
          </span>
        </div>
        <span
          className="text-[10px] font-mono"
          style={{ color: "var(--text-faint)" }}
        >
          {charCount} chars
        </span>
      </div>
    </div>
  );
}
