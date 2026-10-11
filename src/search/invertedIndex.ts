import { Token } from './tokenizer';

export class InvertedIndex {
  readonly postings = new Map<string, number[]>(); // palabra -> líneas
  readonly commentLines = new Set<number>();

  constructor(tokens: Token[]) {
    for (const t of tokens) {
      const lines = this.postings.get(t.text);
      if (!lines) this.postings.set(t.text, [t.line]);
      else if (lines[lines.length - 1] !== t.line) lines.push(t.line);
      if (t.inComment) this.commentLines.add(t.line);
    }
  }
}