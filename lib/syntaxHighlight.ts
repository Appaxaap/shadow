/**
 * Lightweight syntax highlighter for generated code output.
 *
 * Tokenizes code and wraps tokens in semantic spans styled via CSS.
 * Handles CSS, JS/TS, Dart/Flutter, JSON, and SCSS patterns.
 */

type TokenType =
  | "k" // keyword
  | "s" // string
  | "n" // number / hex color
  | "p" // property name
  | "f" // function call
  | "c" // comment
  | "o" // operator / punctuation
  | "d" // CSS pseudo / directive
  | "t" // type / class name
  | "v"; // plain text

type Token = { t: TokenType; v: string };

const KEYWORDS = new Set([
  "const",
  "let",
  "var",
  "function",
  "module",
  "exports",
  "import",
  "export",
  "return",
  "new",
  "class",
  "extends",
  "static",
  "async",
  "await",
  "true",
  "false",
  "null",
  "undefined",
  "if",
  "else",
  "for",
  "of",
  "in",
  "from",
  "require",
  "this",
  "super",
  "throw",
  "try",
  "catch",
  "finally",
  "switch",
  "case",
  "default",
  "break",
  "continue",
  "while",
  "do",
  "typeof",
  "instanceof",
  "void",
  "delete",
]);

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function tokenize(code: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;

  while (i < code.length) {
    // Whitespace - pass through
    if (/\s/.test(code[i])) {
      let j = i + 1;
      while (j < code.length && /\s/.test(code[j])) j++;
      tokens.push({ t: "v", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Single-line comment
    if (code[i] === "/" && code[i + 1] === "/") {
      let j = i + 2;
      while (j < code.length && code[j] !== "\n") j++;
      tokens.push({ t: "c", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Double-quoted string
    if (code[i] === '"') {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === '"') {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ t: "s", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Single-quoted string
    if (code[i] === "'") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === "'") {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ t: "s", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Backtick template literal
    if (code[i] === "`") {
      let j = i + 1;
      while (j < code.length) {
        if (code[j] === "\\") {
          j += 2;
          continue;
        }
        if (code[j] === "`") {
          j++;
          break;
        }
        j++;
      }
      tokens.push({ t: "s", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Hex color
    if (
      code[i] === "#" &&
      i + 1 < code.length &&
      /[0-9a-fA-F]/.test(code[i + 1])
    ) {
      let j = i + 1;
      while (j < code.length && /[0-9a-fA-F]/.test(code[j])) j++;
      tokens.push({ t: "n", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Flutter Color(0x...) or Offset(...) or similar constructor
    if (
      /[A-Z]/.test(code[i]) &&
      i + 1 < code.length &&
      /[a-zA-Z]/.test(code[i + 1])
    ) {
      let j = i + 1;
      while (j < code.length && /[a-zA-Z0-9_]/.test(code[j])) j++;
      const word = code.slice(i, j);
      if (j < code.length && code[j] === "(") {
        tokens.push({ t: "f", v: word });
      } else {
        tokens.push({ t: "t", v: word });
      }
      i = j;
      continue;
    }

    // Number (with optional decimal and unit)
    if (
      /\d/.test(code[i]) ||
      (code[i] === "-" && i + 1 < code.length && /\d/.test(code[i + 1]))
    ) {
      let j = i + 1;
      if (code[i] === "-") j++;
      let hasDot = false;
      while (j < code.length && /[\d.eE]/.test(code[j])) {
        if (code[j] === ".") {
          if (hasDot) break;
          hasDot = true;
        }
        if (code[j] === "e" || code[j] === "E") {
          j++;
          if (j < code.length && /[+-]/.test(code[j])) j++;
          break;
        }
        j++;
      }
      // Optional CSS unit
      const rest = code.slice(j);
      const unitMatch = rest.match(/^(px|em|rem|%|s|ms|deg|vh|vw|vmin|vmax)\b/);
      if (unitMatch) j += unitMatch[0].length;
      tokens.push({ t: "n", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Word - could be keyword, property, function, type, CSS directive
    if (/[a-zA-Z_$\-]/.test(code[i]) || code[i] === "@") {
      let j = i + 1;
      // CSS vars start with --
      if (code[i] === "-" && code[i + 1] === "-") {
        j = i + 2;
        while (j < code.length && /[a-zA-Z0-9_-]/.test(code[j])) j++;
        tokens.push({ t: "p", v: code.slice(i, j) });
        i = j;
        continue;
      }
      // @ rules
      if (code[i] === "@") {
        while (j < code.length && /[a-zA-Z-]/.test(code[j])) j++;
        tokens.push({ t: "d", v: code.slice(i, j) });
        i = j;
        continue;
      }
      while (j < code.length && /[a-zA-Z0-9_$\-]/.test(code[j])) j++;
      const word = code.slice(i, j);

      // Look at next char
      const next = j < code.length ? code[j] : "";

      if (KEYWORDS.has(word)) {
        tokens.push({ t: "k", v: word });
      } else if (next === "(") {
        tokens.push({ t: "f", v: word });
      } else if (next === ":") {
        tokens.push({ t: "p", v: word });
      } else if (word.startsWith("$")) {
        tokens.push({ t: "p", v: word });
      } else if (/^[A-Z]/.test(word)) {
        tokens.push({ t: "t", v: word });
      } else {
        tokens.push({ t: "v", v: word });
      }
      i = j;
      continue;
    }

    // CSS pseudo (:hover, ::before) - but not :: in Flutter
    if (code[i] === ":") {
      if (code[i + 1] === ":") {
        tokens.push({ t: "d", v: "::" });
        i += 2;
      } else {
        tokens.push({ t: "d", v: ":" });
        i += 1;
      }
      // Read the pseudo name
      let j = i;
      while (j < code.length && /[a-zA-Z-]/.test(code[j])) j++;
      if (j > i) tokens.push({ t: "d", v: code.slice(i, j) });
      i = j;
      continue;
    }

    // Punctuation / operators
    if (/[{}()\[\];:,.=+*\/<>!?|&^~%]/.test(code[i])) {
      tokens.push({ t: "o", v: code[i] });
      i++;
      continue;
    }

    // Anything else - pass through
    tokens.push({ t: "v", v: code[i] });
    i++;
  }

  return tokens;
}

const TYPE_STYLE: Record<TokenType, string> = {
  k: "var(--code-k)",
  s: "var(--code-s)",
  n: "var(--code-n)",
  p: "var(--code-p)",
  f: "var(--code-f)",
  c: "var(--code-c)",
  o: "var(--code-o)",
  d: "var(--code-d)",
  t: "var(--code-t)",
  v: "",
};

export function highlightCode(code: string): string {
  const tokens = tokenize(code);
  let html = "";
  for (const token of tokens) {
    const color = TYPE_STYLE[token.t];
    const escaped = escapeHtml(token.v);
    if (color) {
      html += `<span style="color:${color}">${escaped}</span>`;
    } else {
      html += escaped;
    }
  }
  return html;
}
