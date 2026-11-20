# Images: one self-hosted CNTR page, links for the rest

Checked in Nov 2026: Vatican, CSNTM and CNTR's site text reserve rights; NT.VMR and the British Library forbid framing; Sinaiticus, Gallica and Cambridge licences are unconfirmed. CNTR, however, marks each of its page photographs as public domain in the United States under *Bridgeman v. Corel* (1999), noting that use may be restricted elsewhere.

So each profile may show one page photograph from CNTR, resized and self-hosted (`public/img/ms/`, under ~90 KB, lazy-loaded below the fold), with CNTR credited, the Bridgeman note, and a link to the original. For manuscripts held by the Vatican Library (B, 𝔓⁷⁵) we show no copy, out of courtesy to the Vatican's request for permission, and link to the image instead. Check each photo for a licence printed on the image itself: CNTR's Codex Bezae photo is © Cambridge University Library under CC BY-NC 3.0, so it carries that licence, not the public-domain note (`licence` field). Everything else is linked, not copied; CNTR's transcription view still opens in a modal frame.

## Addendum (20 Nov 2026): CNTR transcriptions for manuscript comparisons

Worked examples may show a word-by-word comparison built from the Center for New Testament
Restoration's manuscript transcriptions (github.com/Center-for-New-Testament-Restoration/transcriptions),
licensed CC BY-SA 4.0 by Alan Bunning.

- `scripts/cntr-fetch.mjs` copies only the needed verse lines into `src/data/cntr/<verse>.json`,
  pinned to one commit, so the build needs no network. With `--all` it scans every class 1–3 file at
  that commit and keeps each manuscript that has the verse, adding INTF NTVMR metadata (date, holding)
  per witness; downloads are cached in the gitignored `.cache/` folder so reruns are fast.
- Printed editions from the repository's `critical texts` folder are included after the manuscripts
  (`--editions`, or with `--all`): RP (Robinson–Pierpont 2025), ST (Stephanus 1550), KJTR (CNTR's 2020
  King James Textus Receptus), WH (Westcott–Hort 1885) and SR (CNTR's Statistical Restoration 2022),
  as named and dated in CNTR's Technical Reference. The repository README and LICENSE put the whole
  repository, these files included, under CC BY-SA 4.0 with credit to Alan Bunning and CNTR; that is
  the licence we follow. (greekcntr.org separately offers SR and KJTR as books under CC BY 4.0.)
  Their punctuation, ¶ and SR's ˚ mark are stripped so the parser reads them as words; accents stay.
- `src/lib/collate.ts` reads CNTR's markup (first hand vs corrector, nomina sacra, damaged and
  missing letters), aligns each witness against the base text and groups readings; an editor's
  unit list and glosses (`src/data/collations/*.ts`) decide what is shown.
- Every comparison credits "Alan Bunning, Center for New Testament Restoration, CC BY-SA 4.0",
  and the comparison itself is CC BY-SA 4.0 (ShareAlike). Page images stay on CNTR's site:
  each witness links to its page in the CNTR viewer; no image is copied.
