# Build prompt: UBS Manuscripts field guide

Paste everything below the line into a fresh Claude Code session opened in
`C:\Users\BCS_Support\Documents\dev\nlci\textual-criticism\ubs-manuscripts`.

---

## Who this is for

Bible translators and translation consultants working in Paratext, mostly in South Asia, who meet
the UBS Greek New Testament apparatus and see sigla like `א`, `B`, `𝔓66`, `f13`, `Byz`, `l 2211`,
`it^a`, `syr^s`, `cop^sa` and don't know what they are. Paratext's help gives them a line or two
per siglum. Mobile data is often slow and expensive; many will read on a phone.

They don't need a seminary course. When they hit `𝔓75` in the apparatus at John 1:18, they need to
learn in under a minute: what is it, how old, what does it contain, why does the committee weigh it
heavily, and where can I see it.

## What to build

A static site, a field guide to the witnesses cited in the UBS5/UBS6 apparatus, with:

1. **A profile page for every witness** cited in the UBS apparatus. Start with the Greek
   manuscripts (papyri, majuscules, minuscules, families, lectionaries), then the versions and
   church fathers as a second wave. Each profile has:
   - Siglum as printed in UBS (real Hebrew/Gothic/blackletter forms, correctly rendered), the
     Gregory–Aland number, and common names ("Codex Sinaiticus").
   - At-a-glance facts: date (with the basis for it), material, format, contents (by book, with
     known gaps), current location and shelfmark, text-type/character label *with a note on how
     contested those labels are*, Aland category where it applies.
   - A short narrative: how it was made, found, corrected, and why a TC cares. Include correctors
     (e.g. א¹, א², B²) where UBS cites them.
   - **"Where it matters"**: 3–5 well-known variation units where this witness is decisive, linked
     by reference (e.g. Mark 16:9–20, John 7:53–8:11, John 1:18).
   - **Images**: link to the exact manuscript page on the CNTTS/Greek NT manuscripts image site
     ("greekcntr" — check what greekcntr.org exposes and confirm its URL scheme before
     relying on it), plus the INTF NT.VMR record and any holding-library digitisation (e.g.
     codexsinaiticus.org, Vatican DigiVatLib, BnF Gallica). Deep-link where the URL scheme allows;
     otherwise link the witness's landing page. Never hotlink or copy images without checking the
     licence; a thumbnail is only allowed when its licence permits it.
   - Sources: every factual claim cites a source a reader could check (Metzger & Ehrman, *Text of
     the NT* 4th ed.; Aland & Aland, *Text of the NT*; the UBS5 introduction; INTF Liste; Parker,
     *Introduction to NT Manuscripts*; holding library catalogues).
   - "Last checked" date.

2. **Direct lookup by siglum.** Typing `aleph`, `א`, `01`, `sinaiticus`, `p66`, `P66`, `𝔓66`,
   `B`, `03`, `vaticanus`, `f13`, `family 13`, `Byz` must go straight to the profile. Build:
   - An alias table per witness (Latin transliteration, Unicode form, GA number with and without
     leading zero, names).
   - Short URLs that redirect: `/p66`, `/aleph`, `/01`, `/B` → canonical profile. Generate static
     redirect stubs so this works on GitHub Pages without a server.
   - A client-side search box (Pagefind or a small prebuilt JSON index; no external service) that
     ranks exact siglum matches first.
   - An on-screen keyboard row for `א 𝔓 ƒ ℓ` so phone users don't need a Hebrew keyboard.

3. **Context pages** written from a text critic's point of view, not a general church-history one:
   - How we got the NT text: autographs → copies → text-types debate → printed editions (Erasmus,
     TR, Westcott–Hort, Nestle, NA/UBS, ECM/CBGM).
   - How we got the OT text: MT, Masoretes, Dead Sea Scrolls, LXX, Samaritan Pentateuch,
     Leningrad/Aleppo codices, and how BHS/BHQ cite them. (Keep this tier lean for now; the site is
     UBS-NT first.)
   - Materials and making: papyrus, parchment, palimpsests, ink, scroll vs codex, scripts
     (majuscule/minuscule), nomina sacra, scribal habits, correctors.
   - How to read a UBS apparatus entry: a worked example, annotated piece by piece, with the
     {A}–{D} rating explained honestly (including the criticism of the rating system).
   - Glossary of every abbreviation and symbol used in the UBS apparatus (`vid`, `*`, `c`, `txt`,
     `mg`, `supp`, `( )`, `[ ]`, `pt`, `mss`…), each linked from wherever it appears.

## Things worth adding (enhancements)

Build these if they're cheap; otherwise list them in `ROADMAP.md`:
- **Timeline view**: every witness on a century axis, filterable by type. Click to open the profile.
- **Map view**: where each manuscript was found and where it is now (plain SVG, no tile service).
- **Compare two witnesses** side by side.
- **Paratext bridge**: a printable/PDF one-page "siglum cheat sheet", and a note on how to get to a
  profile from inside Paratext (a bookmarked URL pattern like `.../w/{siglum}`).
- **Offline**: a service worker so a translator who has visited once can use it with no signal.
- **Translations**: structure content so Hindi and other South Asian language versions can be
  added later (i18n folder layout from day one, even if only English ships).
- **Teaching hooks**: link profiles back to the course modules in
  `C:\Users\BCS_Support\Documents\Projects\NLCI\training\textual-criticism` (e.g. M01) where they
  discuss the same witness.

## Data model

One source-of-truth file per witness (YAML or Markdown with front matter) in `content/witnesses/`.
Fields at minimum: `id`, `siglum_display`, `aliases[]`, `ga_number`, `names[]`, `category`
(papyrus/majuscule/minuscule/family/lectionary/version/father), `date` + `date_basis`, `material`,
`contents`, `location`, `shelfmark`, `text_character`, `aland_category`, `correctors[]`,
`key_variants[]`, `images[]` (url, source, licence), `sources[]`, `last_checked`. Validate it with a
schema in CI so a bad entry fails the build.

**Get the witness list from the UBS5 apparatus introduction**, not from memory. If you can't access
it, build the list from the NA28/UBS5 "constantly cited witnesses" and say clearly in `ROADMAP.md`
which entries still need checking against the printed list.

## Accuracy rules

- No invented facts. If a date, location or shelfmark isn't confirmed by a source you can name, put
  `TODO: verify` in the data file and show "unverified" on the page. Don't fill gaps with plausible
  guesses.
- Present contested matters as contested (text-types, the "Alexandrian" label, dating of 𝔓52, the
  Byzantine-priority view, CBGM's effect on the old categories). Say who holds which view.
- Before publishing, run the `cod` agent (the skeptical-critic reviewer in the course repo) over
  the context pages and the top ~20 profiles, and fix what it flags.

## Design

Load the `artifact-design` skill first and apply its principles to this site, even though it isn't
an artifact. Then:

- **Mobile first.** Design at 360px wide, then enhance. Pages must be readable and usable on a slow
  3G connection: aim for under 100 KB per profile page before images, no web-font flash, system
  font fallback, no JS needed to read a profile.
- **Look like a well-made reference book, not a SaaS landing page.** Inspiration: a scholarly
  edition's typography and a museum label's clarity. A serif with excellent Greek and Hebrew
  coverage for body (e.g. Gentium Plus, Noto Serif + Noto Serif Hebrew, or SBL BibLit if the
  licence allows web use), a restrained sans for UI. Real typographic care: proper small caps for
  sigla, old-style figures in running text, tabular figures in fact tables, correct Unicode for
  `𝔓` (U+1D513) and `א`.
- One accent colour taken from manuscript material (iron-gall ink brown, vellum, rubrication red),
  used sparingly. Light and dark themes, both checked.
- Each manuscript profile should have a recognisable visual signature: a small generated "spec
  card" (century, material, size, contents bar showing which NT books survive) rather than stock
  imagery.
- **Avoid AI-slop patterns**: no purple gradients, no emoji headings, no glassmorphism cards, no
  "Unlock the secrets of…" hero, no three-icon feature grid, no gratuitous animations.
- Accessibility: WCAG AA contrast, real headings, `lang` attributes on Greek/Hebrew/Syriac text,
  keyboard-usable search, alt text for every image.

## Writing style

- Plain, concrete English for readers whose first language may not be English. Short sentences.
  Define each technical term the first time it appears on a page, and link it to the glossary.
- Lead with what the reader needs; history after.
- **Avoid AI-slop prose**: no "delve", "tapestry", "testament to", "rich history", "plays a crucial
  role", "in the realm of", "it's important to note"; no rule-of-three padding; no summary
  paragraph restating the page; no unearned superlatives ("most important manuscript ever").
  Prefer a specific number or fact to an adjective.
- Write in a single voice across pages. Draft five profiles first (א, B, 𝔓66, D(05), Byz), and
  show them to me before doing the rest.

## Tech and hosting

- Static site generator: Astro (content collections + schema validation) or Eleventy; pick one and
  say why in the README. Output plain static HTML.
- Must work both at the GitHub Pages project path (`https://nlci-lab.github.io/<repo>/`) and on the
  NLCI lab host (root or sub-path). Make the base path a build setting; never hard-code it.
- GitHub Actions: build, validate data, check links (lychee), run Lighthouse on mobile, deploy to
  Pages. A second artefact (zip of `dist/`) for the NLCI lab host.
- Licence: code MIT; content CC BY-SA 4.0 (confirm with me before setting).

## Repository setup

1. Work in `C:\Users\BCS_Support\Documents\dev\nlci\textual-criticism\ubs-manuscripts`
   (this folder; keep this `PROMPT.md` in `docs/`).
2. `git init`, branch `main`.
3. **Ask me to confirm the repo name and visibility** before creating it. Suggested:
   `nlci-lab/ubs-manuscripts`, public (GitHub Pages on a free org needs public). Then
   `gh repo create nlci-lab/<name> --public --source . --push`.
4. Enable Pages from Actions only after I've seen the first five profiles.

## Order of work

1. Confirm the image sources (greekcntr, INTF NT.VMR, holding libraries) and their URL schemes and
   licences. Report back.
2. Scaffold the site, data schema, alias/redirect generator and search.
3. Design system + one profile template; show me screenshots at 360px and desktop, light and dark.
4. Five sample profiles + "How to read a UBS apparatus entry". Stop for review.
5. Remaining Greek witnesses, then context pages, then versions/fathers.
6. Enhancements in the order above, each as its own PR.

Done looks like: typing `p66` on a phone reaches 𝔓66's profile in one step; every profile cites its
sources and links to images; the site builds and deploys from CI to GitHub Pages and produces a zip
for the NLCI lab host.
