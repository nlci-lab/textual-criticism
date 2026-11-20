# Roadmap

## Needs checking (data)

- [ ] **Witness list against printed UBS5** (Introduction pp. 10*ff.). No copy was available; the seed list comes from the Paratext help abbreviation list (pp. 58*–63*), an unsourced sigla guide (finding aid only), and the John 1:18 apparatus. Every profile shows "not yet checked" until done.
- [ ] Sources marked `checked: false` (Metzger & Ehrman 2005, Aland & Aland 1989, Parker 1992): add page references and flip to `true`.
- [ ] Each profile's `unverified` list.
- [ ] Image licences: codexsinaiticus.org, Cambridge Digital Library, BnF Gallica, British Library images, NT.VMR terms.
- [ ] Whether UBS5 prints `Dᵖ`, `Eᵃ`, `Kᵃᵖ` etc. with superscripts or plain letters.
- [ ] Run the course `cod` reviewer over context pages and the top ~20 profiles.

## Next content

1. Remaining Greek witnesses (papyri, majuscules, minuscules, lectionaries), using `scripts/` to pull INTF Liste data.
2. ~~Context pages~~ drafted 20 Nov 2026 (NT text, OT text, materials); check against their listed sources and run `cod` over them.
3. Versions, then fathers.
4. Full glossary of apparatus symbols.

## Enhancements (each its own PR)

- Timeline view; map view (plain SVG); compare two witnesses.
- Paratext bridge: one-page siglum cheat sheet; URL pattern `/w/{id}/` and `/{siglum}/` for bookmarks.
- Offline service worker.
- Hindi and other South Asian languages (i18n is set up with `en` only).
- Course links back to modules in the training repo.
- IIIF viewing in the modal, source by source, once a licence allows it (CSNTM would need permission from manuscripts@csntm.org).
- Search: split comma lists in version superscripts (`itᵃ,ᵃᵘʳ,ᵇ`) once versions exist.
