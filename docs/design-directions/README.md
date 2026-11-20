# Design directions: using desktop width

The complaint: on desktop the site is a ~38rem column inside a 64rem wrapper, so a
1280px screen is mostly empty margin. A reference resource should put lookup aids
(navigation, facts, contents, notes) into that space while keeping the reading
line at 38–44rem.

Each folder has `home.html`, `witness.html` (B 03 Vaticanus, from
`src/content/witnesses/03-vaticanus.md`) and `guide.html` (Weighing the evidence),
plus screenshots: `*-1280.png`, `*-360.png` (light) and `witness-1280-dark.png`.
All five keep the current tokens (vellum paper, iron-gall ink, rubric red only for
sigla and links), Gentium with system fallbacks, no web fonts, no JS. The mock-ups
are built by `build.py`; screenshots by `shoot.py` (headless Edge; 360px shots are
rendered in a 360px iframe because headless Edge has a ~500px minimum window).
Nothing in `src/` was changed.

| | Direction | Desktop width goes to | Phone (360px) | Main risk |
|---|---|---|---|---|
| 1 | **Reference shelf** | Persistent left nav (all witnesses and guides) + text + sticky "On this page" on ≥1200px | Nav becomes a link row in the header; TOC a `<details>` | Long left nav as the witness list grows (needs grouping) |
| 2 | **Margin notes** | Tufte-style right margin: fact list, glosses (Bezae, Byz), cautions, sources beside the text | Notes drop inline under the paragraph, marked with a red rule | Notes must be written for it; uneven pages leave holes |
| 3 | **Spec sheet** | Sticky left "fact rail" (siglum, date, holdings, contents bar; on guides the editor's checklist) + reading column | Rail becomes a card at the top | Rail is tall on witness pages; little help on plain prose pages |
| 4 | **Index desk** | Dense panels: witness table on home, "at a glance" strip, rules of thumb as a side column, full-width tables | Panels stack in reading order | Busier; easiest to drift into "dashboard" look |
| 5 | **Lookup pane** | App-style master–detail: sticky list of all witnesses/guides on the left, detail on the right with tabs | List collapses to a `<details>` above the content | Feels like software, not a book; tabs hide content and need JS to be real |

## Notes on each

1. **Reference shelf.** Documentation-site pattern. Always shows where you are and
   what else exists, which suits people looking things up mid-translation. Width
   use is predictable on every page type. Generic-looking if not careful; the
   serif and rubric tokens keep it bookish.
2. **Margin notes.** Most "reference book" in feel and kindest to the reading
   column; turns the empty right margin into glosses and citations. But it only
   fills space where there are notes, and authoring sidenotes in Astro needs a
   component and discipline. The home page gains little.
3. **Spec sheet.** Best witness profile: siglum, date, holdings and the contents
   bar stay visible while you read. Weaker for guides and the home page.
4. **Index desk.** Uses the most width (home becomes a sortable-looking witness
   table, the James 2:20 table runs full width). Densest for consultants on
   laptops; heaviest for ESL readers.
5. **Lookup pane.** Fastest to hop between witnesses. Least like a book, and the
   tab bar is decorative without JS.

## Recommendation: 1 Reference shelf, borrowing the fact rail from 3

Why:

- It fixes the complaint on **every** page type (home, witness, guide,
  background), not only where content happens to fit the idea.
- Persistent navigation matches how the site is used: a translator meets a siglum
  in the apparatus and wants the next witness or the next guide without going home.
- The reading column stays at ~44rem, so readability for ESL readers is unchanged.
- It collapses cleanly: on phones it is today's layout plus a collapsible
  "On this page", so the mobile majority loses nothing.
- It scales to the OT pages coming in 2027: add an "Old Testament" group to the nav.
- It is cheap to build in Astro: one `Base.astro` grid with a nav slot and a TOC
  slot; the TOC can be generated from headings at build time with no client JS.

Within it, use direction 3's sticky fact panel for witness profiles (on ≥1000px it
sits to the right of the prose, as the mock-up shows) and keep margin notes (2) as
an optional pattern for guides later. Avoid 4 and 5 as the base: they trade the
reference-book feel for density or app chrome.

Open points before building: group the nav (papyri / majuscules / minuscules /
versions) so it stays short; decide whether the nav is collapsible on 900–1200px
laptops.

## 6 Catalogue (after discussion with the owner, 20 Nov 2026)

Built from the owner's brief: search as the highlight, witnesses as a card
gallery, guides and background as "book pages". Supersedes the recommendation
above as the direction to develop.

- **Home** (`home.html`): search first. Works like a concordance: a verse
  (`John 1:18`, `jn 1:18`), a siglum (`𝔓⁶⁶`, `P66`, `03`, `B`) or an idea
  (`harder reading`) lists every place the site discusses it, grouped by
  Verse / Witness / Guide. Under it, a rail of witness tiles and a shelf of covers.
- **Witnesses** (`witnesses.html`): even grid of specimen tiles (siglum large in
  rubric, a strip of Greek capitals, papyrus-fibre or parchment texture by kind;
  a licensed photo would replace the texture). Each shows name, date, kind and a
  five-part coverage bar (Gospels / Acts / Paul / Catholic / Revelation). Filters
  for kind, date and contents plus a search box; on phones the filters are
  sideways-scrolling chip rows and the grid is two columns.
- **Witness profile** (`witness.html`): tile and fact sheet on the left (sticky),
  prose in the middle, links and "often cited with" tiles on the right.
- **Guide** (`guide.html`): book-page landing (typographic cover, description,
  reading time, level, prerequisite, sources, last checked, "What you will
  learn", Read button) then a "Related" shelf, then the reading view with
  sticky contents. Background pages use the same template with an ochre cover.

Colour: the existing tokens plus three flat manuscript pigments used only on
covers (lapis = guides, verdigris = method guides, ochre = background). No
gradients except the subtle material textures on tiles.

JS: two small inline scripts (search, filters), no framework. In Astro the
concordance index would be built at build time from witness `key_units`, guide
headings and a verse-reference field, and shipped as one small JSON file.
Gallery data in the mock-up is approximate.
