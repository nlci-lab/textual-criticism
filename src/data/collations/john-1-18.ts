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

/** Site witness id for a profile link; CNTR's w= id for its page viewer. */
export const witnesses: Witness[] = [
  { id: 'P66', siglum: '𝔓⁶⁶', label: 'Papyrus 66', date: 'c. 200', cntr: 'm10066', profile: 'p66' },
  { id: 'P75', siglum: '𝔓⁷⁵', label: 'Papyrus 75', date: '3rd c.', cntr: 'm10075', profile: 'p75' },
  { id: '01', siglum: 'א', siglumLang: 'he', label: 'Codex Sinaiticus', date: '4th c.', cntr: 'm20001', profile: 'sinaiticus' },
  { id: '03', siglum: 'B', label: 'Codex Vaticanus', date: '4th c.', cntr: 'm20003', profile: 'vaticanus' },
  { id: '02', siglum: 'A', label: 'Codex Alexandrinus', date: '5th c.', cntr: 'm20002', profile: 'alexandrinus' },
  { id: '04', siglum: 'C', label: 'Codex Ephraemi', date: '5th c.', cntr: 'm20004' },
  { id: '032', siglum: 'W', label: 'Codex Washingtonianus', date: '5th c.', cntr: 'm20032' },
];

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
