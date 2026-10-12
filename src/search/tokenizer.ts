import { fold } from './normalize';

export interface Token {
  text: string;      // sin acentos y en minúsculas
  line: number;      // 0-based
  col: number;
  inComment: boolean;
}

interface CommentSyntax {
  line: string[];
  block?: [string, string];
}

const C_LIKE: CommentSyntax = { line: ['//'], block: ['/*', '*/'] };
const HASH: CommentSyntax = { line: ['#'] };
const NONE: CommentSyntax = { line: [] };

const SYNTAX: Record<string, CommentSyntax> = {
  javascript: C_LIKE, typescript: C_LIKE, javascriptreact: C_LIKE, typescriptreact: C_LIKE,
  java: C_LIKE, c: C_LIKE, cpp: C_LIKE, csharp: C_LIKE, go: C_LIKE, rust: C_LIKE,
  kotlin: C_LIKE, swift: C_LIKE, dart: C_LIKE, scss: C_LIKE,
  php: { line: ['//', '#'], block: ['/*', '*/'] },
  css: { line: [], block: ['/*', '*/'] },
  python: HASH, ruby: HASH, shellscript: HASH, yaml: HASH, powershell: HASH, dockerfile: HASH,
  sql: { line: ['--'], block: ['/*', '*/'] },
  lua: { line: ['--'] },
  html: { line: [], block: ['<!--', '-->'] },
  plaintext: NONE, markdown: NONE,
};
const DEFAULT: CommentSyntax = { line: ['//', '#'], block: ['/*', '*/'] };

const WORD = /[\p{L}\p{M}\p{N}_]+/gu;

/** Rangos [inicio, fin) de comentarios en una línea, ignorando lo que está dentro de strings. */
function commentRanges(text: string, syn: CommentSyntax, inBlock: boolean) {
  const ranges: [number, number][] = [];
  let i = 0;
  let quote: string | null = null;
  let blockStart = inBlock ? 0 : -1;

  while (i < text.length) {
    if (blockStart !== -1) {                       // dentro de un comentario de bloque
      const end = text.indexOf(syn.block![1], i);
      if (end === -1) {
        ranges.push([blockStart, text.length]);
        return { ranges, inBlock: true };
      }
      i = end + syn.block![1].length;
      ranges.push([blockStart, i]);
      blockStart = -1;
      continue;
    }
    const ch = text[i];
    if (quote) {                                   // dentro de un string
      if (ch === '\\') i += 2;
      else {
        if (ch === quote) quote = null;
        i++;
      }
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; i++; continue; }
    if (syn.block && text.startsWith(syn.block[0], i)) {
      blockStart = i;
      i += syn.block[0].length;
      continue;
    }
    if (syn.line.some(p => text.startsWith(p, i))) {
      ranges.push([i, text.length]);
      break;
    }
    i++;
  }
  return { ranges, inBlock: blockStart !== -1 };
}

export function tokenize(lines: string[], languageId = 'plaintext'): Token[] {
  const syn = SYNTAX[languageId] ?? DEFAULT;
  const tokens: Token[] = [];
  let inBlock = false;

  lines.forEach((text, line) => {
    const res = commentRanges(text, syn, inBlock);
    inBlock = res.inBlock;

    for (const m of text.matchAll(WORD)) {
      const col = m.index!;
      tokens.push({
        text: fold(m[0]),            // aquí se usa el normalizador de acentos
        line,
        col,
        inComment: res.ranges.some(([a, b]) => col >= a && col < b),
      });
    }
  });

  return tokens;
}