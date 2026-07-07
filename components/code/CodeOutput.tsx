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
        borderTop: panelMode ? "none" : "1px solid var(--border)",
        borderLeft: panelMode ? "1px solid var(--border)" : "none",
        background:
          "linear-gradient(180deg, color-mix(in srgb, var(--surface-raised) 70%, transparent), color-mix(in srgb, var(--surface) 92%, transparent))",
      }}
    >
      <div
        className="flex items-center justify-between gap-3 px-3 sm:px-4 py-2"
        style={{
          borderBottom: "1px solid var(--border)",
        }}
      >
        <div
          className="flex items-center overflow-x-auto rounded-xl"
          style={{ scrollbarWidth: "none" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="shrink-0 px-3 py-1.5 text-xs font-semibold transition-all rounded-md whitespace-nowrap"
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
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 active:scale-95"
            style={{
              background: codeCopied
                ? "rgba(94,158,136,0.15)"
                : "rgba(128,128,128,0.1)",
              color: codeCopied ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${codeCopied ? "rgba(94,158,136,0.3)" : "var(--border)"}`,
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
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold rounded-xl transition-all duration-150 active:scale-95"
            style={{
              background: shareCopied
                ? "rgba(94,158,136,0.15)"
                : "rgba(128,128,128,0.1)",
              color: shareCopied ? "var(--accent)" : "var(--text-muted)",
              border: `1px solid ${shareCopied ? "rgba(94,158,136,0.3)" : "var(--border)"}`,
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

      <div className="px-3 sm:px-4 py-3 flex-1 min-h-0">
        <div
          className="rounded-xl overflow-hidden h-full flex flex-col"
          style={{
            border: "1px solid var(--border)",
            background: "var(--surface-code)",
          }}
        >
          <pre
            className="px-4 py-3 text-[13px] font-mono leading-relaxed overflow-auto whitespace-pre flex-1"
            style={{
              color: "var(--text)",
              maxHeight: panelMode ? "none" : 176,
              minHeight: panelMode ? 0 : 120,
            }}
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </div>
      </div>
    </div>
  );
}
