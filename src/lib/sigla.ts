// Siglum normalisation and alias index (ADR 0003). Shared by the build and the browser search.

/** Words people type for Hebrew/Greek letter sigla. */
const LETTER_WORDS: Record<string, string> = {
  aleph: 'א', alef: 'א', delta: 'Δ', theta: 'Θ', psi: 'Ψ', xi: 'Ξ', pi: 'Π', sigma: 'Σ', phi: 'Φ', omega: 'Ω', gamma: 'Γ', lambda: 'Λ',
};

/** Fold a typed or pasted string into a lookup key. Superscripts = plain, 𝔓 = P, ƒ = f, ℓ = l. */
export function toKey(raw: string): string {
  let s = raw.normalize('NFKC')
    .replace(/[ƒ]/g, 'f')
    .replace(/[ᐟ⁄∕]/g, '/')
    .replace(/[‐-―]/g, '-')
    .replace(/\s+/g, ' ')
    .trim();
  if (!s) return '';
  const word = LETTER_WORDS[s.toLowerCase()];
  if (word) return word;
  // "family 13" / "fam 13" -> f13 ; "P 66" -> P66 ; "l 2211" -> l2211
  s = s.replace(/^(family|fam\.?)\s*(\d+)$/i, 'f$2').replace(/^([A-Za-z])\s+(\d+)$/, '$1$2');
  // Single letters stay case-sensitive (B ≠ b); everything else folds to lower case.
  return [...s].length === 1 ? s : s.toLowerCase();
}

/** Modifiers that can follow a siglum without changing which witness it is. */
const STRIPS: ((s: string) => string)[] = [
  (s) => s.replace(/\s*\d+\/\d+$/, ''),                                      // fractions: Origen 2/4
  (s) => s.replace(/\s*(vid|supp|txt|mg|com|lem|pt|gr|lat|dub|ed|pap|mss?)$/i, ''),
  (s) => s.replace(/\*$/, ''),                                               // original hand
  (s) => (/\D\d$/.test(s) ? s.slice(0, -1) : s),                             // corrector: B2 -> B, not P66
  (s) => (s.length > 1 ? s.replace(/c$/, '') : s),                           // last corrector: Bc -> B
];

/** Candidate keys from most to least specific: exact first, then with one modifier stripped at a time. */
export function candidateKeys(raw: string): string[] {
  const out: string[] = [];
  let s = raw.normalize('NFKC').replace(/[ᐟ⁄∕]/g, '/').trim();
  for (let guard = 0; guard < 8 && s; guard++) {
    const k = toKey(s);
    if (k && !out.includes(k)) out.push(k);
    const next = STRIPS.map((f) => f(s).trim()).find((t) => t && t !== s);
    if (!next) break;
    s = next;
  }
  return out;
}

/** Split a pasted run of sigla ("Byz [E F G H]", "𝔓66 א* B C*") into single items. */
export function splitRun(raw: string): string[] {
  return raw.replace(/[\[\]();,/]+/g, ' ').split(/\s+/).filter(Boolean);
}

export interface IndexEntry { id: string; siglum: string; name: string; scope?: string }
type W = { id: string; siglum: string; names: string[]; aliases: string[]; ga?: string; scope?: string };

/**
 * Build alias -> witnesses. A key may point to several witnesses only when every one of them
 * declares a siglum scope (D = 05 in Gospels and Acts, 06 in Paul); otherwise the build fails (ADR 0003).
 */
export function buildIndex(witnesses: W[]) {
  const map = new Map<string, IndexEntry[]>();
  const clashes: string[] = [];
  for (const w of witnesses) {
    const forms = new Set<string>([w.siglum, ...w.aliases, ...w.names, w.id]);
    if (w.ga) forms.add(w.ga);
    for (const n of w.names) forms.add(n.replace(/^Codex\s+/i, ''));
    for (const f of forms) {
      const k = toKey(f);
      if (!k) continue;
      const list = map.get(k) ?? [];
      if (list.some((e) => e.id === w.id)) continue;
      if (list.length && (!w.scope || list.some((e) => !e.scope))) clashes.push(`"${f}" -> ${list.map((e) => e.id).join(', ')} and ${w.id}`);
      list.push({ id: w.id, siglum: w.siglum, name: w.names[0], scope: w.scope });
      map.set(k, list);
    }
  }
  if (clashes.length) throw new Error(`Alias collisions need a siglum_scope on each witness:\n${clashes.join('\n')}`);
  return map;
}

