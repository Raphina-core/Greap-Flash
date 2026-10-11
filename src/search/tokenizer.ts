export interface Token {
  text: string;      // en minúsculas
  line: number;      // 0-based
  col: number;
  inComment: boolean;
}

const WORD = /[\p{L}\p{N}_]+/gu;
const COMMENT_START = /\/\/|#|--|\/\*/;

export function tokenize(lines: string[]): Token[] {
  const tokens: Token[] = [];
  let inBlock = false;

  lines.forEach((text, line) => {
    let commentStart = -1;

    if (inBlock) {
      commentStart = 0;
      if (text.includes('*/')) inBlock = false;
    } else {
      const m = COMMENT_START.exec(text);
      if (m) {
        commentStart = m.index;
        if (m[0] === '/*') inBlock = !text.includes('*/', m.index + 2)
      }
    }

    for (const m of text.matchAll(WORD)) {
      tokens.push({
        text: m[0].toLowerCase(),
        line,
        col: m.index!,
        inComment: commentStart !== -1 && m.index! >= commentStart,
      });
    }
  });

  return tokens;
}