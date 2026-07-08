"use client";

import { Check, Copy } from "lucide-react";
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
  const codeRef = useRef<HTMLPreElement>(null);

  const code = getFormatCode(tab, shadows);
  const highlighted = highlightCode(code);

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

  return (
    <div
      className="overflow-hidden h-full flex flex-col"
      style={{ background: "var(--surface-code)" }}
    >
      {/* ─── Top bar: format selector + copy ─── */}
      <div
        className="shrink-0 flex items-center justify-between gap-2 px-3 py-1.5"
        style={{
          background: "var(--surface)",
          borderBottom: "1px solid var(--border)",
        }}
      >
        {/* Format selector */}
        <div
          className="flex items-center gap-1 overflow-x-auto min-w-0"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((t) => {
            const isActive = t.id === tab;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className="shrink-0 px-2 py-0.5 text-[10px] font-semibold rounded-md whitespace-nowrap transition-all duration-150 active:scale-95"
                style={{
                  color: isActive ? "var(--bg)" : "var(--text-muted)",
                  background: isActive ? "var(--accent)" : "transparent",
                  border: `1px solid ${isActive ? "var(--accent)" : "transparent"}`,
                }}
              >
                {t.short}
              </button>
            );
          })}
        </div>

        {/* Copy button */}
        <button
          onClick={handleCopy}
          className="shrink-0 flex items-center gap-1 px-2 py-1 text-[10px] font-semibold rounded-md transition-all duration-150 active:scale-95"
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
          className="absolute inset-0 overflow-y-auto text-[13px] font-mono leading-snug whitespace-pre"
          style={{
            margin: 0,
            padding: "12px 16px",
            color: "var(--text)",
            tabSize: 2,
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}
