import { getCollection } from 'astro:content';
import { buildIndex } from './sigla';

const ORDER: Record<string, number> = { papyrus: 0, majuscule: 1, minuscule: 2, lectionary: 3 };

/** All witnesses in UBS citation order: papyri, majuscules, minuscules, lectionaries, then groups. */
export async function allWitnesses() {
  const all = (await getCollection('witnesses')).map((e) => e.data);
  return all.sort((a, b) => {
    const ka = a.greek_ms ? ORDER[a.greek_ms.category] : 9;
    const kb = b.greek_ms ? ORDER[b.greek_ms.category] : 9;
    if (ka !== kb) return ka - kb;
    return (a.greek_ms?.ntvmr_doc_id ?? 1e9) - (b.greek_ms?.ntvmr_doc_id ?? 1e9);
  });
}

/** Alias key -> profile, checked for collisions at build time. */
export async function aliasIndex() {
  const all = await allWitnesses();
  return buildIndex(all.map((w) => ({ id: w.id, siglum: w.siglum, names: w.names, aliases: w.aliases, ga: w.greek_ms?.ga, scope: w.siglum_scope })));
}
