// Build a contact sheet of public/img/ms/*.webp (bottom strips enlarged) to check for printed copyright notices.
import sharp from 'sharp';
import { readdir } from 'node:fs/promises';
const files = (await readdir('public/img/ms')).filter((f) => f.endsWith('.webp'));
const tiles = [];
for (const f of files) {
  const img = sharp(`public/img/ms/${f}`);
  const { width, height } = await img.metadata();
  const strip = await sharp(`public/img/ms/${f}`).extract({ left: 0, top: process.env.TOP ? 0 : Math.round(height * 0.88), width, height: Math.round(height * 0.12) }).resize({ width: 900 }).png().toBuffer();
  tiles.push(strip);
}
const metas = await Promise.all(tiles.map((t) => sharp(t).metadata()));
let y = 0; const comp = [];
for (const [i, t] of tiles.entries()) { comp.push({ input: t, top: y, left: 0 }); y += metas[i].height + 10; }
await sharp({ create: { width: 900, height: y, channels: 3, background: '#fff' } }).composite(comp).png().toFile(process.argv[2]);
console.log(files.join('\n'));
