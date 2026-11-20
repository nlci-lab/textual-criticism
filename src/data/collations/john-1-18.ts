// John 1:18 collation: base text, glosses, witnesses and the editor's variation units.
// Manuscript text comes from src/data/cntr/43001018.json (CNTR, CC BY-SA 4.0).
import type { UnitDef, Witness } from '../../lib/collate';
import data from '../cntr/43001018.json';

export const verse = { ref: 'John 1:18', id: '43001018' };
export const data_ = data;

/** UBS5 text, one entry per word, with a plain English gloss. */
export const base: [string, string][] = [
  ['θεὸν', 'God'], ['οὐδεὶς', 'no one'], ['ἑώρακεν', 'has seen'], ['πώποτε', 'ever'],
  ['μονογενὴς', 'only'], ['θεὸς', 'God'], ['ὁ', 'the one'], ['ὢν', 'being'],
  ['εἰς', 'in'], ['τὸν', 'the'], ['κόλπον', 'bosom'], ['τοῦ', 'of the'], ['πατρὸς', 'Father'],
  ['ἐκεῖνος', 'that one'], ['ἐξηγήσατο', 'made known'],
];
export const english = 'No one has ever seen God; the only God, who is at the Father’s side, he has made him known.';

/** Every CNTR witness that has the verse, from the JSON's meta; `profile` links to a site profile
 *  where one exists (matched by `greek_ms.ga` in src/content/witnesses). */
const profileByGa: Record<string, string> = {};
for (const src of Object.values(import.meta.glob('../../content/witnesses/*.md', { query: '?raw', import: 'default', eager: true })) as string[]) {
  const id = src.match(/^id:\s*["']?([^"'\s]+)/m)?.[1];
  const ga = src.match(/^\s+ga:\s*["']?([^"'\s]+)/m)?.[1];
  if (id && ga) profileByGa[ga] = id;
}
type Meta = { kind?: 'manuscript' | 'edition'; ga: string; siglum: string; siglumLang?: string; name?: string; date?: string; from?: number; to?: number; material?: string; holding?: string; ntvmr?: number; cntr: string };
const metas = (data as unknown as { meta: Record<string, Meta> }).meta;
/** Printed editions follow the manuscripts: Byzantine, the two Textus Receptus texts, WH, SR. */
const EDITION_ORDER = ['RP', 'ST', 'KJTR', 'WH', 'SR'];
const order = (id: string, m: Meta) => m.kind === 'edition' ? [3, EDITION_ORDER.indexOf(id)]
  : [/^P\d/.test(m.ga) ? 0 : /^0\d/.test(m.ga) ? 1 : 2, Number(m.ga.replace(/^P/, ''))];
export const witnesses: Witness[] = Object.entries(metas)
  .sort(([i, a], [j, b]) => { const [x, y] = [order(i, a), order(j, b)]; return x[0] - y[0] || x[1] - y[1]; })
  .map(([id, m]) => ({
    id, kind: m.kind ?? 'manuscript', ga: m.ga, siglum: m.siglum, siglumLang: m.siglumLang, label: m.name ?? `GA ${m.ga}`, date: m.date ?? '',
    from: m.from, material: m.material, holding: m.holding, ntvmr: m.ntvmr, cntr: m.cntr,
    ...(profileByGa[m.ga] ? { profile: profileByGa[m.ga] } : {}),
  }));

/** Variation units, by base word index (0-based). Glosses are keyed by the reading's plain Greek. */
export const units: UnitDef[] = [
  { label: 'μονογενὴς θεός', note: 'The main question', from: 4, to: 5, glosses: {
    'μονογενης θεος': 'only God', 'ο μονογενης θεος': 'the only God', 'ο μονογενης υιος': 'the only Son', 'ει μη ο μονογενης υιος': 'except the only Son' } },
  { label: 'ὁ ὤν', note: 'who is', from: 6, to: 7, glosses: { 'ο ων': 'who is', '': 'without “who is”' } },
  { label: 'ἑώρακεν πώποτε', note: 'word order', from: 2, to: 3, glosses: { 'εωρακεν πωποτε': 'has seen ever', 'πωποτε εωρακεν': 'ever has seen' } },
  { label: 'at the end', note: 'an added word', from: 15, to: 14, glosses: { 'ημιν': 'to us' } },
];

/** Phrases for the word-by-word grid (base index ranges). */
/** Glosses for manuscript words that differ from the base (keyed by plain full spelling). */
export const glosses: Record<string, string> = { υιοσ: 'Son', ημιν: 'to us', ει: 'except', μη: '' };

export const phrases: [number, number][] = [[0, 2], [3, 5], [6, 9], [10, 12], [13, 14]];
