// Witness list for a collation, built from a CNTR verse JSON (see scripts/cntr-fetch.mjs).
import type { Witness } from '../../lib/collate';
/** Every CNTR witness that has the verse, from the JSON's meta; `profile` links to a site profile
 *  where one exists (matched by `greek_ms.ga` in src/content/witnesses). */
const profileByGa: Record<string, string> = {};
for (const src of Object.values(import.meta.glob('../../content/witnesses/*.md', { query: '?raw', import: 'default', eager: true })) as string[]) {
  const id = src.match(/^id:\s*["']?([^"'\s]+)/m)?.[1];
  const ga = src.match(/^\s+ga:\s*["']?([^"'\s]+)/m)?.[1];
  if (id && ga) profileByGa[ga] = id;
}
type Meta = { kind?: 'manuscript' | 'edition'; ga: string; siglum: string; siglumLang?: string; name?: string; date?: string; from?: number; to?: number; material?: string; holding?: string; ntvmr?: number; cntr: string };

/** Printed editions follow the manuscripts: Byzantine, the two Textus Receptus texts, WH, SR. */
const EDITION_ORDER = ['RP', 'ST', 'KJTR', 'WH', 'SR'];
const order = (id: string, m: Meta) => m.kind === 'edition' ? [3, EDITION_ORDER.indexOf(id)]
  : [/^P\d/.test(m.ga) ? 0 : /^0\d/.test(m.ga) ? 1 : 2, Number(m.ga.replace(/^P/, ''))];
export function witnessesFrom(data: unknown): Witness[] {
  const metas = (data as { meta: Record<string, Meta> }).meta;
  return Object.entries(metas)
  .sort(([i, a], [j, b]) => { const [x, y] = [order(i, a), order(j, b)]; return x[0] - y[0] || x[1] - y[1]; })
  .map(([id, m]) => ({
    id, kind: m.kind ?? 'manuscript', ga: m.ga, siglum: m.siglum, siglumLang: m.siglumLang, label: m.name ?? `GA ${m.ga}`, date: m.date ?? '',
    from: m.from, material: m.material, holding: m.holding, ntvmr: m.ntvmr, cntr: m.cntr,
    ...(profileByGa[m.ga] ? { profile: profileByGa[m.ga] } : {}),
  }));
}
