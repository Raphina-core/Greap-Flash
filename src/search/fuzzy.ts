const isBoundary = (s: string, i: number) => i === 0 || s[i - 1] === '_';

/** null = no hay match. Mayor score = mejor. */
export function fuzzyScore(query: string, target: string): number | null {
  let score = 0;
  let ti = 0;
  let prev = -2;

  for (let qi = 0; qi < query.length; qi++) {
    const idx = target.indexOf(query[qi], ti);
    if (idx === -1) return null;

    score += 1;
    if (isBoundary(target, idx)) score += 8;   // inicio de palabra
    if (idx === prev + 1) score += 5;          // consecutivo
    else score -= (idx - ti) * 0.3;            // penaliza huecos

    prev = idx;
    ti = idx + 1;
  }
  return score - target.length * 0.1;          // prefiere palabras cortas
}