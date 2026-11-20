# Build plan: direction 6 "Catalogue" in Astro

Status: proposal, 20 Nov 2026. Mock-ups: `6-catalogue/`. Nothing here is built yet.

## Principles carried over

- Static Astro, GitHub Pages, `base` from `SITE_BASE` (ADR 0001). No framework;
  each interactive part is a small inline `<script>` that degrades to plain links
  (the current home already has a `<noscript>` fallback, keep that pattern).
- No web fonts loaded; Gentium only if installed, system fallbacks.
- Everything shown comes from content collections; nothing hand-copied into pages.
- ADR 0004 (unverified facts separate) and ADR 0005 (images, withheld photos)
  stay as they are. The tile texture is the fallback whenever `page_image.file`
  is absent or withheld.

## Phase 0 — tokens and shell (one PR, no page changes in meaning)

1. `src/styles/global.css`: add pigment tokens (`--ochre`, `--verdigris`,
   `--lapis`, `--gall`, `--on-pig`, `--chip`) for light and dark, both the
   `prefers-color-scheme` block and `[data-theme]` blocks. Check AA for
   `--on-pig` on each pigment and rubric on each tile texture.
2. Split CSS: `global.css` (tokens, type, base) + `components.css` (tile, cover,
   chip, book page, lessons, module). Keep it one stylesheet request.
3. `Base.astro`: new header (mark + Learn / Witnesses / Guides / Background,
   wraps on phones), footer, `.wrap` at 84rem. Remove the 38rem `--measure`
   on the outer layout; prose blocks keep a 44rem measure.

## Phase 1 — components

| Component | Props / source | Notes |
|---|---|---|
| `WitnessTile.astro` | a `witnesses` entry | Siglum (via `lib/sigla.ts`), name, `date.label`, kind, coverage bar. Background: cropped `page_image.file` thumbnail if present, else texture by `greek_ms.category` / `kind`. Script strip text: new optional field `specimen` (a short line of capitals), default by kind. |
| `CoverageBar.astro` | `greek_ms.contents` | Collapse 27 books to 5 groups (e a p c r): on if any book in the group is complete/partial/fragment. Groups also work for `group` / `version` kinds via `content_letters`. |
| `Cover.astro` | `title`, `kind`, `pigment` | Pure CSS, no images. |
| `BookPage.astro` | frontmatter of a guide/background/course page | Cover + spec list + "What you will learn" + actions + Related shelf. |
| `Shelf.astro`, `Rail.astro` | children | Horizontal scroll with scroll-snap; no JS. |
| `ChipFilter.astro` | filter groups | Buttons with `aria-pressed`; script filters `data-*` attributes. |
| `ModuleCard.astro`, `LessonList.astro` | `modules`, `lessons` collections | Done-state read from localStorage after load. |

Thumbnails: add a build script (or `astro:assets` `getImage`) to make 400px
tile crops from the existing `public/img/ms/*.webp`; 8 witnesses already have
self-hosted CNTR images (𝔓⁴⁵ ⁴⁶ ⁴⁷ ⁵² ⁶⁴ ⁶⁶ ¹¹⁵, D 05). Keep each tile image
under ~25 KB, `loading="lazy"`, width/height set.

## Phase 2 — content model changes (`src/content.config.ts`)

1. **Guides and background as a collection.** Move each `src/pages/guide/*.astro`
   and `background/*.astro` page's metadata into frontmatter of a `guides`
   collection (MD/MDX, or keep `.astro` bodies and add a sibling data file):
   `title, section (guide|background), level (start|further), reading_min,
   description, learn[], prerequisite?, related[], verses[], last_checked,
   sources[]`. Pages keep their bodies; the book-page header and Related shelf
   are generated.
   *Decision needed:* convert bodies to MDX (cleaner, adds `@astrojs/mdx`) or
   keep `.astro` bodies with a data file per page (no new dependency). Proposal:
   keep `.astro`, add `src/data/guides.ts` — least churn.
2. **`verses` everywhere.** Normalised references (`Jn 1:18`, `Jas 2:20`,
   `Mk 16:9-20`) on guides, examples, modules. Witness `key_units[].ref`
   already carries them; normalise with one parser in `src/lib/refs.ts`.
3. **`course` and `modules` collections.**
   - `src/content/course/` : one file per lesson: `order, title, summary,
     minutes, uses[]` (ids of guides/witnesses/modules), body.
   - `src/content/modules/` : `id, verse, title_grc?, summary, minutes, skill,
     steps[]` where a step is `{ text | apparatus table | question {options[],
     correct, explanation} }`.
   New ADR 0006: "Online course and micro modules: built from site content,
   progress on-device only."
4. Witness: optional `specimen` (string) for the tile strip.

## Phase 3 — pages

| Route | Built from | Mock-up |
|---|---|---|
| `/` | search + rails | `home.html` |
| `/witnesses/` | gallery + filters (replaces current list) | `witnesses.html` |
| `/w/[id]/` | 3-column profile; existing sections reused | `witness.html` |
| `/guide/[slug]/`, `/background/[slug]/` | `BookPage` header + existing body + sticky contents | `guide.html` |
| `/guide/`, `/background/` | shelves of covers | (index pages) |
| `/learn/` | course book page + lessons + modules | `course.html` |
| `/learn/[module]/` | module steps | `module.html` |
| `/[alias]/` | unchanged redirects (ADR 0003) | — |

## Phase 4 — concordance search

- At build time, an endpoint `src/pages/search.json.ts` emits one array:
  `[key, kind, title, context, href]` from witnesses (siglum, GA number,
  aliases, names), every `key_units[].ref`, guides/background (title,
  description, headings, `verses`), examples, lessons and modules.
- Reuse and extend the existing alias logic in `lib/witnesses.ts` /
  `lib/sigla.ts` (superscripts, 𝔓 → P, א, GA numbers) — do not fork it.
  Add verse normalisation (book abbreviations, en dash, `jn`/`joh`/`john`).
- Client: ~2 KB script, fetches `search.json` on first focus (not on page
  load), groups results Verse / Witness / Guide / Practice. `?q=` keeps working.
- Size budget: index under 30 KB gzipped at today's content; revisit when OT
  pages arrive (likely split NT/OT files).

## Phase 5 — checks before merge

- `astro check` and `astro build` clean; all links resolve with `SITE_BASE`.
- Screenshots at 360 / 768 / 1280, light and dark, for each route (reuse
  `docs/design-directions/shoot.py` against `astro preview`).
- Contrast: rubric on both tile textures, `--on-pig` on all pigments (AA).
- Keyboard: chips, search results and module answers reachable and announced.
- No-JS: gallery shows all tiles, search falls back to `/witnesses/`, module
  answers readable (`<details>`).
- Page weight: home under 120 KB transferred excluding tile images.

## Order and size

1. Phase 0 + 1 (shell, tokens, components) — one PR.
2. Witness gallery + profile (Phase 3 rows 2–3) — highest value, data exists.
3. Guides/background book pages (Phase 2.1 + rows 4–5).
4. Concordance search (Phase 4) + new home.
5. Learn: ADR 0006, collections, `/learn/` pages — when the first lessons and
   modules are written; the pages can ship with "coming soon" states before.

Each step is shippable on its own; the owner approves each push.

## Open questions for the owner

1. Guide bodies: keep `.astro` + data file (proposed) or move to MDX?
2. Tile photos: use the self-hosted CNTR crops on tiles where we have them, or
   keep every tile typographic for a uniform look?
3. Course: does a lesson have its own text, or is it a guided path through
   existing guides with short intros and a check question at the end?

## Owner's answers (20 Nov 2026)

1. Guides stay as `.astro` files; metadata goes in `src/data/guides.ts`. No MDX.
2. Tiles use the site's own photo crop where one exists; texture otherwise.
3. Course lessons reuse the existing guides. Review of fit:

| Lesson | Existing material | Fit | Work needed |
|---|---|---|---|
| 1 Why there are variants | background/nt-text "Writing and copying"; materials "How copyists changed the text" | Good | Short intro; point to two sections, not whole pages |
| 2 Manuscripts and their names | materials (surfaces, scripts); paratext "Decoding the sigla"; glossary; witness gallery | **Gap** | No page explains papyrus / majuscule / minuscule / version / father and how a siglum is built. Write one new short page (~600 words), which also helps the gallery |
| 3 Reading the apparatus | guide/apparatus (1,195 words) | Very good | Intro + check question only |
| 4 Weighing the evidence | guide/weighing-evidence (2,103 words) + examples/james-2-20 | Good, long | Split across two sittings by section anchors (external / internal + example); James 2:20 is told twice (guide and example page): make the module the practice, the guide the explanation |
| 5 Which variants matter | guide/which-variants-matter (1,550) | Good | Intro + question |
| 6 Your project's text policy | guide/base-texts (2,034) + guide/text-policy (861) | Good, long | Lesson uses base-texts "Where they differ" + "What this means", then text-policy; skip the Indian-language table on first pass |

No rewriting of guide text is needed. Two rules for lessons: (a) a lesson never
sends readers into a "Not yet verified" section; (b) each lesson = intro
(~100 words), links to named sections, one check question, "what to do in your
project" line. The Paratext guide becomes an optional practical lesson.
