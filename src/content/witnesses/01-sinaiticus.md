---
id: sinaiticus
kind: greek_ms
siglum: "א"
siglum_lang: he
names: ["Codex Sinaiticus"]
aliases: ["aleph", "alef", "01", "Sinaiticus", "Codex Sinaiticus"]
lead: "A fourth-century parchment Bible with the whole New Testament, the oldest complete copy that survives."
date:
  label: "4th century"
  from: 300
  to: 399
  basis: "INTF dates it to century IV on the basis of its handwriting and book format."
  src: [intf]
text_character:
  label: "Usually grouped with the early Egyptian (\"Alexandrian\") witnesses, except in John 1–8"
  contested_note: "Text-type labels are disputed. In John 1:1–8:38 it is often said to follow a different (\"Western\") kind of text."
  src: [me]
key_units:
  - ref: "John 1:18"
    note: "The first hand (א*) reads μονογενὴς θεός; a corrector (א²) adds the article, ὁ μονογενὴς θεός."
    src: [ubs5-jn118]
  - ref: "Mark 16:9–20"
    note: "Ends Mark at 16:8. With B it is the oldest Greek witness for the short ending."
    src: [me]
  - ref: "John 7:53–8:11"
    note: "Does not have the story of the woman caught in adultery."
    src: [me]
links:
  - { label: "INTF NT.VMR record (GA 01)", url: "https://ntvmr.uni-muenster.de/manuscript-workspace?docID=20001", kind: record, licence: "unconfirmed" }
  - { label: "Codex Sinaiticus Project (full images and transcription)", url: "https://codexsinaiticus.org/", kind: images, licence: "unconfirmed" }
  - { label: "CSNTM record (GA 01)", url: "https://manuscripts.csntm.org/manuscript/View/GA_01", kind: images, licence: "CSNTM: every use needs their permission; link only." }
sources:
  - { id: intf, cite: "INTF, Kurzgefasste Liste, NT.VMR record for 01 (docID 20001), retrieved 19 Nov 2026.", url: "https://ntvmr.uni-muenster.de/community/vmr/api/metadata/liste/search/?docID=20001&detail=shelfInstance", checked: true }
  - { id: ubs5-jn118, cite: "UBS Greek New Testament, 5th ed., apparatus at John 1:18, as shown in Paratext 9 (seen 19 Nov 2026).", checked: true }
  - { id: ubs5-intro, cite: "UBS Greek New Testament, 5th ed., Introduction pp. 58*–63*, list of symbols, as given in Paratext 9 help.", checked: true }
  - { id: me, cite: "Bruce M. Metzger and Bart D. Ehrman, The Text of the New Testament, 4th ed. (Oxford University Press, 2005).", checked: false }
unverified:
  - { claim: "Other leaves of the codex (mostly Old Testament) are in Leipzig University Library, St Catherine's Monastery at Sinai, and the National Library of Russia in St Petersburg.", from: "memory; INTF lists only the London New Testament leaves. Check codexsinaiticus.org" }
  - { claim: "It also contains the Epistle of Barnabas and part of the Shepherd of Hermas after Revelation.", from: "memory of Metzger & Ehrman" }
  - { claim: "Constantin von Tischendorf saw leaves at Sinai in 1844 and brought the New Testament part to St Petersburg in 1859; the British Museum bought it in 1933.", from: "memory of Metzger & Ehrman" }
  - { claim: "Aland category I.", from: "memory of Aland & Aland; check" }
ubs5_list_checked: false
last_checked: "2026-11-19"
greek_ms:
  ga: "01"
  ntvmr_doc_id: 20001
  category: majuscule
  material: { value: parchment, src: [me] }
  format: { value: codex, src: [me] }
  leaves: { value: "148 (New Testament part, London)", src: [intf] }
  content_letters: { value: "eapr (Gospels, Acts and Catholic letters, Paul, Revelation)", src: [intf] }
  contents:
    - { book: Mt, status: complete }
    - { book: Mk, status: complete }
    - { book: Lk, status: complete }
    - { book: Jn, status: complete }
    - { book: Ac, status: complete }
    - { book: Jas, status: complete }
    - { book: 1Pe, status: complete }
    - { book: 2Pe, status: complete }
    - { book: 1Jn, status: complete }
    - { book: 2Jn, status: complete }
    - { book: 3Jn, status: complete }
    - { book: Jd, status: complete }
    - { book: Ro, status: complete }
    - { book: 1Cor, status: complete }
    - { book: 2Cor, status: complete }
    - { book: Ga, status: complete }
    - { book: Eph, status: complete }
    - { book: Php, status: complete }
    - { book: Col, status: complete }
    - { book: 1Th, status: complete }
    - { book: 2Th, status: complete }
    - { book: He, status: complete }
    - { book: 1Tm, status: complete }
    - { book: 2Tm, status: complete }
    - { book: Tt, status: complete }
    - { book: Phm, status: complete }
    - { book: Re, status: complete }
  contents_src: [intf, me]
  correctors:
    - { siglum: "א*", note: "The reading of the first scribe, before correction.", src: [ubs5-intro] }
    - { siglum: "א¹ א² ᶜ", note: "Later correctors, numbered in time order; ᶜ marks the latest. UBS cites א² at John 1:18.", src: [ubs5-intro, ubs5-jn118] }
  holdings:
    - { institution: "British Library", place: "London", shelfmark: "Add. MS 43725", src: [intf] }
  cntr: { w: "m20001", v: "43001001" }
---

Sinaiticus is a large book made of animal skin (*parchment*), written in capital letters (*majuscule* script) in four narrow columns on each page. It once held the whole Greek Bible. Today its New Testament is in the British Library in London.

The text was corrected many times, from the scribes who first copied it to readers several centuries later. This is why the apparatus gives separate sigla for the first hand (<span class="siglum" lang="he" dir="ltr">א*</span>) and for the correctors (<span class="siglum" lang="he" dir="ltr">א‎¹</span>, <span class="siglum" lang="he" dir="ltr">א‎²</span>). When you see <span class="siglum" lang="he" dir="ltr">א*</span> and <span class="siglum" lang="he" dir="ltr">א‎²</span> on opposite sides of a variation unit, the manuscript is witnessing to both readings at different times.

Translators meet <span class="siglum" lang="he" dir="ltr">א</span> on almost every page of the UBS apparatus. Together with B it is the main reason the UBS text often follows a shorter reading where later manuscripts have a longer one. Some scholars think the committee leans too heavily on B and א, and that the rule "prefer the shorter reading" is less safe than it looks, because scribes also left words out.
