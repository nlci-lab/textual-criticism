# Textual Criticism: an introductory resource for Bible translators

An introductory resource on textual criticism for Bible translators and consultants. It started as a guide for those who meet sigla like `א`, `B`, `𝔓⁶⁶`, `ƒ¹³` or `Byz` in the UBS Greek New Testament apparatus in Paratext and need to know, in under a minute, what each witness is and why it matters.

Live (after review): https://nlci-lab.github.io/textual-criticism/

## Why Astro

Astro content collections validate every witness file against a schema at build time, so a bad entry fails the build. The output is plain static HTML that reads without JavaScript. See [docs/adr/0001-astro-static-site.md](docs/adr/0001-astro-static-site.md).

## Working on it

```sh
npm install
npm run dev          # http://localhost:4321
SITE_BASE=/textual-criticism/ npm run build   # as deployed on GitHub Pages
```

On Git Bash for Windows, prefix with `MSYS_NO_PATHCONV=1` so the base path is not rewritten.

## Where things live

| Path | What |
|---|---|
| `src/content/witnesses/*.md` | One file per witness: data in front matter, background text below |
| `src/content.config.ts` | The witness schema (core + one kind block) |
| `src/lib/sigla.ts` | Siglum normalisation, alias index, collision check |
| `src/pages/[alias].astro` | Static short URLs (`/p66/`, `/aleph/`, `/B/`) |
| `src/data/glossary.ts` | Apparatus symbols in plain words |
| `GLOSSARY.md` | Project vocabulary |
| `docs/adr/` | Decisions and why |
| `docs/PROMPT.md` | The original brief |

## Accuracy rules

- A fact goes into a field only with a source id. Sources marked `checked: false` were cited from memory and show a "to check" tag.
- Anything without a source we can name goes in `unverified` and is shown in its own box.
- `ubs5_list_checked: false` until the witness is confirmed against the printed UBS5 list.

## Licence

Code: MIT ([LICENSE](LICENSE)). Content (text and data in `src/content` and `src/data`): CC BY-SA 4.0 ([LICENSE-CONTENT.md](LICENSE-CONTENT.md)). Manuscript images are not copied; they stay under their holders' terms.
