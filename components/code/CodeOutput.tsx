"use client";

import { Check, Copy, Link } from "lucide-react";
import { useState } from "react";
import type { Shadow } from "../../lib/types";
import { type ExportFormat, getFormatCode } from "../../lib/exportFormats";
import { highlightCode } from "../../lib/syntaxHighlight";

type Props = {
  shadows: Shadow[];
  getShareUrl: () => string;
  panelMode?: boolean;
};

const TABS: { id: ExportFormat; label: string }[] = [
  { id: "css", label: "CSS" },
  { id: "tailwind", label: "Tailwind" },
  { id: "tailwind-config", label: "TW Config" },
  { id: "scss", label: "SCSS" },
  { id: "css-var", label: "CSS Var" },
  { id: "js", label: "JS" },
  { id: "flutter", label: "Flutter" },
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

export function CodeOutput({ shadows, getShareUrl, panelMode = false }: Props) {
  const [tab, setTab] = useState<ExportFormat>("css");
  const [codeCopied, setCodeCopied] = useState(false);
  const [shareCopied, setShareCopied] = useState(false);

  const code = getFormatCode(tab, shadows);
  const highlighted = highlightCode(code);

  async function handleCopy() {
    await copyText(code);
    setCodeCopied(true);
    setTimeout(() => setCodeCopied(false), 2000);
  }

  async function handleShare() {
    await copyText(getShareUrl());
    setShareCopied(true);
    setTimeout(() => setShareCopied(false), 2000);
  }

  return (
    <div
      className="overflow-hidden h-full flex flex-col"
      style={{
        borderRadius: panelMode ? 0 : 12,
        borderTop: panelMode ? "none" : "1px solid var(--border)",
        borderLeft: panelMode ? "1px solid var(--border)" : "none",
        borderRight: "1px solid var(--border)",
        borderBottom: "1px solid var(--border)",
        background: "var(--surface)",
      }}
    >
      {/* Toolbar — dedicated 54px strip */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ height: 54, padding: "0 20px" }}
      >
        {/* Left: language tabs */}
        <div
          className="flex items-center gap-2 overflow-x-auto min-w-0"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold rounded-md whitespace-nowrap transition-all duration-150"
              style={{
                color: tab === t.id ? "var(--text)" : "var(--text-muted)",
                background:
                  tab === t.id
                    ? "color-mix(in srgb, var(--surface-raised) 60%, transparent)"
                    : "transparent",
                border:
                  tab === t.id
                    ? "1px solid var(--border-hover)"
                    : "1px solid transparent",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Right: utility actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95"
            style={{
              background: codeCopied
                ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                : "rgba(128,128,128,0.1)",
              color: codeCopied ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${codeCopied ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)"}`,
            }}
          >
            {codeCopied ? (
              <Check size={11} className="animate-check-pop" />
            ) : (
              <Copy size={11} />
            )}
            {codeCopied ? "Copied!" : "Copy"}
          </button>
          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-all duration-150 active:scale-95"
            style={{
              background: shareCopied
                ? "color-mix(in srgb, var(--accent) 15%, transparent)"
                : "rgba(128,128,128,0.1)",
              color: shareCopied ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${shareCopied ? "color-mix(in srgb, var(--accent) 30%, transparent)" : "var(--border)"}`,
            }}
          >
            {shareCopied ? (
              <Check size={11} className="animate-check-pop" />
            ) : (
              <Link size={11} />
            )}
            {shareCopied ? "Copied!" : "Share"}
          </button>
        </div>
      </div>

      {/* Subtle divider */}
      <div style={{ height: 1, background: "var(--border)", flexShrink: 0 }} />

      {/* Code viewport — scrolls independently */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ background: "var(--surface-code)" }}
      >
        <pre
          className="text-[13px] font-mono leading-relaxed whitespace-pre"
          style={{
            margin: 0,
            padding: "28px 24px 24px",
            color: "var(--text)",
            minHeight: "100%",
            boxSizing: "border-box",
          }}
          dangerouslySetInnerHTML={{ __html: highlighted }}
        />
      </div>
    </div>
  );
}
