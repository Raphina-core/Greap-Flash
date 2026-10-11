import { tokenize } from './tokenizer';
import { InvertedIndex } from './invertedIndex';
import { fuzzyScore } from './fuzzy';
import { levenshtein } from './levenshtein';

export interface Result { line: number; score: number; isComment: boolean; }

const COMMENT_BONUS = 4;

export class SearchEngine {
  private index: InvertedIndex;

  constructor(readonly lines: string[]) {
    this.index = new InvertedIndex(tokenize(lines));
  }

  search(query: string, limit = 50): Result[] {
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    if (terms.length === 0) return [];

    let acc: Map<number, number> | null = null;

    for (const term of terms) {
      const best = new Map<number, number>();

      // Se compara contra el vocabulario (palabras únicas), no contra cada línea
      for (const [word, lines] of this.index.postings) {
        let s = fuzzyScore(term, word);
        if (s === null && term.length >= 4 && Math.abs(term.length - word.length) <= 1
            && levenshtein(term, word) <= 1) {
          s = term.length;                      // tolera errores de dedo
        }
        if (s === null) continue;
        for (const l of lines) if (s > (best.get(l) ?? -Infinity)) best.set(l, s);
      }

      if (acc === null) acc = best;
      else {                                    // AND: la línea debe cumplir todos los términos
        const next = new Map<number, number>();
        for (const [l, s] of best) if (acc.has(l)) next.set(l, acc.get(l)! + s);
        acc = next;
      }
    }

    return [...acc!]
      .map(([line, s]) => {
        const isComment = this.index.commentLines.has(line);
        return { line, isComment, score: s + (isComment ? COMMENT_BONUS : 0) };
      })
      .sort((a, b) => b.score - a.score || a.line - b.line)
      .slice(0, limit);
  }
}