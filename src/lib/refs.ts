// Bible reference parsing for the concordance search. Shared by the build and the browser.
// "John 1:18", "jn 1.18", "Jas 2:20", "Mark 16:9–20", "John 7:53–8:11", "Luke 23:34a", "Acts".

const BOOKS: [string, string[]][] = [
  ['Matthew', ['mt', 'mat', 'matt', 'matthew']], ['Mark', ['mk', 'mr', 'mrk', 'mar', 'mark']],
  ['Luke', ['lk', 'luk', 'luke']], ['John', ['jn', 'jhn', 'joh', 'john']], ['Acts', ['ac', 'act', 'acts']],
  ['Romans', ['ro', 'rom', 'romans']], ['1 Corinthians', ['1co', '1cor', '1corinthians']], ['2 Corinthians', ['2co', '2cor', '2corinthians']],
  ['Galatians', ['ga', 'gal', 'galatians']], ['Ephesians', ['eph', 'ephesians']], ['Philippians', ['php', 'phil', 'philippians']],
  ['Colossians', ['col', 'colossians']], ['1 Thessalonians', ['1th', '1thess', '1thessalonians']], ['2 Thessalonians', ['2th', '2thess', '2thessalonians']],
  ['1 Timothy', ['1tm', '1ti', '1tim', '1timothy']], ['2 Timothy', ['2tm', '2ti', '2tim', '2timothy']], ['Titus', ['tt', 'tit', 'titus']],
  ['Philemon', ['phm', 'phlm', 'philem', 'philemon']], ['Hebrews', ['he', 'heb', 'hebrews']], ['James', ['jas', 'jm', 'jam', 'james']],
  ['1 Peter', ['1pe', '1pet', '1peter']], ['2 Peter', ['2pe', '2pet', '2peter']], ['1 John', ['1jn', '1jo', '1john']],
  ['2 John', ['2jn', '2jo', '2john']], ['3 John', ['3jn', '3jo', '3john']], ['Jude', ['jd', 'jud', 'jude']],
  ['Revelation', ['re', 'rev', 'revelation', 'apocalypse']],
];
const ALIAS = new Map<string, string>();
for (const [name, as] of BOOKS) for (const a of as) ALIAS.set(a, name);

/** A passage as numbers: verse positions are chapter*1000+verse, so ranges across chapters compare simply. */
export interface Ref { book: string; from?: number; to?: number }

/** Parse one reference, or return null when the text does not start with a book name. */
export function parseRef(raw: string): Ref | null {
  const s = raw.normalize('NFKC').toLowerCase().replace(/[‐-―]/g, '-').replace(/\s+/g, ' ').trim();
  const m = /^([1-3]?)\s*([a-z]+)\.?\s*(.*)$/.exec(s);
  if (!m) return null;
  const book = ALIAS.get(m[1] + m[2]);
  if (!book) return null;
  const rest = m[3].replace(/[a-z]+\b/g, '').replace(/[()]/g, '').trim();   // drop 23:34a's "a", "(throughout)"
  if (!rest) return { book };
  const r = /^(\d+)(?:[:.](\d+))?(?:\s*-\s*(?:(\d+)[:.])?(\d+))?/.exec(rest);
  if (!r) return { book };
  const ch = +r[1];
  if (!r[2]) return { book, from: ch * 1000, to: ch * 1000 + 999 };
  const from = ch * 1000 + +r[2];
  const to = r[4] ? (r[3] ? +r[3] : ch) * 1000 + +r[4] : from;
  return { book, from, to };
}

/** True when two passages overlap (a bare book matches any passage in it). */
export function overlaps(a: Ref, b: Ref): boolean {
  if (a.book !== b.book) return false;
  if (a.from === undefined || b.from === undefined) return true;
  return a.from <= b.to! && b.from <= a.to!;
}

/** Display form: "John 7:53–8:11". */
export function formatRef(r: Ref): string {
  if (r.from === undefined) return r.book;
  const c1 = Math.floor(r.from / 1000), v1 = r.from % 1000, c2 = Math.floor(r.to! / 1000), v2 = r.to! % 1000;
  if (v1 === 0 && v2 === 999) return `${r.book} ${c1}`;
  if (r.from === r.to) return `${r.book} ${c1}:${v1}`;
  return c1 === c2 ? `${r.book} ${c1}:${v1}–${v2}` : `${r.book} ${c1}:${v1}–${c2}:${v2}`;
}
