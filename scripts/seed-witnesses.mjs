// Create witness files from cached INTF Liste records (src/data/intf/*.json).
// Only Liste facts become sourced fields; names and sigla come from the table below.
// Never overwrites an existing witness file. Usage: node scripts/seed-witnesses.mjs
import { readdir, readFile, writeFile, access } from 'node:fs/promises';
import * as yaml from 'js-yaml';

// GA -> how UBS prints it. Scoped letters (D, E, F, G, H, K, L, P) mean different manuscripts in different parts of the NT.
// Whether UBS5 adds superscripts (Eᵃ, Dᵖ…) is unverified, so the plain letter is the siglum and the superscript form an alias.
const TABLE = {
  '02': { id: 'alexandrinus', siglum: 'A', names: ['Codex Alexandrinus'] },
  '04': { id: 'ephraemi', siglum: 'C', names: ['Codex Ephraemi Rescriptus'], aliases: ['Ephraemi'] },
  '06': { id: 'claromontanus', siglum: 'D', scope: "Paul's letters", names: ['Codex Claromontanus'], aliases: ['D06', 'Dp'] },
  '07': { id: 'basilensis', siglum: 'E', scope: 'the Gospels', names: ['Codex Basilensis'], aliases: ['E07'] },
  '08': { id: 'laudianus', siglum: 'E', scope: 'Acts', names: ['Codex Laudianus'], aliases: ['E08', 'Ea'] },
  '09': { id: 'boreelianus', siglum: 'F', scope: 'the Gospels', names: ['Codex Boreelianus'], aliases: ['F09'] },
  '010': { id: 'augiensis', siglum: 'F', scope: "Paul's letters", names: ['Codex Augiensis'], aliases: ['F010', 'Fp'] },
  '011': { id: 'seidelianus-i', siglum: 'G', scope: 'the Gospels', names: ['Codex Seidelianus I'], aliases: ['G011'] },
  '012': { id: 'boernerianus', siglum: 'G', scope: "Paul's letters", names: ['Codex Boernerianus'], aliases: ['G012', 'Gp'] },
  '013': { id: 'seidelianus-ii', siglum: 'H', scope: 'the Gospels', names: ['Codex Seidelianus II'], aliases: ['H013'] },
  '014': { id: 'mutinensis', siglum: 'H', scope: 'Acts', names: ['Codex Mutinensis'], aliases: ['H014', 'Ha'] },
  '015': { id: 'coislinianus', siglum: 'H', scope: "Paul's letters", names: ['Codex Coislinianus'], aliases: ['H015', 'Hp'] },
  '017': { id: 'cyprius', siglum: 'K', scope: 'the Gospels', names: ['Codex Cyprius'], aliases: ['K017'] },
  '018': { id: 'mosquensis', siglum: 'K', scope: 'Acts and the letters', names: ['Codex Mosquensis'], aliases: ['K018', 'Kap'] },
  '019': { id: 'regius', siglum: 'L', scope: 'the Gospels', names: ['Codex Regius'], aliases: ['L019'] },
  '020': { id: 'angelicus', siglum: 'L', scope: 'Acts and the letters', names: ['Codex Angelicus'], aliases: ['L020', 'Lap'] },
  '024': { id: 'guelferbytanus-a', siglum: 'P', scope: 'the Gospels', names: ['Codex Guelferbytanus A'], aliases: ['P024'] },
  '025': { id: 'porphyrianus', siglum: 'P', scope: 'Acts, the letters and Revelation', names: ['Codex Porphyrianus'], aliases: ['P025', 'Papr'] },
  '032': { id: 'washingtonianus', siglum: 'W', names: ['Codex Washingtonianus', 'Freer Gospels'], aliases: ['Freer'] },
  '037': { id: 'sangallensis', siglum: 'Δ', names: ['Codex Sangallensis'], aliases: ['Delta'] },
  '038': { id: 'koridethi', siglum: 'Θ', names: ['Codex Koridethi'], aliases: ['Theta', 'Koridethianus'] },
  '044': { id: 'athous-lavrensis', siglum: 'Ψ', names: ['Codex Athous Lavrensis'], aliases: ['Psi'] },
};

const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const ORD = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
const ROMAN = { I: 1, II: 2, III: 3, IV: 4, V: 5, VI: 6, VII: 7, VIII: 8, IX: 9, X: 10, XI: 11, XII: 12, XIII: 13, XIV: 14, XV: 15, XVI: 16 };
const PART = { A: 'early ', M: 'mid-', E: 'late ' };

/** INTF date notation -> plain English: "III (A)" or "A III" -> "early 3rd century", "III/IV" -> "3rd or 4th century". */
function dateLabel(orig) {
  const m = orig.match(/^(?:([AME])\s+)?([IVX]+)(?:\/([IVX]+))?(?:\s*\(([AME])\))?$/);
  if (!m) return orig;
  if (m[3]) return `${ORD(ROMAN[m[2]])} or ${ORD(ROMAN[m[3]])} century`;
  const part = m[1] ?? m[4];
  return `${part ? PART[part] : ''}${ORD(ROMAN[m[2]])} century`;
}

const PARTS = { e: 'the Gospels', a: 'Acts and the Catholic letters', p: "Paul's letters", r: 'Revelation' };
// INTF book abbreviations in verse lists -> our book ids and English names.
const INTF_BOOK = {
  Mt: ['Mt', 'Matthew'], Mk: ['Mk', 'Mark'], L: ['Lk', 'Luke'], J: ['Jn', 'John'], Act: ['Ac', 'Acts'], Jc: ['Jas', 'James'],
  '1P': ['1Pe', '1 Peter'], '2P': ['2Pe', '2 Peter'], '1J': ['1Jn', '1 John'], '2J': ['2Jn', '2 John'], '3J': ['3Jn', '3 John'], Jd: ['Jd', 'Jude'],
  R: ['Ro', 'Romans'], '1K': ['1Cor', '1 Corinthians'], '2K': ['2Cor', '2 Corinthians'], G: ['Ga', 'Galatians'], E: ['Eph', 'Ephesians'],
  Ph: ['Php', 'Philippians'], Kol: ['Col', 'Colossians'], '1Th': ['1Th', '1 Thessalonians'], '2Th': ['2Th', '2 Thessalonians'],
  H: ['He', 'Hebrews'], '1T': ['1Tm', '1 Timothy'], '2T': ['2Tm', '2 Timothy'], Tt: ['Tt', 'Titus'], Phm: ['Phm', 'Philemon'], Ap: ['Re', 'Revelation'],
};
const list = (xs) => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs.at(-1)}` : xs[0] ?? '');

/**
 * INTF contents -> { words, books }. Two forms occur:
 * a section code ("eapr †", "p", "eP: Mt": lower-case e/a/p/r = sections, capital P = only part survives,
 * text after ":" names the books), or a verse list ("J 18,31-33; Ap 9,10-11,3").
 */
function parseContents(all) {
  const books = new Map();
  const names = [];
  let gaps = false;
  for (const code of all) {
    const m = code.match(/^([eapr]+)(P?)\s*†?\s*(?::\s*(.*))?$/);
    if (m) {
      const partial = m[2] === 'P'; // † means some leaves are lost, handled below
      if (/†/.test(code)) gaps = true;
      const named = (m[3] ?? '').split(/[;,\s]+/).map((x) => INTF_BOOK[x]).filter(Boolean);
      if (named.length) named.forEach(([id, n]) => { books.set(id, 'partial'); names.push(n); });
      // A bare section code says which parts of the NT are present, not that every book in them is: no per-book bars.
      else for (const ch of m[1]) names.push(`${partial ? 'parts of ' : ''}${PARTS[ch]}`);
      continue;
    }
    if (INTF_BOOK[code.trim()]) { const b = INTF_BOOK[code.trim()]; if (!books.has(b[0])) { books.set(b[0], 'partial'); names.push(b[1]); } continue; }
    for (const [, abbr] of code.matchAll(/(?:^|;\s*)(\d?[A-Z][a-z]*)\s+\d/g)) {
      const b = INTF_BOOK[abbr];
      if (b && !books.has(b[0])) { books.set(b[0], 'partial'); names.push(b[1]); }
    }
  }
  const uniq = [...new Set(names)];
  const words = uniq.length && !uniq.some((n) => n.includes(' letters') || n.includes('Gospels')) ? `parts of ${list(uniq)}` : list(uniq);
  return { words: words && gaps ? `${words}, with some leaves lost` : words, books };
}

const PLACE = { 'Wien': 'Vienna', 'Cologny/Genf': 'Cologny, Geneva', 'Genf': 'Geneva', 'Köln': 'Cologne', 'München': 'Munich', 'Città del Vaticano': 'Vatican City', 'Firenze': 'Florence', 'Venezia': 'Venice', 'Roma': 'Rome', 'Moskva': 'Moscow', 'Sankt-Peterburg': 'St Petersburg', 'Athen': 'Athens', 'Kairo': 'Cairo' };
const place = (p) => PLACE[p] ?? p;
const nLeaves = (s) => Number(String(s.leaves).match(/\d+/)?.[0] ?? 0);
const category = (ga) => (ga.startsWith('P') ? 'papyrus' : ga.startsWith('L') ? 'lectionary' : ga.startsWith('0') ? 'majuscule' : 'minuscule');
const exists = (p) => access(p).then(() => true, () => false);

for (const f of (await readdir('src/data/intf')).filter((x) => x.endsWith('.json'))) {
  const r = JSON.parse(await readFile(`src/data/intf/${f}`, 'utf8'));
  const ga = r.ga;
  const cat = category(ga);
  const t = TABLE[ga] ?? {};
  const id = t.id ?? (cat === 'papyrus' ? ga.toLowerCase() : cat === 'lectionary' ? `l${ga.slice(1)}` : `ms-${ga}`);
  const file = `src/content/witnesses/${id}.md`;
  if (await exists(file)) { console.log(`skip ${ga} (${file} exists)`); continue; }
  // Also skip GA numbers already covered by a hand-written profile with another id.
  const existing = await readdir('src/content/witnesses');
  let covered = false;
  for (const e of existing) if ((await readFile(`src/content/witnesses/${e}`, 'utf8')).includes(`ntvmr_doc_id: ${r.docID}\n`)) covered = true;
  if (covered) { console.log(`skip ${ga} (already has a profile)`); continue; }

  const num = ga.replace(/^P/, '');
  const siglum = t.siglum ?? (cat === 'papyrus' ? `𝔓${[...num].map((d) => SUP[d]).join('')}` : cat === 'lectionary' ? `ℓ ${ga.slice(1)}` : ga);
  const names = t.names ?? [cat === 'papyrus' ? `Papyrus ${num}` : cat === 'lectionary' ? `Lectionary ${ga.slice(1)}` : `Minuscule ${ga}`];
  const aliases = [...new Set([...(t.aliases ?? []), ga, ...(cat === 'papyrus' ? [`P${num}`, `𝔓${num}`] : [])])];
  const date = dateLabel(r.orig);
  const main = [...r.shelves].sort((a, b) => nLeaves(b) - nLeaves(a))[0];
  const content = main?.content ?? '';
  const { words, books } = parseContents(r.shelves.map((s) => s.content).filter(Boolean));
  const catWord = { papyrus: 'papyrus', majuscule: 'majuscule', minuscule: 'minuscule', lectionary: 'lectionary' }[cat];
  const lead = `A Greek ${catWord} manuscript${words ? ` of ${words}` : ''}, from the ${date}${main ? `, now ${r.shelves.length > 1 ? 'mostly ' : ''}in ${place(main.place)}` : ''}.`;
  const leaves = r.shelves.map((s) => s.leaves).filter((x) => x && x !== '?' && x !== '0');

  const data = {
    id, kind: 'greek_ms', siglum,
    ...(t.scope ? { siglum_scope: t.scope } : {}),
    names, aliases, lead,
    date: { label: date, from: r.early, to: r.late, basis: `INTF date: ${r.orig}.`, src: ['intf'] },
    links: [
      { label: `INTF NT.VMR record (GA ${ga})`, url: `https://ntvmr.uni-muenster.de/manuscript-workspace?docID=${r.docID}`, kind: 'record', licence: 'unconfirmed' },
    ],
    sources: [
      { id: 'intf', cite: `INTF, Kurzgefasste Liste, NT.VMR record for ${ga} (docID ${r.docID}), retrieved ${r.retrieved}.`, url: r.url, checked: true },
    ],
    unverified: [],
    ubs5_list_checked: false,
    last_checked: r.retrieved,
    greek_ms: {
      ga, ntvmr_doc_id: r.docID, category: cat,
      ...(cat === 'papyrus' ? { material: { value: 'papyrus', src: ['intf'] } } : {}),
      ...(leaves.length === 1 ? { leaves: { value: leaves[0], src: ['intf'] } } : leaves.length > 1 ? { leaves: { value: `${leaves.reduce((a, b) => a + (Number(b) || 0), 0)} in ${leaves.length} places`, src: ['intf'] } } : {}),
      ...(content ? { content_letters: { value: r.shelves.length > 1 ? r.shelves.map((s) => s.content).join('; ') : content, src: ['intf'] } } : {}),
      contents: [...books].map(([book, status]) => ({ book, status })),
      contents_src: ['intf'],
      holdings: r.shelves.map((s) => ({
        institution: s.institution, place: place(s.place), shelfmark: s.shelfmark,
        ...(r.shelves.length > 1 ? { note: [nLeaves(s) ? `${s.leaves} leaves` : '', s.content].filter(Boolean).join(': ') } : {}),
        src: ['intf'],
      })),
    },
  };
  if (r.supplemental) data.unverified.push({ claim: `INTF lists supplemented portions: ${r.supplemental}.`, from: 'INTF Liste; meaning of the field to confirm' });
  await writeFile(file, `---\n${yaml.dump(data, { lineWidth: 140, quotingType: '"' })}---\n`);
  console.log(`wrote ${file}`);
}
