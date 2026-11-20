// Greek -> Latin transliteration, SBL academic style, rule based.
// Rough breathing gives h (rh on rho), iota subscript gives i, other accents are dropped.
// Dependency-free so scripts/translit-test.mjs can load it with Node's type stripping.

const MAP: Record<string, string> = {
  α: 'a', β: 'b', γ: 'g', δ: 'd', ε: 'e', ζ: 'z', η: 'ē', θ: 'th', ι: 'i', κ: 'k', λ: 'l', μ: 'm',
  ν: 'n', ξ: 'x', ο: 'o', π: 'p', ρ: 'r', σ: 's', ς: 's', ϲ: 's', τ: 't', υ: 'y', φ: 'ph', χ: 'ch',
  ψ: 'ps', ω: 'ō',
};
const ROUGH = '̔', DIAER = '̈', YPOG = 'ͅ';

interface Ch { b: string; up: boolean; marks: string }

function chars(w: string): Ch[] {
  const out: Ch[] = [];
  for (const c of w.normalize('NFD')) {
    if (/[̀-ͯ]/.test(c)) { if (out.length) out[out.length - 1].marks += c; continue; }
    const lo = c.toLowerCase();
    out.push({ b: lo, up: lo !== c, marks: '' });
  }
  return out;
}

function word(w: string): string {
  const cs = chars(w);
  if (!cs.length) return '';
  // A rough breathing sits on the first vowel, or on the second vowel of an opening diphthong.
  const rough = cs.slice(0, 2).some((c) => c.marks.includes(ROUGH));
  let out = '';
  cs.forEach((c, i) => {
    const next = cs[i + 1], prev = cs[i - 1];
    let t = MAP[c.b];
    if (t === undefined) { out += c.b; return; }
    if (c.b === 'γ' && next && 'γκξχ'.includes(next.b)) t = 'n';
    if (c.b === 'υ' && !c.marks.includes(DIAER)
      && ((prev && 'αεηο'.includes(prev.b)) || (next && next.b === 'ι' && !next.marks.includes(DIAER)))) t = 'u';
    if (c.b === 'ρ' && i === 0 && rough) t = 'rh';
    if (c.marks.includes(YPOG)) t += 'i';
    out += t;
  });
  if (rough && cs[0].b !== 'ρ') out = 'h' + out;
  if (cs[0].up) out = out[0].toUpperCase() + out.slice(1);
  return out;
}

/** Transliterate Greek text; anything else (spaces, punctuation) passes through. */
export function translit(s: string): string {
  return s.replace(/[Ͱ-Ͽἀ-῿][̀-ͯͰ-Ͽἀ-῿]*/g, (m) => word(m)).replace(/·/g, '·');
}

/**
 * A manuscript word (written without breathings): transliterate its plain, expanded form and
 * borrow a rough breathing from the base word it lines up with. Initial υ and ρ always take one.
 */
export function translitMs(norm: string, base?: string): string {
  const roughBase = !!base && base.normalize('NFD').slice(0, 4).includes(ROUGH);
  const t = translit(norm);
  if (!t) return t;
  if (norm[0] === 'ρ') return 'rh' + t.slice(1);
  if (roughBase || norm[0] === 'υ') return 'h' + t;
  return t;
}
