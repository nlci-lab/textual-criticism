// Fetch INTF Kurzgefasste Liste records for GA numbers and cache them as JSON in src/data/intf/.
// Usage: node scripts/intf-fetch.mjs P45 02 04 33 ...
// Polite by design: one request per FETCH_DELAY_MS (default 90 s), one retry, and it stops
// after two failures in a row, so a block is never hammered.
// Only facts present in the Liste are kept; everything else is added by hand with its own source.
import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';

const DELAY = Number(process.env.FETCH_DELAY_MS ?? 90000);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const API = 'https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/';

export function docId(ga) {
  const m = ga.match(/^(P|L|l)?0*(\d+)$/);
  if (!m) throw new Error(`Not a GA number: ${ga}`);
  const n = Number(m[2]);
  if (m[1] === 'P') return 10000 + n;
  if (m[1] === 'L' || m[1] === 'l') return 40000 + n;
  return ga.startsWith('0') ? 20000 + n : 30000 + n;
}

const attr = (s, name) => (s.match(new RegExp(`${name}="([^"]*)"`)) ?? [])[1] ?? '';
const tag = (s, name) => (s.match(new RegExp(`<${name}>([^<]*)</${name}>`)) ?? [])[1] ?? '';
const unesc = (s) => s.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

async function fetchOne(ga) {
  const id = docId(ga);
  const url = `${API}?docID=${id}&detail=shelfInstance`;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      // curl, not fetch: Node's fetch times out against this server where curl does not.
      const xml = execFileSync('curl', ['-s', '-m', '90', url], { encoding: 'utf8' });
      const ms = xml.match(/<manuscript [^>]*>/)?.[0];
      if (!ms) throw new Error(`no record: ${xml.slice(0, 200)}`);
      const shelves = [...xml.matchAll(/<shelfInstance [^>]*>[\s\S]*?<\/shelfInstance>/g)].map(([s]) => {
        const inst = s.match(/<institution [^>]*\/>/)?.[0] ?? '';
        return {
          shelfmark: unesc(attr(s, 'shelfNumber')),
          institution: unesc(attr(inst, 'name')),
          place: unesc(attr(inst, 'place')),
          country: unesc(attr(inst, 'country')),
          content: unesc(tag(s, 'contentOverview')),
          leaves: unesc(tag(s, 'leavesDescription')),
        };
      });
      return {
        ga: attr(ms, 'gaNum'), docID: id, orig: attr(ms, 'orig'),
        early: Number(attr(ms, 'origEarly')), late: Number(attr(ms, 'origLate')), lang: attr(ms, 'lang'),
        shelves,
        supplemental: unesc(tag(xml, 'supplementalContentOverview')),
        url, retrieved: new Date().toISOString().slice(0, 10),
      };
    } catch (e) {
      if (attempt === 2) throw new Error(`${ga}: ${e.message}`);
      await new Promise((r) => setTimeout(r, DELAY));
    }
  }
}

const gas = process.argv.slice(2);
await mkdir('src/data/intf', { recursive: true });
let failuresInARow = 0;
for (const [i, ga] of gas.entries()) {
  if (i > 0) await sleep(DELAY);
  try {
    const rec = await fetchOne(ga);
    await writeFile(`src/data/intf/${rec.docID}.json`, JSON.stringify(rec, null, 2) + '\n');
    console.log(`${ga}\t${rec.orig}\t${rec.shelves.map((s) => `${s.institution}: ${s.shelfmark}`).join(' | ')}`);
    failuresInARow = 0;
  } catch (e) {
    console.error(`FAILED ${e.message}`);
    if (++failuresInARow >= 2) { console.error('Two failures in a row: stopping so we do not hammer the server.'); process.exit(1); }
  }
}
