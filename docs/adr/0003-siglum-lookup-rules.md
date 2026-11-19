# Siglum lookup matches what Paratext prints

Readers type or paste exactly what they see in the Paratext UBS apparatus, so lookup is built around printed sigla, not GA numbers.

- Superscripts and plain characters are equal (`𝔓⁶⁶` = `𝔓66` = `P66` = `p66`).
- Single Latin/Greek letters are case-sensitive (`B` = Vaticanus; `b` = Old Latin b). Everything else is case-insensitive.
- Bare numbers are GA numbers: `01` is Sinaiticus, `1` is minuscule 1, `f1`/`ƒ¹` is Family 1.
- Modifiers (`*`, `²`, `ᶜ`, `ᵛⁱᵈ`, `ˢᵘᵖᵖ`, fractions) are stripped and resolve to the parent witness, with an anchor where the profile has one (correctors, supplements).
- A pasted chunk (`itᵃ,ᵃᵘʳ,ᵇ`, `Byz [E F G H]`) is split into its witnesses.
- Any alias claimed by two witnesses must have an explicit disambiguation entry, or the build fails.
