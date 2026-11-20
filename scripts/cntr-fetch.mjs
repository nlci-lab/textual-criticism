// Copy single verses from CNTR's manuscript transcriptions into src/data/cntr/<verse>.json,
// so the site builds without the network. Pinned to one commit of the CNTR repository.
// Transcriptions © Alan Bunning, Center for New Testament Restoration, CC BY-SA 4.0.
// Usage: node scripts/cntr-fetch.mjs <BBCCCVVV> <ms> [<ms> ...]   e.g. 43001018 P66 P75 01 02 03 04 032
import { writeFile, mkdir } from 'node:fs/promises';

const REPO = 'Center-for-New-Testament-Restoration/transcriptions';
const COMMIT = '4e743a41a4b2ca010ece53229cd272aa59b1efe6';
const FOLDERS = ['class 1', 'class 2', 'class 3'];

const [verse, ...mss] = process.argv.slice(2);
if (!/^\d{8}$/.test(verse ?? '') || !mss.length) { console.error('usage: cntr-fetch.mjs <BBCCCVVV> <ms>...'); process.exit(1); }

async function fetchMs(ms) {
  for (const f of FOLDERS) {
    const r = await fetch(`https://raw.githubusercontent.com/${REPO}/${COMMIT}/${encodeURIComponent(f)}/${ms}.txt`);
    if (r.ok) return { folder: f, text: await r.text() };
  }
  return null;
}

const out = { source: `https://github.com/${REPO}/tree/${COMMIT}`, commit: COMMIT, licence: 'CC BY-SA 4.0', credit: 'Alan Bunning, Center for New Testament Restoration', verse, witnesses: {} };
for (const ms of mss) {
  const f = await fetchMs(ms);
  const line = f?.text.split(/\r?\n/).find((l) => l.startsWith(verse + ' '));
  out.witnesses[ms] = line ? line.slice(9) : null;
  console.log(`${ms}\t${f ? f.folder : 'not found'}\t${line ? 'ok' : 'verse absent'}`);
}
await mkdir('src/data/cntr', { recursive: true });
await writeFile(`src/data/cntr/${verse}.json`, JSON.stringify(out, null, 2) + '\n');
console.log(`wrote src/data/cntr/${verse}.json`);
