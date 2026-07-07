"use client";

import { Check, Copy, Link } from "lucide-react";
import { useState } from "react";
import type { Shadow } from "../../lib/types";
import { type ExportFormat, getFormatCode } from "../../lib/exportFormats";
import { highlightCode } from "../../lib/syntaxHighlight";

type Props = {
  shadows: Shadow[];
  getShareUrl: () => string;
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

export function CodeOutput({ shadows, getShareUrl }: Props) {
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
    <div className="flex flex-col h-full overflow-hidden" style={{ gap: 0 }}>
      {/* Toolbar */}
      <div
        className="flex items-center justify-between shrink-0"
        style={{ height: 44, padding: "0 4px" }}
      >
        {/* Language tabs — editorial text */}
        <div
          className="flex items-center overflow-x-auto min-w-0"
          style={{ gap: 10, scrollbarWidth: "none" }}
        >
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className="sg-transition"
              style={{
                background: "none",
                border: "none",
                padding: "4px 0",
                cursor: "pointer",
                fontSize: 10.5,
                fontWeight: tab === t.id ? 500 : 400,
                color: tab === t.id ? "var(--text)" : "var(--text-muted)",
                letterSpacing: "0.02em",
                whiteSpace: "nowrap",
              }}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* Actions — subtle text links */}
        <div className="flex items-center shrink-0" style={{ gap: 8 }}>
          <button
            onClick={handleCopy}
            className="sg-transition"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 450,
              color: codeCopied ? "var(--accent)" : "var(--text-faint)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            onMouseEnter={(e) => {
              if (!codeCopied) e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              if (!codeCopied)
                e.currentTarget.style.color = "var(--text-faint)";
            }}
          >
            {codeCopied ? (
              <Check size={10} strokeWidth={1.5} />
            ) : (
              <Copy size={10} strokeWidth={1.5} />
            )}
            {codeCopied ? "Copied" : "Copy"}
          </button>
          <button
            onClick={handleShare}
            className="sg-transition"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              cursor: "pointer",
              fontSize: 10.5,
              fontWeight: 450,
              color: shareCopied ? "var(--accent)" : "var(--text-faint)",
              display: "flex",
              alignItems: "center",
              gap: 4,
            }}
            onMouseEnter={(e) => {
              if (!shareCopied) e.currentTarget.style.color = "var(--text)";
            }}
            onMouseLeave={(e) => {
              if (!shareCopied)
                e.currentTarget.style.color = "var(--text-faint)";
            }}
          >
            {shareCopied ? (
              <Check size={10} strokeWidth={1.5} />
            ) : (
              <Link size={10} strokeWidth={1.5} />
            )}
            {shareCopied ? "Copied" : "Share"}
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "var(--border)", flexShrink: 0 }} />

      {/* Code viewport */}
      <div
        className="flex-1 min-h-0 overflow-y-auto"
        style={{ background: "var(--surface-code)" }}
      >
        <pre
          className="text-[13px] font-mono leading-relaxed whitespace-pre"
          style={{
            margin: 0,
            padding: "28px 20px 24px",
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
