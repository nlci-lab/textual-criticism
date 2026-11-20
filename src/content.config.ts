// Witness schema: one common core + one kind-specific block (ADR 0002).
// Unverified claims live in `unverified`, never in the core fields (ADR 0004).
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** Every field that states a fact names its sources by id (see `sources`). */
const sourced = { src: z.array(z.string()).min(1) };

const BOOKS = [
  'Mt', 'Mk', 'Lk', 'Jn', 'Ac', 'Jas', '1Pe', '2Pe', '1Jn', '2Jn', '3Jn', 'Jd',
  'Ro', '1Cor', '2Cor', 'Ga', 'Eph', 'Php', 'Col', '1Th', '2Th', 'He', '1Tm', '2Tm', 'Tt', 'Phm', 'Re',
] as const;

const greekMs = z.object({
  ga: z.string(), // INTF form: P66, 01, 1739, L2211
  ntvmr_doc_id: z.number().int(),
  category: z.enum(['papyrus', 'majuscule', 'minuscule', 'lectionary']),
  material: z.object({ value: z.enum(['papyrus', 'parchment', 'paper']), ...sourced }).optional(),
  format: z.object({ value: z.enum(['codex', 'roll', 'single leaf']), ...sourced }).optional(),
  leaves: z.object({ value: z.string(), ...sourced }).optional(),
  /** INTF content letters: e a p c r (see glossary). */
  content_letters: z.object({ value: z.string(), ...sourced }).optional(),
  contents: z.array(z.object({
    book: z.enum(BOOKS),
    status: z.enum(['complete', 'partial', 'fragment', 'absent']),
    note: z.string().optional(),
  })),
  contents_src: z.array(z.string()).min(1),
  aland_category: z.object({ value: z.enum(['I', 'II', 'III', 'IV', 'V']), ...sourced }).optional(),
  correctors: z.array(z.object({ siglum: z.string(), note: z.string(), ...sourced })).default([]),
  holdings: z.array(z.object({
    institution: z.string(), place: z.string(), shelfmark: z.string(), note: z.string().optional(), ...sourced,
  })).min(1),
  cntr: z.object({ w: z.string(), v: z.string() }).optional(), // greekcntr.org deep-link params
});

const group = z.object({
  members_note: z.string(),
  ...sourced,
});

const witnesses = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/witnesses' }),
  schema: z.object({
    id: z.string().regex(/^[a-z0-9-]+$/),
    kind: z.enum(['greek_ms', 'group', 'version', 'father', 'ot_ms']),
    siglum: z.string(),                 // as printed in UBS5, Unicode superscripts allowed
    siglum_lang: z.string().optional(), // e.g. 'he' for א
    /** Where this siglum means this witness, when the same letter means another one elsewhere (D = 05 in Gospels/Acts, 06 in Paul). */
    siglum_scope: z.string().optional(),
    names: z.array(z.string()).min(1),
    aliases: z.array(z.string()).default([]),
    lead: z.string(),                   // one-sentence answer to "what is this?"
    date: z.object({
      label: z.string(), from: z.number().int(), to: z.number().int(), basis: z.string(), ...sourced,
    }).optional(),
    text_character: z.object({ label: z.string(), contested_note: z.string(), ...sourced }).optional(),
    key_units: z.array(z.object({ ref: z.string(), note: z.string(), ...sourced })).default([]),
    links: z.array(z.object({
      label: z.string(), url: z.string().url(), kind: z.enum(['images', 'record', 'transcription', 'reading']),
      licence: z.string(), // licence of what is behind the link, or 'unconfirmed'
    })).default([]),
    /** checked=false: cited from memory, not yet checked against the source itself (ADR 0004). */
    sources: z.array(z.object({ id: z.string(), cite: z.string(), url: z.string().url().optional(), checked: z.boolean() })).min(1),
    /** false: the narrative body is shown in a separate "not yet checked" box. */
    narrative_checked: z.boolean().default(false),
    unverified: z.array(z.object({ claim: z.string(), from: z.string() })).default([]),
    ubs5_list_checked: z.boolean(),
    /** One page photo (ADR 0005): a self-hosted copy of a CNTR image, or, where withheld, a link to it. */
    page_image: z.object({
      file: z.string().optional(),            // under public/, e.g. img/ms/m10066-001v.webp
      width: z.number().int().optional(),
      height: z.number().int().optional(),
      label: z.string(),                      // what the page shows, e.g. "John 1:14–21"
      source_url: z.string().url(),           // the original image or viewer
      withheld: z.string().optional(),        // why no copy is shown (shows a link instead)
      /** Set when the photo carries its own licence (e.g. printed on the image); otherwise CNTR's US public-domain note applies. */
      licence: z.object({ holder: z.string(), name: z.string(), url: z.string().url() }).optional(),
    }).optional(),
    last_checked: isoDate,
    greek_ms: greekMs.optional(),
    group: group.optional(),
  }).superRefine((w, ctx) => {
    const kindBlock: Record<string, unknown> = { greek_ms: w.greek_ms, group: w.group };
    if (w.kind in kindBlock && !kindBlock[w.kind]) {
      ctx.addIssue({ code: 'custom', message: `kind "${w.kind}" needs a "${w.kind}" block` });
    }
    // Every src id must exist in sources.
    const ids = new Set(w.sources.map((s) => s.id));
    const walk = (v: unknown, path: string) => {
      if (Array.isArray(v)) v.forEach((x, i) => walk(x, `${path}[${i}]`));
      else if (v && typeof v === 'object') {
        for (const [k, x] of Object.entries(v)) {
          if ((k === 'src' || k === 'contents_src') && Array.isArray(x)) {
            for (const s of x) if (!ids.has(s)) ctx.addIssue({ code: 'custom', message: `${path}.${k}: unknown source "${s}"` });
          } else walk(x, `${path}.${k}`);
        }
      }
    };
    walk(w, w.id);
  }),
});

export const collections = { witnesses };
export { BOOKS };
