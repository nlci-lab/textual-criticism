// A small collation engine built for textual criticism, run at build time.
// 1. Read a CNTR transcription line (Manuscript Encoding Specification, see MES.g4 in the CNTR repo)
//    into words, keeping nomina sacra, damaged and missing letters, and first hand vs corrector.
// 2. Align each witness against a base text word by word.
// 3. Name each difference (same, spelling only, different word, missing, added, changed order)
//    and gather witnesses into readings for each variation unit defined by an editor.
// The machine proposes; the editor's unit list and glosses decide what is shown.

export interface Glyph { c: string; dmg?: boolean; miss?: boolean }
export interface MsWord { glyphs: Glyph[]; ns: boolean; supplied: boolean; raw: string; norm: string; ortho: string }
export interface Layer { hand: 'first' | 'corrected'; words: MsWord[] }

// ---- normalisation ------------------------------------------------------------------------

/** Nomina sacra and the forms they stand for (contracted spelling -> full, unaccented). */
const NOMINA: Record<string, string> = {
  θσ: 'θεοσ', θυ: 'θεου', θω: 'θεω', θν: 'θεον', θε: 'θεε',
  κσ: 'κυριοσ', κυ: 'κυριου', κω: 'κυριω', κν: 'κυριον', κε: 'κυριε',
  ισ: 'ιησουσ', ιυ: 'ιησου', ιν: 'ιησουν',
  χσ: 'χριστοσ', χυ: 'χριστου', χω: 'χριστω', χν: 'χριστον',
  υσ: 'υιοσ', υυ: 'υιου', υω: 'υιω', υν: 'υιον',
  πηρ: 'πατηρ', πρσ: 'πατροσ', πρι: 'πατρι', πρα: 'πατερα', περ: 'πατερ',
  πνα: 'πνευμα', πνσ: 'πνευματοσ', πνι: 'πνευματι',
  ανοσ: 'ανθρωποσ', ανου: 'ανθρωπου', ανω: 'ανθρωπω', ανον: 'ανθρωπον',
  σηρ: 'σωτηρ', στσ: 'σταυροσ', ιηλ: 'ισραηλ', ουνοσ: 'ουρανοσ', ουνου: 'ουρανου',
};

/** Lower case, no accents or breathings, final sigma as σ. */
export function plain(s: string): string {
  return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/ς/g, 'σ');
}

/**
 * Spelling key: folds the common scribal spellings that do not make a different word
 * (ει/ι, αι/ε, ω/ο, doubled letters, movable ν). Two words with the same key are "spelling only".
 */
export function ortho(s: string): string {
  return plain(s).replace(/ει/g, 'ι').replace(/αι/g, 'ε').replace(/ω/g, 'ο').replace(/η/g, 'ι')
    .replace(/(.)\1/g, '$1').replace(/(ε|ι)ν$/, '$1');
}

// ---- reading CNTR markup ---------------------------------------------------------------------

function parseWords(src: string): MsWord[] {
  const out: MsWord[] = [];
  for (let tok of src.trim().split(/\s+/)) {
    if (!tok) continue;
    const raw = tok;
    tok = tok.replace(/[\\|/&*_⋄]\d*/g, '').replace(/^[+-]/, '');   // breaks, lacuna remnants, word-division marks
    let ns = false, supplied = false;
    if (tok.startsWith('~')) { supplied = true; tok = tok.slice(1); }
    if (tok.startsWith('=')) { ns = true; tok = tok.slice(1); }
    if (tok.startsWith('$')) tok = tok.slice(1);
    const glyphs: Glyph[] = [];
    for (const ch of tok) {
      if (ch === '%') { if (glyphs.length) glyphs[glyphs.length - 1].dmg = true; continue; }
      if (ch === '^') { if (glyphs.length) glyphs[glyphs.length - 1].miss = true; continue; }
      if (ch === '¯') { glyphs.push({ c: '̄' }); continue; }           // suspension stroke = ν
      glyphs.push({ c: ch });
    }
    if (!glyphs.length) continue;
    const letters = glyphs.map((g) => (g.c === '̄' ? 'ν' : g.c)).join('');
    const full = ns ? NOMINA[letters] ?? letters : letters;
    out.push({ glyphs, ns, supplied, raw, norm: plain(full), ortho: ortho(full) });
  }
  return out;
}

/**
 * Split a verse into the first hand's text and the corrected text.
 * MES: x{original} {first correction} a{second} …  (an empty {} means nothing written).
 */
export function parseMes(line: string): Layer[] {
  const first: string[] = [], corr: string[] = [];
  let hasCorr = false;
  const re = /x\{([^}]*)\}\s*\{([^}]*)\}((?:\s*[a-c]\{[^}]*\})*)/g;
  let last = 0, m: RegExpExecArray | null;
  while ((m = re.exec(line))) {
    const before = line.slice(last, m.index);
    first.push(before); corr.push(before);
    first.push(m[1]);
    const later = [...m[3].matchAll(/[a-c]\{([^}]*)\}/g)].map((x) => x[1]);
    corr.push(later.length ? later[later.length - 1] : m[2]);
    hasCorr = true;
    last = re.lastIndex;
  }
  first.push(line.slice(last)); corr.push(line.slice(last));
  const layers: Layer[] = [{ hand: 'first', words: parseWords(first.join(' ')) }];
  if (hasCorr) layers.push({ hand: 'corrected', words: parseWords(corr.join(' ')) });
  return layers;
}

// ---- alignment -------------------------------------------------------------------------------

export type Kind = 'same' | 'spelling' | 'different' | 'missing' | 'added' | 'order';
export interface Slot { word: MsWord | null; kind: Kind }
export interface Added { word: MsWord; kind: Kind; origin?: number }   // origin: base index of a word that moved here
export interface Aligned { slots: Slot[]; adds: Map<number, Added[]> }   // adds keyed by "after base index" (-1 = before the first)

function cost(a: string, w: MsWord): number {
  if (a === w.norm) return 0;
  if (ortho(a) === w.ortho) return 0.2;
  // A short word (article, particle) never stands in for a long one: treat that as one word missing and one added.
  if (Math.min(a.length, w.norm.length) <= 2 && Math.max(a.length, w.norm.length) >= 4) return 2.1;
  return 1.5;   // under two gaps (2), so a different word stays one substitution; over 1+0.2, so a moved word becomes a move
}

/** Needleman–Wunsch alignment of the witness against the base, then a pass that finds changes of order. */
export function align(base: string[], wit: MsWord[]): Aligned {
  const B = base.map(plain), n = B.length, m = wit.length, GAP = 1;
  const D: number[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(0));
  for (let i = 1; i <= n; i++) D[i][0] = i * GAP;
  for (let j = 1; j <= m; j++) D[0][j] = j * GAP;
  for (let i = 1; i <= n; i++) for (let j = 1; j <= m; j++)
    D[i][j] = Math.min(D[i - 1][j - 1] + cost(B[i - 1], wit[j - 1]), D[i - 1][j] + GAP, D[i][j - 1] + GAP);
  const slots: Slot[] = new Array(n);
  const adds = new Map<number, Added[]>();
  let i = n, j = m;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + cost(B[i - 1], wit[j - 1])) {
      const c = cost(B[i - 1], wit[j - 1]);
      slots[i - 1] = { word: wit[j - 1], kind: c === 0 ? 'same' : c < 1 ? 'spelling' : 'different' }; i--; j--;
    } else if (j > 0 && D[i][j] === D[i][j - 1] + GAP) {
      // On a tie, attach an added word after the base word just passed, so it joins the unit that follows it.
      const list = adds.get(i - 1) ?? []; list.unshift({ word: wit[j - 1], kind: 'added' }); adds.set(i - 1, list); j--;
    } else {
      slots[i - 1] = { word: null, kind: 'missing' }; i--;
    }
  }
  // A base word missing here and the same word added within two places = a change of order.
  slots.forEach((s, k) => {
    if (s.kind !== 'missing') return;
    for (let after = k - 3; after <= k + 2; after++) {
      const hit = adds.get(after)?.find((a) => a.kind === 'added' && ortho(base[k]) === a.word.ortho);
      if (hit) { hit.kind = 'order'; hit.origin = k; s.kind = 'order'; break; }
    }
  });
  return { slots, adds };
}

// ---- variation units -------------------------------------------------------------------------

export interface Witness { id: string; siglum: string; siglumLang?: string; label: string; date: string; cntr: string; profile?: string; ga?: string; material?: string; holding?: string; ntvmr?: number; from?: number }
export interface UnitDef { label: string; from: number; to: number; note?: string; glosses: Record<string, string> }
export interface Row { w: Witness; hand: 'first' | 'corrected'; sigla: string; al: Aligned }
export interface Reading { key: string; words: MsWord[]; gloss?: string; isBase: boolean; rows: Row[]; odd: number }

/** Build one row per witness, plus a corrected row where the corrector changed the text. */
export function rows(base: string[], witnesses: Witness[], lines: Record<string, string | null>): Row[] {
  const out: Row[] = [];
  for (const w of witnesses) {
    const line = lines[w.id];
    if (!line) continue;
    const layers = parseMes(line);
    for (const L of layers)
      out.push({ w, hand: L.hand, sigla: layers.length > 1 ? (L.hand === 'first' ? '*' : 'ᶜ') : '', al: align(base, L.words) });
  }
  return out;
}

/** The words a row has inside a unit: base positions from..to, plus words added just before and inside it. */
export function unitWords(r: Row, u: UnitDef): { word: MsWord; kind: Kind }[] {
  const inUnit = (x: number) => u.from <= x && x <= u.to;
  const leads = (k: number) => (u.from <= u.to ? k >= u.from - 1 && k < u.to : k === u.from - 1);
  const out: { word: MsWord; kind: Kind }[] = [];
  for (let k = -1; k < r.al.slots.length; k++) {
    if (k >= 0 && inUnit(k)) { const s = r.al.slots[k]; if (s.word) out.push({ word: s.word, kind: s.kind }); }
    // A moved word belongs to the unit of the place it moved from; other added words to the unit they precede.
    for (const a of r.al.adds.get(k) ?? []) if (a.origin !== undefined ? inUnit(a.origin) : leads(k)) out.push(a);
  }
  return out;
}

/** Gather rows into readings for a unit (spelling differences do not split a reading). */
export function readings(base: string[], rs: Row[], u: UnitDef): Reading[] {
  const baseKey = base.slice(u.from, u.to + 1).map(ortho).join(' ');
  const groups = new Map<string, Reading>();
  for (const r of rs) {
    const ws = unitWords(r, u);
    const key = ws.map((x) => x.word.ortho).join(' ');
    // A corrected row joins only if it differs from the first hand here.
    if (r.hand === 'corrected') {
      const first = rs.find((x) => x.w.id === r.w.id && x.hand === 'first');
      if (first && unitWords(first, u).map((x) => x.word.ortho).join(' ') === key) continue;
    }
    const g = groups.get(key) ?? { key, words: ws.map((x) => x.word), isBase: key === baseKey, rows: [], gloss: undefined, odd: Infinity };
    // Show the reading in the spelling of the witness closest to standard spelling.
    const odd = ws.filter((x) => x.kind === 'spelling').length + ws.reduce((n, x) => n + x.word.glyphs.filter((c) => c.dmg || c.miss).length, 0);
    if (odd < g.odd) { g.words = ws.map((x) => x.word); g.odd = odd; }
    g.rows.push(r);
    groups.set(key, g);
  }
  const glossKeys = Object.fromEntries(Object.entries(u.glosses).map(([k, v]) => [k.split(' ').filter(Boolean).map(ortho).join(' '), v]));
  const list = [...groups.values()].map((g) => ({ ...g, gloss: glossKeys[g.key] }));
  return list.sort((a, b) => +b.isBase - +a.isBase);
}

/** Witness sigla as shown: first hand gets *, corrected gets ᶜ, only where the corrector changed this unit. */
export function siglum(r: Row, rs: Row[], u: UnitDef): string {
  if (!r.sigla) return r.w.siglum;
  const other = rs.find((x) => x.w.id === r.w.id && x.hand !== r.hand);
  if (!other) return r.w.siglum;
  const same = unitWords(other, u).map((x) => x.word.ortho).join(' ') === unitWords(r, u).map((x) => x.word.ortho).join(' ');
  return same ? r.w.siglum : r.w.siglum + r.sigla;
}
