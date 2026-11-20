// Concordance index for the home search, built with the site and fetched on first use.
// Witness sigla are resolved on the page itself from the alias index (ADR 0003); this file adds
// passages (every place a verse is discussed), pages, and glossary terms.
import type { APIRoute } from 'astro';
import { allWitnesses } from '../lib/witnesses';
import { parseRef, formatRef } from '../lib/refs';
import { GUIDES, KICKER } from '../data/guides';
import { GLOSSARY } from '../data/glossary';

export type Entry =
  | { k: 'v'; ref: { book: string; from?: number; to?: number }; label: string; title: string; ctx: string; href: string }
  | { k: 'p' | 'g'; title: string; kicker: string; ctx: string; href: string; text: string };

const plain = (s: string) => s.replace(/<[^>]+>/g, '').replace(/\{['"][^'"]*['"]\}/g, (m) => m.slice(2, -2)).replace(/\s+/g, ' ').trim();
/** Same id rule as Context.astro, so a heading result can link straight to its section. */
const slug = (t: string) => t.toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '-').slice(0, 48) || 'section';
// Page sources, read as text at build time to list their section headings.
const SRC = import.meta.glob('./{guide,background}/**/*.astro', { query: '?raw', import: 'default', eager: true }) as Record<string, string>;

const BOOKNAMES = 'Matthew|Mark|Luke|John|Acts|Romans|Corinthians|Galatians|Ephesians|Philippians|Colossians|Thessalonians|Timothy|Titus|Philemon|Hebrews|James|Peter|Jude|Revelation';
const REF_RE = new RegExp(String.raw`\b(?:[1-3] )?(?:${BOOKNAMES}) \d+:\d+(?:[–-]\d+(?::\d+)?)?`, 'g');

export const GET: APIRoute = async () => {
  const out: Entry[] = [];
  for (const w of await allWitnesses()) {
    for (const u of w.key_units) {
      const ref = parseRef(u.ref);
      if (ref) out.push({ k: 'v', ref, label: u.ref, title: `${w.siglum} ${w.names[0]}`, ctx: plain(u.note), href: `w/${w.id}/` });
    }
  }
  for (const g of GUIDES) {
    for (const v of g.verses ?? []) {
      const ref = parseRef(v);
      if (ref) out.push({ k: 'v', ref, label: formatRef(ref), title: g.cover, ctx: g.summary, href: g.path });
    }
    // Every passage the page's own text mentions also enters the passage index.
    const pageSrc = SRC[`./${g.path.replace(/\/$/, '')}.astro`] ?? SRC[`./${g.path}index.astro`] ?? '';
    const seen = new Set((g.verses ?? []).map((v) => { const r = parseRef(v); return r ? formatRef(r) : v; }));
    for (const m of pageSrc.matchAll(REF_RE)) {
      const ref = parseRef(m[0]);
      if (!ref || ref.from === undefined) continue;
      const label = formatRef(ref);
      if (seen.has(label)) continue;
      seen.add(label);
      out.push({ k: 'v', ref, label, title: g.cover, ctx: `Discussed in “${g.cover}”`, href: g.path });
    }
    out.push({ k: 'p', title: g.cover, kicker: KICKER[g.section], ctx: g.summary, href: g.path,
      text: [g.cover, g.summary, ...g.learn, ...(g.verses ?? [])].join(' ').toLowerCase() });
    const src = SRC[`./${g.path.replace(/\/$/, '')}.astro`] ?? SRC[`./${g.path}index.astro`] ?? '';
    for (const m of src.matchAll(/<h([234])([^>]*)>([\s\S]*?)<\/h\1>/g)) {
      const text = plain(m[3].replace(/<span class="tag"[\s\S]*?<\/span>/g, ''));
      if (!text || /^not yet verified$/i.test(text)) continue;
      const id = /\bid="([^"]+)"/.exec(m[2])?.[1] ?? (m[1] === '2' ? slug(text) : '');
      out.push({ k: 'p', title: text, kicker: g.cover, ctx: `Section in “${g.cover}”`, href: g.path + (id ? `#${id}` : ''), text: `${text} ${g.cover}`.toLowerCase() });
    }
  }
  for (const t of GLOSSARY) {
    out.push({ k: 'g', title: t.term, kicker: 'Glossary', ctx: t.plain, href: `glossary/#${t.id}`, text: `${t.term} ${t.plain}`.toLowerCase() });
  }
  return new Response(JSON.stringify(out), { headers: { 'Content-Type': 'application/json' } });
};
