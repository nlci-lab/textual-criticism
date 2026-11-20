// Resize downloaded CNTR page photos for the web: max 900 px wide, WebP, target under ~90 KB.
// Usage: node scripts/resize-images.mjs <input-dir>  (writes to public/img/ms/)
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';
import { join, parse } from 'node:path';

const dir = process.argv[2];
await mkdir('public/img/ms', { recursive: true });
for (const f of (await readdir(dir)).filter((x) => /\.(jpe?g|png)$/i.test(x))) {
  const out = `public/img/ms/${parse(f).name}.webp`;
  let q = 72;
  let info;
  do {
    info = await sharp(join(dir, f)).resize({ width: Number(process.env.MAX_W ?? 900), withoutEnlargement: true }).webp({ quality: q }).toFile(out);
    q -= 8;
  } while (info.size > 90_000 && q > 30);
  console.log(`${out}\t${info.width}x${info.height}\t${Math.round(info.size / 1024)} KB`);
}
