// Tile thumbnails for the witness gallery: 480x360 centre crop of each page photo, WebP, under ~25 KB.
// Usage: node scripts/make-thumbs.mjs   (reads public/img/ms/m*.webp, writes public/img/ms/thumb/)
import sharp from 'sharp';
import { readdir, mkdir } from 'node:fs/promises';

await mkdir('public/img/ms/thumb', { recursive: true });
for (const f of (await readdir('public/img/ms')).filter((x) => /^m\d+-.*\.webp$/.test(x))) {
  let q = 70, info;
  do {
    info = await sharp(`public/img/ms/${f}`).resize(480, 360, { fit: 'cover', position: 'attention' }).webp({ quality: q }).toFile(`public/img/ms/thumb/${f}`);
    q -= 10;
  } while (info.size > 25_000 && q > 30);
  console.log(`thumb/${f}\t${Math.round(info.size / 1024)} KB`);
}
