// Copy single verses from CNTR's manuscript transcriptions into src/data/cntr/<verse>.json,
// so the site builds without the network. Pinned to one commit of the CNTR repository.
// Transcriptions © Alan Bunning, Center for New Testament Restoration, CC BY-SA 4.0.
// Usage: node scripts/cntr-fetch.mjs <BBCCCVVV> <ms> [<ms> ...]   e.g. 43001018 P66 P75 01 02 03 04 032
//        node scripts/cntr-fetch.mjs <BBCCCVVV> --all   every class 1–3 file that has the verse, plus the editions
//        node scripts/cntr-fetch.mjs <BBCCCVVV> --editions   only the printed editions in 'critical texts'
// Editions are accented and punctuated; punctuation, ¶ and SR's ˚ (nomen sacrum mark) are stripped so the
// MES parser reads them as plain words. Dates and names follow CNTR's Technical Reference abbreviation list.
// Downloads are cached in .cache/cntr/ and INTF metadata in .cache/intf/ (gitignored), so reruns are fast.
// Metadata (date, material, holding) comes from INTF NTVMR (src/data/intf/ is used first if present);
// when INTF has no record the fields are left empty, never guessed.
import { writeFile, readFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const REPO = 'Center-for-New-Testament-Restoration/transcriptions';
const COMMIT = '4e743a41a4b2ca010ece53229cd272aa59b1efe6';
const FOLDERS = ['class 1', 'class 2', 'class 3'];
const CACHE = '.cache/cntr';
const ICACHE = '.cache/intf';
const INTF = 'https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/';
const INTF_DELAY = Number(process.env.FETCH_DELAY_MS ?? 15000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const [verse, ...mss] = process.argv.slice(2);
if (!/^\d{8}$/.test(verse ?? '') || !mss.length) { console.error('usage: cntr-fetch.mjs <BBCCCVVV> (<ms>... | --all)'); process.exit(1); }

async function cached(file, get) {
  if (existsSync(file)) return readFile(file, 'utf8');
  const text = await get();
  if (text != null) await writeFile(file, text);
  return text;
}

async function raw(path) {
  const r = await fetch(`https://raw.githubusercontent.com/${REPO}/${COMMIT}/${path.split('/').map(encodeURIComponent).join('/')}`);
  // Every path comes from the pinned tree listing, so any failure (429, 503, …) is an error, never "not there".
  // Throwing here stops the run before the verse JSON is written, so a bad download can't drop a witness.
  if (!r.ok) throw new Error(`CNTR download failed: ${path} (${r.status} ${r.statusText})`);
  return r.text();
}

async function listAll() {
  const tree = JSON.parse(await cached(`${CACHE}/tree-${COMMIT}.json`, async () => {
    const r = await fetch(`https://api.github.com/repos/${REPO}/git/trees/${COMMIT}?recursive=1`, { headers: { 'User-Agent': 'cntr-fetch' } });
    if (!r.ok) throw new Error(`GitHub tree: ${r.status}`);
    return r.text();
  }));
  return tree.tree.filter((x) => x.type === 'blob' && FOLDERS.some((f) => x.path.startsWith(f + '/')) && x.path.endsWith('.txt')).map((x) => x.path);
}

async function fetchPath(path) {
  return cached(`${CACHE}/${path.replace(/[\/ ]/g, '_')}`, async () => { await sleep(150); return raw(path); });
}

// ---- metadata ----
const SUP = { 0: '⁰', 1: '¹', 2: '²', 3: '³', 4: '⁴', 5: '⁵', 6: '⁶', 7: '⁷', 8: '⁸', 9: '⁹' };
const UNCIAL = { 1: 'א', 2: 'A', 3: 'B', 4: 'C', 5: 'D', 6: 'D', 7: 'E', 8: 'E', 9: 'F', 10: 'G', 11: 'F', 12: 'G', 13: 'H', 15: 'H', 17: 'K', 18: 'K', 19: 'L', 20: 'L', 21: 'M', 22: 'N', 23: 'O', 24: 'P', 25: 'P', 26: 'Q', 27: 'R', 28: 'S', 29: 'T', 30: 'U', 31: 'V', 32: 'W', 33: 'X', 34: 'Y', 35: 'Z', 36: 'Γ', 37: 'Δ', 38: 'Θ', 39: 'Λ', 40: 'Ξ', 41: 'Π', 42: 'Σ', 43: 'Φ', 44: 'Ψ', 45: 'Ω' };
// Names only where certain; for John's majuscules the letter is the conventional siglum.
const NAMES = { P66: 'Papyrus 66', P75: 'Papyrus 75', '01': 'Codex Sinaiticus', '02': 'Codex Alexandrinus', '03': 'Codex Vaticanus', '04': 'Codex Ephraemi Rescriptus', '05': 'Codex Bezae', '019': 'Codex Regius', '032': 'Codex Washingtonianus', '038': 'Codex Koridethi', '044': 'Codex Athous Lavrensis', '029': 'Codex Borgianus' };

function kind(ga) { return /^P\d/.test(ga) ? 0 : /^0\d/.test(ga) ? 1 : /^\d/.test(ga) ? 2 : 3; }
function ntvmr(ga) {
  const n = Number(ga.replace(/^P/, ''));
  return [10000, 20000, 30000][kind(ga)] + n;
}
function siglum(ga) {
  const k = kind(ga);
  if (k === 0) return { siglum: '𝔓' + ga.slice(1).replace(/\d/g, (d) => SUP[d]) };
  if (k === 1) { const s = UNCIAL[Number(ga)]; return s ? { siglum: s, ...(s === 'א' ? { siglumLang: 'he' } : {}) } : { siglum: ga }; }
  return { siglum: ga };
}
function centuryLabel(from, to) {
  const c = (y) => Math.floor(y / 100) + 1;
  const ord = (n) => n + (n % 10 === 1 && n !== 11 ? 'st' : n % 10 === 2 && n !== 12 ? 'nd' : n % 10 === 3 && n !== 13 ? 'rd' : 'th');
  if (!from || !to) return undefined;
  if (from % 100 === 0 && to % 100 === 99 && c(from) === c(to)) return `${ord(c(from))} c.`;
  if (from % 100 === 0 && to % 100 === 99) return `${ord(c(from))}–${ord(c(to))} c.`;
  return `${from}–${to}`;
}
const attr = (s, name) => (s.match(new RegExp(`${name}="([^"]*)"`)) ?? [])[1] ?? '';
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

let intfFails = 0, intfCalls = 0;
async function intf(id) {
  const local = `src/data/intf/${id}.json`;
  if (existsSync(local)) {
    const r = JSON.parse(await readFile(local, 'utf8'));
    return { early: r.early, late: r.late, orig: r.orig, material: undefined, shelves: r.shelves };
  }
  const file = `${ICACHE}/${id}.xml`;
  let xml = existsSync(file) ? await readFile(file, 'utf8') : null;
  if (!xml) {
    if (intfFails >= 2) return null; // stop asking once the server refuses twice in a row
    if (intfCalls++) await sleep(INTF_DELAY);
    try {
      // curl, not fetch: Node's fetch times out against this server where curl does not.
      xml = execFileSync('curl', ['-s', '-m', '90', `${INTF}?docID=${id}&detail=shelfInstance`], { encoding: 'utf8' });
      if (!/<manuscript /.test(xml)) throw new Error('no record');
      await writeFile(file, xml); intfFails = 0;
    } catch (e) { intfFails++; console.error(`INTF ${id}: ${e.message}`); return null; }
  }
  const ms = xml.match(/<manuscript [^>]*>/)?.[0] ?? '';
  const shelves = [...xml.matchAll(/<shelfInstance [^>]*>[\s\S]*?<\/shelfInstance>/g)].map(([s]) => {
    const inst = s.match(/<institution [^>]*\/>/)?.[0] ?? '';
    return { shelfmark: unesc(attr(s, 'shelfNumber')), institution: unesc(attr(inst, 'name')), place: unesc(attr(inst, 'place')) };
  });
  const mat = attr(ms, 'material') || (xml.match(/<material>([^<]*)<\/material>/) ?? [])[1];
  return { early: Number(attr(ms, 'origEarly')) || undefined, late: Number(attr(ms, 'origLate')) || undefined, orig: attr(ms, 'orig'), material: mat ? unesc(mat) : undefined, shelves };
}

async function meta(ga) {
  const id = ntvmr(ga);
  const m = { ga, ...siglum(ga), ...(NAMES[ga] ? { name: NAMES[ga] } : {}), ntvmr: id, cntr: 'm' + id };
  const r = await intf(id);
  if (r) {
    if (r.early) m.from = r.early;
    if (r.late) m.to = r.late;
    const d = centuryLabel(r.early, r.late);
    if (d) m.date = d;
    if (r.material) m.material = r.material;
  }
  if (!m.material && kind(ga) === 0) m.material = 'papyrus'; // papyri are papyrus by definition; INTF's API gives no material
  if (r) {
    const by = new Map();
    for (const s of r.shelves ?? []) { if (!s.institution && !s.shelfmark) continue; const k = [s.place, s.institution].filter(Boolean).join(', '); by.set(k, [...(by.get(k) ?? []), s.shelfmark].filter(Boolean)); }
    const h = [...by].map(([k, v]) => [k, v.join(' / ')].filter(Boolean).join(', ')).join('; ');
    if (h) m.holding = h;
  }
  return m;
}

const EDITIONS = {
  RP: { siglum: 'Byz (RP)', name: 'Robinson–Pierpont Byzantine Textform', date: '2025' },
  ST: { siglum: 'TR (Stephanus)', name: 'Stephanus Textus Receptus', date: '1550' },
  KJTR: { siglum: 'TR (KJV)', name: 'King James Textus Receptus (CNTR; text underlying the 1769 KJV)', date: '2020' },
  WH: { siglum: 'WH', name: 'Westcott and Hort', date: '1885' },
  SR: { siglum: 'SR', name: 'Statistical Restoration (CNTR)', date: '2022' },
};
// Editions carry punctuation and quotation marks (SR has “ ”); keep only words, accents and elision marks.
const cleanEdition = (t) => t.replace(/[¶˚]/g, '').replace(/[.,;:··;“”‘«»()\[\]!?—]/g, '').replace(/\s+/g, ' ').trim();

// ---- main ----
await mkdir(CACHE, { recursive: true });
await mkdir(ICACHE, { recursive: true });
let paths;
const wantEditions = mss[0] === '--all' || mss[0] === '--editions';
if (mss[0] === '--all') paths = await listAll();
else if (mss[0] === '--editions') paths = [];
else {
  const all = await listAll();
  paths = mss.map((ms) => FOLDERS.map((f) => `${f}/${ms}.txt`).find((p) => all.includes(p)) ?? `missing/${ms}.txt`);
}
const out = { source: `https://github.com/${REPO}/tree/${COMMIT}`, commit: COMMIT, licence: 'CC BY-SA 4.0', credit: 'Alan Bunning, Center for New Testament Restoration', verse, witnesses: {}, meta: {} };
for (const p of paths) {
  const ms = p.split('/').pop().replace(/\.txt$/, '');
  const text = p.startsWith('missing/') ? null : await fetchPath(p);
  const line = text?.split(/\r?\n/).find((l) => l.startsWith(verse + ' '));
  if (mss[0] === '--all' && !line) continue;
  out.witnesses[ms] = line ? line.slice(9) : null;
  console.log(`${ms}\t${text ? p : 'not found'}\t${line ? 'ok' : 'verse absent'}`);
}
for (const ms of Object.keys(out.witnesses)) out.meta[ms] = { kind: 'manuscript', ...(await meta(ms)) };
if (wantEditions) for (const [id, e] of Object.entries(EDITIONS)) {
  const line = (await fetchPath(`critical texts/${id}.txt`))?.split(/\r?\n/).find((l) => l.startsWith(verse + ' '));
  if (!line) { console.log(`${id}\tverse absent`); continue; }
  out.witnesses[id] = cleanEdition(line.slice(9));
  out.meta[id] = { kind: 'edition', ...e, cntr: '' };
  console.log(`${id}\tcritical texts/${id}.txt\tok`);
}
await mkdir('src/data/cntr', { recursive: true });
await writeFile(`src/data/cntr/${verse}.json`, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote src/data/cntr/${verse}.json (${Object.keys(out.witnesses).length} witnesses)`);
